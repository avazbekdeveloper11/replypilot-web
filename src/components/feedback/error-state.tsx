"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Scoped error UI — dropped into a route's error.tsx or inline wherever a
 * single panel (a chart, a widget) fails without blanking the rest of the
 * page (FRONTEND_ARCHITECTURE.md §5). Distinct from EmptyState: this
 * means "something broke", not "there's nothing here yet".
 */
export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
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
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        {description && (
          <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
