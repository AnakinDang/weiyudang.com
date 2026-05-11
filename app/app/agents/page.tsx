import fs from "node:fs";
import path from "node:path";
import { Bot } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

type Agent = {
  id: string;
  name: string;
  role: string;
  state: string;
  summary: string;
};

function getAgents(): Agent[] {
  const folder = path.join(process.cwd(), "content", "agents");
  return fs
    .readdirSync(folder)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(fs.readFileSync(path.join(folder, file), "utf8")) as Agent);
}

export default function AgentsPage() {
  const agents = getAgents();

  return (
    <section className="space-y-5">
      <div className="panel p-6">
        <p className="eyebrow">MiniDora status</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Agent registry mock</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">Loaded from structured JSON files under content/agents.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {agents.map((agent) => (
          <article key={agent.id} className="panel p-5">
            <Bot className="text-sky-100" size={24} aria-hidden />
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold text-white">{agent.name}</h3>
              <StatusBadge tone="info">{agent.state}</StatusBadge>
            </div>
            <p className="mt-2 text-sm font-semibold text-yellow-100">{agent.role}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{agent.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
