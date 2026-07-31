import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { ProfileView } from "@/features/profile/components/profile-view";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="Profile" description="Your personal account details and password." />
      <ProfileView />
    </>
  );
}
