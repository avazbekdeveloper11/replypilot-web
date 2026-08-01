import { z } from "zod";

/**
 * Login is two steps because the Go API's LoginRequest requires an
 * organization_id up front (backend/internal/delivery/http/v1/dto.go) —
 * there's no single "email + password" login endpoint. Step 1 resolves
 * which organization(s) the email belongs to
 * (GET /v1/auth/organizations); step 2 submits the actual login once an
 * org is known (auto-picked if there's exactly one).
 *
 * Built as factory functions taking a translator, not module-level
 * constants: zod schemas are plain TS, evaluated once at import time with
 * no React context, so there's no way for them to call useTranslations()
 * directly. The `t` param is the "validation" message namespace (shared
 * across every form in the app — see messages/en.json) — the caller
 * builds these inside a useMemo keyed on the translator (see
 * login-form.tsx).
 */
export function buildEmailStepSchema(t: (key: string) => string) {
  return z.object({
    email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
  });
}
export type EmailStepValues = z.infer<ReturnType<typeof buildEmailStepSchema>>;

export function buildPasswordStepSchema(t: (key: string) => string) {
  return z.object({
    organization_id: z.string().uuid(t("selectWorkspace")),
    password: z.string().min(1, t("passwordRequired")),
  });
}
export type PasswordStepValues = z.infer<
  ReturnType<typeof buildPasswordStepSchema>
>;
