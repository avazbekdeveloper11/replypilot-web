/**
 * App-wide metadata defaults. Read by app/layout.tsx `metadata` export and
 * anywhere else that needs the product name/description without importing
 * from a route file (avoids circular imports between route groups).
 */
export const siteConfig = {
  name: "ReplyPilot",
  description:
    "AI-powered Instagram DM sales agent — turn every conversation into a qualified lead, automatically.",
  url: "https://app.replypilot.ai",
} as const;
