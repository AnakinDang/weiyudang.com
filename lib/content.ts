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
  publishedAt: string;
  updatedAt?: string;
  date: string;
  dateLabel: string;
  category: LabCategory;
  categoryLabel: string;
  visibility: ContentVisibility;
  visibilityLabel: string;
  summary: string;
  relatedProject?: string;
  artifactLinks: ContentLink[];
  featured: boolean;
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
  publishedAt?: string;
  updatedAt?: string;
  date?: string;
  category: unknown;
  visibility: unknown;
  summary: string;
  relatedProject?: unknown;
  artifactLinks?: unknown;
  featured?: unknown;
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

function readPublishedAt(raw: RawNote): string {
  if (typeof raw.publishedAt === "string" && raw.publishedAt.trim()) {
    return raw.publishedAt;
  }

  if (typeof raw.date === "string" && raw.date.trim()) {
    return raw.date;
  }

  throw new Error("[content-model] note.publishedAt is required");
}

function readRelatedProject(value: unknown, projectSlugs: Set<string>): string | undefined {
  if (typeof value !== "string" || !/^[a-z0-9-]+$/.test(value)) {
    return undefined;
  }

  return projectSlugs.has(value) ? value : undefined;
}

function readContentLinks(value: unknown): ContentLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is ContentLink => {
      if (!item || typeof item !== "object") {
        return false;
      }

      const candidate = item as Partial<ContentLink>;
      return (
        typeof candidate.label === "string" &&
        typeof candidate.href === "string" &&
        (/^\//.test(candidate.href) || /^https:\/\//.test(candidate.href))
      );
    })
    .map((item) => ({
      label: item.label,
      href: item.href,
      private: item.private === true
    }));
}

export function formatContentDate(value: string): string {
  const [year, month, day] = value.split("-").map(Number);
  const date =
    Number.isInteger(year) && Number.isInteger(month) && Number.isInteger(day)
      ? new Date(Date.UTC(year, month - 1, day))
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
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

function normalizeNote(raw: RawNote & { body: string }, projectSlugs: Set<string>): Note {
  const category = readEnum("note.category", raw.category, labCategories) as LabCategory;
  const visibility = readEnum("note.visibility", raw.visibility, visibilityLabels) as ContentVisibility;
  const publishedAt = readPublishedAt(raw);
  const updatedAt = typeof raw.updatedAt === "string" && raw.updatedAt.trim() ? raw.updatedAt : undefined;

  return {
    ...raw,
    publishedAt,
    updatedAt,
    date: publishedAt,
    dateLabel: formatContentDate(publishedAt),
    category,
    categoryLabel: labCategories[category],
    visibility,
    visibilityLabel: visibilityLabels[visibility],
    relatedProject: readRelatedProject(raw.relatedProject, projectSlugs),
    artifactLinks: readContentLinks(raw.artifactLinks),
    featured: raw.featured === true
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
  const projectSlugs = new Set(getProjects().map((project) => project.slug));
  return fs
    .readdirSync(folder)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => readMdx<RawNote>("notes", file))
    .map((note) => normalizeNote(note, projectSlugs))
    .filter((note) => isPublicVisibility(note.visibility))
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function getNoteBySlug(slug: string): Note | undefined {
  return getNotes().find((note) => note.slug === slug);
}

export function getNotesForProject(projectSlug: string, limit = 3): Note[] {
  return getNotes()
    .filter((note) => note.relatedProject === projectSlug)
    .slice(0, limit);
}

export function getRelatedNotes(note: Note, limit = 2): Note[] {
  return getNotes()
    .filter((candidate) => candidate.slug !== note.slug)
    .sort((left, right) => {
      const leftProjectMatch = note.relatedProject && left.relatedProject === note.relatedProject ? 0 : 1;
      const rightProjectMatch = note.relatedProject && right.relatedProject === note.relatedProject ? 0 : 1;
      const leftCategoryMatch = left.category === note.category ? 0 : 1;
      const rightCategoryMatch = right.category === note.category ? 0 : 1;

      return (
        leftProjectMatch - rightProjectMatch ||
        leftCategoryMatch - rightCategoryMatch ||
        right.date.localeCompare(left.date) ||
        left.slug.localeCompare(right.slug)
      );
    })
    .slice(0, limit);
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

export function getJournalEntryBySlug(slug: string): JournalEntry | undefined {
  return getJournalEntries().find((entry) => entry.slug === slug);
}
