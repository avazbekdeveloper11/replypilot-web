import { z } from "zod";

// min(8)/max(72) mirrors the Go API's ResetPasswordRequest binding tags
// exactly (backend/internal/delivery/http/v1/dto.go) — 72 because bcrypt
// silently truncates beyond 72 bytes, so the backend rejects longer
// passwords rather than accepting input it can't fully hash.
//
// Factory, not a constant — see login.schema.ts's doc comment.
export function buildResetPasswordSchema(t: (key: string) => string) {
  return z
    .object({
      new_password: z
        .string()
        .min(8, t("passwordMinLength8"))
        .max(72, t("passwordMaxLength72")),
      confirm_password: z.string(),
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: t("passwordsDontMatch"),
      path: ["confirm_password"],
    });
}
export type ResetPasswordValues = z.infer<
  ReturnType<typeof buildResetPasswordSchema>
>;
