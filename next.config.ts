import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 15's dev server blocks requests whose Host doesn't match
  // localhost by default (cross-origin request protection). The
  // Instagram OAuth connect flow requires HTTPS, which localhost can't
  // provide, so local dev goes through a tunnel instead — without this,
  // every page load through that tunnel gets blocked with a "Blocked
  // cross-origin request" error. Covers both ngrok's free-tier domains
  // and Cloudflare's quick-tunnel domain (trycloudflare.com) since either
  // one gets used depending on what's available — see backend/README.md's
  // local-dev section. Dev-only setting — has no effect on a production
  // build.
  allowedDevOrigins: [
    "*.ngrok-free.dev",
    "*.ngrok-free.app",
    "*.ngrok.io",
    "*.trycloudflare.com",
  ],

  // Proxies Meta's webhook POSTs (and the GET verification handshake)
  // straight through to the Go API, so Meta only ever needs to know ONE
  // public URL — the same tunnel already exposing the frontend for the
  // OAuth redirect — instead of a second tunnel to the backend's own
  // port. (Originally worked around ngrok's free plan only allowing one
  // online endpoint at a time — ERR_NGROK_334 on a second tunnel — but
  // this is worth keeping regardless of which tunnel tool is in use: one
  // tunnel is simpler than two either way.) A plain HTTP proxy (not a
  // Route Handler that re-parses/re-serializes the body) is deliberate:
  // WebhookHandler.Receive verifies Meta's HMAC signature against the
  // exact raw request bytes, and rewrites forward the body untouched —
  // a hand-written proxy route risks re-encoding it and breaking that
  // signature check. In production there is no such proxy — the backend
  // has its own public URL and Meta points at it directly; this rewrite
  // exists purely to make local dev behind one tunnel work.
  async rewrites() {
    const goApiURL = process.env.GO_API_URL ?? "http://localhost:8080";
    return [
      {
        source: "/webhooks/:path*",
        destination: `${goApiURL}/webhooks/:path*`,
      },
    ];
  },
};

export default nextConfig;
