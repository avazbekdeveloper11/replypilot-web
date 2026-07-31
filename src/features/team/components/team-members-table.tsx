"use client";

import { UsersIcon } from "@heroicons/react/24/outline";

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

  if (isPending) return <TableSkeleton columns={4} rows={5} />;

  if (isError) {
    return (
      <ErrorState
        title="Couldn't load team members"
        description={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={UsersIcon}
        title="No team members yet"
        description="Invite someone to start collaborating on this workspace."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
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
            <TableCell className="text-sm">{member.role.name}</TableCell>
            <TableCell>
              <Badge variant={STATUS_VARIANT[member.status] ?? "secondary"}>
                {member.status}
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
