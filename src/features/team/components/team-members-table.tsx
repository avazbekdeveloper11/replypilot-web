"use client";

import { UsersIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/data/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { TableSkeleton } from "@/components/feedback/table-skeleton";

import { useTeamMembers } from "../hooks/use-team-members";
import { MemberRowActions } from "./member-row-actions";

const STATUS_VARIANT: Record<string, "success" | "warning" | "secondary"> = {
  active: "success",
  invited: "warning",
  suspended: "secondary",
  removed: "secondary",
};

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function TeamMembersTable() {
  const { data, isPending, isError, error, refetch } = useTeamMembers();
  const t = useTranslations("team");
  const ts = useTranslations("memberStatus");

  if (isPending) return <TableSkeleton columns={4} rows={5} />;

  if (isError) {
    return (
      <ErrorState
        title={t("couldntLoadMembers")}
        description={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={UsersIcon}
        title={t("noMembersYet")}
        description={t("noMembersDescription")}
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("member")}</TableHead>
          <TableHead>{t("role")}</TableHead>
          <TableHead>{t("status")}</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((member) => (
          <TableRow key={member.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarFallback>{initials(member.user.full_name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {member.user.full_name}
                  </span>
                  <span className="text-xs text-muted-foreground">{member.user.email}</span>
                </div>
              </div>
            </TableCell>
            {/* member.role.name is backend/tenant-defined data (an
               organization can rename or add roles), not app copy — never
               translated, same as organization names elsewhere. */}
            <TableCell className="text-sm">{member.role.name}</TableCell>
            <TableCell>
              <Badge variant={STATUS_VARIANT[member.status] ?? "secondary"}>
                {ts.has(member.status) ? ts(member.status) : member.status}
              </Badge>
            </TableCell>
            <TableCell>
              <MemberRowActions member={member} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
