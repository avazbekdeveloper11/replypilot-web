import { z } from "zod";

/** Factory, not a constant — see features/auth/schemas/login.schema.ts's
 * doc comment on why. Mirrors ConnectClickRequest on the backend exactly:
 * merchant_id/service_id/secret_key required, merchant_user_id optional.
 * secret_key is a real secret (see entity.ClickIntegration.SecretKeyEncrypted's
 * doc comment) — required here, unlike merchant_id/service_id, because
 * without it the backend can never verify Click's payment webhook. */
export function buildClickSchema(t: (key: string) => string) {
  return z.object({
    merchant_id: z.string().min(1, t("merchantIdRequired")),
    service_id: z.string().min(1, t("serviceIdRequired")),
    secret_key: z.string().min(1, t("secretKeyRequired")),
    merchant_user_id: z.string().optional(),
  });
}

export type ClickFormValues = z.infer<ReturnType<typeof buildClickSchema>>;
