import { z } from "zod";

/**
 * Server-only environment. Imported exclusively from Route Handlers
 * (`app/api/**`) — never from a Client Component, never re-exported with
 * a `NEXT_PUBLIC_` prefix. GO_API_URL points at the Go backend and must
 * never be reachable from the browser bundle: the whole point of the BFF
 * pattern (FRONTEND_ARCHITECTURE.md §3) is that the browser only ever
 * talks to this Next.js app, which then calls the Go API server-to-server.
 *
 * Validated at first import so a missing/malformed env fails loudly with
 * a clear message instead of surfacing as a mystery `fetch failed` three
 * layers deep inside a Route Handler.
 */
const serverEnvSchema = z.object({
  GO_API_URL: z.string().url().default("http://localhost:8080"),
});

export const serverEnv = serverEnvSchema.parse({
  GO_API_URL: process.env.GO_API_URL,
});
