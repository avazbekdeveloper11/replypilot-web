"use client";

import { useTranslations } from "next-intl";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Cursor pagination, not page-number pagination — deliberately. The Go
 * API returns cursor-based pages (see FRONTEND_ARCHITECTURE.md §4), so
 * "jump to page 7" isn't a thing the backend supports and faking it with
 * numbered buttons would be UI that lies about what's possible. Wire
 * `hasNext`/`hasPrev` and the two callbacks to a `useInfiniteQuery` /
 * manual cursor state in the feature that uses this.
 */
export function Pagination({
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  label,
  className,
}: {
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  /** e.g. "1–20 of 134" — optional, only shown if the total is known. */
  label?: string;
  className?: string;
}) {
  const t = useTranslations("common");

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 border-t border-border pt-3",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPrev}
          onClick={onPrev}
        >
          <ChevronLeftIcon className="size-4" />
          {t("previous")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNext}
          onClick={onNext}
        >
          {t("next")}
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
