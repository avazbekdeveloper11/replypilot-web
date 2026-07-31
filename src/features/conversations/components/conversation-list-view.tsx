"use client";

import { PageHeader } from "@/components/layout/page-header";

import { ConversationList } from "./conversation-list";

export function ConversationListView() {
  return (
    <>
      <PageHeader title="Conversations" description="Every DM thread across your connected accounts." />
      <ConversationList />
    </>
  );
}
