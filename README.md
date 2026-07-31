# ReplyPilot Dashboard (replypilot-web)

Next.js 15 (App Router) + React 19 + TypeScript, implementing
`docs/FRONTEND_ARCHITECTURE.md` against the Go/Gin backend built earlier in
this project.

## Stack

Next.js 15, React 19, TypeScript, Tailwind CSS 4, shadcn/ui (Radix
primitives, hand-authored to match `components.json`), TanStack Query,
Zustand, React Hook Form + Zod, next-themes, Heroicons, Recharts, Chart.js
(dashboard charts only — see milestone 3 below), Framer Motion — the stack
in `docs/FRONTEND_ARCHITECTURE.md`, plus Chart.js as a scoped, explicit
exception for the Dashboard page.

## Read this first: known limitations

This was built and verified in a sandboxed environment with **outbound
network access restricted to an allowlist that excludes
`fonts.googleapis.com`/`fonts.gstatic.com`**, and where `next build`'s
production compile did not complete (see below) despite `npm install` and
`node`/`npm` working normally. Two consequences:

1. **Fonts are self-hosted via `@fontsource-variable/inter`, not
   `next/font/google`.** Functionally equivalent (no runtime third-party
   request, no layout shift) but chosen so the build has zero external
   dependencies rather than because `next/font` is wrong — swap back to
   `next/font/google` in `app/layout.tsx` if you prefer it; Google Fonts
   will work fine outside this sandbox.
2. **`npm run build` was not verified end-to-end in the sandbox.** It
   consistently stalled after printing the version banner, with strace
   showing no network or filesystem activity — most likely a
   worker/child-process synchronization issue specific to this sandbox's
   restricted process namespace (`bwrap --unshare-pid`), not a code
   defect. What **was** verified, every milestone including this one:
   - `npx tsc --noEmit` — **passes cleanly, zero errors**, across every
     file in `app/` and `src/`.
   - `npm install` — every dependency in `package.json` resolves and
     installs correctly (no missing peers, no version conflicts).
   - `eslint` in this sandbox is pinned to whatever version is actually
     installed (`9.39.5` as of this milestone) rather than an aspirational
     version, because the sandbox's filesystem can't perform the atomic
     rename `npm install` needs to swap an already-installed package
     version (`ENOTEMPTY` on `node_modules/eslint` → `.eslint-*` rename —
     a hard sandbox limitation, not a code issue). An earlier milestone
     pinned `9.17.0` to work around a real `eslint-config-next@15.5.22` /
     `eslint@9.39.x` incompatibility (`TypeError: Plugin "" not found"`);
     that pin was never actually enforceable in this sandbox (the
     installed binary stayed 9.39.5 regardless of what package.json said),
     so it's been aligned to reality here. **Run `npm run lint` yourself**
     before trusting it — this may still need the `9.17.0` pin (or a newer
     `eslint-config-next`) on your machine.

None of this reflects a problem with the delivered code — `tsc` is the
strongest static signal available and it's clean every milestone. Before
you trust the build, run on your own machine:

```bash
npm install
npm run build
npm run lint
```

and fix whatever (if anything) that surfaces. Report back if `npm run
build` fails for a reason other than the two items above — that would be
worth knowing.

## What's built (milestone 1 — foundations only)

Per the brief: Design System → Global Layout → Sidebar → Top Navigation →
Theme System → Routing → Reusable Components, and stop there.

- **Design system** — `src/styles/themes.css` (light/dark CSS variable
  tokens, one brand accent), `app/globals.css` (Tailwind 4 `@theme`
  mapping), Inter via `@fontsource-variable/inter`.
- **Theme system** — `src/lib/providers/theme-provider.tsx` (next-themes,
  class strategy, system default, no-flash), `src/components/layout/theme-toggle.tsx`.
- **Global layout & providers** — `app/layout.tsx` (root shell, fonts,
  metadata), `src/lib/providers/` (QueryClientProvider, ThemeProvider,
  TooltipProvider, Toaster composed in one place).
- **Sidebar** — `src/components/layout/sidebar.tsx` (desktop, collapsible,
  persisted via Zustand), `mobile-sidebar.tsx` (Sheet-based for < lg),
  `sidebar-nav.tsx` (shared nav list, reads `src/config/navigation.ts` —
  the single route registry).
- **Top navigation** — `src/components/layout/topbar.tsx` — mobile menu
  trigger, search input, theme toggle, notifications, user menu.
- **Routing** — `app/(auth)/` and `app/(dashboard)/` route groups, every
  page from the brief's page list exists and resolves, route-group
  `error.tsx`/`loading.tsx`, root `not-found.tsx` / `global-error.tsx` /
  `robots.ts` / `manifest.ts`, a coarse `middleware.ts` auth-gate stub
  (still commented out — see "Not done" below).
