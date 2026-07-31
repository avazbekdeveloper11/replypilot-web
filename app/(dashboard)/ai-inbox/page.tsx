import type { Metadata } from "next";

import { AIInboxView } from "@/features/ai-inbox/components/ai-inbox-view";

export const metadata: Metadata = { title: "AI Inbox" };

export default function AIInboxPage() {
  return <AIInboxView />;
}
