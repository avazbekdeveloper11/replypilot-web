"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FormAlert } from "@/components/feedback/form-alert";
import { ApiError } from "@/lib/api/errors";
import type { User } from "@/features/auth/types";

import {
  buildUpdateProfileSchema,
  type UpdateProfileValues,
} from "../schemas/update-profile.schema";
import { useUpdateProfile } from "../hooks/use-update-profile";

function initialsFor(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ProfileForm({ user }: { user: User }) {
  const mutation = useUpdateProfile();
  const [justSaved, setJustSaved] = React.useState(false);
  const t = useTranslations("profile");
  const tv = useTranslations("validation");

  const updateProfileSchema = React.useMemo(() => buildUpdateProfileSchema(tv), [tv]);

  const form = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      full_name: user.full_name,
      avatar_url: user.avatar_url ?? "",
    },
  });

  function onSubmit(values: UpdateProfileValues) {
    setJustSaved(false);
    mutation.mutate(
      { full_name: values.full_name, avatar_url: values.avatar_url || null },
      { onSuccess: () => setJustSaved(true) },
    );
  }

  const watchedAvatar = form.watch("avatar_url");
  const watchedName = form.watch("full_name");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex items-center gap-4">
        <Avatar className="size-14">
          <AvatarImage src={watchedAvatar || undefined} alt={watchedName} />
          <AvatarFallback>{initialsFor(watchedName || user.full_name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">{user.full_name}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="full_name">{t("fullNameLabel")}</Label>
        <Input
          id="full_name"
          aria-invalid={!!form.formState.errors.full_name}
          {...form.register("full_name")}
        />
        {form.formState.errors.full_name && (
          <p className="text-xs text-destructive">{form.formState.errors.full_name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="avatar_url">{t("avatarUrlLabel")}</Label>
        <Input
          id="avatar_url"
          placeholder="https://…"
          aria-invalid={!!form.formState.errors.avatar_url}
          {...form.register("avatar_url")}
        />
        {form.formState.errors.avatar_url && (
          <p className="text-xs text-destructive">{form.formState.errors.avatar_url.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">{t("emailLabel")}</Label>
        <Input id="email" value={user.email} disabled />
        <p className="text-xs text-muted-foreground">{t("emailChangeHint")}</p>
      </div>

      {mutation.isError && (
        <FormAlert variant="error">
          {mutation.error instanceof ApiError ? mutation.error.message : t("genericError")}
        </FormAlert>
      )}

      {justSaved && !mutation.isError && (
        <FormAlert variant="success">{t("profileUpdated")}</FormAlert>
      )}

      <div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? t("saving") : t("saveChanges")}
        </Button>
      </div>
    </form>
  );
}
