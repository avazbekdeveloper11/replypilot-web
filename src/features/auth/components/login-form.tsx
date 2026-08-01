"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

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
  buildEmailStepSchema,
  buildPasswordStepSchema,
  type EmailStepValues,
  type PasswordStepValues,
} from "../schemas/login.schema";
import { useOrganizationsByEmail } from "../hooks/use-organizations-by-email";
import { useLogin } from "../hooks/use-login";
import type { OrganizationMembership } from "../types";

/**
 * Two-step login: email -> resolve which workspace(s) it belongs to
 * (backend requires organization_id up front, see login.schema.ts) ->
 * password + workspace (auto-picked if there's only one). On success,
 * a full navigation to /dashboard so the newly-set httpOnly cookies are
 * present on the very next server render (a client-side router.push
 * alone wouldn't guarantee middleware/Server Components see the cookie
 * on the first paint).
 */
/** Only ever redirect to a same-app relative path — "/dashboard", never
 * "https://evil.example" or "//evil.example" (protocol-relative), even
 * though `next` comes from our own middleware.ts today: a query param is
 * still attacker-controllable input the moment this ships, so it's
 * validated here rather than trusted. */
function safeRedirectTarget(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/dashboard";
  return next;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const [step, setStep] = React.useState<"email" | "password">("email");
  const [email, setEmail] = React.useState("");
  const [memberships, setMemberships] = React.useState<OrganizationMembership[]>([]);

  const emailSchema = React.useMemo(() => buildEmailStepSchema(tv), [tv]);
  const passwordSchema = React.useMemo(() => buildPasswordStepSchema(tv), [tv]);

  const emailForm = useForm<EmailStepValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const passwordForm = useForm<PasswordStepValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { organization_id: "", password: "" },
  });

  const orgsMutation = useOrganizationsByEmail();
  const loginMutation = useLogin();

  async function onEmailSubmit(values: EmailStepValues) {
    orgsMutation.mutate(values.email, {
      onSuccess: (result) => {
        if (result.length === 0) {
          emailForm.setError("email", {
            message: t("noWorkspace"),
          });
          return;
        }
        setEmail(values.email);
        setMemberships(result);
        passwordForm.reset({ organization_id: result[0].organization.id, password: "" });
        setStep("password");
      },
      onError: (err) => {
        const message =
          err instanceof ApiError && err.code === "NOT_FOUND"
            ? t("accountNotFound")
            : t("genericError");
        emailForm.setError("email", { message });
      },
    });
  }

  function onPasswordSubmit(values: PasswordStepValues) {
    loginMutation.mutate(
      { email, password: values.password, organization_id: values.organization_id },
      {
        onSuccess: () => {
          router.push(safeRedirectTarget(searchParams.get("next")));
          router.refresh();
        },
      },
    );
  }

  function backToEmail() {
    setStep("email");
    loginMutation.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("logInTitle")}</CardTitle>
        <CardDescription>
          {step === "email"
            ? t("enterEmailToContinue")
            : t("continueAs", { email })}
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
                placeholder="you@company.com"
                aria-invalid={!!emailForm.formState.errors.email}
                {...emailForm.register("email")}
              />
              {emailForm.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {emailForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={orgsMutation.isPending}>
              {orgsMutation.isPending ? t("checking") : t("continueBtn")}
            </Button>
          </form>
        ) : (
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            {memberships.length > 1 && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="organization_id">{t("workspaceLabel")}</Label>
                <Select
                  value={passwordForm.watch("organization_id")}
                  onValueChange={(value) =>
                    passwordForm.setValue("organization_id", value, { shouldValidate: true })
                  }
                >
                  <SelectTrigger id="organization_id" className="w-full">
                    <SelectValue placeholder={t("selectWorkspacePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {memberships.map((m) => (
                      <SelectItem key={m.organization.id} value={m.organization.id}>
                        {m.organization.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("passwordLabel")}</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-brand hover:underline"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                autoFocus
                aria-invalid={!!passwordForm.formState.errors.password}
                {...passwordForm.register("password")}
              />
              {passwordForm.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {passwordForm.formState.errors.password.message}
                </p>
              )}
            </div>

            {loginMutation.isError && (
              <FormAlert variant="error">
                {loginMutation.error instanceof ApiError
                  ? loginMutation.error.message
                  : t("genericError")}
              </FormAlert>
            )}

            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? t("loggingIn") : t("logIn")}
            </Button>
            <button
              type="button"
              onClick={backToEmail}
              className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeftIcon className="size-3" />
              {t("useDifferentEmail")}
            </button>
          </form>
        )}

        {step === "email" && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("noAccount")}{" "}
            <Link href="/register" className="text-brand hover:underline">
              {t("signUp")}
            </Link>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
