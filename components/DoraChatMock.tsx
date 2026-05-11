"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Bot, ShieldCheck } from "lucide-react";
import { doraAnswers, publicQuestions } from "@/lib/mock";

type Message = {
  role: "visitor" | "dora";
  text: string;
};

export function DoraChatMock() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "dora",
      text: "Hi, I am Dora, the public-facing guide for Weiyu Dang's AI company website. I can explain public projects and route you to contact."
    }
  ]);
  const [input, setInput] = useState("");

  const suggestions = useMemo(() => publicQuestions, []);

  function ask(question: string) {
    const normalized = publicQuestions.includes(question) ? question : "Show me Weiyu's projects.";
    setMessages((current) => [
      ...current,
      { role: "visitor", text: question },
      {
        role: "dora",
        text:
          doraAnswers[normalized] ??
          "I can only answer from public website content in this MVP. Try asking about Weiyu AI, Doraemon Agent System, projects, MiniDora Trading, or collaboration."
      }
    ]);
    setInput("");
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.5fr_0.9fr]">
      <aside className="panel p-5">
        <div className="flex size-14 items-center justify-center rounded-[8px] border border-sky-200/30 bg-sky-300/12 text-sky-100">
          <Bot size={30} aria-hidden />
        </div>
        <h2 className="mt-5 text-2xl font-semibold text-white">Dora Public Guide</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          A constrained public assistant for project explanation and visitor routing.
        </p>
        <div className="mt-5 rounded-[8px] border border-emerald-200/24 bg-emerald-300/10 p-3 text-sm text-emerald-100">
          <ShieldCheck className="mb-2" size={18} aria-hidden />
          No private memory, trading data, internal tools, files, email, calendar, or credentials.
        </div>
      </aside>

      <section className="panel flex min-h-[34rem] flex-col overflow-hidden">
        <div className="border-b border-slate-700/50 px-5 py-4">
          <p className="text-sm font-semibold text-white">Public chat mock</p>
          <p className="text-xs text-slate-400">Static MVP, ready for a future constrained API.</p>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`max-w-[86%] rounded-[8px] border p-4 text-sm leading-6 ${
                message.role === "dora"
                  ? "border-sky-200/22 bg-sky-300/10 text-sky-50"
                  : "ml-auto border-yellow-200/24 bg-yellow-300/10 text-yellow-50"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <form
          className="flex gap-3 border-t border-slate-700/50 p-4"
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
            className="min-w-0 flex-1 rounded-[8px] border border-slate-600 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300"
            placeholder="Ask a public question"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-[8px] bg-sky-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-300"
          >
            Ask
            <ArrowRight size={16} aria-hidden />
          </button>
        </form>
      </section>

      <aside className="panel p-5">
        <h2 className="text-lg font-semibold text-white">Suggested questions</h2>
        <div className="mt-4 space-y-3">
          {suggestions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => ask(question)}
              className="w-full rounded-[8px] border border-slate-600 bg-white/5 px-3 py-3 text-left text-sm text-slate-200 transition hover:border-sky-300/50 hover:bg-sky-300/10"
            >
              {question}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
