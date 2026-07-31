import type * as React from "react";
import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { AppProviders } from "@/lib/providers";
// Self-hosted via @fontsource-variable/inter rather than next/font/google:
// same outcome (no third-party runtime request, no layout shift — see
// FRONTEND_ARCHITECTURE.md §6) but the font files ship in node_modules
// instead of being fetched from Google Fonts at build time, so the build
// has zero external dependencies. --font-inter is set on <html> below and
// consumed by the @theme mapping in app/globals.css. Monospace contexts
// (request IDs, API keys) use the system mono stack — see --font-mono in
// globals.css — no separate font file needed for that.
import "@fontsource-variable/inter/wght.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // suppressHydrationWarning is required with next-themes: the class
      // attribute it sets before hydration legitimately differs from the
      // server-rendered markup, and that's expected, not a bug.
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="flex min-h-full flex-col font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
