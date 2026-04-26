import { ChatCompletionFunctionTool } from "openai/resources/chat/completions";

// ── Tool Definition for OpenAI ──────────────────────────────────────────────
export const definition: ChatCompletionFunctionTool = {
  type: "function",
  function: {
    name: "search_pdb",
    description:
      "Busca estructuras proteicas en el Protein Data Bank (RCSB PDB) a partir de un nombre " +
      "de proteína en lenguaje natural. Retorna una lista de PDB IDs candidatos. " +
      "Usar como primera etapa cuando el usuario NO proporciona un PDB ID explícito. " +
      "Encadenar con query_pdb para obtener los detalles de la estructura.",
    parameters: {
      type: "object",
      properties: {
        protein_name: {
          type: "string",
          description:
            "Nombre de la proteína o entidad biológica en lenguaje natural. " +
            "Ejemplos: 'hemoglobina humana', 'insulina', 'p53', 'lysozyme'. " +
            "Puedes usar el nombre en español o inglés.",
        },
        limit: {
          type: "number",
          description:
            "Número máximo de PDB IDs candidatos a retornar (1-10). Por defecto: 3.",
        },
      },
      required: ["protein_name"],
    },
  },
};

// ── System Prompt Section ───────────────────────────────────────────────────
export const systemPromptSection = `
## Búsqueda de estructuras en PDB (search_pdb)

Puedes buscar estructuras proteicas en el Protein Data Bank usando search_pdb.

Reglas:
1. Usa esta función cuando el usuario NO proporcione un PDB ID explícito (patrón: un dígito seguido de tres caracteres alfanuméricos, ej. "4HHB", "2MNR", "1A3N").
2. Extrae la entidad biológica de la pregunta del usuario y pásala como protein_name.
   Ejemplos: "¿Cuál es la resolución de la hemoglobina humana?" → protein_name="hemoglobina humana"
3. Toma el primer resultado (top-1) como el candidato más relevante.
4. Encadena siempre con query_pdb para obtener los detalles.
5. Presenta los PDB IDs encontrados antes de consultar detalles si hay ambigüedad.
`;

// ── Types ───────────────────────────────────────────────────────────────────
interface PdbSearchResult {
  identifier: string;
  score?: number;
}

interface PdbSearchResponse {
  result_set?: PdbSearchResult[];
  total_count?: number;
}

// ── Function Handler ────────────────────────────────────────────────────────
interface SearchPdbResult {
  status: "success" | "error";
  content: string;
}

export async function handler(args: {
  protein_name: string;
  limit?: number;
}): Promise<SearchPdbResult> {
  try {
    const { protein_name, limit = 3 } = args;

    // Clamp limit between 1 and 10
    const safeLimit = Math.max(1, Math.min(10, limit));

    const url = "https://search.rcsb.org/rcsbsearch/v2/query";

    const query = {
      query: {
        type: "terminal",
        service: "full_text",
        parameters: {
          value: protein_name,
        },
      },
      return_type: "entry",
      request_options: {
        paginate: {
          start: 0,
          rows: safeLimit,
        },
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(query),
    });

    if (!response.ok) {
      return {
        status: "error",
        content: `Error al buscar en RCSB PDB: HTTP ${response.status}`,
      };
    }

    const data: PdbSearchResponse = await response.json();
    const results = data.result_set || [];

    if (results.length === 0) {
      return {
        status: "error",
        content: `No se encontraron estructuras en PDB para: "${protein_name}"`,
      };
    }

    // Format results as readable list
    const formatted = results
      .map((r, i) => `${i + 1}. PDB ID: ${r.identifier}`)
      .join("\n");

    const pdbIds = results.map((r) => r.identifier).join(", ");

    return {
      status: "success",
      content:
        `Se encontraron ${results.length} estructuras PDB para "${protein_name}":\n\n` +
        `${formatted}\n\n` +
        `PDB IDs: ${pdbIds}\n` +
        `Primer candidato (top-1): ${results[0].identifier}`,
    };
  } catch (error) {
    return {
      status: "error",
      content: `Error al consultar RCSB PDB: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
