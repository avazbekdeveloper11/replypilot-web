"use client";

import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/feedback/error-state";
import { AmoCRMIntegrationCard } from "@/features/amocrm/components/amocrm-integration-card";
import { ClickIntegrationCard } from "@/features/click/components/click-integration-card";
import { CommentAutomationCard } from "@/features/comment-automation/components/comment-automation-card";
import { TelegramIntegrationCard } from "@/features/telegram/components/telegram-integration-card";

import { useOrganization } from "../hooks/use-organization";
import { BusinessHoursCard } from "./business-hours-card";
import { OrganizationForm } from "./organization-form";

/**
 * Scope: organization name + timezone, plus the Click payment integration
 * card and the Telegram bot connection card. Instagram account connections
 * have their own dedicated page — see src/features/instagram and the
 * "Instagram" sidebar item (src/config/navigation.ts), not this
 * Organization settings card. Click and Telegram are both light enough
 * (a couple of fields, one row of state) to live here instead of getting
 * their own nav entry — see ClickIntegrationCard's / TelegramIntegrationCard's
 * doc comments. AI
 * behavior tuning (tone, confidence threshold, etc.) has no backend
 * support yet — see usecase/ai's confidenceThreshold constant, which is
 * currently hardcoded, not a per-org setting. That one's a natural
 * follow-up, not a silent gap.
 */
export function SettingsView() {
  const { data: organization, isPending, isError, error, refetch } = useOrganization();
  const t = useTranslations("settings");

  if (isPending) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          {t("loadingSettings")}
        </CardContent>
      </Card>
    );
  }

  if (isError || !organization) {
    return (
      <Card>
        <CardContent className="p-0">
          <ErrorState
            className="py-16"
            title={t("couldntLoadSettings")}
            description={error instanceof Error ? error.message : undefined}
            onRetry={() => refetch()}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("organization")}</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationForm organization={organization} />
        </CardContent>
      </Card>

      <BusinessHoursCard organization={organization} />
      <ClickIntegrationCard />
      <TelegramIntegrationCard />
      <CommentAutomationCard />
      <AmoCRMIntegrationCard />
    </div>
  );
}
