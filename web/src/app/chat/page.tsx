"use client";

import dynamic from "next/dynamic";

const ChatClient = dynamic(() => import("./ChatClient"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col h-screen max-h-screen items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />
      <div className="relative z-10 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse [animation-delay:200ms]" />
        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse [animation-delay:400ms]" />
      </div>
    </div>
  ),
});

export default function ChatPage() {
  return <ChatClient />;
}
