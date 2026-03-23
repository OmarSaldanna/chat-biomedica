"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./chat.css";

// ── Types ───────────────────────────────────────────────────────────────────
interface FunctionCallInfo {
  name: string;
  args: string;
  result: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  functionCalls?: FunctionCallInfo[];
}

// ── Constants ─────────────────────────────────────────────────────────────
const MAX_RESPONSES = 5;
const MAX_MESSAGES = MAX_RESPONSES * 2;
const STORAGE_KEY = "biochat-current-id";

// ── Helpers ──────────────────────────────────────────────────────────────────
function generateChatId(): string {
  return `chat-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

function saveChatToStorage(chatId: string, messages: ChatMessage[]) {
  try {
    localStorage.setItem(chatId, JSON.stringify(messages));
    localStorage.setItem(STORAGE_KEY, chatId);
  } catch {
    // localStorage might be full or unavailable
  }
}

function loadChatFromStorage(chatId: string): ChatMessage[] {
  try {
    const data = localStorage.getItem(chatId);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function getPersistedChatId(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || generateChatId();
  } catch {
    return generateChatId();
  }
}

// ── Friendly function names ─────────────────────────────────────────────────
const FUNCTION_LABELS: Record<string, string> = {
  get_drug_info: "Consultando ChEMBL",
};

function getFunctionLabel(name: string): string {
  return FUNCTION_LABELS[name] || name;
}

function formatFunctionArgs(args: string): string {
  try {
    const parsed = JSON.parse(args);
    return Object.values(parsed).join(", ");
  } catch {
    return args;
  }
}

// ── Markdown components ──────────────────────────────────────────────────────
const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-base font-bold text-white mt-3 mb-1">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-sm font-bold text-white mt-3 mb-1">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-sm font-semibold text-slate-200 mt-2 mb-1">{children}</h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic text-slate-300">{children}</em>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-none space-y-1 my-2 pl-0">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal list-inside space-y-1 my-2 pl-2">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="flex items-start gap-2 text-slate-200">
      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
      <span>{children}</span>
    </li>
  ),
  code: ({ children, className }: { children?: React.ReactNode; className?: string }) => {
    const isBlock = className?.startsWith("language-");
    return isBlock ? (
      <code className="block bg-slate-900/60 rounded-lg p-3 text-xs text-emerald-300 font-mono my-2 overflow-x-auto">
        {children}
      </code>
    ) : (
      <code className="bg-slate-900/60 rounded px-1.5 py-0.5 text-xs text-emerald-300 font-mono">
        {children}
      </code>
    );
  },
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-2 border-indigo-500/50 pl-3 my-2 text-slate-300 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-slate-700/50 my-3" />,
};

// ── Component ───────────────────────────────────────────────────────────────
export default function ChatClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string>("");
  const [limitReached, setLimitReached] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ── Initialize from localStorage on mount ──────────────────────────────
  useEffect(() => {
    const id = getPersistedChatId();
    setChatId(id);
    const stored = loadChatFromStorage(id);
    if (stored.length > 0) {
      setMessages(stored);
      if (stored.length >= MAX_MESSAGES) setLimitReached(true);
    }
  }, []);

  // ── Auto-scroll ────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ── Persist messages to localStorage ──────────────────────────────────
  useEffect(() => {
    if (chatId && messages.length > 0) {
      saveChatToStorage(chatId, messages);
    }
  }, [messages, chatId]);

  // ── Send Message ────────────────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || limitReached) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.limitReached) setLimitReached(true);
        setMessages([
          ...updatedMessages,
          {
            role: "assistant",
            content: data.error || "Error al procesar la solicitud.",
          },
        ]);
        return;
      }

      const newMessages = [
        ...updatedMessages,
        {
          role: "assistant" as const,
          content: data.message,
          functionCalls: data.functionCalls,
        },
      ];
      setMessages(newMessages);
      if (newMessages.length >= MAX_MESSAGES) setLimitReached(true);
    } catch {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Error de conexión. Verifica que el servidor esté funcionando.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, limitReached, messages]);

  // ── New Chat ───────────────────────────────────────────────────────────
  const startNewChat = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    const id = generateChatId();
    setChatId(id);
    setMessages([]);
    setInput("");
    setLimitReached(false);
    inputRef.current?.focus();
  };

  // ── Key handler ───────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen max-h-screen relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800/60 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700/80 transition-colors"
            title="Volver al inicio"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <div>
            <h1 className="text-base font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              BioChat
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">Asistente de bases de datos biomédicas</p>
          </div>
        </div>

        {/* Nuevo Chat button — always visible */}
        <button
          onClick={startNewChat}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-sm text-slate-300 hover:bg-slate-700/80 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span className="hidden sm:inline">Nuevo Chat</span>
        </button>
      </header>

      {/* ── Messages Area ──────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto chat-scroll px-4 sm:px-6 py-6 relative z-10">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* ── Welcome Header — always visible at top ─────────────────── */}
          <div className="flex flex-col items-center text-center py-6 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 flex items-center justify-center border border-slate-700/40">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
                <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">¡Hola! Soy BioChat</h2>
              <p className="text-slate-400 text-sm max-w-md">
                Puedo ayudarte a consultar información sobre fármacos, genes,<br />
                proteínas y más. Pregúntame lo que necesites.
              </p>
            </div>
            {/* Suggestion chips — only when no messages */}
            {messages.length === 0 && (
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                {[
                  "Propiedades del ibuprofeno",
                  "¿Qué es la aspirina?",
                  "Información del paracetamol",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInput(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="px-3 py-1.5 rounded-full text-xs text-slate-300 bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/60 hover:text-white transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Message list ──────────────────────────────────────────── */}
          {messages.map((msg, idx) => (
            <div key={idx} className="message-enter">
              {/* Function calling chips */}
              {msg.functionCalls && msg.functionCalls.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {msg.functionCalls.map((fc, fcIdx) => (
                    <div
                      key={fcIdx}
                      className="function-chip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                      </svg>
                      <span>{getFunctionLabel(fc.name)}</span>
                      <span className="text-indigo-400/60">({formatFunctionArgs(fc.args)})</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Message bubble */}
              <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-indigo-600/30 border border-indigo-500/30 text-white"
                      : "glass-card text-slate-200"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="text-sm leading-relaxed markdown-content">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start message-enter">
              <div className="glass-card rounded-2xl px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="typing-dot w-2 h-2 rounded-full bg-indigo-400" />
                  <div className="typing-dot w-2 h-2 rounded-full bg-indigo-400" />
                  <div className="typing-dot w-2 h-2 rounded-full bg-indigo-400" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Limit Reached Banner ───────────────────────────────────────── */}
      {limitReached && (
        <div className="limit-banner relative z-10 flex items-center justify-center gap-3 px-4 py-3 bg-amber-500/10 border-t border-amber-500/20 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" /><path d="M12 17h.01" />
          </svg>
          <span className="text-sm text-amber-300">Límite de {MAX_RESPONSES} respuestas alcanzado.</span>
          <button
            onClick={startNewChat}
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2"
          >
            Nuevo Chat
          </button>
        </div>
      )}

      {/* ── Input Bar ──────────────────────────────────────────────────── */}
      <div className="relative z-10 border-t border-slate-800/60 px-4 sm:px-6 py-4 shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  limitReached
                    ? "Límite alcanzado — inicia un nuevo chat"
                    : "Escribe tu pregunta..."
                }
                disabled={isLoading || limitReached}
                rows={1}
                className="w-full resize-none rounded-xl bg-slate-800/60 border border-slate-700/60 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                style={{ maxHeight: "120px" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = Math.min(target.scrollHeight, 120) + "px";
                }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading || limitReached}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white transition-colors shrink-0"
            >
              {isLoading ? (
                <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 7-7 7 7" /><path d="M12 19V5" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 px-1">
            <span className="text-xs text-slate-500">
              {messages.length > 0 && !limitReached && (
                <>{Math.floor(messages.length / 2)}/{MAX_RESPONSES} respuestas usadas</>
              )}
            </span>
            <button
              onClick={startNewChat}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-300 transition-colors group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform duration-200">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Nuevo Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
