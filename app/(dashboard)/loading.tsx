import { Skeleton } from "@/components/ui/skeleton";

/** Route-group-level fallback for the rare page with no more specific
 *  loading.tsx of its own — the shell (sidebar/topbar) renders instantly
 *  regardless since this only replaces `children`. */
export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
