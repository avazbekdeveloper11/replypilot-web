import { z } from "zod";

/** Factory, not a constant — see login.schema.ts's doc comment. */
export function buildForgotPasswordSchema(t: (key: string) => string) {
  return z.object({
    email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
  });
}
export type ForgotPasswordValues = z.infer<
  ReturnType<typeof buildForgotPasswordSchema>
>;
