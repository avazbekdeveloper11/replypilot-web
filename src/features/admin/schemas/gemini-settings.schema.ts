import { z } from "zod";

// No upper bound on purpose — API keys from different providers/formats
// vary in length, and this codebase has already been burned once by
// assuming a specific key shape (see the chat history: a pasted token that
// turned out not to even be in the expected format). Validate presence,
// not shape — the backend call itself is the real validation.
//
// Factory, not a constant — see features/auth/schemas/login.schema.ts's
// doc comment on why.
export function buildGeminiSettingsSchema(t: (key: string) => string) {
  return z.object({
    api_key: z.string().min(10, t("apiKeyInvalid")),
  });
}

export type GeminiSettingsValues = z.infer<ReturnType<typeof buildGeminiSettingsSchema>>;
