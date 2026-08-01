import { z } from "zod";

/** Factory, not a constant — see features/auth/schemas/login.schema.ts's
 * doc comment on why (no React context at zod-schema-definition time). */
export function buildInviteSchema(t: (key: string) => string) {
  return z.object({
    email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
    role_id: z.string().uuid(t("chooseRole")),
  });
}
export type InviteValues = z.infer<ReturnType<typeof buildInviteSchema>>;
