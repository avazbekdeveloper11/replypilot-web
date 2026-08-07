"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/feedback/form-alert";
import { ApiError } from "@/lib/api/errors";
import type { Organization } from "@/features/auth/types";

import { useUpdateBusinessHours } from "../hooks/use-update-business-hours";

/**
 * Restricts automated AI replies to a daily window, in the organization's
 * own timezone (set above in OrganizationForm) — outside that window an
 * inbound message is handed to a human instead of getting an AI reply.
 * See backend usecase/ai's withinBusinessHours for the enforcement side.
 * Off by default: an org that hasn't configured this gets AI replies
 * around the clock, same behavior as before this feature existed.
 */
export function BusinessHoursCard({ organization }: { organization: Organization }) {
  const mutation = useUpdateBusinessHours();
  const t = useTranslations("settings");

  const [start, setStart] = React.useState(organization.business_hours_start ?? "09:00");
  const [end, setEnd] = React.useState(organization.business_hours_end ?? "18:00");
  const [dirty, setDirty] = React.useState(false);

  // Seed from the server value once loaded, but never clobber what the
  // user is actively editing — same convention as CommentAutomationCard.
  React.useEffect(() => {
    if (!dirty) {
      setStart(organization.business_hours_start ?? "09:00");
      setEnd(organization.business_hours_end ?? "18:00");
    }
  }, [organization.business_hours_start, organization.business_hours_end, dirty]);

  const enabled = organization.business_hours_enabled;

  function save(nextEnabled: boolean) {
    mutation.mutate(
      { enabled: nextEnabled, start, end },
      { onSuccess: () => setDirty(false) },
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle>{t("businessHoursTitle")}</CardTitle>
        <Badge variant={enabled ? "success" : "secondary"}>
          {enabled ? t("enabled") : t("disabled")}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">{t("businessHoursDescription")}</p>

          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="business-hours-start">{t("businessHoursStartLabel")}</Label>
              <Input
                id="business-hours-start"
                type="time"
                className="w-32"
                value={start}
                onChange={(e) => {
                  setStart(e.target.value);
                  setDirty(true);
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="business-hours-end">{t("businessHoursEndLabel")}</Label>
              <Input
                id="business-hours-end"
                type="time"
                className="w-32"
                value={end}
                onChange={(e) => {
                  setEnd(e.target.value);
                  setDirty(true);
                }}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{t("businessHoursTimezoneHint", { timezone: organization.timezone })}</p>

          {mutation.isError && (
            <FormAlert variant="error">
              {mutation.error instanceof ApiError ? mutation.error.message : t("genericError")}
            </FormAlert>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant={enabled ? "outline" : "default"}
              disabled={mutation.isPending || (!enabled && (!start || !end))}
              onClick={() => save(!enabled)}
            >
              {mutation.isPending ? t("saving") : enabled ? t("disable") : t("enable")}
            </Button>
            {enabled && dirty && (
              <Button
                variant="outline"
                disabled={mutation.isPending || !start || !end}
                onClick={() => save(true)}
              >
                {t("saveChanges")}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
