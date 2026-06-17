import type { Project } from "@/lib/content";

export type ProjectBoundary = {
  label: string;
  summary: string;
  className: string;
  rules: string[];
};

const visuals = ["radar", "network", "notes", "market", "field"] as const;

export function visualForProject(slug: string) {
  const sum = Array.from(slug).reduce((total, char) => total + char.charCodeAt(0), 0);
  return visuals[sum % visuals.length];
}

export function boundaryForProject(project: Project): ProjectBoundary {
  if (project.category === "trading-research") {
    return {
      label: "Research-only",
      summary: "No execution, no broker routing, no orders.",
      className: "is-research",
      rules: [
        "No trading execution or brokerage integration.",
        "No account data, positions, PnL, or order state.",
        "Claims require evidence and source links.",
        "Owner review remains required before any next step."
      ]
    };
  }

  if (project.visibility === "private-summary") {
    return {
      label: "Private Summary",
      summary: "Public concept, private implementation details.",
      className: "is-private",
      rules: [
        "Public page explains the concept only.",
        "Private tasks, prompts, and runtime details stay out.",
        "App links require owner authentication.",
        "No raw IDs, paths, accounts, or internal state."
      ]
    };
  }

  return {
    label: "Public",
    summary: "Safe to share. Explains the what and why.",
    className: "is-public",
    rules: [
      "Curated public story and project context.",
      "No private memory or source notes.",
      "Links route only to public-safe destinations unless gated.",
      "Public/private boundary remains explicit."
    ]
  };
}
