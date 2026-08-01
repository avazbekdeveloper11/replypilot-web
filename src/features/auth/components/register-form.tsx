"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

import { buildRegisterSchema, type RegisterValues } from "../schemas/register.schema";
import { useRegister } from "../hooks/use-register";

/** Strips organization_name down to the backend's `alphanum` slug rule
 * (letters + digits only) — this is only ever a starting suggestion the
 * user can edit, not a hidden value, so a slug collision (409 from the
 * API) is something they can just retype rather than a dead end. */
function slugify(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, "");
}

export function RegisterForm() {
  const router = useRouter();
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const [slugTouched, setSlugTouched] = React.useState(false);

  const registerSchema = React.useMemo(() => buildRegisterSchema(tv), [tv]);

  const form = useForm<RegisterValues>({
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

  const registerMutation = useRegister();

  function onOrganizationNameChange(value: string) {
    form.setValue("organization_name", value);
    if (!slugTouched) {
      form.setValue("organization_slug", slugify(value), { shouldValidate: true });
    }
  }

  function onSubmit(values: RegisterValues) {
    registerMutation.mutate(
      {
        organization_name: values.organization_name,
        organization_slug: values.organization_slug,
        full_name: values.full_name,
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
          router.refresh();
        },
        onError: (err) => {
          if (err instanceof ApiError && err.code === "CONFLICT") {
            form.setError("organization_slug", {
              message: t("slugTaken"),
            });
          }
        },
      },
    );
  }

  const genericError =
    registerMutation.isError &&
    !(registerMutation.error instanceof ApiError && registerMutation.error.code === "CONFLICT");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("createAccountTitle")}</CardTitle>
        <CardDescription>{t("createAccountDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="organization_name">{t("organizationNameLabel")}</Label>
            <Input
              id="organization_name"
              placeholder="Acme Inc."
              aria-invalid={!!form.formState.errors.organization_name}
              {...form.register("organization_name", {
                onChange: (e) => onOrganizationNameChange(e.target.value),
              })}
            />
            {form.formState.errors.organization_name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.organization_name.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="organization_slug">{t("workspaceUrlLabel")}</Label>
            <Input
              id="organization_slug"
              placeholder="acmeinc"
              aria-invalid={!!form.formState.errors.organization_slug}
              {...form.register("organization_slug", {
                onChange: () => setSlugTouched(true),
              })}
            />
            <p className="text-xs text-muted-foreground">{t("lettersNumbersOnly")}</p>
            {form.formState.errors.organization_slug && (
              <p className="text-xs text-destructive">
                {form.formState.errors.organization_slug.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="full_name">{t("yourNameLabel")}</Label>
            <Input
              id="full_name"
              autoComplete="name"
              placeholder="Jane Doe"
              aria-invalid={!!form.formState.errors.full_name}
              {...form.register("full_name")}
            />
            {form.formState.errors.full_name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.full_name.message}
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
              aria-invalid={!!form.formState.errors.email}
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">{t("passwordLabel")}</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={!!form.formState.errors.password}
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-xs text-destructive">
                {form.formState.errors.password.message}
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

          {genericError && (
            <FormAlert variant="error">
              {registerMutation.error instanceof ApiError
                ? registerMutation.error.message
                : t("genericError")}
            </FormAlert>
          )}

          <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? t("creatingAccount") : t("createAccountBtn")}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/login" className="text-brand hover:underline">
            {t("logIn")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
