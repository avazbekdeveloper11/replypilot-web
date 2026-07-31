"use client";

import { PageHeader } from "@/components/layout/page-header";

import { AIInboxList } from "./ai-inbox-list";

export function AIInboxView() {
  return (
    <>
      <PageHeader
        title="AI Inbox"
        description="Conversations the AI wasn't confident enough to answer on its own — take one over to reply yourself."
      />
      <AIInboxList />
    </>
  );
}
