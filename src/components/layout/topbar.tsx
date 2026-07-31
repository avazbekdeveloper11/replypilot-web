"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";

import { useUIStore } from "@/stores/ui-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMe } from "@/features/profile/hooks/use-me";
import { useLogout } from "@/features/profile/hooks/use-logout";
import { ThemeToggle } from "./theme-toggle";

function initialsFor(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Top navigation: mobile sidebar trigger, global search, theme toggle,
 * notifications, user menu. Sticky so it stays reachable while a long
 * page (conversation thread, analytics) scrolls underneath it.
 *
 * Fetches the current user itself via useMe() rather than taking it as a
 * prop — AppShell (a Server Component) would otherwise need to become a
 * client-data-fetching boundary just to pass this down, and every other
 * page in this app already fetches its own data client-side the same way.
 */
export function Topbar() {
  const setMobileSidebarOpen = useUIStore((s) => s.setMobileSidebarOpen);
  const { data: user } = useMe();
  const logoutMutation = useLogout();
  const router = useRouter();

  const name = user?.full_name ?? "";
  const initials = name ? initialsFor(name) : "";

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        // Always land back at /login, even if the revoke call itself
        // failed (e.g. token already expired) — the cookies are cleared
        // server-side either way, see app/api/auth/logout/route.ts.
        router.push("/login");
      },
    });
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open sidebar"
        onClick={() => setMobileSidebarOpen(true)}
      >
        <Bars3Icon className="size-5" />
      </Button>

      <div className="relative hidden max-w-sm flex-1 sm:block">
        <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search conversations, leads, docs…"
          className="pl-8"
          aria-label="Search"
        />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <BellIcon className="size-4.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="ml-1 h-9 gap-2 px-1.5"
              aria-label="Open user menu"
            >
              <Avatar className="size-7">
                <AvatarImage src={user?.avatar_url ?? undefined} alt={name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  {name || "…"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.email ?? ""}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserCircleIcon />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Cog6ToothIcon />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/billing">
                <CreditCardIcon />
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              disabled={logoutMutation.isPending}
              onSelect={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              <ArrowRightStartOnRectangleIcon />
              {logoutMutation.isPending ? "Logging out…" : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
