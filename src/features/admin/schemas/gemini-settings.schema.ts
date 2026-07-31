import { z } from "zod";

// No upper bound on purpose — API keys from different providers/formats
// vary in length, and this codebase has already been burned once by
// assuming a specific key shape (see the chat history: a pasted token that
// turned out not to even be in the expected format). Validate presence,
// not shape — the backend call itself is the real validation.
export const geminiSettingsSchema = z.object({
  api_key: z.string().min(10, "Doesn't look like a real API key"),
});

export type GeminiSettingsValues = z.infer<typeof geminiSettingsSchema>;
