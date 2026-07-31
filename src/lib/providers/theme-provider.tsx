"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Dark / light mode, class-strategy (`.dark` on <html>, matching the
 * tokens in src/styles/themes.css). next-themes injects a tiny blocking
 * script into <head> before hydration so the correct class is present on
 * first paint — this is what prevents the "flash of wrong theme" called
 * out in FRONTEND_ARCHITECTURE.md §7. No manual script needed here.
 *
 * `enableSystem` defaults new visitors to their OS preference; the choice
 * is then persisted (next-themes uses localStorage by default, which is
 * fine — theme is a pure client preference, not something a Server
 * Component needs to read for correctness — the class script guarantees
 * the server-rendered HTML never mismatches on hydration).
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