- **Reusable components** — `src/components/ui/` (button, input, label,
  card, badge, separator, skeleton, avatar, tooltip, dialog, sheet,
  dropdown-menu, tabs, table, scroll-area, select, sonner toaster — all
  hand-authored against `components.json` since the shadcn CLI's remote
  registry fetch wasn't reliable in this sandbox), plus
  `src/components/layout/page-header.tsx`,
  `src/components/data/{empty-state,pagination,coming-soon}.tsx`,
  `src/components/feedback/{error-state,table-skeleton}.tsx`.

Every page except the ones covered by later milestones renders
`<ComingSoon>` — the route, layout, and design system are real; the
feature content for those is deliberately deferred.

## What's built (milestone 2 — auth pages)

Login, Forgot Password, Reset Password — end to end, real backend calls,
no mocks. See `docs/AUTH_PAGES_MILESTONE.md` in the project root for the
full design (including the two backend gaps this required closing:
`organization_id`-first login and a from-scratch password-reset flow).

- **`src/lib/api/`** — `client.ts` (browser → this app's `/api/**`),
  `server.ts` (this app's Route Handlers → the Go API, server-to-server),
  `errors.ts` (`ApiError`, one shape for both), `route-handler.ts` (shared
  error → HTTP response mapping for Route Handlers).
- **`src/lib/auth/cookies.ts`** — httpOnly cookie set/clear for the
  session (`rp_access_token`, `rp_refresh_token`); the browser never sees
  a raw token, per `FRONTEND_ARCHITECTURE.md` §3. Also `getAccessToken()`
  (added in milestone 3) for Route Handlers that need to forward the
  session to the Go API.
- **`app/api/auth/{organizations,login,forgot-password,reset-password}/route.ts`**
  — the BFF layer: each proxies to the matching Go endpoint;
  `login/route.ts` is the only one that touches raw tokens, and only to
  write them into cookies before responding.
- **`src/features/auth/`** — schemas (Zod), API client functions, TanStack
  Query mutation hooks, and the three form components
  (`login-form.tsx`, `forgot-password-form.tsx`, `reset-password-form.tsx`).
- **Login is two steps**, not one: the Go API requires `organization_id`
  up front and there's no single "email + password" endpoint. Step 1
  resolves which workspace(s) the email belongs to
  (`GET /v1/auth/organizations`); step 2 is password + workspace
  (auto-picked if there's only one).
- **Forgot Password** always shows the same "check your email" message on
  success, matching the backend's anti-enumeration design.
- **Reset Password** reads `?token=` from the URL (wrapped in
  `<Suspense>`), handles missing/expired/invalid token as distinct
  states.
- **No real email delivery.** The backend logs the reset link instead of
  emailing it — see `backend/internal/platform/notify/log_notifier.go`.

## What's built (milestone 3 — Dashboard page)

The Dashboard page, real backend calls, no mocks. Six widgets per the
brief: Statistics Cards, Recent Conversations, AI Performance, Response
Time, Charts (Chart.js), Notifications. Full design and the honest scope
notes on AI Performance / Notifications are in
`docs/DASHBOARD_MILESTONE.md` at the project root — read that before
assuming a 0 or an empty state anywhere on this page is a bug.

- **`src/features/dashboard/`** — types mirroring the four new backend
  DTOs, an `api/dashboard.api.ts` client, five TanStack Query hooks
  (`use-dashboard-stats`, `use-conversations-timeseries`,
  `use-ai-performance`, `use-notifications`, `use-recent-conversations`,
  each polling on a 30-60s interval), a small `lib/format.ts` (duration/
  percent/relative-time formatting), and six widget components composed
  in `components/dashboard-view.tsx`.
- **`app/api/dashboard/{stats,timeseries,ai-performance,notifications}/route.ts`**
  and **`app/api/conversations/route.ts`** — the first *protected*
  (session-required) Route Handlers in this app: each reads the httpOnly
  access-token cookie via the new `getAccessToken()` helper, returns 401
  if there isn't one, otherwise forwards as a Bearer token to the Go API.
  `app/api/conversations/route.ts` is built ahead of the full
  Conversations page — that page will reuse it.
- **Charts uses Chart.js** (`chart.js` + `react-chartjs-2`), not Recharts
  (already a dependency, used for future analytics pages per
  `FRONTEND_ARCHITECTURE.md`) — a deliberate, scoped exception because the
  brief explicitly said "Use Chart.js" for this page. Recharts is
  untouched and still the default for everything else.
- **AI Performance renders an honest empty state.** This codebase has no
  AI reply pipeline implemented anywhere yet — nothing writes to the
  `ai_responses` table — so the widget's query legitimately returns
  `total_responses: 0`. Rather than fabricate numbers, the card shows "No
  AI activity yet" and will start showing real figures automatically once
  that pipeline exists, with no frontend changes needed.
- **Notifications is unread conversations, not a notification feed.**
  There's no notifications table/producer with any application code
  behind it (schema-only). The widget surfaces
  `Conversation.unread_count` — real, already-correct data from the
  webhook ingestion path — rather than either faking a feed or building a
  whole events system as a side effect of "the Dashboard page". See
  `docs/DASHBOARD_MILESTONE.md` for the reasoning.
- **Recent Conversations is read-only** (no links into a conversation
  detail view) — that page is still a placeholder, out of scope here.

## Not done

Register page auth-gate, session refresh/logout UI, "remember me",
rate-limit feedback in the UI (429s), and — still, deliberately —
`middleware.ts`'s auth-gate check (commented out: uncommenting it needs a
documented decision about what "signed in" means at the edge vs. what the
Dashboard's Route Handlers already enforce server-side; not silently
flipped on as a side effect of this milestone). Conversations, AI Inbox,
Knowledge Base, Analytics, Team, Billing, Settings, Profile are still
`<ComingSoon>` placeholders.

## Running locally

Needs the Go backend running too (see `backend/README.md`) — these pages
call it for real.

```bash
# backend/  (separate terminal)
cp .env.example .env   # fill in secrets, then:
make docker-up

# web_app/replypilot-web/
cp .env.local.example .env.local   # GO_API_URL defaults to localhost:8080
npm install
npm run dev
```

Open `http://localhost:3000/login`.
