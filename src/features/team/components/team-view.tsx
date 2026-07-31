"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

import { InviteMemberDialog } from "./invite-member-dialog";
import { TeamMembersTable } from "./team-members-table";

export function TeamView() {
  return (
    <>
      <PageHeader
        title="Team"
        description="Who has access to this workspace."
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
