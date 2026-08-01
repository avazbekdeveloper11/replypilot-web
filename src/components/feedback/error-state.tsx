"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Scoped error UI — dropped into a route's error.tsx or inline wherever a
 * single panel (a chart, a widget) fails without blanking the rest of the
 * page (FRONTEND_ARCHITECTURE.md §5). Distinct from EmptyState: this
 * means "something broke", not "there's nothing here yet". title/
 * description default to the "common" namespace when a caller doesn't
 * pass its own — every call site that DOES pass one is responsible for
 * translating it itself (this component has no way to know their copy).
 */
export function ErrorState({
  title,
  description,
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  const t = useTranslations("common");

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-6 py-16 text-center",
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <ExclamationTriangleIcon
          className="size-6 text-destructive"
          aria-hidden="true"
        />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium text-foreground">
          {title ?? t("somethingWentWrong")}
        </h3>
        {description && (
          <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {t("tryAgain")}
        </Button>
      )}
    </div>
  );
}
