import type * as React from "react";

import { Logo } from "@/components/layout/logo";

/**
 * Unauthenticated shell — centered, minimal chrome, no sidebar/topbar.
 * Every route under this group (login, register, forgot-password) shares
 * this and nothing else; auth pages should never accidentally inherit
 * dashboard nav.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-background px-4 py-12">
      <Logo className="text-lg" />
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
