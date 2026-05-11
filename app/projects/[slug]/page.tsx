import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, LockKeyhole } from "lucide-react";
import { MarkdownBody } from "@/components/MarkdownBody";
import { StatusBadge } from "@/components/StatusBadge";
import { SiteChrome } from "@/components/SiteChrome";
import { getProjectBySlug, getProjects } from "@/lib/content";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.summary
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <SiteChrome>
      <section className="section">
        <div className="container">
          <Link href="/projects" className="link-focus inline-flex items-center gap-2 text-sm font-semibold text-sky-100 hover:text-sky-50">
            <ArrowLeft size={16} aria-hidden />
            Back to projects
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
            <article>
              <p className="eyebrow">{project.category}</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold text-white md:text-6xl">{project.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{project.summary}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <StatusBadge tone="info">{project.visibility}</StatusBadge>
                <StatusBadge tone="warning">{project.status}</StatusBadge>
              </div>
              <MarkdownBody body={project.body} />
            </article>
            <aside className="panel h-fit p-5">
              <h2 className="text-lg font-semibold text-white">Project links</h2>
              <div className="mt-4 space-y-3">
                {project.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="link-focus flex items-center justify-between gap-3 rounded-[8px] border border-slate-700 px-3 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-300/40 hover:bg-sky-300/10"
                  >
                    <span className="inline-flex items-center gap-2">
                      {link.private ? <LockKeyhole size={15} aria-hidden /> : null}
                      {link.label}
                    </span>
                    <ArrowUpRight size={15} aria-hidden />
                  </Link>
                ))}
              </div>
              <p className="mt-5 text-xs leading-5 text-slate-500">
                Private links require app access and are intentionally separated from public content.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
