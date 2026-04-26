import { ChatCompletionFunctionTool } from "openai/resources/chat/completions";

// ── Tool Definitions for OpenAI ─────────────────────────────────────────────

export const searchGenbankDefinition: ChatCompletionFunctionTool = {
  type: "function",
  function: {
    name: "search_genbank_sequences",
    description:
      "Búsqueda básica en GenBank (NCBI) usando ESEARCH. " +
      "Dado un nombre de gen y un organismo, devuelve el número total de secuencias " +
      "disponibles y una lista de IDs de secuencias. " +
      "Ideal para preguntas cuantitativas ('¿cuántas secuencias?'), " +
      "obtención de IDs, y comparaciones entre organismos.",
    parameters: {
      type: "object",
      properties: {
        gene_name: {
          type: "string",
          description:
            "Nombre del gen a buscar. Ejemplos: 'BRCA1', 'TP53', 'INS', 'EGFR', 'MYC'. " +
            "Usa el símbolo oficial del gen en MAYÚSCULAS.",
        },
        organism: {
          type: "string",
          description:
            "Nombre científico del organismo en inglés. " +
            "Ejemplos: 'Homo sapiens', 'Mus musculus', 'Rattus norvegicus'. " +
            "Si el usuario dice 'humano' o 'humanos', usa 'Homo sapiens'. " +
            "Si dice 'ratón', usa 'Mus musculus'.",
        },
        max_results: {
          type: "number",
          description:
            "Número máximo de IDs a recuperar (1-50). Por defecto: 20.",
        },
      },
      required: ["gene_name", "organism"],
    },
  },
};

export const queryGenbankDefinition: ChatCompletionFunctionTool = {
  type: "function",
  function: {
    name: "query_genbank",
    description:
      "Pipeline extendido de GenBank (NCBI): ESEARCH + ESUMMARY. " +
      "Dado un nombre de gen y un organismo, primero busca los IDs y luego " +
      "obtiene metadata biológica de cada secuencia (título, longitud, tipo de molécula). " +
      "Usar con return_type='ids' para conteo + IDs, " +
      "o return_type='summary' para metadata biológica detallada. " +
      "Ideal para análisis biológico, exploración de secuencias e interfaces educativas.",
    parameters: {
      type: "object",
      properties: {
        gene_name: {
          type: "string",
          description:
            "Nombre del gen a buscar. Ejemplos: 'BRCA1', 'TP53', 'INS', 'EGFR', 'MYC'. " +
            "Usa el símbolo oficial del gen en MAYÚSCULAS.",
        },
        organism: {
          type: "string",
          description:
            "Nombre científico del organismo en inglés. " +
            "Ejemplos: 'Homo sapiens', 'Mus musculus', 'Rattus norvegicus'.",
        },
        max_results: {
          type: "number",
          description:
            "Número máximo de resultados a recuperar (1-20). Por defecto: 5.",
        },
        return_type: {
          type: "string",
          enum: ["ids", "summary"],
          description:
            "'ids' → devuelve conteo total + lista de IDs. " +
            "'summary' → devuelve metadata biológica (título, longitud, tipo de molécula). " +
            "Usa 'summary' cuando el usuario pregunte por longitud, descripción o tipo de secuencia. " +
            "Usa 'ids' cuando el usuario pregunte por IDs o para comparaciones.",
        },
      },
      required: ["gene_name", "organism"],
    },
  },
};

// ── System Prompt Section ───────────────────────────────────────────────────

export const systemPromptSection = `
## Consulta de secuencias en GenBank - NCBI (search_genbank_sequences / query_genbank)

Puedes consultar la base de datos de secuencias genómicas GenBank del NCBI usando dos funciones:

### search_genbank_sequences
Usa esta función cuando el usuario pregunte:
- "¿Cuántas secuencias hay de [gen] en [organismo]?"
- "Dame IDs de secuencias del gen X"
- Comparaciones simples entre organismos

### query_genbank
Usa esta función cuando el usuario pregunte:
- "Dame ejemplos de secuencias del gen X" → return_type="summary"
- "¿Cuál es la longitud de las secuencias de X?" → return_type="summary"
- "¿Qué tipo de molécula es X?" → return_type="summary"
- "Dame los IDs del gen X en [organismo]" → return_type="ids"
- Comparaciones entre organismos que requieran múltiples llamadas → return_type="ids"

### Reglas importantes
1. El gene_name debe ser el símbolo oficial del gen en MAYÚSCULAS (ej. "BRCA1", "TP53", "INS").
2. El organismo debe ser el nombre científico en inglés (ej. "Homo sapiens", "Mus musculus").
   - "humano" / "humanos" → "Homo sapiens"
   - "ratón" / "mouse" → "Mus musculus"
   - "rata" → "Rattus norvegicus"
3. Para comparaciones multi-organismo, haz múltiples llamadas (una por organismo).
4. Cuando presentes los resultados:
   - Para search_genbank_sequences: indica el total de secuencias y muestra algunos IDs.
   - Para query_genbank (summary): presenta título, longitud (en pares de bases) y tipo de molécula de cada secuencia.
   - Explica de forma didáctica qué significan los datos (ej. qué es la longitud de una secuencia de DNA).
   - Si no hay resultados, dilo claramente y sugiere variaciones en la búsqueda.
`;

