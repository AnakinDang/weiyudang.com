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
    step: "Private capture",
    summary: "Raw notes, memory, and source material stay in owner-only systems."
  },
  {
    step: "Synthesis",
    summary: "Doraemon and MiniDoras turn source material into summaries, decisions, and candidate outputs."
  },
  {
    step: "Owner review",
    summary: "Weiyu explicitly decides what can become public and what stays private."
  },
  {
    step: "Public output",
    summary: "Only curated pages, lab notes, journal entries, and safe dashboard text reach visitors."
  }
] as const;

export const publicKnowledgeBoundaries = [
  "No raw vault pages, private memory records, prompt text, or unpublished reports are rendered.",
  "Public links point only to curated site pages.",
  "Private source quality can shape public writing, but private source text does not cross the boundary."
] as const;

export const privateKnowledgeSources = [
  {
    title: "Source inbox",
    state: "Working",
    tone: "info",
    scope: "Owner-only captures",
    summary: "Incoming notes and evidence are triaged before they become synthesis material."
  },
  {
    title: "Synthesis briefs",
    state: "Owner review",
    tone: "warning",
    scope: "Private summaries",
    summary: "Draft conclusions and decisions wait for explicit owner review before publication."
  },
  {
    title: "Public candidates",
    state: "Working",
    tone: "info",
    scope: "Curated outputs",
    summary: "Candidate project, lab, and journal updates are rewritten into public-safe form."
  },
  {
    title: "Memory context",
    state: "Private",
    tone: "private",
    scope: "Owner context",
    summary: "Personal context can guide prioritization, but raw memory records stay out of the UI."
  }
] as const;

export const privateKnowledgeQueue = [
  {
    title: "Personal OS design memory",
    owner: "Doraemon",
    state: "Owner review",
    tone: "warning",
    output: "Product decision summary",
    risk: "Needs public/private boundary pass"
  },
  {
    title: "Doraemon Office release notes",
    owner: "Dev MiniDora",
    state: "Working",
    tone: "info",
    output: "Public lab note candidate",
    risk: "Must avoid runtime details"
  },
  {
    title: "Trading research glossary",
    owner: "Trading MiniDora",
    state: "Working",
    tone: "info",
    output: "Research-only public explainer",
    risk: "No positions, orders, accounts, or recommendations"
  }
] as const;

export const privateKnowledgePolicy = [
  "Raw vault pages are never mounted directly into public routes.",
  "Public publishing requires an explicit owner-reviewed rewrite.",
  "Private memory can inform prioritization but must not appear as source text.",
  "Trading-related synthesis stays research-only and cannot become an execution workflow."
] as const;
