"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormAlert } from "@/components/feedback/form-alert";
import { ApiError } from "@/lib/api/errors";
import type { Organization } from "@/features/auth/types";

import {
  buildOrganizationSettingsSchema,
  type OrganizationSettingsValues,
} from "../schemas/organization.schema";
import { useUpdateOrganization } from "../hooks/use-update-organization";
import { listTimezones } from "../lib/timezones";

const TIMEZONES = listTimezones();

export function OrganizationForm({ organization }: { organization: Organization }) {
  const mutation = useUpdateOrganization();
  const [justSaved, setJustSaved] = React.useState(false);
  const t = useTranslations("settings");
  const tv = useTranslations("validation");

  const organizationSettingsSchema = React.useMemo(
    () => buildOrganizationSettingsSchema(tv),
    [tv],
  );

  const form = useForm<OrganizationSettingsValues>({
    resolver: zodResolver(organizationSettingsSchema),
    defaultValues: {
      name: organization.name,
      // Primary market is Uzbekistan — default here matches the backend's
      // Register-time default (usecase/auth.UseCase.Register), not UTC.
      timezone: organization.timezone || "Asia/Tashkent",
    },
  });

  function onSubmit(values: OrganizationSettingsValues) {
    setJustSaved(false);
    mutation.mutate(values, { onSuccess: () => setJustSaved(true) });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="org-name">{t("organizationNameLabel")}</Label>
        <Input
          id="org-name"
          aria-invalid={!!form.formState.errors.name}
          {...form.register("name")}
        />
        {form.formState.errors.name && (
          <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="org-slug">{t("workspaceUrlSlugLabel")}</Label>
        <Input id="org-slug" value={organization.slug} disabled />
        <p className="text-xs text-muted-foreground">{t("slugHint")}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="org-timezone">{t("timezoneLabel")}</Label>
        <Select
          value={form.watch("timezone")}
          onValueChange={(value) => form.setValue("timezone", value, { shouldValidate: true })}
        >
          <SelectTrigger id="org-timezone" className="w-full">
            <SelectValue placeholder={t("selectTimezonePlaceholder")} />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {TIMEZONES.map((tz) => (
              <SelectItem key={tz} value={tz}>
                {tz}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.timezone && (
          <p className="text-xs text-destructive">{form.formState.errors.timezone.message}</p>
        )}
      </div>

      {mutation.isError && (
        <FormAlert variant="error">
          {mutation.error instanceof ApiError
            ? mutation.error.message
            : t("genericError")}
        </FormAlert>
      )}

      {justSaved && !mutation.isError && (
        <FormAlert variant="success">{t("settingsUpdated")}</FormAlert>
      )}

      <div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? t("saving") : t("saveChanges")}
        </Button>
      </div>
    </form>
  );
}
