import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Genuine client-only UI state ONLY (decision #1 in
 * docs/FRONTEND_ARCHITECTURE.md) — never server-owned data, never
 * anything TanStack Query already caches. If a value can be refetched
 * from the API, it does not belong here.
 */
interface UIState {
  /** Desktop sidebar collapsed to icon-only rail. Persisted — a user's
   *  layout preference should survive a reload. */
  sidebarCollapsed: boolean;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  /** Mobile sidebar sheet open/closed. Deliberately NOT persisted — it
   *  should always start closed on a fresh page load. */
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;

  /** Right-hand contextual drawer (e.g. conversation details, lead info).
   *  `null` means closed. */
  rightDrawerContent: string | null;
  openRightDrawer: (content: string) => void;
  closeRightDrawer: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebarCollapsed: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      mobileSidebarOpen: false,
      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

      rightDrawerContent: null,
      openRightDrawer: (content) => set({ rightDrawerContent: content }),
      closeRightDrawer: () => set({ rightDrawerContent: null }),
    }),
    {
      name: "replypilot-ui",
      // Only the durable preference is persisted — transient state
      // (mobile sheet, drawer) is excluded so it can't leak stale "open"
      // across a reload/back-forward-cache restore.
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed }),
    },
  ),
);
