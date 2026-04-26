import { ChatCompletionFunctionTool } from "openai/resources/chat/completions";

// ── Tool Definition for OpenAI ──────────────────────────────────────────────
export const definition: ChatCompletionFunctionTool = {
  type: "function",
  function: {
    name: "query_pdb",
    description:
      "Consulta información estructural, experimental y bibliográfica de una entrada " +
      "del Protein Data Bank (RCSB PDB) dado su PDB ID. " +
      "Devuelve título, resolución, método experimental, autores, publicación asociada, " +
      "año, peso molecular y composición polimérica. " +
      "Usar directamente si el usuario proporciona un PDB ID explícito, " +
      "o después de search_pdb para obtener detalles del candidato encontrado.",
    parameters: {
      type: "object",
      properties: {
        pdb_id: {
          type: "string",
          description:
            "Identificador único de la estructura en PDB. " +
            "Formato: 1 dígito + 3 caracteres alfanuméricos (mayúsculas o minúsculas). " +
            "Ejemplos: '4HHB', '2MNR', '1A3N', '6VXX'.",
        },
      },
      required: ["pdb_id"],
    },
  },
};

// ── System Prompt Section ───────────────────────────────────────────────────
export const systemPromptSection = `
## Consulta de estructura PDB (query_pdb)

Puedes obtener información detallada de una estructura del Protein Data Bank usando query_pdb.

Reglas:
1. Si el usuario proporciona un PDB ID explícito (patrón: dígito + 3 alfanuméricos, ej. "4HHB", "2MNR"), úsalo directamente — NO llames search_pdb.
2. Si el usuario no proporciona un PDB ID, primero llama search_pdb y luego query_pdb con el primer resultado (top-1).
3. El pdb_id debe ir siempre en MAYÚSCULAS.

Cuando recibas el resultado de query_pdb, transforma la información científica en conocimiento educativo:
- Explica qué significa la resolución (en Å): menor valor = mayor detalle atómico.
  - < 1.5 Å: resolución atómica (excelente)
  - 1.5–2.5 Å: alta resolución (buena para análisis)
  - > 3.0 Å: resolución moderada/baja
- Explica el método experimental:
  - X-RAY DIFFRACTION: cristalografía de rayos X (método clásico)
  - ELECTRON MICROSCOPY: criomicroscopía electrónica (cryo-EM), ideal para complejos grandes
  - SOLUTION NMR: resonancia magnética nuclear en solución, para proteínas pequeñas
- Menciona el título de la estructura, los autores y el año de publicación.
- Incluye la composición (monomérica, homodimérica, etc.) si está disponible.
- Añade una analogía o dato relevante que ayude al estudiante a recordar la información.
- NO copies texto crudo — siempre interpreta y explica.
`;

// ── Types ───────────────────────────────────────────────────────────────────
interface PdbEntryData {
  struct?: {
    title?: string;
  };
  rcsb_entry_info?: {
    resolution_combined?: number[];
    molecular_weight?: number;
    polymer_composition?: string;
  };
  exptl?: Array<{
    method?: string;
  }>;
  rcsb_primary_citation?: {
    rcsb_authors?: string[];
    title?: string;
    year?: number;
  };
}

// ── Function Handler ────────────────────────────────────────────────────────
interface QueryPdbResult {
  status: "success" | "error";
  content: string;
}

export async function handler(args: {
  pdb_id: string;
}): Promise<QueryPdbResult> {
  try {
    const { pdb_id } = args;

    // Normalize to uppercase
    const normalizedId = pdb_id.toUpperCase().trim();

    const url = `https://data.rcsb.org/rest/v1/core/entry/${normalizedId}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          status: "error",
          content: `No se encontró la entrada PDB con ID: ${normalizedId}. Verifica el identificador.`,
        };
      }
      return {
        status: "error",
        content: `Error al consultar RCSB PDB: HTTP ${response.status}`,
      };
    }

    const data: PdbEntryData = await response.json();

    // Extract title
    const title = data.struct?.title || "N/A";

    // Extract resolution (array — use first value if available)
    const resolutionArr = data.rcsb_entry_info?.resolution_combined;
    const resolution =
      resolutionArr && resolutionArr.length > 0
        ? `${resolutionArr[0].toFixed(2)} Å`
        : "N/A (puede ser estructura de NMR o modelo teórico)";

    // Extract experimental method
    const experimentalMethod =
      data.exptl?.[0]?.method || "N/A";

    // Extract citation info
    const authors = data.rcsb_primary_citation?.rcsb_authors;
    const authorsStr =
      authors && authors.length > 0
        ? authors.length > 5
          ? `${authors.slice(0, 5).join(", ")} et al.`
          : authors.join(", ")
        : "N/A";

    const publicationTitle =
      data.rcsb_primary_citation?.title || "N/A";

    const year = data.rcsb_primary_citation?.year?.toString() || "N/A";

    // Extract molecular weight
    const molWeight = data.rcsb_entry_info?.molecular_weight;
    const molWeightStr = molWeight
      ? `${molWeight.toFixed(1)} kDa`
      : "N/A";

    // Extract polymer composition
    const polymerComposition =
      data.rcsb_entry_info?.polymer_composition || "N/A";

    // Build structured output
    const info = [
      `PDB ID: ${normalizedId}`,
      `Título: ${title}`,
      ``,
      `=== Datos Estructurales ===`,
      `Resolución: ${resolution}`,
      `Método experimental: ${experimentalMethod}`,
      `Peso molecular: ${molWeightStr}`,
      `Composición polimérica: ${polymerComposition}`,
      ``,
      `=== Publicación Asociada ===`,
      `Título del artículo: ${publicationTitle}`,
      `Autores: ${authorsStr}`,
      `Año: ${year}`,
    ].join("\n");

    return {
      status: "success",
      content: info,
    };
  } catch (error) {
    return {
      status: "error",
      content: `Error al consultar RCSB PDB: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
