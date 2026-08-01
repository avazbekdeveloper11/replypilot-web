import type * as React from "react";

import { Logo } from "@/components/layout/logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

/**
 * Unauthenticated shell — centered, minimal chrome, no sidebar/topbar.
 * Every route under this group (login, register, forgot-password) shares
 * this and nothing else; auth pages should never accidentally inherit
 * dashboard nav. LanguageSwitcher lives here (not just in the
 * authenticated Topbar) so a visitor can pick their language before ever
 * logging in — same cookie, same effect either side of auth.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center gap-8 bg-background px-4 py-12">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Logo className="text-lg" />
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
