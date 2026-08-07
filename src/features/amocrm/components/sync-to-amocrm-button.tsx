"use client";

import { useTranslations } from "next-intl";
import { ArrowUpTrayIcon, CheckIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";

import { useAmoCRMStatus } from "../hooks/use-amocrm-status";
import { useSyncAmoCRM } from "../hooks/use-sync-amocrm";

/**
 * "Push this customer to amoCRM" — renders nothing at all when the org
 * hasn't connected amoCRM (rather than a disabled button explaining
 * why), since the customer drill-down sheet is not the place to sell
 * the integration — that's the Settings page's AmoCRMIntegrationCard.
 * See backend amocrm.SyncUseCase.SyncCustomer's doc comment for what
 * this actually does (create-or-update one amoCRM contact + a
 * purchase-history note).
 */
export function SyncToAmoCRMButton({ conversationId }: { conversationId: string }) {
  const { data: integration } = useAmoCRMStatus();
  const mutation = useSyncAmoCRM();
  const t = useTranslations("amocrm");

  if (!integration || integration.status !== "connected") {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        variant="outline"
        size="sm"
        disabled={mutation.isPending}
        onClick={() => {
          mutation.reset();
          mutation.mutate(conversationId);
        }}
      >
        {mutation.isSuccess ? (
          <CheckIcon className="size-4" />
        ) : (
          <ArrowUpTrayIcon className="size-4" />
        )}
        {mutation.isPending
          ? t("syncing")
          : mutation.isSuccess
            ? t("synced")
            : t("syncToAmoCRM")}
      </Button>
      {mutation.isError && (
        <p className="text-xs text-destructive">
          {mutation.error instanceof ApiError ? mutation.error.message : t("genericError")}
        </p>
      )}
    </div>
  );
}
