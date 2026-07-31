import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { SettingsView } from "@/features/settings/components/settings-view";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Organization name and timezone. Instagram connections live under Team; AI behavior tuning isn't configurable yet."
      />
      <SettingsView />
    </>
  );
}
