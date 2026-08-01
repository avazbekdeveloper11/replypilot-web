"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import * as React from "react";

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

import {
  buildForgotPasswordSchema,
  type ForgotPasswordValues,
} from "../schemas/forgot-password.schema";
import { useForgotPassword } from "../hooks/use-forgot-password";

/**
 * The backend always returns 200 for this endpoint regardless of whether
 * the email exists (anti-enumeration — see auth.UseCase.ForgotPassword's
 * doc comment). This form mirrors that on the client: success always
 * shows the same generic message, never "email not found".
 */
export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const schema = React.useMemo(() => buildForgotPasswordSchema(tv), [tv]);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });
  const mutation = useForgotPassword();

  function onSubmit(values: ForgotPasswordValues) {
    mutation.mutate(values.email);
  }

  if (mutation.isSuccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("checkYourEmailTitle")}</CardTitle>
          <CardDescription>{t("checkYourEmailDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login" className="text-sm text-brand hover:underline">
            {t("backToLogIn")}
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("resetPasswordTitle")}</CardTitle>
        <CardDescription>{t("resetPasswordDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">{t("emailLabel")}</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@company.com"
              aria-invalid={!!form.formState.errors.email}
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>

          {mutation.isError && (
            <FormAlert variant="error">{t("genericError")}</FormAlert>
          )}

          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? t("sending") : t("sendResetLink")}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-brand hover:underline">
            {t("backToLogIn")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
