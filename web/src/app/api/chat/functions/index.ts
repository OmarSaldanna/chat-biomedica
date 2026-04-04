import { ChatCompletionFunctionTool } from "openai/resources/chat/completions";

// ── Import all function modules ─────────────────────────────────────────────
import * as getDrugInfo from "./getDrugInfo";
import * as searchProteins from "./searchProteins";
import * as getProteinDetails from "./getProteinDetails";

// ── Types ───────────────────────────────────────────────────────────────────
type FunctionHandler = (args: Record<string, unknown>) => Promise<{
  status: string;
  content: string;
}>;

// ── Tool Definitions (passed to OpenAI) ─────────────────────────────────────
export const toolDefinitions: ChatCompletionFunctionTool[] = [
  getDrugInfo.definition,
  searchProteins.definition,
  getProteinDetails.definition,
];

// ── Function Handlers (for dynamic dispatch) ────────────────────────────────
export const functionHandlers: Record<string, FunctionHandler> = {
  get_drug_info: getDrugInfo.handler as unknown as FunctionHandler,
  search_proteins: searchProteins.handler as unknown as FunctionHandler,
  get_protein_details: getProteinDetails.handler as unknown as FunctionHandler,
};

// ── System Prompt ───────────────────────────────────────────────────────────
export const systemPrompt = `Eres un asistente experto en bioinformática, farmacología e ingeniería biomédica.
Tu nombre es BioChat y formas parte de una plataforma de consulta de bases de datos abiertas para compuestos biológicos.

Respondes de forma clara, didáctica y progresiva, adaptando tu lenguaje al nivel del usuario.
Puedes responder en español o inglés según el idioma del usuario.

Tienes acceso a las siguientes herramientas para consultar bases de datos científicas:

${getDrugInfo.systemPromptSection}

${searchProteins.systemPromptSection}

${getProteinDetails.systemPromptSection}

Instrucciones generales:
- Cuando el usuario pregunte sobre un tema cubierto por tus herramientas, USA la herramienta correspondiente.
- Para preguntas sobre proteínas, usa el flujo: search_proteins → get_protein_details.
- NO inventes datos: siempre basa tus respuestas en los resultados de las herramientas.
- Si ninguna herramienta es relevante, responde con tu conocimiento general pero aclara que no estás consultando una base de datos en tiempo real.
- Sé amable, profesional y conciso.
`;
