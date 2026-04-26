import { ChatCompletionFunctionTool } from "openai/resources/chat/completions";

// ── Import all function modules ─────────────────────────────────────────────
import * as getDrugInfo from "./getDrugInfo";
import * as searchProteins from "./searchProteins";
import * as getProteinDetails from "./getProteinDetails";
import * as searchPdb from "./searchPdb";
import * as queryPdb from "./queryPdb";
import {
  searchGenbankDefinition,
  queryGenbankDefinition,
  systemPromptSection as genbankSystemPromptSection,
  searchGenbankHandler,
  queryGenbankHandler,
} from "./searchGenbank";

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
  searchPdb.definition,
  queryPdb.definition,
  searchGenbankDefinition,
  queryGenbankDefinition,
];

// ── Function Handlers (for dynamic dispatch) ────────────────────────────────
export const functionHandlers: Record<string, FunctionHandler> = {
  get_drug_info: getDrugInfo.handler as unknown as FunctionHandler,
  search_proteins: searchProteins.handler as unknown as FunctionHandler,
  get_protein_details: getProteinDetails.handler as unknown as FunctionHandler,
  search_pdb: searchPdb.handler as unknown as FunctionHandler,
  query_pdb: queryPdb.handler as unknown as FunctionHandler,
  search_genbank_sequences: searchGenbankHandler as unknown as FunctionHandler,
  query_genbank: queryGenbankHandler as unknown as FunctionHandler,
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

${searchPdb.systemPromptSection}

${queryPdb.systemPromptSection}

${genbankSystemPromptSection}

REGLA FUNDAMENTAL — SOLO DATOS DE LAS BASES DE DATOS:
- TODA la información que proporciones DEBE provenir exclusivamente de los resultados obtenidos a través de tus herramientas de consulta a bases de datos.
- NUNCA respondas con datos de tu memoria o entrenamiento. No inventes, no completes, no supongas información que no haya sido devuelta por una herramienta.
- Si el usuario hace una pregunta que puede ser respondida con alguna de tus herramientas, SIEMPRE usa la herramienta primero y basa tu respuesta únicamente en los resultados obtenidos.
- Si la pregunta NO puede ser respondida con ninguna de tus herramientas, indica amablemente que solo puedes responder con información proveniente de las bases de datos integradas (ChEMBL, UniProt, Protein Data Bank y GenBank) y sugiere reformular la pregunta para que pueda ser consultada en alguna de ellas.
- Lo que SÍ puedes hacer es: inferir los parámetros de búsqueda apropiados a partir de la pregunta del usuario, y luego presentar y organizar los resultados de manera clara, didáctica y bien estructurada.

Instrucciones de flujo de herramientas:
- Cuando el usuario pregunte sobre un tema cubierto por tus herramientas, USA la herramienta correspondiente.
- Para preguntas sobre proteínas (función, gen, organismo), usa el flujo: search_proteins → get_protein_details.
- Para preguntas sobre estructuras 3D, resolución, método experimental o publicaciones PDB, usa el flujo: search_pdb → query_pdb.
- Si el usuario proporciona un PDB ID explícito (ej. "4HHB", "2MNR"), llama query_pdb directamente sin pasar por search_pdb.
- Para preguntas sobre secuencias genómicas (GenBank/NCBI):
  - Si pregunta cuántas secuencias hay → usa search_genbank_sequences.
  - Si pregunta por IDs de secuencias → usa search_genbank_sequences o query_genbank con return_type="ids".
  - Si pregunta por metadata (longitud, tipo, descripción) → usa query_genbank con return_type="summary".
  - Para comparaciones entre organismos → haz múltiples llamadas a query_genbank o search_genbank_sequences.
- Sé amable, profesional y conciso.
`;
