import type { Metadata } from "next";

import { SubscriptionView } from "@/features/billing/components/subscription-view";

export const metadata: Metadata = { title: "Subscription" };

export default function SubscriptionPage() {
  return <SubscriptionView />;
}
