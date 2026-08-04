"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  buildRegisterSchema,
  buildRegisterCodeSchema,
  type RegisterValues,
  type RegisterCodeValues,
} from "../schemas/register.schema";
import { useRegister } from "../hooks/use-register";
import { useRequestRegistrationCode } from "../hooks/use-request-registration-code";

/** Strips organization_name down to the backend's `alphanum` slug rule
 * (letters + digits only) — this is only ever a starting suggestion the
 * user can edit, not a hidden value, so a slug collision (409 from the
 * API) is something they can just retype rather than a dead end. */
function slugify(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, "");
}

/**
 * Two-step registration, mirroring login-form.tsx's pattern: account
 * details -> request a 6-digit OTP for the entered email (Resend, see
 * auth.UseCase.RequestRegistrationCode) -> code entry, which submits the
 * code alongside the details already collected to actually create the
 * account (auth.UseCase.Register verifies the code before creating
 * org+user). Nothing is created until the code step succeeds.
 */
export function RegisterForm() {
  const router = useRouter();
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const [slugTouched, setSlugTouched] = React.useState(false);
  const [step, setStep] = React.useState<"details" | "code">("details");
  const [details, setDetails] = React.useState<RegisterValues | null>(null);

  const registerSchema = React.useMemo(() => buildRegisterSchema(tv), [tv]);
  const codeSchema = React.useMemo(() => buildRegisterCodeSchema(tv), [tv]);

  const detailsForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      organization_name: "",
      organization_slug: "",
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const codeForm = useForm<RegisterCodeValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: "" },
  });

  const requestCodeMutation = useRequestRegistrationCode();
  const registerMutation = useRegister();

  function onOrganizationNameChange(value: string) {
    detailsForm.setValue("organization_name", value);
    if (!slugTouched) {
      detailsForm.setValue("organization_slug", slugify(value), { shouldValidate: true });
    }
  }

  function onDetailsSubmit(values: RegisterValues) {
    requestCodeMutation.mutate(values.email, {
      onSuccess: () => {
        setDetails(values);
        codeForm.reset({ code: "" });
        setStep("code");
      },
    });
  }

  function onCodeSubmit(values: RegisterCodeValues) {
    if (!details) return;
    registerMutation.mutate(
      {
        organization_name: details.organization_name,
        organization_slug: details.organization_slug,
        full_name: details.full_name,
        email: details.email,
        password: details.password,
        code: values.code,
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
          router.refresh();
        },
        onError: (err) => {
          if (err instanceof ApiError && err.code === "UNAUTHORIZED") {
            codeForm.setError("code", { message: t("codeInvalid") });
          }
        },
      },
    );
  }

  function backToDetails() {
    setStep("details");
    registerMutation.reset();
  }

  function resendCode() {
    if (!details) return;
    requestCodeMutation.mutate(details.email);
  }

  const registerError =
    registerMutation.isError &&
    !(registerMutation.error instanceof ApiError && registerMutation.error.code === "UNAUTHORIZED");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("createAccountTitle")}</CardTitle>
        <CardDescription>
          {step === "details"
            ? t("createAccountDescription")
            : t("weSentCodeTo", { email: details?.email ?? "" })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "details" ? (
          <form
            onSubmit={detailsForm.handleSubmit(onDetailsSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="organization_name">{t("organizationNameLabel")}</Label>
              <Input
                id="organization_name"
                placeholder="Acme Inc."
                aria-invalid={!!detailsForm.formState.errors.organization_name}
                {...detailsForm.register("organization_name", {
                  onChange: (e) => onOrganizationNameChange(e.target.value),
                })}
              />
              {detailsForm.formState.errors.organization_name && (
                <p className="text-xs text-destructive">
                  {detailsForm.formState.errors.organization_name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="organization_slug">{t("workspaceUrlLabel")}</Label>
              <Input
                id="organization_slug"
                placeholder="acmeinc"
                aria-invalid={!!detailsForm.formState.errors.organization_slug}
                {...detailsForm.register("organization_slug", {
                  onChange: () => setSlugTouched(true),
                })}
              />
              <p className="text-xs text-muted-foreground">{t("lettersNumbersOnly")}</p>
              {detailsForm.formState.errors.organization_slug && (
                <p className="text-xs text-destructive">
                  {detailsForm.formState.errors.organization_slug.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="full_name">{t("yourNameLabel")}</Label>
              <Input
                id="full_name"
                autoComplete="name"
                placeholder="Jane Doe"
                aria-invalid={!!detailsForm.formState.errors.full_name}
                {...detailsForm.register("full_name")}
              />
              {detailsForm.formState.errors.full_name && (
                <p className="text-xs text-destructive">
                  {detailsForm.formState.errors.full_name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">{t("emailLabel")}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                aria-invalid={!!detailsForm.formState.errors.email}
                {...detailsForm.register("email")}
              />
              {detailsForm.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {detailsForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">{t("passwordLabel")}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                aria-invalid={!!detailsForm.formState.errors.password}
                {...detailsForm.register("password")}
              />
              {detailsForm.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {detailsForm.formState.errors.password.message}
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
                aria-invalid={!!detailsForm.formState.errors.confirm_password}
                {...detailsForm.register("confirm_password")}
              />
              {detailsForm.formState.errors.confirm_password && (
                <p className="text-xs text-destructive">
                  {detailsForm.formState.errors.confirm_password.message}
                </p>
              )}
            </div>

            {requestCodeMutation.isError && (
              <FormAlert variant="error">
                {requestCodeMutation.error instanceof ApiError
                  ? requestCodeMutation.error.message
                  : t("genericError")}
              </FormAlert>
            )}

            <Button type="submit" className="w-full" disabled={requestCodeMutation.isPending}>
              {requestCodeMutation.isPending ? t("sending") : t("sendVerificationCode")}
            </Button>
          </form>
        ) : (
          <form
            onSubmit={codeForm.handleSubmit(onCodeSubmit)}
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
                aria-invalid={!!codeForm.formState.errors.code}
                {...codeForm.register("code")}
              />
              {codeForm.formState.errors.code && (
                <p className="text-xs text-destructive">
                  {codeForm.formState.errors.code.message}
                </p>
              )}
            </div>

            {registerError && (
              <FormAlert variant="error">
                {registerMutation.error instanceof ApiError
                  ? registerMutation.error.message
                  : t("genericError")}
              </FormAlert>
            )}

            <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? t("creatingAccount") : t("createAccountBtn")}
            </Button>

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={backToDetails}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeftIcon className="size-3" />
                {t("editDetails")}
              </button>
              <button
                type="button"
                onClick={resendCode}
                disabled={requestCodeMutation.isPending}
                className="text-brand hover:underline disabled:opacity-50"
              >
                {requestCodeMutation.isSuccess ? t("codeResent") : t("resendCode")}
              </button>
            </div>
          </form>
        )}

        {step === "details" && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("alreadyHaveAccount")}{" "}
            <Link href="/login" className="text-brand hover:underline">
              {t("logIn")}
            </Link>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
