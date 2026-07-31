import type { MetadataRoute } from "next";

// The whole app is authenticated (no (marketing) route group yet — see
// app/page.tsx). Nothing here should be indexed until a public marketing
// site exists (FRONTEND_ARCHITECTURE.md §8).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
