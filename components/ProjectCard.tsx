import Link from "next/link";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import type { Project } from "@/lib/content";
import { StatusBadge } from "@/components/StatusBadge";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="panel group flex h-full flex-col justify-between p-5 transition hover:-translate-y-0.5 hover:border-[#bfdbfe]">
      <div>
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <StatusBadge tone={project.visibility === "public" || project.visibility === "private-summary" ? "info" : "private"}>
            {project.visibilityLabel}
          </StatusBadge>
          <StatusBadge tone="warning">{project.statusLabel}</StatusBadge>
        </div>
        <p className="eyebrow mb-3">{project.categoryLabel}</p>
        <h3 className="text-xl font-semibold text-slate-950">{project.title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{project.summary}</p>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/projects/${project.slug}`}
          className="link-focus inline-flex items-center gap-2 rounded-[8px] bg-[#e0f2fe] px-3 py-2 text-sm font-semibold text-[#1d4ed8] transition hover:bg-[#dbeafe]"
        >
          View project
          <ArrowUpRight size={15} aria-hidden />
        </Link>
        {project.links.some((link) => link.private) ? (
          <span className="inline-flex items-center gap-2 rounded-[8px] border border-[#dde7f0] px-3 py-2 text-sm text-slate-500">
            <LockKeyhole size={14} aria-hidden />
            private hooks
          </span>
        ) : null}
      </div>
    </article>
  );
}
