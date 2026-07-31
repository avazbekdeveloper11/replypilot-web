import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { AdminView } from "@/features/admin/components/admin-view";

export const metadata: Metadata = { title: "Admin" };

export default function AdminPage() {
  return (
    <>
      <PageHeader
        title="Admin"
        description="Platform-wide view across every organization. Visible to ReplyPilot staff only."
      />
      <AdminView />
    </>
  );
}
