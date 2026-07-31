import type { Metadata } from "next";

import { ConversationListView } from "@/features/conversations/components/conversation-list-view";

export const metadata: Metadata = { title: "Conversations" };

export default function ConversationsPage() {
  return <ConversationListView />;
}
