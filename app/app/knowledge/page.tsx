import type { Metadata } from "next";
import { KnowledgeVaultCockpit } from "@/app/app/knowledge/KnowledgeVaultCockpit";

export const metadata: Metadata = {
  title: "Private Knowledge",
  description: "Owner-only Knowledge Vault overview for private synthesis, review, and public publishing boundaries."
};

export default function KnowledgePage() {
  return <KnowledgeVaultCockpit />;
}
