import { ChatCompletionFunctionTool } from "openai/resources/chat/completions";

// ── Tool Definition for OpenAI ──────────────────────────────────────────────
export const definition: ChatCompletionFunctionTool = {
  type: "function",
  function: {
    name: "get_protein_details",
    description:
      "Obtiene información detallada de una proteína específica de UniProt usando su código de acceso (accession ID). " +
      "Devuelve nombre, gen, organismo, función biológica, longitud de secuencia y más. " +
      "Usar después de search_proteins para obtener detalles profundos.",
    parameters: {
      type: "object",
      properties: {
        accession: {
          type: "string",
          description:
            "Código de acceso UniProt de la proteína (accession ID). " +
            "Ejemplo: 'P04637' para p53, 'P01308' para insulina.",
        },
      },
      required: ["accession"],
    },
  },
};

// ── System Prompt Section ───────────────────────────────────────────────────
export const systemPromptSection = `
## Detalles de proteína desde UniProt (get_protein_details)

Puedes obtener información detallada de una proteína específica usando get_protein_details.

Reglas:
1. Necesitas el código de acceso (accession ID) de UniProt. Si no lo tienes, usa primero search_proteins para encontrarlo.
2. Cuando el usuario pregunte "¿Qué hace la proteína X?", el flujo ideal es:
   a) Buscar con search_proteins("X")
   b) Tomar el accession del mejor resultado
   c) Llamar get_protein_details(accession)
3. Cuando recibas el resultado de esta función, transforma la información científica cruda en conocimiento educativo:

   a) Resume la función en una sola frase clara
   b) Explica la proteína en 3 niveles:
      - Nivel básico: Usa analogías simples (como "guardián", "interruptor", "mensajero")
      - Nivel intermedio: Explica su rol biológico real con terminología accesible
      - Nivel avanzado: Describe mecanismos celulares o moleculares específicos
   c) Extrae y explica SOLO los conceptos importantes (ignora ruido técnico innecesario)
   d) Añade:
      - ¿Por qué es importante en medicina?
      - ¿Qué pasa si falla esta proteína?
   e) Termina con:
      - 1 pregunta tipo examen para el estudiante
      - 1 analogía memorable

4. NO copies texto crudo de la API — siempre traduce a lenguaje educativo.
5. Si la función biológica no está disponible, usa tu conocimiento para complementar.
`;

// ── Types ───────────────────────────────────────────────────────────────────
interface UniProtComment {
  commentType: string;
  texts?: Array<{
    value?: string;
  }>;
}

interface UniProtEntry {
  primaryAccession?: string;
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
    commonName?: string;
  };
  comments?: UniProtComment[];
  sequence?: {
    length?: number;
    molWeight?: number;
    value?: string;
  };
  keywords?: Array<{
    name?: string;
  }>;
}

// ── Function Handler ────────────────────────────────────────────────────────
interface ProteinDetailsResult {
  status: "success" | "error";
  content: string;
}

export async function handler(args: {
  accession: string;
}): Promise<ProteinDetailsResult> {
  try {
    const { accession } = args;

    // Fetch protein details from UniProt
    const url = `https://rest.uniprot.org/uniprotkb/${accession}.json`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          status: "error",
          content: `No se encontró la proteína con accession: ${accession}. Verifica el código o usa search_proteins para buscar.`,
        };
      }
      return {
        status: "error",
        content: `Error al consultar UniProt: HTTP ${response.status}`,
      };
    }

    const data: UniProtEntry = await response.json();

    // Extract protein name
    const proteinName =
      data.proteinDescription?.recommendedName?.fullName?.value ||
      data.proteinDescription?.submissionNames?.[0]?.fullName?.value ||
      "N/A";

    // Extract gene name
    const gene = data.genes?.[0]?.geneName?.value || "N/A";

    // Extract organism
    const organism = data.organism?.scientificName || "N/A";
    const commonName = data.organism?.commonName || "";

    // Extract function text from comments
    let functionText: string | null = null;
    if (data.comments) {
      for (const comment of data.comments) {
        if (comment.commentType === "FUNCTION" && comment.texts?.length) {
          functionText = comment.texts[0].value || null;
          break;
        }
      }
    }

    // Extract subcellular location
    let subcellularLocation: string | null = null;
    if (data.comments) {
      for (const comment of data.comments) {
        if (comment.commentType === "SUBCELLULAR LOCATION" && comment.texts?.length) {
          subcellularLocation = comment.texts[0].value || null;
          break;
        }
      }
    }

    // Extract involvement in disease
    let diseaseInfo: string | null = null;
    if (data.comments) {
      const diseaseComments = data.comments.filter(
        (c) => c.commentType === "DISEASE" && c.texts?.length
      );
      if (diseaseComments.length > 0) {
        diseaseInfo = diseaseComments
          .map((c) => c.texts?.[0]?.value || "")
          .filter(Boolean)
          .join(" | ");
      }
    }

    // Extract sequence info
    const seqLength = data.sequence?.length || null;
    const molWeight = data.sequence?.molWeight || null;

    // Extract keywords
    const keywords = data.keywords
      ?.map((k) => k.name)
      .filter(Boolean)
      .slice(0, 10)
      .join(", ") || "N/A";

    // Build structured output
    const info = [
      `Nombre: ${proteinName}`,
      `Gen: ${gene}`,
      `Organismo: ${organism}${commonName ? ` (${commonName})` : ""}`,
      `Accession: ${data.primaryAccession || accession}`,
      `Longitud de secuencia: ${seqLength ? `${seqLength} aminoácidos` : "N/A"}`,
      `Peso molecular: ${molWeight ? `${(molWeight / 1000).toFixed(1)} kDa` : "N/A"}`,
      ``,
      `Función biológica: ${functionText || "No disponible en UniProt — usa tu conocimiento para complementar."}`,
      ``,
      `Localización subcelular: ${subcellularLocation || "No disponible"}`,
      ``,
      `Enfermedades asociadas: ${diseaseInfo || "No disponible"}`,
      ``,
      `Palabras clave: ${keywords}`,
    ].join("\n");

    return {
      status: "success",
      content: info,
    };
  } catch (error) {
    return {
      status: "error",
      content: `Error al consultar UniProt: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
