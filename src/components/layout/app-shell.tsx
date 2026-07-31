import type * as React from "react";

import { Sidebar } from "./sidebar";
import { MobileSidebar } from "./mobile-sidebar";
import { Topbar } from "./topbar";

/**
 * The authenticated app shell: sidebar + mobile sidebar + topbar + main
 * content region. Mounted once by app/(dashboard)/layout.tsx — every
 * dashboard page is just `children` here, per "app/ holds routing and
 * composition only" (FRONTEND_ARCHITECTURE.md §2).
 *
 * Topbar fetches the current user itself (useMe(), a TanStack Query hook)
 * rather than being handed one — see topbar.tsx's doc comment.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full bg-background">
      <Sidebar />
      <MobileSidebar />
      <div className="flex min-h-dvh flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
