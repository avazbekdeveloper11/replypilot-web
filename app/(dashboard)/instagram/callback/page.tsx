import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/layout/page-header";
import { InstagramCallbackView } from "@/features/instagram/components/instagram-callback-view";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Connecting Instagram" };

// InstagramCallbackView reads code/state/error query params via
// useSearchParams(), which Next.js requires wrapping in Suspense — same
// reasoning as app/(auth)/reset-password/page.tsx.
export default async function InstagramCallbackPage() {
  const t = await getTranslations("instagram");
  return (
    <>
      <PageHeader title={t("connectingTitle")} />
      <Suspense fallback={<CallbackSkeleton />}>
        <InstagramCallbackView />
      </Suspense>
    </>
  );
}

function CallbackSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-16">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-48" />
      </CardContent>
    </Card>
  );
}
