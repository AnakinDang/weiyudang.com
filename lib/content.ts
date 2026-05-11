import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type ContentLink = {
  label: string;
  href: string;
  private?: boolean;
};

export type Project = {
  title: string;
  slug: string;
  status: string;
  visibility: string;
  category: string;
  summary: string;
  cover: string;
  order: number;
  links: ContentLink[];
  body: string;
};

export type Note = {
  title: string;
  slug: string;
  date: string;
  summary: string;
  body: string;
};

type RawProject = Omit<Project, "body">;
type RawNote = Omit<Note, "body">;

const contentRoot = path.join(process.cwd(), "content");

function readMdx<T>(folder: string, fileName: string): T & { body: string } {
  const filePath = path.join(contentRoot, folder, fileName);
  const file = fs.readFileSync(filePath, "utf8");
  const parsed = matter(file);
  return {
    ...(parsed.data as T),
    body: parsed.content.trim()
  };
}

export function getProjects(): Project[] {
  const folder = path.join(contentRoot, "projects");
  return fs
    .readdirSync(folder)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => readMdx<RawProject>("projects", file))
    .sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}

export function getNotes(): Note[] {
  const folder = path.join(contentRoot, "notes");
  return fs
    .readdirSync(folder)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => readMdx<RawNote>("notes", file))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getLatestNotes(limit = 3): Note[] {
  return getNotes().slice(0, limit);
}
