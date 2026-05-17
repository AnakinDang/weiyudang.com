"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Bot, Radio, Route, ShieldCheck } from "lucide-react";
import { doraAnswers, publicQuestions } from "@/lib/mock";

type Message = {
  role: "visitor" | "dora";
  text: string;
};

export function DoraChatMock() {
  const timerRef = useRef<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "dora",
      text: "Hi, I am Dora, the public-facing guide for Weiyu Dang's personal website and AI lab. I can explain public projects and route you to contact."
    }
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [lastRoute, setLastRoute] = useState("project-guide");

  const suggestions = useMemo(() => publicQuestions, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  function ask(question: string) {
    if (isThinking) {
      return;
    }

    const normalized = publicQuestions.includes(question) ? question : "Show me Weiyu's projects.";
    const response =
      doraAnswers[normalized] ??
      "I can only answer from public website content in this MVP. Try asking about Weiyu AI, Dora, projects, MiniDora Trading, or collaboration.";
    setLastRoute(normalized === "How does Dora work?" ? "dora-routing" : normalized.includes("Trading") ? "research-safety" : "public-content");
    setMessages((current) => [...current, { role: "visitor", text: question }]);
    setIsThinking(true);
    setInput("");

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      setMessages((current) => [...current, { role: "dora", text: response }]);
      setIsThinking(false);
    }, 620);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.5fr_0.9fr]">
      <aside className="panel p-5">
        <div className="flex size-14 items-center justify-center rounded-[8px] border border-[#bfdbfe] bg-[#e0f2fe] text-[#2563eb]">
          <Bot size={30} aria-hidden />
        </div>
        <h2 className="mt-5 text-2xl font-semibold text-slate-950">Dora Public Guide</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          A constrained public assistant for project explanation and visitor routing.
        </p>
        <div className="mt-5 grid gap-2 text-sm">
          <div className="flex items-center justify-between rounded-[8px] border border-[#dde7f0] bg-[#f8fafc] px-3 py-2">
            <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
              <Radio size={15} aria-hidden />
              State
            </span>
            <span className="font-bold text-[#1d4ed8]">{isThinking ? "drafting" : "ready"}</span>
          </div>
          <div className="flex items-center justify-between rounded-[8px] border border-[#dde7f0] bg-[#f8fafc] px-3 py-2">
            <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
              <Route size={15} aria-hidden />
              Route
            </span>
            <span className="font-bold text-[#9a6a08]">{lastRoute}</span>
          </div>
        </div>
        <div className="mt-5 rounded-[8px] border border-emerald-200/60 bg-emerald-50 p-3 text-sm text-emerald-800">
          <ShieldCheck className="mb-2" size={18} aria-hidden />
          No private memory, trading data, internal tools, files, email, calendar, or credentials.
        </div>
      </aside>

      <section className="panel flex min-h-[34rem] flex-col overflow-hidden">
        <div className="border-b border-[#dde7f0] px-5 py-4">
          <p className="text-sm font-semibold text-slate-950">Public chat mock</p>
          <p className="text-xs text-slate-500">Static MVP, ready for a future constrained API.</p>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`max-w-[86%] rounded-[8px] border p-4 text-sm leading-6 ${
                message.role === "dora"
                  ? "border-[#bfdbfe] bg-[#e0f2fe]/80 text-slate-800"
                  : "ml-auto border-[#f4b740]/35 bg-[#fff8e5] text-slate-800"
              }`}
            >
              {message.text}
            </div>
          ))}
          {isThinking ? (
            <div className="max-w-[86%] rounded-[8px] border border-[#bfdbfe] bg-[#e0f2fe]/80 p-4 text-sm leading-6 text-slate-800">
              <span className="inline-flex items-center gap-2">
                <span className="size-2 animate-pulse rounded-full bg-[#2563eb]" />
                Dora is composing a bounded public answer...
              </span>
            </div>
          ) : null}
        </div>
        <form
          className="flex gap-3 border-t border-[#dde7f0] p-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (input.trim()) {
              ask(input.trim());
            }
          }}
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="min-w-0 flex-1 rounded-[8px] border border-[#dde7f0] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563eb]"
            placeholder="Ask a public question"
          />
          <button
            type="submit"
            disabled={isThinking}
            className="inline-flex items-center gap-2 rounded-[8px] bg-sky-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Ask
            <ArrowRight size={16} aria-hidden />
          </button>
        </form>
      </section>

      <aside className="panel p-5">
        <h2 className="text-lg font-semibold text-slate-950">Suggested questions</h2>
        <div className="mt-4 space-y-3">
          {suggestions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => ask(question)}
              disabled={isThinking}
              className="w-full rounded-[8px] border border-[#dde7f0] bg-[#f8fafc] px-3 py-3 text-left text-sm text-slate-700 transition hover:border-[#bfdbfe] hover:bg-[#e0f2fe]"
            >
              {question}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
