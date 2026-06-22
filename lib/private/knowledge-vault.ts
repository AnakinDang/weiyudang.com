import "server-only";

// Owner-only Knowledge Vault data. Public routes must import from "@/lib/knowledge-vault" instead.

type KnowledgeTone = "normal" | "info" | "warning" | "private" | "danger";

type KnowledgeReviewRow = {
  label: string;
  state: string;
  tone: KnowledgeTone;
  ready: boolean;
  detail: string;
};

type KnowledgeReviewPosture = {
  label: string;
  state: string;
  tone: KnowledgeTone;
  detail: string;
  next: string;
};

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
    id: "personal-os-memory",
    title: "Personal OS design memory",
    owner: "Doraemon",
    state: "Owner review",
    tone: "warning",
    priority: "High",
    destination: "Product blueprint",
    output: "Product decision summary",
    risk: "Needs public/private boundary pass",
    evidence: ["Docs cross-check", "Owner decision", "Public rewrite"],
    reviewSummary: "Turn private design context into a public-safe product decision summary.",
    boundary: "No raw memory, private transcript, prompt, or unpublished source text can be copied into public pages.",
    readiness: [
      {
        label: "Docs cross-check",
        state: "Ready",
        tone: "normal",
        ready: true,
        detail: "Public blueprint and data contract are available as the source of truth."
      },
      {
        label: "Owner decision",
        state: "Required",
        tone: "warning",
        ready: false,
        detail: "Weiyu must choose what becomes public product language."
      },
      {
        label: "Public rewrite",
        state: "Needed",
        tone: "warning",
        ready: false,
        detail: "Private context needs a curated rewrite before leaving the cockpit."
      }
    ] satisfies readonly KnowledgeReviewRow[],
    transformSteps: [
      {
        label: "Read source context",
        state: "Owner-only",
        tone: "private",
        ready: true,
        detail: "Use private context as input without rendering raw material."
      },
      {
        label: "Rewrite conclusion",
        state: "Working",
        tone: "info",
        ready: false,
        detail: "Create public product wording from the documented blueprint."
      },
      {
        label: "Boundary signoff",
        state: "Required",
        tone: "warning",
        ready: false,
        detail: "Run the public/private boundary pass before publishing."
      }
    ] satisfies readonly KnowledgeReviewRow[],
    safeOutputs: [
      {
        label: "Decision summary",
        state: "Allowed",
        tone: "normal",
        ready: true,
        detail: "A rewritten product decision summary can be reviewed for public use."
      },
      {
        label: "Blueprint update",
        state: "Owner-gated",
        tone: "warning",
        ready: false,
        detail: "Documentation changes need explicit owner review."
      },
      {
        label: "Raw memory",
        state: "Unavailable",
        tone: "private",
        ready: true,
        detail: "Private memory records are not displayable outputs."
      }
    ] satisfies readonly KnowledgeReviewRow[],
    ownerPostures: [
      {
        label: "Review now",
        state: "Owner review",
        tone: "warning",
        detail: "Treat this candidate as the next public-language decision.",
        next: "Read the summary, choose public wording, then keep any edits inside Review Queue until approved."
      },
      {
        label: "Defer rewrite",
        state: "Safe hold",
        tone: "info",
        detail: "Leave the candidate visible without moving it toward publication.",
        next: "Keep the source private and revisit after the current Personal OS slice closes."
      },
      {
        label: "Need boundary pass",
        state: "Needs evidence",
        tone: "warning",
        detail: "Require another privacy review before trusting the candidate.",
        next: "Check the Data Contract and remove any private-memory-shaped wording first."
      }
    ] satisfies readonly KnowledgeReviewPosture[]
  },
  {
    id: "doraemon-office-release-notes",
    title: "Doraemon Office release notes",
    owner: "Dev MiniDora",
    state: "Working",
    tone: "info",
    priority: "Medium",
    destination: "Lab note",
    output: "Public lab note candidate",
    risk: "Must avoid runtime details",
    evidence: ["PR summary", "Deployment smoke", "Safe wording"],
    reviewSummary: "Prepare a public build note from reviewed PR and deployment evidence.",
    boundary: "No internal runtime labels, local service details, raw logs, or operational commands can be shown.",
    readiness: [
      {
        label: "PR summary",
        state: "Ready",
        tone: "normal",
        ready: true,
        detail: "Reviewed product changes are safe inputs for a public build note."
      },
      {
        label: "Deployment smoke",
        state: "Ready",
        tone: "normal",
        ready: true,
        detail: "Public route checks can support the release story."
      },
      {
        label: "Safe wording",
        state: "Needed",
        tone: "warning",
        ready: false,
        detail: "Runtime and ops language still needs a public rewrite."
      }
    ] satisfies readonly KnowledgeReviewRow[],
    transformSteps: [
      {
        label: "Collect reviewed work",
        state: "Ready",
        tone: "normal",
        ready: true,
        detail: "Start from merged PRs and production smoke evidence."
      },
      {
        label: "Remove internals",
        state: "Required",
        tone: "warning",
        ready: false,
        detail: "Strip service internals, commands, hostnames, ports, and private traces."
      },
      {
        label: "Draft lab note",
        state: "Working",
        tone: "info",
        ready: false,
        detail: "Write a public note about product behavior and design intent."
      }
    ] satisfies readonly KnowledgeReviewRow[],
    safeOutputs: [
      {
        label: "Release note",
        state: "Allowed",
        tone: "normal",
        ready: true,
        detail: "A public note can describe shipped user-visible improvements."
      },
      {
        label: "Verification summary",
        state: "Allowed",
        tone: "info",
        ready: true,
        detail: "Route and privacy smoke checks can be summarized safely."
      },
      {
        label: "Runtime detail",
        state: "Unavailable",
        tone: "private",
        ready: true,
        detail: "Raw logs, shell commands, and private infrastructure details stay out."
      }
    ] satisfies readonly KnowledgeReviewRow[],
    ownerPostures: [
      {
        label: "Draft note",
        state: "Working",
        tone: "info",
        detail: "Use the candidate as a starting point for a public lab note.",
        next: "Write from product impact and verification evidence, not from raw runtime detail."
      },
      {
        label: "Hold wording",
        state: "Needs rewrite",
        tone: "warning",
        detail: "Pause until the public wording is less operational.",
        next: "Rewrite toward visitor-facing product behavior before publication."
      },
      {
        label: "Archive private",
        state: "Owner-only",
        tone: "private",
        detail: "Keep the evidence private and do not create public content.",
        next: "Leave the candidate in the vault; no public page or lab note is created."
      }
    ] satisfies readonly KnowledgeReviewPosture[]
  },
  {
    id: "trading-research-glossary",
    title: "Trading research glossary",
    owner: "Trading MiniDora",
    state: "Working",
    tone: "info",
    priority: "Medium",
    destination: "Research explainer",
    output: "Research-only public explainer",
    risk: "No positions, orders, accounts, or recommendations",
    evidence: ["Research-only disclaimer", "No account data", "No execution path"],
    reviewSummary: "Create a public explainer for research vocabulary without market instructions.",
    boundary: "Trading language must remain research-only and cannot become advice, recommendation, order, account, or position content.",
    readiness: [
      {
        label: "Research disclaimer",
        state: "Ready",
        tone: "normal",
        ready: true,
        detail: "The fixed research-only disclaimer is required wherever trading appears."
      },
      {
        label: "Account data",
        state: "Absent",
        tone: "normal",
        ready: true,
        detail: "No account, position, broker, or credential detail is part of this candidate."
      },
      {
        label: "Execution path",
        state: "Blocked",
        tone: "private",
        ready: true,
        detail: "No order, recommendation, sizing, or execution workflow exists."
      }
    ] satisfies readonly KnowledgeReviewRow[],
    transformSteps: [
      {
        label: "Define terms",
        state: "Research-only",
        tone: "info",
        ready: true,
        detail: "Explain vocabulary as learning context, not as market instruction."
      },
      {
        label: "Remove signals",
        state: "Required",
        tone: "warning",
        ready: true,
        detail: "Do not include live signals, symbols, positions, or tactical calls."
      },
      {
        label: "Attach disclaimer",
        state: "Required",
        tone: "warning",
        ready: true,
        detail: "Keep the research-only boundary visible in the final public output."
      }
    ] satisfies readonly KnowledgeReviewRow[],
    safeOutputs: [
      {
        label: "Glossary explainer",
        state: "Allowed",
        tone: "normal",
        ready: true,
        detail: "A methodology explainer is safe when it contains no actionable market instruction."
      },
      {
        label: "Boundary note",
        state: "Required",
        tone: "warning",
        ready: true,
        detail: "The research-only disclaimer must stay attached."
      },
      {
        label: "Trade instruction",
        state: "Unavailable",
        tone: "private",
        ready: true,
        detail: "No order, recommendation, position sizing, or account action is rendered."
      }
    ] satisfies readonly KnowledgeReviewRow[],
    ownerPostures: [
      {
        label: "Review explainer",
        state: "Owner read",
        tone: "normal",
        detail: "Read the glossary as methodology content only.",
        next: "Open the Trading Team for research context; do not treat the glossary as a signal."
      },
      {
        label: "Tighten boundary",
        state: "Needs wording",
        tone: "warning",
        detail: "Strengthen language if any phrase sounds like advice.",
        next: "Remove tactical verbs and keep the fixed research-only disclaimer visible."
      },
      {
        label: "Do not publish",
        state: "Safe hold",
        tone: "private",
        detail: "Leave the glossary private until the owner approves the boundary.",
        next: "No public route, recommendation, order, or execution path is created."
      }
    ] satisfies readonly KnowledgeReviewPosture[]
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
