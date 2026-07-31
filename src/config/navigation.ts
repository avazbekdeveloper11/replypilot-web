import type { ComponentType, SVGProps } from "react";
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  BookOpenIcon,
  ChartBarIcon,
  UsersIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

export type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export interface NavItem {
  title: string;
  href: string;
  icon: IconType;
  /** Matches this route and every nested route (e.g. /conversations/[id]). */
  matchPrefix?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/**
 * The single source of truth for sidebar navigation — Sidebar renders
 * this, nothing hardcodes a route list elsewhere. Adding a page means
 * adding it here once; config/permissions.ts (later) will gate entries by
 * role the same way, reading from this same registry.
 */
export const navigation: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: HomeIcon },
      {
        title: "Conversations",
        href: "/conversations",
        icon: ChatBubbleLeftRightIcon,
        matchPrefix: true,
      },
      { title: "AI Inbox", href: "/ai-inbox", icon: SparklesIcon },
      {
        title: "Knowledge Base",
        href: "/knowledge-base",
        icon: BookOpenIcon,
        matchPrefix: true,
      },
      { title: "Analytics", href: "/analytics", icon: ChartBarIcon },
    ],
  },
  {
    label: "Organization",
    items: [
      {
        title: "Instagram",
        href: "/instagram",
        icon: LinkIcon,
        matchPrefix: true,
      },
      { title: "Team", href: "/team", icon: UsersIcon },
      {
        title: "Billing",
        href: "/billing",
        icon: CreditCardIcon,
        matchPrefix: true,
      },
      { title: "Settings", href: "/settings", icon: Cog6ToothIcon },
    ],
  },
];

/**
 * Platform-admin-only group, appended by getNavigation() when the
 * current user's `is_platform_admin` flag is set (see
 * features/profile/hooks/use-me.ts) — never shown otherwise. This is a
 * UX convenience, not the security boundary: the backend's
 * RequirePlatformAdmin middleware is what actually enforces access, this
 * just avoids showing a link that would 403.
 */
const adminNavGroup: NavGroup = {
  label: "Platform",
  items: [{ title: "Admin", href: "/admin", icon: ShieldCheckIcon }],
};

export function getNavigation(isPlatformAdmin: boolean): NavGroup[] {
  return isPlatformAdmin ? [...navigation, adminNavGroup] : navigation;
}
