"use client";

import * as React from "react";

import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

/**
 * Every app-wide client provider, composed once. app/layout.tsx mounts
 * this single component instead of nesting providers itself — keeps the
 * root layout (a Server Component) readable and means adding a new
 * global provider never touches app/.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
