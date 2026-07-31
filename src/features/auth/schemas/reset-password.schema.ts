import { z } from "zod";

// min(8)/max(72) mirrors the Go API's ResetPasswordRequest binding tags
// exactly (backend/internal/delivery/http/v1/dto.go) — 72 because bcrypt
// silently truncates beyond 72 bytes, so the backend rejects longer
// passwords rather than accepting input it can't fully hash.
export const resetPasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be at most 72 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
