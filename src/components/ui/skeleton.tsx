import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Skeleton loaders must mirror the real component's dimensions so there's
 * no layout shift when data arrives (see FRONTEND_ARCHITECTURE.md §5). Use
 * this as the base primitive; feature-specific skeletons (e.g.
 * ConversationListSkeleton) compose several of these into the real
 * layout, not a generic gray box.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-accent", className)}
      {...props}
    />
  );
}

export { Skeleton };
