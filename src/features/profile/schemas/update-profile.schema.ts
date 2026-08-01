import { z } from "zod";

/** Factory, not a constant — see features/auth/schemas/login.schema.ts's
 * doc comment on why. Reuses the "validation" namespace's fullNameRequired
 * key — same copy as the register form's equivalent field. */
export function buildUpdateProfileSchema(t: (key: string) => string) {
  return z.object({
    full_name: z.string().min(2, t("fullNameRequired")).max(120, t("fullNameTooLong")),
    avatar_url: z
      .string()
      .trim()
      .url(t("urlInvalid"))
      .optional()
      .or(z.literal("")),
  });
}

export type UpdateProfileValues = z.infer<ReturnType<typeof buildUpdateProfileSchema>>;
