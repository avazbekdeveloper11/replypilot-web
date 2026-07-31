"use client";

import * as React from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

/**
 * One QueryClient per browser tab, created lazily inside a ref so
 * concurrent-rendering (React 19 / Strict Mode double-invoke) can't
 * accidentally construct two clients that fight over the cache. This is
 * the single source of truth for all client-side server-state — see
 * decision #1 in FRONTEND_ARCHITECTURE.md. Server Components seed it via
 * `initialData`/hydration where a route needs first-paint + interactivity
 * on the same resource; this provider does not do that seeding itself.
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Per-resource staleTime is tuned at the query-key level
            // (src/lib/api/query-keys.ts, built alongside each feature) —
            // this is only the conservative fallback.
            staleTime: 30_000,
            refetchOnWindowFocus: true,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  );
}
