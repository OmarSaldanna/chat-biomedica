import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  toolDefinitions,
  functionHandlers,
  systemPrompt,
} from "./functions/index";

// ── Types ───────────────────────────────────────────────────────────────────
interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface FunctionCallInfo {
  name: string;
  args: string;
  result: string;
}

// ── OpenAI Client ───────────────────────────────────────────────────────────
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_RESPONSES = parseInt(process.env.MAX_RESPONSES || "5", 10);

// ── POST Handler ────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages: ChatMessage[] = body.messages || [];

    // Validate message limit (count assistant messages)
    const assistantCount = messages.filter(
      (m) => m.role === "assistant"
    ).length;
    if (assistantCount >= MAX_RESPONSES) {
      return NextResponse.json(
        {
          error:
            "Se ha alcanzado el límite de respuestas para este chat. Inicia un nuevo chat para continuar.",
          limitReached: true,
        },
        { status: 429 }
      );
    }

    // Build the full messages array with system prompt
    const fullMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    // Tool calling loop — supports chained calls (e.g. search_proteins → get_protein_details)
    const MAX_TOOL_ROUNDS = 3;
    const conversationMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      [...fullMessages];
    const functionCalls: FunctionCallInfo[] = [];

    let assistantMessage!: OpenAI.Chat.Completions.ChatCompletionMessage;

    for (let round = 0; round < MAX_TOOL_ROUNDS + 1; round++) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: conversationMessages,
        tools: toolDefinitions,
        tool_choice: "auto",
      });

      assistantMessage = response.choices[0].message;

      // If no tool calls, we have the final response
      if (!assistantMessage.tool_calls || assistantMessage.tool_calls.length === 0) {
        break;
      }

      // Safety: don't exceed max rounds
      if (round >= MAX_TOOL_ROUNDS) {
        break;
      }

      // Add assistant message (with tool_calls) to conversation
      conversationMessages.push(assistantMessage);

      // Execute each tool call
      for (const toolCall of assistantMessage.tool_calls) {
        if (toolCall.type !== "function") continue;

        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);

        const handlerFn = functionHandlers[functionName];
        let result: { status: string; content: string };

        if (handlerFn) {
          result = await handlerFn(functionArgs);
        } else {
          result = {
            status: "error",
            content: `Función desconocida: ${functionName}`,
          };
        }

        // Track function call info for frontend
        functionCalls.push({
          name: functionName,
          args: toolCall.function.arguments,
          result: result.content,
        });

        // Add tool result to conversation
        conversationMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }
    }

    return NextResponse.json({
      message: assistantMessage.content || "",
      functionCalls: functionCalls.length > 0 ? functionCalls : undefined,
    });
  } catch (error) {
    console.error("Chat API error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";

    // Check for common OpenAI errors
    if (errorMessage.includes("API key")) {
      return NextResponse.json(
        { error: "API key de OpenAI no configurada o inválida." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: `Error del servidor: ${errorMessage}` },
      { status: 500 }
    );
  }
}
