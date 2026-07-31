"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/feedback/error-state";

import { useOrganization } from "../hooks/use-organization";
import { OrganizationForm } from "./organization-form";

/**
 * Scope: organization name + timezone only, matching what
 * organization.UseCase.UpdateSettings actually supports server-side.
 * Instagram account connections have their own dedicated page — see
 * src/features/instagram and the "Instagram" sidebar item
 * (src/config/navigation.ts), not this Organization settings card. AI
 * behavior tuning (tone, confidence threshold, etc.) has no backend
 * support yet — see usecase/ai's confidenceThreshold constant, which is
 * currently hardcoded, not a per-org setting. That one's a natural
 * follow-up, not a silent gap.
 */
export function SettingsView() {
  const { data: organization, isPending, isError, error, refetch } = useOrganization();

  if (isPending) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Loading organization settings…
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
            title="Couldn't load organization settings"
            description={error instanceof Error ? error.message : undefined}
            onRetry={() => refetch()}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization</CardTitle>
      </CardHeader>
      <CardContent>
        <OrganizationForm organization={organization} />
      </CardContent>
    </Card>
  );
}
