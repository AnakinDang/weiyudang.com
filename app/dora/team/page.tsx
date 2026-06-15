import type { Metadata } from "next";
import { Bot } from "lucide-react";
import { DoraOfficeShell } from "@/components/DoraOfficeShell";
import { StatusBadge } from "@/components/StatusBadge";
import { getPublicAgentTone, latestAgentEvent } from "@/lib/dora-office";
import { getPublicAgents } from "@/lib/public-agents";

export const metadata: Metadata = {
  title: "Dora Team Agents",
  description: "Public MiniDora roster for the Dora Office."
};

export default function DoraTeamPage() {
  const agents = getPublicAgents();

  return (
    <DoraOfficeShell
      active="/dora/team"
      title="Team Agents"
      summary="A public-safe roster of Doraemon and MiniDoras with role, state, and recent sanitized activity."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {agents.map((agent) => {
          const event = latestAgentEvent(agent);
          return (
            <article key={agent.publicId} className="panel p-5">
              <span className="flex size-11 items-center justify-center rounded-[8px] border border-[#bfdbfe] bg-[#e0f2fe] text-[#2563eb]">
                <Bot size={22} aria-hidden />
              </span>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold text-slate-950">{agent.displayName}</h2>
                <StatusBadge tone={getPublicAgentTone(agent)}>{agent.stateLabel}</StatusBadge>
              </div>
              <p className="mt-2 text-sm font-semibold text-[#9a6a08]">{agent.role}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{agent.summary}</p>
              <div className="mt-5 rounded-[8px] border border-[#dde7f0] bg-[#f8fafc] p-3 text-xs leading-5 text-slate-500">
                Recent public event: {event ? `${event.title} · ${event.event_id}` : "No public event yet"}
              </div>
            </article>
          );
        })}
      </div>
    </DoraOfficeShell>
  );
}
