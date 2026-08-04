import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reset password" };

/**
 * The backend no longer issues link-tokens for password reset (see
 * auth.UseCase.ResetPassword — now verifies a 6-digit OTP against
 * {email, code}, not a `?token=` query param). The whole flow now lives
 * on /forgot-password (email -> code -> new password), so any old email
 * still pointing at /reset-password?token=... is redirected there rather
 * than 404ing.
 */
export default function ResetPasswordPage() {
  redirect("/forgot-password");
}
