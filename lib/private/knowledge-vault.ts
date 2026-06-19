import "server-only";

// Owner-only Knowledge Vault data. Public routes must import from "@/lib/knowledge-vault" instead.

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
