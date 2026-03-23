import { ChatCompletionFunctionTool } from "openai/resources/chat/completions";

// ── Tool Definition for OpenAI ──────────────────────────────────────────────
export const definition: ChatCompletionFunctionTool = {
  type: "function",
  function: {
    name: "get_drug_info",
    description:
      "Obtiene información química de un fármaco consultando la base de datos ChEMBL. " +
      "Recibe el nombre del fármaco en inglés y devuelve propiedades como fórmula molecular, " +
      "peso molecular, LogP, fase clínica, etc.",
    parameters: {
      type: "object",
      properties: {
        drug_name: {
          type: "string",
          description:
            "Nombre del fármaco en inglés (INN). Ejemplos: 'ibuprofen', 'aspirin', 'paracetamol'.",
        },
      },
      required: ["drug_name"],
    },
  },
};

// ── System Prompt Section ───────────────────────────────────────────────────
export const systemPromptSection = `
## Consulta de información química de fármacos (get_drug_info)

Puedes buscar información química de fármacos usando la función get_drug_info.

Reglas:
1. El nombre del fármaco DEBE estar en inglés (INN — International Nonproprietary Name).
2. Si el usuario escribe el nombre en español, tradúcelo al inglés antes de llamar la función.
   Ejemplos: "ibuprofeno" → "ibuprofen", "aspirina" → "aspirin", "paracetamol" → "paracetamol"
3. Usa nombres comunes internacionales.

Cuando recibas el resultado de la función:
- Si status = "error": explica el error de forma clara al usuario.
- Si status = "success": explica de forma didáctica, clara y progresiva:
  1. Qué es el fármaco
  2. Qué significan sus propiedades químicas (fórmula, peso molecular, LogP, etc.)
  3. Para qué se usa comúnmente
  4. Incluye una analogía sencilla si es posible
`;

// ── Function Handler ────────────────────────────────────────────────────────
interface DrugInfoResult {
  status: "success" | "error";
  content: string;
}

interface ChEMBLMolecule {
  pref_name?: string;
  molecule_chembl_id: string;
  molecule_properties?: {
    full_molformula?: string;
    full_mwt?: string;
    alogp?: string;
  };
  max_phase?: number;
  therapeutic_flag?: boolean;
  molecule_type?: string;
}

export async function handler(args: {
  drug_name: string;
}): Promise<DrugInfoResult> {
  try {
    const { drug_name } = args;

    // Step 1: Search for the CHEMBL ID
    const searchUrl = new URL(
      "https://www.ebi.ac.uk/chembl/api/data/molecule/search"
    );
    searchUrl.searchParams.set("q", drug_name);
    searchUrl.searchParams.set("format", "json");

    const searchResponse = await fetch(searchUrl.toString());
    if (!searchResponse.ok) {
      return {
        status: "error",
        content: `Error al buscar en ChEMBL: HTTP ${searchResponse.status}`,
      };
    }

    const searchData = await searchResponse.json();
    const molecules: ChEMBLMolecule[] = searchData.molecules || [];

    if (molecules.length === 0) {
      return {
        status: "error",
        content: `No se encontró el fármaco: ${drug_name}`,
      };
    }

    // Try exact match by pref_name
    let chemblId: string | null = null;
    for (const mol of molecules) {
      if (
        mol.pref_name &&
        mol.pref_name.toLowerCase() === drug_name.toLowerCase()
      ) {
        chemblId = mol.molecule_chembl_id;
        break;
      }
    }

    // Fallback to first result
    if (!chemblId) {
      chemblId = molecules[0].molecule_chembl_id;
    }

    // Step 2: Get detailed molecule data
    const moleculeUrl = `https://www.ebi.ac.uk/chembl/api/data/molecule/${chemblId}.json`;
    const moleculeResponse = await fetch(moleculeUrl);

    if (!moleculeResponse.ok) {
      return {
        status: "error",
        content: `Error al obtener datos del fármaco: HTTP ${moleculeResponse.status}`,
      };
    }

    const data: ChEMBLMolecule = await moleculeResponse.json();
    const props = data.molecule_properties || {};

    const info = [
      `Nombre: ${data.pref_name || "N/A"}`,
      `CHEMBL ID: ${chemblId}`,
      `Fórmula: ${props.full_molformula || "N/A"}`,
      `Peso molecular: ${props.full_mwt || "N/A"}`,
      `LogP (lipofilia): ${props.alogp || "N/A"}`,
      `Fase clínica máxima: ${data.max_phase ?? "N/A"}`,
      `Uso terapéutico: ${data.therapeutic_flag ?? "N/A"}`,
      `Tipo de molécula: ${data.molecule_type || "N/A"}`,
    ].join("\n");

    return {
      status: "success",
      content: info,
    };
  } catch (error) {
    return {
      status: "error",
      content: `Error al consultar la API: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
