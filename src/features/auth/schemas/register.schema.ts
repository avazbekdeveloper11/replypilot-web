import { z } from "zod";

/**
 * organization_slug mirrors the backend's `alphanum` binding tag exactly
 * (backend/internal/delivery/http/v1/dto.go's RegisterRequest) — letters
 * and digits only, no hyphens/underscores, or the API rejects it with
 * INVALID_INPUT before this form's client-side check would even matter on
 * a slow connection. The field is auto-derived from organization_name (see
 * register-form.tsx) but stays editable/visible so a slug collision
 * (CONFLICT from the API) is something the user can just retype, not a
 * dead end.
 *
 * Split into two steps to match the backend's OTP-gated registration flow
 * (auth.UseCase.RequestRegistrationCode + Register with Code): this schema
 * covers step 1 (account details, submitted to request a code); the code
 * itself is validated separately by buildRegisterCodeSchema below, since
 * it doesn't exist yet when this step's form mounts.
 *
 * A factory, not a module-level constant — see login.schema.ts's doc
 * comment on why (no React context at zod-schema-definition time).
 */
export function buildRegisterSchema(t: (key: string) => string) {
  return z
    .object({
      organization_name: z
        .string()
        .min(2, t("organizationNameRequired"))
        .max(120, t("organizationNameTooLong")),
      organization_slug: z
        .string()
        .min(2, t("slugRequired"))
        .max(60, t("slugTooLong"))
        .regex(/^[a-zA-Z0-9]+$/, t("slugAlphanumOnly")),
      full_name: z.string().min(2, t("fullNameRequired")).max(120),
      email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
      password: z.string().min(8, t("passwordMinLength")).max(72),
      confirm_password: z.string().min(1, t("confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: t("passwordsDontMatch"),
      path: ["confirm_password"],
    });
}

export type RegisterValues = z.infer<ReturnType<typeof buildRegisterSchema>>;

/** Step 2 — the 6-digit code sent to the address entered in step 1. */
export function buildRegisterCodeSchema(t: (key: string) => string) {
  return z.object({
    code: z
      .string()
      .min(1, t("codeRequired"))
      .length(6, t("codeLength"))
      .regex(/^\d+$/, t("codeLength")),
  });
}

export type RegisterCodeValues = z.infer<ReturnType<typeof buildRegisterCodeSchema>>;
