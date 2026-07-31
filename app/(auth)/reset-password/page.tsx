import { Suspense } from "react";
import type { Metadata } from "next";

import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Set a new password" };

// ResetPasswordForm reads the `token` query param via useSearchParams(),
// which Next.js requires to be wrapped in Suspense — without it the
// whole route would be forced into fully client-side rendering (App
// Router build-time requirement, not a stylistic choice).
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordSkeleton />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 pt-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}
