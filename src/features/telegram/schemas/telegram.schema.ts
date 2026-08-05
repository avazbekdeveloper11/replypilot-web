import { z } from "zod";

/** Factory, not a constant — see features/auth/schemas/login.schema.ts's
 * doc comment on why. Just bot_token — the string @BotFather gives back
 * after /newbot, matching TelegramConnectRequest on the backend exactly. */
export function buildTelegramSchema(t: (key: string) => string) {
  return z.object({
    bot_token: z.string().min(1, t("botTokenRequired")),
  });
}

export type TelegramFormValues = z.infer<ReturnType<typeof buildTelegramSchema>>;
