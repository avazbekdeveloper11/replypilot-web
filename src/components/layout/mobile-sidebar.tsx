"use client";

import { useUIStore } from "@/stores/ui-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Logo } from "./logo";
import { SidebarNav } from "./sidebar-nav";

/**
 * Sidebar-as-Sheet for < lg viewports, opened from Topbar's hamburger
 * button. Same SidebarNav as the desktop rail — see that file's comment
 * on why the nav list itself is shared.
 */
export function MobileSidebar() {
  const open = useUIStore((s) => s.mobileSidebarOpen);
  const setOpen = useUIStore((s) => s.setMobileSidebarOpen);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-72 gap-0 p-0">
        <SheetHeader className="h-14 flex-row items-center border-b border-sidebar-border bg-sidebar px-3 py-0">
          <SheetTitle asChild>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col bg-sidebar">
          <SidebarNav onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
