import { ChatCompletionFunctionTool } from "openai/resources/chat/completions";

// ── Import all function modules ─────────────────────────────────────────────
import * as getDrugInfo from "./getDrugInfo";

// ── Types ───────────────────────────────────────────────────────────────────
type FunctionHandler = (args: Record<string, unknown>) => Promise<{
  status: string;
  content: string;
}>;

// ── Tool Definitions (passed to OpenAI) ─────────────────────────────────────
export const toolDefinitions: ChatCompletionFunctionTool[] = [
  getDrugInfo.definition,
  // Add new function definitions here:
  // newFunction.definition,
];

// ── Function Handlers (for dynamic dispatch) ────────────────────────────────
export const functionHandlers: Record<string, FunctionHandler> = {
  get_drug_info: getDrugInfo.handler as unknown as FunctionHandler,
  // Add new handlers here:
  // new_function_name: newFunction.handler,
};

// ── System Prompt ───────────────────────────────────────────────────────────
export const systemPrompt = `Eres un asistente experto en bioinformática, farmacología e ingeniería biomédica.
Tu nombre es BioChat y formas parte de una plataforma de consulta de bases de datos abiertas para compuestos biológicos.

Respondes de forma clara, didáctica y progresiva, adaptando tu lenguaje al nivel del usuario.
Puedes responder en español o inglés según el idioma del usuario.

Tienes acceso a las siguientes herramientas para consultar bases de datos científicas:

${getDrugInfo.systemPromptSection}

Instrucciones generales:
- Cuando el usuario pregunte sobre un tema cubierto por tus herramientas, USA la herramienta correspondiente.
- NO inventes datos: siempre basa tus respuestas en los resultados de las herramientas.
- Si ninguna herramienta es relevante, responde con tu conocimiento general pero aclara que no estás consultando una base de datos en tiempo real.
- Sé amable, profesional y conciso.
`;
