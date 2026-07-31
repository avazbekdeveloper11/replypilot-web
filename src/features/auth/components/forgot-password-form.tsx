"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  forgotPasswordSchema,
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
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
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
          <CardTitle className="text-lg">Check your email</CardTitle>
          <CardDescription>
            If an account exists for that email, we&apos;ve sent a link to reset
            your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login" className="text-sm text-brand hover:underline">
            Back to log in
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Reset your password</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a link to reset your
          password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
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
            <FormAlert variant="error">
              Something went wrong. Please try again.
            </FormAlert>
          )}

          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Sending…" : "Send reset link"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-brand hover:underline">
            Back to log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
