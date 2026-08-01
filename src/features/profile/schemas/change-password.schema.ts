import { z } from "zod";

/** Factory, not a constant — see features/auth/schemas/login.schema.ts's
 * doc comment on why. Reuses the "validation" namespace's
 * passwordMinLength8/passwordMaxLength72/passwordsDontMatch keys — same
 * copy as the reset-password form's equivalent fields. */
export function buildChangePasswordSchema(t: (key: string) => string) {
  return z
    .object({
      current_password: z.string().min(1, t("currentPasswordRequired")),
      new_password: z.string().min(8, t("passwordMinLength8")).max(72, t("passwordMaxLength72")),
      confirm_password: z.string().min(1, t("confirmPasswordRequired")),
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: t("passwordsDontMatch"),
      path: ["confirm_password"],
    });
}

export type ChangePasswordValues = z.infer<ReturnType<typeof buildChangePasswordSchema>>;
