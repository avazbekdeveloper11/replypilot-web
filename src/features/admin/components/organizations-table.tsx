"use client";

import { useTranslations } from "next-intl";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";

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

import { useAdminOrganizations } from "../hooks/use-organizations";
import { OrganizationRowActions } from "./organization-row-actions";

const ORG_STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  trial: "secondary",
  active: "success",
  suspended: "destructive",
  cancelled: "warning",
};

const SUB_STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  trialing: "success",
  active: "success",
  past_due: "warning",
  paused: "warning",
};

export function OrganizationsTable() {
  const { data, isPending, isError, error, refetch } = useAdminOrganizations();
  const t = useTranslations("admin");
  const tOrgStatus = useTranslations("orgStatus");

  if (isPending) return <TableSkeleton columns={5} rows={6} />;

  if (isError) {
    return (
      <ErrorState
        title={t("couldntLoadOrganizations")}
        description={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={BuildingOfficeIcon}
        title={t("noOrganizationsYet")}
        description={t("noOrganizationsDescription")}
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("organizationColumn")}</TableHead>
          <TableHead>{t("statusColumn")}</TableHead>
          <TableHead>{t("membersColumn")}</TableHead>
          <TableHead>{t("planColumn")}</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.organization.id}>
            <TableCell>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{row.organization.name}</span>
                <span className="text-xs text-muted-foreground">{row.organization.slug}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={ORG_STATUS_VARIANT[row.organization.status] ?? "secondary"}>
                {tOrgStatus.has(row.organization.status)
                  ? tOrgStatus(row.organization.status)
                  : row.organization.status}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">{row.member_count}</TableCell>
            <TableCell>
              {row.plan_code ? (
                <Badge variant={SUB_STATUS_VARIANT[row.subscription_status ?? ""] ?? "secondary"}>
                  {row.plan_code}
                </Badge>
              ) : (
                <span className="text-sm text-muted-foreground">{t("noPlan")}</span>
              )}
            </TableCell>
            <TableCell>
              <OrganizationRowActions org={row} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
