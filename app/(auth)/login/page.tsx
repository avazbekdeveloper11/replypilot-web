import { Suspense } from "react";
import type { Metadata } from "next";

import { LoginForm } from "@/features/auth/components/login-form";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Log in" };

// LoginForm reads the `next` query param (set by middleware.ts's redirect)
// via useSearchParams(), which the App Router requires to be wrapped in
// Suspense — same reason as (auth)/reset-password/page.tsx.
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 pt-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}
