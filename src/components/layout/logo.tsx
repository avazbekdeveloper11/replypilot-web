import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Logo({
  collapsed = false,
  className,
}: {
  collapsed?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/dashboard"
      className={cn(
        "flex items-center gap-2 px-1 font-semibold text-sidebar-foreground",
        className,
      )}
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
        R
      </span>
      {!collapsed && <span className="truncate text-sm">{siteConfig.name}</span>}
    </Link>
  );
}
