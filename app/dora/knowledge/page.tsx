import type { Metadata } from "next";
import { DoraOfficeShell } from "@/components/DoraOfficeShell";
import { KnowledgeVaultPanel } from "@/app/dora/knowledge/KnowledgeVaultPanel";
import { publicKnowledgeBoundaries, publicKnowledgeFlow, publicKnowledgeOutputs, publicKnowledgeStats } from "@/lib/knowledge-vault";

export const metadata: Metadata = {
  title: "Doraemon Knowledge",
  description: "Public Knowledge Vault explanation with curated outputs and no raw private source material."
};

export default function DoraKnowledgePage() {
  return (
    <DoraOfficeShell
      active="/dora/knowledge"
      title="Knowledge"
      summary="A public explanation of the Knowledge Vault: private source material becomes curated public outputs only after synthesis and owner review."
      showBoundaryStrip={false}
    >
      <KnowledgeVaultPanel
        outputs={publicKnowledgeOutputs}
        flow={publicKnowledgeFlow}
        boundaries={publicKnowledgeBoundaries}
        stats={publicKnowledgeStats}
      />
    </DoraOfficeShell>
  );
}