// ── Types ───────────────────────────────────────────────────────────────────

interface GenbankResult {
  status: "success" | "error";
  content: string;
}

interface ESummaryItem {
  title?: string;
  slen?: number;
  moltype?: string;
}

interface ESummaryResult {
  [key: string]: ESummaryItem;
}

// ── Handler: search_genbank_sequences ───────────────────────────────────────

export async function searchGenbankHandler(args: {
  gene_name: string;
  organism: string;
  max_results?: number;
}): Promise<GenbankResult> {
  try {
    const { gene_name, organism, max_results = 20 } = args;

    const safeMax = Math.max(1, Math.min(50, max_results));
    const query = `${gene_name}[gene] AND ${organism}[orgn]`;

    const url = new URL(
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
    );
    url.searchParams.set("db", "nuccore");
    url.searchParams.set("term", query);
    url.searchParams.set("retmode", "json");
    url.searchParams.set("retmax", String(safeMax));

    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return {
        status: "error",
        content: `Error al consultar GenBank ESEARCH: HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    const result = data?.esearchresult || {};
    const totalResults = parseInt(result.count || "0", 10);
    const ids: string[] = result.idlist || [];

    if (totalResults === 0) {
      return {
        status: "success",
        content: `No se encontraron secuencias para el gen "${gene_name}" en "${organism}" en GenBank.`,
      };
    }

    const content = [
      `Gen: ${gene_name}`,
      `Organismo: ${organism}`,
      `Total de secuencias en GenBank: ${totalResults}`,
      ``,
      `IDs recuperados (${ids.length}): ${ids.join(", ")}`,
    ].join("\n");

    return { status: "success", content };
  } catch (error) {
    return {
      status: "error",
      content: `Error al consultar GenBank: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

// ── Handler: query_genbank ───────────────────────────────────────────────────

export async function queryGenbankHandler(args: {
  gene_name: string;
  organism: string;
  max_results?: number;
  return_type?: "ids" | "summary";
}): Promise<GenbankResult> {
  try {
    const {
      gene_name,
      organism,
      max_results = 5,
      return_type = "summary",
    } = args;

    const safeMax = Math.max(1, Math.min(20, max_results));
    const query = `${gene_name}[gene] AND ${organism}[orgn]`;
    const baseUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";

    // STEP 1: ESEARCH
    const searchUrl = new URL(baseUrl + "esearch.fcgi");
    searchUrl.searchParams.set("db", "nuccore");
    searchUrl.searchParams.set("term", query);
    searchUrl.searchParams.set("retmode", "json");
    searchUrl.searchParams.set("retmax", String(safeMax));

    const searchRes = await fetch(searchUrl.toString(), {
      headers: { Accept: "application/json" },
    });

    if (!searchRes.ok) {
      return {
        status: "error",
        content: `Error en ESEARCH de GenBank: HTTP ${searchRes.status}`,
      };
    }

    const searchData = await searchRes.json();
    const esearchResult = searchData?.esearchresult || {};
    const totalResults = parseInt(esearchResult.count || "0", 10);
    const ids: string[] = esearchResult.idlist || [];

    if (ids.length === 0) {
      return {
        status: "success",
        content: `No se encontraron secuencias para el gen "${gene_name}" en "${organism}" en GenBank.`,
      };
    }

    // RETURN IDS ONLY
    if (return_type === "ids") {
      const content = [
        `Gen: ${gene_name}`,
        `Organismo: ${organism}`,
        `Total de secuencias en GenBank: ${totalResults}`,
        ``,
        `IDs recuperados (${ids.length}): ${ids.join(", ")}`,
      ].join("\n");

      return { status: "success", content };
    }

    // STEP 2: ESUMMARY
    const summaryUrl = new URL(baseUrl + "esummary.fcgi");
    summaryUrl.searchParams.set("db", "nuccore");
    summaryUrl.searchParams.set("id", ids.join(","));
    summaryUrl.searchParams.set("retmode", "json");

    const summaryRes = await fetch(summaryUrl.toString(), {
      headers: { Accept: "application/json" },
    });

    if (!summaryRes.ok) {
      return {
        status: "error",
        content: `Error en ESUMMARY de GenBank: HTTP ${summaryRes.status}`,
      };
    }

    const summaryData = await summaryRes.json();
    const summaryResult: ESummaryResult = summaryData?.result || {};

    const sequences = ids.map((id) => {
      const item = summaryResult[id] || {};
      return {
        id,
        title: item.title || "N/A",
        length: item.slen ?? "N/A",
        molecule_type: item.moltype || "N/A",
      };
    });

    const formatted = sequences
      .map(
        (s, i) =>
          `${i + 1}. ID: ${s.id}\n` +
          `   Título: ${s.title}\n` +
          `   Longitud: ${s.length} bp\n` +
          `   Tipo de molécula: ${s.molecule_type}`
      )
      .join("\n\n");

    const content = [
      `Gen: ${gene_name}`,
      `Organismo: ${organism}`,
      `Total de secuencias en GenBank: ${totalResults}`,
      `Mostrando: ${sequences.length}`,
      ``,
      formatted,
    ].join("\n");

    return { status: "success", content };
  } catch (error) {
    return {
      status: "error",
      content: `Error al consultar GenBank: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
