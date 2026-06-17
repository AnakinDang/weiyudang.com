import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  labCategories,
  projectCategories,
  projectStatuses,
  readEnum,
  visibilityLabels,
  type ContentVisibility,
  type LabCategory,
  type ProjectCategory,
  type ProjectStatus
} from "@/lib/content-model";

export type ContentLink = {
  label: string;
  href: string;
  private?: boolean;
};

export type Project = {
  title: string;
  slug: string;
  status: ProjectStatus;
  statusLabel: string;
  visibility: ContentVisibility;
  visibilityLabel: string;
  category: ProjectCategory;
  categoryLabel: string;
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
  category: LabCategory;
  categoryLabel: string;
  visibility: ContentVisibility;
  visibilityLabel: string;
  summary: string;
  body: string;
};

export type JournalEntry = {
  title: string;
  slug: string;
  date: string;
  type: string;
  visibility: ContentVisibility;
  visibilityLabel: string;
  location: string;
  summary: string;
  cover: string;
  accent: string;
  order: number;
  body: string;
};

type RawProject = {
  title: string;
  slug: string;
  status: unknown;
  visibility: unknown;
  category: unknown;
  summary: string;
  cover: string;
  order: number;
  links?: ContentLink[];
};

type RawNote = {
  title: string;
  slug: string;
  date: string;
  category: unknown;
  visibility: unknown;
  summary: string;
};

type RawJournalEntry = {
  title: string;
  slug: string;
  date: string;
  type: string;
  visibility: unknown;
  location: string;
  summary: string;
  cover: string;
  accent: string;
  order: number;
};

const contentRoot = path.join(process.cwd(), "content");

function isPublicVisibility(visibility: ContentVisibility) {
  return visibility === "public" || visibility === "private-summary";
}

function readMdx<T>(folder: string, fileName: string): T & { body: string } {
  const filePath = path.join(contentRoot, folder, fileName);
  const file = fs.readFileSync(filePath, "utf8");
  const parsed = matter(file);
  return {
    ...(parsed.data as T),
    body: parsed.content.trim()
  };
}

function normalizeProject(raw: RawProject & { body: string }): Project {
  const status = readEnum("project.status", raw.status, projectStatuses) as ProjectStatus;
  const visibility = readEnum("project.visibility", raw.visibility, visibilityLabels) as ContentVisibility;
  const category = readEnum("project.category", raw.category, projectCategories) as ProjectCategory;

  return {
    ...raw,
    status,
    statusLabel: projectStatuses[status],
    visibility,
    visibilityLabel: visibilityLabels[visibility],
    category,
    categoryLabel: projectCategories[category],
    links: raw.links ?? []
  };
}

function normalizeNote(raw: RawNote & { body: string }): Note {
  const category = readEnum("note.category", raw.category, labCategories) as LabCategory;
  const visibility = readEnum("note.visibility", raw.visibility, visibilityLabels) as ContentVisibility;

  return {
    ...raw,
    category,
    categoryLabel: labCategories[category],
    visibility,
    visibilityLabel: visibilityLabels[visibility]
  };
}

function normalizeJournalEntry(raw: RawJournalEntry & { body: string }): JournalEntry {
  const visibility = readEnum("journal.visibility", raw.visibility, visibilityLabels) as ContentVisibility;

  return {
    ...raw,
    visibility,
    visibilityLabel: visibilityLabels[visibility]
  };
}

export function getProjects(): Project[] {
  const folder = path.join(contentRoot, "projects");
  return fs
    .readdirSync(folder)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => readMdx<RawProject>("projects", file))
    .map(normalizeProject)
    .filter((project) => isPublicVisibility(project.visibility))
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
    .map(normalizeNote)
    .filter((note) => isPublicVisibility(note.visibility))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getLatestNotes(limit = 3): Note[] {
  return getNotes().slice(0, limit);
}

export function getJournalEntries(): JournalEntry[] {
  const folder = path.join(contentRoot, "journal");
  return fs
    .readdirSync(folder)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => readMdx<RawJournalEntry>("journal", file))
    .map(normalizeJournalEntry)
    .filter((entry) => isPublicVisibility(entry.visibility))
    .sort((a, b) => a.order - b.order);
}

export function getLatestJournalEntries(limit = 3): JournalEntry[] {
  return getJournalEntries().slice(0, limit);
}
