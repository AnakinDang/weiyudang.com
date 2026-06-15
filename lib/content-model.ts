export const projectCategories = {
  "personal-ai-systems": "Personal AI Systems",
  "agent-infrastructure": "Agent Infrastructure",
  "research-tools": "Research Tools",
  "trading-research": "Trading Research",
  "creative-media": "Creative Media",
  "games-experiments": "Games & Experiments",
  "writing-field-notes": "Writing & Field Notes"
} as const;

export type ProjectCategory = keyof typeof projectCategories;

export const projectStatuses = {
  concept: "Concept",
  prototype: "Prototype",
  active: "Active",
  paused: "Paused",
  archived: "Archived"
} as const;

export type ProjectStatus = keyof typeof projectStatuses;

export const visibilityLabels = {
  public: "Public",
  "private-summary": "Private Summary",
  unlisted: "Unlisted",
  draft: "Draft"
} as const;

export type ContentVisibility = keyof typeof visibilityLabels;

export const labCategories = {
  "agent-systems": "Agent Systems",
  "dora-office": "Dora Office",
  "trading-research": "Trading Research",
  design: "Design",
  engineering: "Engineering",
  "creative-media": "Creative Media",
  operations: "Operations"
} as const;

export type LabCategory = keyof typeof labCategories;

export function readEnum<T extends Record<string, string>>(
  label: string,
  value: unknown,
  allowed: T
): keyof T {
  if (typeof value === "string" && value in allowed) {
    return value as keyof T;
  }

  throw new Error(
    `[content-model] ${label} must be one of: ${Object.keys(allowed).join(", ")}`
  );
}

