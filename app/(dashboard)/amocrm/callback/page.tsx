import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/layout/page-header";
import { AmoCRMCallbackView } from "@/features/amocrm/components/amocrm-callback-view";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Connecting amoCRM" };

// AmoCRMCallbackView reads code/state/referer/error query params via
// useSearchParams(), which Next.js requires wrapping in Suspense — same
// reasoning as app/(dashboard)/instagram/callback/page.tsx.
export default async function AmoCRMCallbackPage() {
  const t = await getTranslations("amocrm");
  return (
    <>
      <PageHeader title={t("connectingTitle")} />
      <Suspense fallback={<CallbackSkeleton />}>
        <AmoCRMCallbackView />
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
