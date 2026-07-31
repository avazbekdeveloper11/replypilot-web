import type { Metadata } from "next";

import { KnowledgeBaseView } from "@/features/knowledge-base/components/knowledge-base-view";

export const metadata: Metadata = { title: "Knowledge Base" };

export default function KnowledgeBasePage() {
  return <KnowledgeBaseView />;
}
