"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormAlert } from "@/components/feedback/form-alert";
import { ApiError } from "@/lib/api/errors";

import {
  buildResetPasswordSchema,
  type ResetPasswordValues,
} from "../schemas/reset-password.schema";
import { useResetPassword } from "../hooks/use-reset-password";

export function ResetPasswordForm() {
  const token = useSearchParams().get("token");
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const schema = React.useMemo(() => buildResetPasswordSchema(tv), [tv]);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: { new_password: "", confirm_password: "" },
  });
  const mutation = useResetPassword();

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("invalidResetLinkTitle")}</CardTitle>
          <CardDescription>{t("invalidResetLinkDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/forgot-password" className="text-sm text-brand hover:underline">
            {t("requestNewLink")}
          </Link>
        </CardContent>
      </Card>
    );
  }

  function onSubmit(values: ResetPasswordValues) {
    mutation.mutate({ token: token as string, new_password: values.new_password });
  }

  if (mutation.isSuccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("passwordUpdatedTitle")}</CardTitle>
          <CardDescription>{t("passwordUpdatedDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/login">{t("logIn")}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const tokenExpired = mutation.isError && mutation.error instanceof ApiError && mutation.error.code === "UNAUTHORIZED";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("setNewPasswordTitle")}</CardTitle>
        <CardDescription>{t("setNewPasswordDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        {tokenExpired ? (
          <FormAlert variant="error" className="mb-4">
            {t("resetLinkExpired")}{" "}
            <Link href="/forgot-password" className="underline">
              {t("requestNewOne")}
            </Link>
            .
          </FormAlert>
        ) : null}

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new_password">{t("newPasswordLabel")}</Label>
            <Input
              id="new_password"
              type="password"
              autoComplete="new-password"
              autoFocus
              placeholder="••••••••"
              aria-invalid={!!form.formState.errors.new_password}
              {...form.register("new_password")}
            />
            {form.formState.errors.new_password && (
              <p className="text-xs text-destructive">
                {form.formState.errors.new_password.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirm_password">{t("confirmPasswordLabel")}</Label>
            <Input
              id="confirm_password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={!!form.formState.errors.confirm_password}
              {...form.register("confirm_password")}
            />
            {form.formState.errors.confirm_password && (
              <p className="text-xs text-destructive">
                {form.formState.errors.confirm_password.message}
              </p>
            )}
          </div>

          {mutation.isError && !tokenExpired && (
            <FormAlert variant="error">{t("genericError")}</FormAlert>
          )}

          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? t("updating") : t("updatePassword")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
