"use client";

import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

import { InviteMemberDialog } from "./invite-member-dialog";
import { TeamMembersTable } from "./team-members-table";

export function TeamView() {
  const t = useTranslations("team");

  return (
    <>
      <PageHeader
        title={t("pageTitle")}
        description={t("pageDescription")}
        actions={<InviteMemberDialog />}
      />
      <Card>
        <CardContent>
          <TeamMembersTable />
        </CardContent>
      </Card>
    </>
  );
}
