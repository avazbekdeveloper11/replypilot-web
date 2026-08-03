import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/config/site";

// Public, unauthenticated route — deliberately outside both (auth) and
// (dashboard) groups and NOT in middleware.ts's matcher, so it's reachable
// without a session. This exists specifically to satisfy Meta App Review's
// mandatory "Privacy Policy URL" field (App Dashboard → App settings →
// Basic) for the Instagram API with Instagram Login product; Meta rejects
// review if this URL is empty, unreachable, or paywalled. Keep this page
// live for as long as the Meta app exists, even if the marketing site
// changes — Meta re-checks it periodically, not just at initial review.
export const metadata: Metadata = {
  title: `Privacy Policy — ${siteConfig.name}`,
  description: `How ${siteConfig.name} collects, uses, and protects data, including data accessed via the Instagram API.`,
};

const LAST_UPDATED = "August 3, 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-3xl px-6 py-16">
      <div className="mb-10">
        <p className="text-sm font-medium text-muted-foreground">{siteConfig.name}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-foreground/90 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        <section>
          <p>
            {siteConfig.name} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) provides an
            AI-powered service that connects to a business&apos;s Instagram account to read
            and respond to direct messages on their behalf. This policy explains what data we
            collect, why, and how it is handled — including data accessed through the
            Instagram API.
          </p>
        </section>

        <section>
          <h2>1. What we collect</h2>
          <ul>
            <li>
              Account information you provide when you register: name, email address, and
              organization details.
            </li>
            <li>
              Instagram account data you authorize via Instagram&apos;s OAuth login: your
              Instagram Business account ID, username, and a long-lived access token, which we
              store encrypted at rest.
            </li>
            <li>
              Instagram Direct Message content sent to and from the connected Instagram
              account — message text, timestamps, and sender/recipient identifiers — solely to
              generate and deliver AI replies and to display conversation history in your
              dashboard.
            </li>
            <li>
              Content you upload to the Knowledge Base feature, used to ground the AI&apos;s
              replies about your business.
            </li>
          </ul>
        </section>

        <section>
          <h2>2. How we use it</h2>
          <ul>
            <li>To authenticate your account and connect it to your Instagram Business account.</li>
            <li>To receive, store, and display Instagram DM conversations in your dashboard.</li>
            <li>To generate AI-drafted or AI-sent replies to incoming DMs, using the message content and any Knowledge Base documents you&apos;ve provided.</li>
            <li>To show usage analytics (message volume, response rates) back to you.</li>
            <li>To operate, maintain, and improve the service, including debugging and abuse prevention.</li>
          </ul>
          <p>
            We do not sell your data or your customers&apos; message data to third parties, and
            we do not use Instagram DM content to train third-party AI models beyond the
            request made to generate a reply.
          </p>
        </section>

        <section>
          <h2>3. Data from the Instagram API</h2>
          <p>
            Data obtained through the Instagram API (profile info, message content, message
            metadata) is used only to provide the messaging-automation features described
            above and is not used for advertising or shared with data brokers. Access tokens
            are encrypted at rest and are used only to call the Instagram API on your behalf.
          </p>
        </section>

        <section>
          <h2>4. Data retention</h2>
          <p>
            We retain conversation and message data for as long as your account is active, so
            you can view conversation history and analytics. If you disconnect an Instagram
            account, we stop syncing new messages for it; if you delete your organization
            account, we delete or anonymize associated data within a reasonable period,
            except where retention is required by law.
          </p>
        </section>

        <section>
          <h2>5. Data deletion</h2>
          <p>
            You can disconnect an Instagram account at any time from your dashboard&apos;s
            Instagram settings, which stops further message syncing for that account. To
            request full deletion of your organization&apos;s data, contact us at the email
            below.
          </p>
        </section>

        <section>
          <h2>6. Third parties</h2>
          <p>
            We use infrastructure and processing providers (hosting, database, AI model
            provider) strictly to operate the service. These providers process data under
            contract and do not use it for their own purposes.
          </p>
        </section>

        <section>
          <h2>7. Security</h2>
          <p>
            Access tokens and other sensitive credentials are encrypted at rest. Access to
            production data is restricted to authorized personnel operating the service.
          </p>
        </section>

        <section>
          <h2>8. Changes to this policy</h2>
          <p>
            We may update this policy as the service evolves. Material changes will be
            reflected by updating the &quot;Last updated&quot; date above.
          </p>
        </section>

        <section>
          <h2>9. Contact</h2>
          <p>
            Questions about this policy or data requests: contact us at{" "}
            <a className="underline underline-offset-2" href="mailto:avazbekdeveloper11@gmail.com">
              avazbekdeveloper11@gmail.com
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-12 border-t border-border pt-6">
        <Link href="/" className="text-sm text-muted-foreground underline underline-offset-2">
          ← Back to {siteConfig.name}
        </Link>
      </div>
    </main>
  );
}
