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
  /** Key into the "nav" message namespace — SidebarNav resolves it via t(). */
  titleKey: string;
  href: string;
  icon: IconType;
  /** Matches this route and every nested route (e.g. /conversations/[id]). */
  matchPrefix?: boolean;
}

export interface NavGroup {
  /** Key into the "nav" message namespace. */
  labelKey: string;
  items: NavItem[];
}

/**
 * The single source of truth for sidebar navigation — Sidebar renders
 * this, nothing hardcodes a route list elsewhere. Adding a page means
 * adding it here once; config/permissions.ts (later) will gate entries by
 * role the same way, reading from this same registry.
 *
 * Labels are translation keys, not literal strings — this file has no
 * React context to call useTranslations() from (it's imported by both
 * client and server code), so SidebarNav resolves titleKey/labelKey via
 * its own t() call. Keep these in sync with messages/*.json's "nav"
 * namespace.
 */
export const navigation: NavGroup[] = [
  {
    labelKey: "groupWorkspace",
    items: [
      { titleKey: "dashboard", href: "/dashboard", icon: HomeIcon },
      {
        titleKey: "conversations",
        href: "/conversations",
        icon: ChatBubbleLeftRightIcon,
        matchPrefix: true,
      },
      { titleKey: "aiInbox", href: "/ai-inbox", icon: SparklesIcon },
      {
        titleKey: "knowledgeBase",
        href: "/knowledge-base",
        icon: BookOpenIcon,
        matchPrefix: true,
      },
      { titleKey: "analytics", href: "/analytics", icon: ChartBarIcon },
    ],
  },
  {
    labelKey: "groupOrganization",
    items: [
      {
        titleKey: "instagram",
        href: "/instagram",
        icon: LinkIcon,
        matchPrefix: true,
      },
      { titleKey: "team", href: "/team", icon: UsersIcon },
      {
        titleKey: "billing",
        href: "/billing",
        icon: CreditCardIcon,
        matchPrefix: true,
      },
      { titleKey: "settings", href: "/settings", icon: Cog6ToothIcon },
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
  labelKey: "groupPlatform",
  items: [{ titleKey: "admin", href: "/admin", icon: ShieldCheckIcon }],
};

export function getNavigation(isPlatformAdmin: boolean): NavGroup[] {
  return isPlatformAdmin ? [...navigation, adminNavGroup] : navigation;
}
