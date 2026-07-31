import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { InstagramAccountsView } from "@/features/instagram/components/instagram-accounts-view";

export const metadata: Metadata = { title: "Instagram" };

export default function InstagramPage() {
  return (
    <>
      <PageHeader
        title="Instagram"
        description="Connect your Instagram Business account so ReplyPilot can read and reply to DMs on your behalf."
      />
      <InstagramAccountsView />
    </>
  );
}
