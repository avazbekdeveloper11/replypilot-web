import type { Metadata } from "next";

import { ConversationDetailView } from "@/features/conversations/components/conversation-detail-view";

export const metadata: Metadata = { title: "Conversation" };

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ConversationDetailView conversationId={id} />;
}
