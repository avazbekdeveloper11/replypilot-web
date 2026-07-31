import type * as React from "react";
import { ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

import { cn } from "@/lib/utils";

/**
 * Inline, form-level feedback — a failed submit, a success confirmation.
 * Deliberately not a toast: form errors need to persist next to the
 * field the user is looking at, not disappear after a few seconds.
 */
export function FormAlert({
  variant = "error",
  children,
  className,
}: {
  variant?: "error" | "success";
  children: React.ReactNode;
  className?: string;
}) {
  const Icon = variant === "error" ? ExclamationTriangleIcon : CheckCircleIcon;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2 rounded-md border px-3 py-2 text-sm",
        variant === "error" &&
          "border-destructive/20 bg-destructive/5 text-destructive",
        variant === "success" && "border-success/20 bg-success/5 text-success",
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
