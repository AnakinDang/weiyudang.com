import Link from "next/link";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import type { Project } from "@/lib/content";
import { StatusBadge } from "@/components/StatusBadge";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="panel group flex h-full flex-col justify-between p-5 transition hover:-translate-y-0.5 hover:border-sky-300/40">
      <div>
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <StatusBadge tone={project.visibility.includes("public") ? "info" : "private"}>
            {project.visibility}
          </StatusBadge>
          <StatusBadge tone="warning">{project.status}</StatusBadge>
        </div>
        <p className="eyebrow mb-3">{project.category}</p>
        <h3 className="text-xl font-semibold text-white">{project.title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-300">{project.summary}</p>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/projects/${project.slug}`}
          className="link-focus inline-flex items-center gap-2 rounded-[8px] bg-sky-400/12 px-3 py-2 text-sm font-semibold text-sky-100 transition hover:bg-sky-400/20"
        >
          View project
          <ArrowUpRight size={15} aria-hidden />
        </Link>
        {project.links.some((link) => link.private) ? (
          <span className="inline-flex items-center gap-2 rounded-[8px] border border-slate-600 px-3 py-2 text-sm text-slate-300">
            <LockKeyhole size={14} aria-hidden />
            private hooks
          </span>
        ) : null}
      </div>
    </article>
  );
}
