"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/feedback/error-state";

/**
 * Route-group error boundary — a failure inside any dashboard page (a bad
 * fetch, a render error) degrades to this instead of a blank screen or,
 * worse, taking down the whole app (FRONTEND_ARCHITECTURE.md §5). The
 * sidebar/topbar (in the layout above this boundary) stay intact.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: send to error reporting once observability is wired.
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title="This page couldn't load"
      description={error.message || "An unexpected error occurred."}
      onRetry={reset}
    />
  );
}
