"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { getNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useMe } from "@/features/profile/hooks/use-me";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Pure nav-list rendering, shared by the desktop rail (Sidebar) and the
 * mobile Sheet (MobileSidebar) — one implementation, two shells, per the
 * "no duplicated code" rule in the brief. Reads config/navigation.ts, the
 * single route registry; adding a page never touches this file.
 *
 * Calls useMe() itself (same cached query Topbar uses) to decide whether
 * to append the platform-admin nav group — see getNavigation's doc
 * comment.
 */
export function SidebarNav({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { data: me } = useMe();
  const navGroups = getNavigation(me?.is_platform_admin ?? false);
  const t = useTranslations("nav");

  return (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
      {navGroups.map((group) => (
        <div key={group.labelKey} className="flex flex-col gap-1">
          {!collapsed && (
            <p className="px-2 pb-1 text-xs font-medium text-sidebar-foreground/50">
              {t(group.labelKey)}
            </p>
          )}
          {group.items.map((item) => {
            const isActive = item.matchPrefix
              ? pathname === item.href || pathname.startsWith(`${item.href}/`)
              : pathname === item.href;

            const link = (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                  "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive &&
                    "bg-sidebar-accent text-sidebar-accent-foreground",
                  collapsed && "justify-center px-0",
                )}
              >
                <item.icon
                  className={cn(
                    "size-5 shrink-0",
                    isActive
                      ? "text-sidebar-primary"
                      : "text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground",
                  )}
                  aria-hidden="true"
                />
                {!collapsed && (
                  <span className="truncate">{t(item.titleKey)}</span>
                )}
              </Link>
            );

            if (!collapsed) return link;

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">
                  {t(item.titleKey)}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
