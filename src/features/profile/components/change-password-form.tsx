"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/feedback/form-alert";
import { ApiError } from "@/lib/api/errors";

import {
  buildChangePasswordSchema,
  type ChangePasswordValues,
} from "../schemas/change-password.schema";
import { useChangePassword } from "../hooks/use-change-password";

export function ChangePasswordForm() {
  const mutation = useChangePassword();
  const [justChanged, setJustChanged] = React.useState(false);
  const t = useTranslations("profile");
  const tv = useTranslations("validation");

  const changePasswordSchema = React.useMemo(() => buildChangePasswordSchema(tv), [tv]);

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { current_password: "", new_password: "", confirm_password: "" },
  });

  function onSubmit(values: ChangePasswordValues) {
    setJustChanged(false);
    mutation.mutate(
      { current_password: values.current_password, new_password: values.new_password },
      {
        onSuccess: () => {
          setJustChanged(true);
          form.reset();
        },
      },
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="current_password">{t("currentPasswordLabel")}</Label>
        <Input
          id="current_password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!form.formState.errors.current_password}
          {...form.register("current_password")}
        />
        {form.formState.errors.current_password && (
          <p className="text-xs text-destructive">
            {form.formState.errors.current_password.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new_password">{t("newPasswordLabel")}</Label>
        <Input
          id="new_password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!form.formState.errors.new_password}
          {...form.register("new_password")}
        />
        {form.formState.errors.new_password && (
          <p className="text-xs text-destructive">{form.formState.errors.new_password.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirm_password">{t("confirmNewPasswordLabel")}</Label>
        <Input
          id="confirm_password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!form.formState.errors.confirm_password}
          {...form.register("confirm_password")}
        />
        {form.formState.errors.confirm_password && (
          <p className="text-xs text-destructive">
            {form.formState.errors.confirm_password.message}
          </p>
        )}
      </div>

      {mutation.isError && (
        <FormAlert variant="error">
          {mutation.error instanceof ApiError ? mutation.error.message : t("genericError")}
        </FormAlert>
      )}

      {justChanged && !mutation.isError && (
        <FormAlert variant="success">{t("passwordChanged")}</FormAlert>
      )}

      <div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? t("changing") : t("changePassword")}
        </Button>
      </div>
    </form>
  );
}
