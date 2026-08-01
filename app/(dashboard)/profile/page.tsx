import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/layout/page-header";
import { ProfileView } from "@/features/profile/components/profile-view";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const t = await getTranslations("profile");
  return (
    <>
      <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
      <ProfileView />
    </>
  );
}
