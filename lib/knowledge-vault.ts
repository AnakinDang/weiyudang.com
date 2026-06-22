export const publicKnowledgeOutputs = [
  {
    title: "Project summaries",
    href: "/projects",
    state: "Published",
    tone: "normal",
    summary: "Curated public pages for systems, research tools, and Doraemon-related work."
  },
  {
    title: "Lab notes",
    href: "/lab",
    state: "Public notes",
    tone: "info",
    summary: "Experiment logs and design sketches rewritten for public reading."
  },
  {
    title: "Journal",
    href: "/journal",
    state: "Human rhythm",
    tone: "info",
    summary: "Personal writing that keeps the site from feeling like a machine dashboard."
  },
  {
    title: "Doraemon Office",
    href: "/dora/office",
    state: "Public view",
    tone: "normal",
    summary: "A public command-room view built from safe labels, opaque IDs, and display-only state."
  }
] as const;

export const publicKnowledgeFlow = [
  {
    step: "Capture",
    shortLabel: "owner-only source",
    summary: "Source material is collected in owner-only systems and is never mounted directly into public routes."
  },
  {
    step: "Synthesis",
    shortLabel: "curated draft",
    summary: "Doraemon and MiniDoras turn source material into summaries, decisions, and candidate outputs."
  },
  {
    step: "Owner review",
    shortLabel: "explicit gate",
    summary: "Weiyu explicitly decides what can become public and what stays private."
  },
  {
    step: "Public output",
    shortLabel: "safe page",
    summary: "Only curated pages, lab notes, journal entries, and safe dashboard text reach visitors."
  }
] as const;

export const publicKnowledgeStats = [
  {
    label: "Public outputs",
    value: "4"
  },
  {
    label: "Publish gates",
    value: "3"
  },
  {
    label: "Private sources",
    value: "hidden"
  },
  {
    label: "Source pages",
    value: "0 public"
  }
] as const;

export const publicKnowledgeBoundaries = [
  "No owner context, source records, or unreleased research drafts are rendered.",
  "Public links point only to curated site pages.",
  "Private research can shape public writing, but source passages do not cross the boundary."
] as const;
