"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { PhoneIcon } from "@heroicons/react/24/outline";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/data/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { TableSkeleton } from "@/components/feedback/table-skeleton";
import { InstagramProfileLink } from "@/components/data/instagram-profile-link";

import { useLeads } from "../hooks/use-leads";
import { useUpdateLeadStatus } from "../hooks/use-update-lead-status";
import type { LeadStatus } from "../types";

const STATUS_VARIANT: Record<LeadStatus, "warning" | "brand" | "success"> = {
  new: "warning",
  contacted: "brand",
  done: "success",
};

const FILTER_VALUES: (LeadStatus | "all")[] = ["new", "contacted", "done", "all"];

/**
 * Every customer who left a phone number in a DM — captured automatically
 * by the AI pipeline (see backend/internal/usecase/ai's
 * captureLeadIfPresent), independent of whatever the conversation's own
 * ai_active/human_active status is. Defaults to the "new" filter since
 * that's the actual to-do list; "contacted"/"done" are for looking back at
 * what's already been handled.
 */
export function LeadsList() {
  const [filter, setFilter] = React.useState<LeadStatus | "all">("new");
  const { data, isPending, isError, error, refetch } = useLeads(
    filter === "all" ? undefined : filter,
  );
  const updateMutation = useUpdateLeadStatus();
  const t = useTranslations("leads");
  const tStatus = useTranslations("leadStatus");

  const leads = data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={filter} onValueChange={(v) => setFilter(v as LeadStatus | "all")}>
        <TabsList>
          {FILTER_VALUES.map((value) => (
            <TabsTrigger key={value} value={value}>
              {value === "all" ? tStatus("all") : tStatus(value)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          {isPending ? (
            <div className="p-6">
              <TableSkeleton columns={1} rows={6} />
            </div>
          ) : isError ? (
            <ErrorState
              className="py-16"
              title={t("couldntLoadLeads")}
              description={error instanceof Error ? error.message : undefined}
              onRetry={() => refetch()}
            />
          ) : leads.length === 0 ? (
            <EmptyState
              className="py-16"
              icon={PhoneIcon}
              title={t("noLeadsTitle")}
              description={t("noLeadsDescription")}
            />
          ) : (
            <ul className="divide-y divide-border">
              {leads.map((lead) => (
                <li key={lead.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-sm font-semibold text-foreground hover:text-brand hover:underline"
                      >
                        {lead.phone}
                      </a>
                      <Badge variant={STATUS_VARIANT[lead.status]}>{tStatus(lead.status)}</Badge>
                      <InstagramProfileLink
                        username={lead.customer_username}
                        fallback={t("unknownCustomer")}
                        className="text-xs text-muted-foreground"
                      />
                    </div>
                    {lead.summary && (
                      <p className="mt-1 text-sm text-muted-foreground">{lead.summary}</p>
                    )}
                    <Link
                      href={`/conversations/${lead.conversation_id}`}
                      className="mt-1 inline-block text-xs text-muted-foreground hover:text-foreground hover:underline"
                    >
                      {t("viewConversation")}
                    </Link>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {lead.status === "new" && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={updateMutation.isPending}
                        onClick={() => updateMutation.mutate({ id: lead.id, status: "contacted" })}
                      >
                        {t("markContacted")}
                      </Button>
                    )}
                    {lead.status !== "done" && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={updateMutation.isPending}
                        onClick={() => updateMutation.mutate({ id: lead.id, status: "done" })}
                      >
                        {t("markDone")}
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
