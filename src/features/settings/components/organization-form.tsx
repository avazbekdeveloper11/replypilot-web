"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  organizationSettingsSchema,
  type OrganizationSettingsValues,
} from "../schemas/organization.schema";
import { useUpdateOrganization } from "../hooks/use-update-organization";
import { listTimezones } from "../lib/timezones";

const TIMEZONES = listTimezones();

export function OrganizationForm({ organization }: { organization: Organization }) {
  const mutation = useUpdateOrganization();
  const [justSaved, setJustSaved] = React.useState(false);

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
        <Label htmlFor="org-name">Organization name</Label>
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
        <Label htmlFor="org-slug">Workspace URL slug</Label>
        <Input id="org-slug" value={organization.slug} disabled />
        <p className="text-xs text-muted-foreground">
          The slug isn&apos;t editable here — it&apos;s embedded in the Instagram connection
          flow and any links already shared.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="org-timezone">Timezone</Label>
        <Select
          value={form.watch("timezone")}
          onValueChange={(value) => form.setValue("timezone", value, { shouldValidate: true })}
        >
          <SelectTrigger id="org-timezone" className="w-full">
            <SelectValue placeholder="Select a timezone" />
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
            : "Something went wrong. Please try again."}
        </FormAlert>
      )}

      {justSaved && !mutation.isError && (
        <FormAlert variant="success">Organization settings updated.</FormAlert>
      )}

      <div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
