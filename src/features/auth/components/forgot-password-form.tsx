"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

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
  buildForgotPasswordSchema,
  type ForgotPasswordValues,
} from "../schemas/forgot-password.schema";
import {
  buildResetPasswordSchema,
  type ResetPasswordValues,
} from "../schemas/reset-password.schema";
import { useForgotPassword } from "../hooks/use-forgot-password";
import { useResetPassword } from "../hooks/use-reset-password";

/**
 * Two-step forgot-password, merged with what used to be a separate
 * token-link-based /reset-password page: the backend no longer issues a
 * link-token (auth.UseCase.ResetPassword now verifies {email, code,
 * new_password} — see redis.OTPStore), so there's nothing for a `?token=`
 * URL to carry anymore. Email -> request a 6-digit code (always resolves,
 * anti-enumeration, same as before) -> code + new password, submitted
 * together against the email captured in step 1.
 */
export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const [step, setStep] = React.useState<"email" | "reset">("email");
  const [email, setEmail] = React.useState("");

  const emailSchema = React.useMemo(() => buildForgotPasswordSchema(tv), [tv]);
  const resetSchema = React.useMemo(() => buildResetPasswordSchema(tv), [tv]);

  const emailForm = useForm<ForgotPasswordValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { code: "", new_password: "", confirm_password: "" },
  });

  const forgotMutation = useForgotPassword();
  const resetMutation = useResetPassword();

  function onEmailSubmit(values: ForgotPasswordValues) {
    forgotMutation.mutate(values.email, {
      onSuccess: () => {
        setEmail(values.email);
        resetForm.reset({ code: "", new_password: "", confirm_password: "" });
        setStep("reset");
      },
    });
  }

  function onResetSubmit(values: ResetPasswordValues) {
    resetMutation.mutate(
      { email, code: values.code, new_password: values.new_password },
      {
        onError: (err) => {
          if (err instanceof ApiError && err.code === "UNAUTHORIZED") {
            resetForm.setError("code", { message: t("codeInvalid") });
          }
        },
      },
    );
  }

  function backToEmail() {
    setStep("email");
    resetMutation.reset();
  }

  function resendCode() {
    forgotMutation.mutate(email);
  }

  if (resetMutation.isSuccess) {
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

  const resetError =
    resetMutation.isError &&
    !(resetMutation.error instanceof ApiError && resetMutation.error.code === "UNAUTHORIZED");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {step === "email" ? t("resetPasswordTitle") : t("setNewPasswordTitle")}
        </CardTitle>
        <CardDescription>
          {step === "email" ? t("resetPasswordDescription") : t("weSentCodeTo", { email })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "email" ? (
          <form
            onSubmit={emailForm.handleSubmit(onEmailSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">{t("emailLabel")}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                placeholder="you@company.com"
                aria-invalid={!!emailForm.formState.errors.email}
                {...emailForm.register("email")}
              />
              {emailForm.formState.errors.email && (
                <p className="text-xs text-destructive">{emailForm.formState.errors.email.message}</p>
              )}
            </div>

            {forgotMutation.isError && (
              <FormAlert variant="error">{t("genericError")}</FormAlert>
            )}

            <Button type="submit" className="w-full" disabled={forgotMutation.isPending}>
              {forgotMutation.isPending ? t("sending") : t("sendVerificationCode")}
            </Button>
          </form>
        ) : (
          <form
            onSubmit={resetForm.handleSubmit(onResetSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="code">{t("verificationCodeLabel")}</Label>
              <Input
                id="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                autoFocus
                maxLength={6}
                aria-invalid={!!resetForm.formState.errors.code}
                {...resetForm.register("code")}
              />
              {resetForm.formState.errors.code && (
                <p className="text-xs text-destructive">{resetForm.formState.errors.code.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new_password">{t("newPasswordLabel")}</Label>
              <Input
                id="new_password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                aria-invalid={!!resetForm.formState.errors.new_password}
                {...resetForm.register("new_password")}
              />
              {resetForm.formState.errors.new_password && (
                <p className="text-xs text-destructive">
                  {resetForm.formState.errors.new_password.message}
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
                aria-invalid={!!resetForm.formState.errors.confirm_password}
                {...resetForm.register("confirm_password")}
              />
              {resetForm.formState.errors.confirm_password && (
                <p className="text-xs text-destructive">
                  {resetForm.formState.errors.confirm_password.message}
                </p>
              )}
            </div>

            {resetError && <FormAlert variant="error">{t("genericError")}</FormAlert>}

            <Button type="submit" className="w-full" disabled={resetMutation.isPending}>
              {resetMutation.isPending ? t("updating") : t("updatePassword")}
            </Button>

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={backToEmail}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeftIcon className="size-3" />
                {t("useDifferentEmail")}
              </button>
              <button
                type="button"
                onClick={resendCode}
                disabled={forgotMutation.isPending}
                className="text-brand hover:underline disabled:opacity-50"
              >
                {forgotMutation.isSuccess ? t("codeResent") : t("resendCode")}
              </button>
            </div>
          </form>
        )}

        {step === "email" && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/login" className="text-brand hover:underline">
              {t("backToLogIn")}
            </Link>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
