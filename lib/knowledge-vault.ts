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
  }
] as const;

export const publicKnowledgeBoundaries = [
  "No raw vault pages, owner context records, private instruction text, or unpublished reports are rendered.",
  "Public links point only to curated site pages.",
  "Private source quality can shape public writing, but private source text does not cross the boundary."
] as const;

export const privateKnowledgeSources = [
  {
    title: "Source inbox",
    state: "Working",
    tone: "info",
    scope: "Owner-only captures",
    signal: "Triage lane",
    summary: "Incoming notes and evidence are triaged before they become synthesis material.",
    detail: "Raw captures stay outside the web UI."
  },
  {
    title: "Synthesis briefs",
    state: "Owner review",
    tone: "warning",
    scope: "Private summaries",
    signal: "Decision queue",
    summary: "Draft conclusions and decisions wait for explicit owner review before publication.",
    detail: "Only rewritten conclusions can move forward."
  },
  {
    title: "Public candidates",
    state: "Working",
    tone: "info",
    scope: "Curated outputs",
    signal: "Rewrite path",
    summary: "Candidate project, lab, and journal updates are rewritten into public-safe form.",
    detail: "Public pages receive curated text, never raw source."
  },
  {
    title: "Memory context",
    state: "Private",
    tone: "private",
    scope: "Owner context",
    signal: "Private guide",
    summary: "Personal context can guide prioritization, but raw memory records stay out of the UI.",
    detail: "Context can shape priority without becoming content."
  }
] as const;

export const privateKnowledgeQueue = [
  {
    title: "Personal OS design memory",
    owner: "Doraemon",
    state: "Owner review",
    tone: "warning",
    priority: "High",
    destination: "Product blueprint",
    output: "Product decision summary",
    risk: "Needs public/private boundary pass",
    evidence: ["Docs cross-check", "Owner decision", "Public rewrite"]
  },
  {
    title: "Doraemon Office release notes",
    owner: "Dev MiniDora",
    state: "Working",
    tone: "info",
    priority: "Medium",
    destination: "Lab note",
    output: "Public lab note candidate",
    risk: "Must avoid runtime details",
    evidence: ["PR summary", "Deployment smoke", "Safe wording"]
  },
  {
    title: "Trading research glossary",
    owner: "Trading MiniDora",
    state: "Working",
    tone: "info",
    priority: "Medium",
    destination: "Research explainer",
    output: "Research-only public explainer",
    risk: "No positions, orders, accounts, or recommendations",
    evidence: ["Research-only disclaimer", "No account data", "No execution path"]
  }
] as const;

export const privateKnowledgePolicy = [
  "Raw vault pages are never mounted directly into public routes.",
  "Public publishing requires an explicit owner-reviewed rewrite.",
  "Private memory can inform prioritization but must not appear as source text.",
  "Trading-related synthesis stays research-only and cannot become an execution workflow."
] as const;

export const privateKnowledgePosture = [
  {
    label: "Private sources",
    value: "Owner-only",
    tone: "private",
    detail: "Protected inputs can inform the cockpit, but source text is not rendered."
  },
  {
    label: "Review gates",
    value: "Explicit",
    tone: "warning",
    detail: "Publication requires owner review, public rewrite, and boundary pass."
  },
  {
    label: "Public bridge",
    value: "Curated",
    tone: "normal",
    detail: "Only safe project pages, notes, and dashboard summaries cross out."
  }
] as const;

export const privateKnowledgePublishBridge = [
  {
    label: "Private source",
    state: "Owner-only",
    tone: "private",
    detail: "Raw notes, memory, prompts, and unpublished reports stay private."
  },
  {
    label: "Synthesis",
    state: "Working",
    tone: "info",
    detail: "Doraemon and MiniDoras turn inputs into reviewable conclusions."
  },
  {
    label: "Owner review",
    state: "Required",
    tone: "warning",
    detail: "Weiyu approves wording, destination, and public safety before release."
  },
  {
    label: "Public-safe output",
    state: "Curated",
    tone: "normal",
    detail: "Visitors see rewritten pages and sanitized dashboard state only."
  }
] as const;

export const privateKnowledgeUnavailableControls = [
  "Publish candidate",
  "Expose source",
  "Sync private vault",
  "Create trading execution path"
] as const;
