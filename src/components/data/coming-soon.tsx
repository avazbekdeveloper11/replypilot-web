import type * as React from "react";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/data/empty-state";

/**
 * Scaffolding for the pages explicitly deferred this milestone (per the
 * brief: build Design System → Reusable Components only, stop before
 * pages). Each route below renders this so navigation, layout, and the
 * design system are all exercised end to end — the route itself is real,
 * the feature content isn't yet. Delete this file's usage page-by-page as
 * each feature slice lands (FRONTEND_ARCHITECTURE.md §10).
 */
export function ComingSoon({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  const t = useTranslations("common");
  return (
    <>
      <PageHeader title={title} />
      <EmptyState icon={icon} title={t("comingInNextMilestone")} description={description} />
    </>
  );
}
