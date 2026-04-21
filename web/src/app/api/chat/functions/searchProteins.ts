import { ChatCompletionFunctionTool } from "openai/resources/chat/completions";

// ── Tool Definition for OpenAI ──────────────────────────────────────────────
export const definition: ChatCompletionFunctionTool = {
  type: "function",
  function: {
    name: "search_proteins",
    description:
      "Busca proteínas en la base de datos UniProt por nombre, gen, función o enfermedad. " +
      "Devuelve una lista de proteínas relacionadas con sus identificadores (accession), " +
      "nombres, genes y organismos. Útil para búsquedas generales tipo Google biológico.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Término de búsqueda: nombre de proteína, gen, función biológica o enfermedad. " +
            "Ejemplos: 'p53', 'insulin', 'apoptosis', 'BRCA1', 'hemoglobin'. " +
            "IMPORTANTE: traduce siempre el término al inglés antes de buscar.",
        },
        limit: {
          type: "number",
          description:
            "Número máximo de resultados a devolver (1-10). Por defecto: 5.",
        },
        organism: {
          type: "string",
          description:
            "Filtrar por organismo. Valores comunes: 'human' (defecto), 'mouse', 'rat', 'all'. " +
            "Usa 'all' solo si el usuario pide explícitamente buscar en todos los organismos.",
        },
      },
      required: ["query"],
    },
  },
};

// ── System Prompt Section ───────────────────────────────────────────────────
export const systemPromptSection = `
## Búsqueda de proteínas en UniProt (search_proteins)

Puedes buscar proteínas usando la función search_proteins.

Reglas:
1. Usa esta función cuando el usuario pregunte sobre proteínas de forma general o quiera explorar proteínas relacionadas con un tema.
2. El término de búsqueda puede ser en inglés o español — la API de UniProt funciona mejor con términos en inglés, así que traduce si es necesario.
   Ejemplos: "apoptosis" → "apoptosis", "cáncer" → "cancer", "hemoglobina" → "hemoglobin"
3. Si el usuario pregunta "¿Qué hace la proteína X?", primero busca con search_proteins y luego usa get_protein_details con el accession encontrado para obtener detalles.
4. Presenta los resultados como una lista clara con nombre, gen, organismo y accession.
5. Si encuentras resultados, sugiere al usuario que puede pedir detalles de cualquier proteína específica.
`;

// ── Types ───────────────────────────────────────────────────────────────────
interface UniProtSearchResult {
  primaryAccession: string;
  proteinDescription?: {
    recommendedName?: {
      fullName?: {
        value?: string;
      };
    };
    submissionNames?: Array<{
      fullName?: {
        value?: string;
      };
    }>;
  };
  genes?: Array<{
    geneName?: {
      value?: string;
    };
  }>;
  organism?: {
    scientificName?: string;
  };
}

interface SearchResponse {
  results?: UniProtSearchResult[];
}

interface ProteinResult {
  accession: string;
  nombre: string;
  gen: string;
  organismo: string;
}

// ── Function Handler ────────────────────────────────────────────────────────
interface SearchProteinsResult {
  status: "success" | "error";
  content: string;
}

// Map common organism names to UniProt taxonomy IDs
const ORGANISM_MAP: Record<string, string> = {
  human: "9606",
  mouse: "10090",
  rat: "10116",
  zebrafish: "7955",
  "e. coli": "83333",
  yeast: "559292",
  drosophila: "7227",
  "c. elegans": "6239",
};

export async function handler(args: {
  query: string;
  limit?: number;
  organism?: string;
}): Promise<SearchProteinsResult> {
  try {
    const { query, limit = 5, organism = "human" } = args;

    // Clamp limit between 1 and 10
    const safeLimit = Math.max(1, Math.min(10, limit));

    // Build the search query with filters for relevant results
    let searchQuery = query;

    // Add organism filter (default: human)
    if (organism !== "all") {
      const orgId = ORGANISM_MAP[organism.toLowerCase()] || ORGANISM_MAP["human"];
      searchQuery += ` AND organism_id:${orgId}`;
    }

    // Filter to reviewed (Swiss-Prot) entries for higher quality results
    searchQuery += " AND reviewed:true";

    // Build the UniProt search URL
    const url = new URL("https://rest.uniprot.org/uniprotkb/search");
    url.searchParams.set("query", searchQuery);
    url.searchParams.set("format", "json");
    url.searchParams.set("size", String(safeLimit));
    // Request only the fields we need to reduce payload
    url.searchParams.set("fields", "accession,protein_name,gene_names,organism_name,annotation_score");

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return {
        status: "error",
        content: `Error al buscar en UniProt: HTTP ${response.status}`,
      };
    }

    const data: SearchResponse = await response.json();
    const entries = data.results || [];

    if (entries.length === 0) {
      return {
        status: "error",
        content: `No se encontraron proteínas para: "${query}"`,
      };
    }

    // Extract structured data from each result
    const results: ProteinResult[] = entries.map((entry) => {
      // Get protein name — try recommendedName first, then submissionNames
      const proteinName =
        entry.proteinDescription?.recommendedName?.fullName?.value ||
        entry.proteinDescription?.submissionNames?.[0]?.fullName?.value ||
        "N/A";

      const gene = entry.genes?.[0]?.geneName?.value || "N/A";
      const organism = entry.organism?.scientificName || "N/A";
      const accession = entry.primaryAccession;

      return {
        accession,
        nombre: proteinName,
        gen: gene,
        organismo: organism,
      };
    });

    // Format results as readable text
    const formatted = results
      .map(
        (r, i) =>
          `${i + 1}. ${r.nombre}\n` +
          `   Gen: ${r.gen}\n` +
          `   Organismo: ${r.organismo}\n` +
          `   Accession: ${r.accession}`
      )
      .join("\n\n");

    return {
      status: "success",
      content: `Se encontraron ${results.length} proteínas para "${query}":\n\n${formatted}`,
    };
  } catch (error) {
    return {
      status: "error",
      content: `Error al consultar UniProt: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
