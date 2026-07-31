import { redirect } from "next/navigation";

// No (marketing) route group yet — out of scope for this milestone (the
// approved page list starts at Login). Root "/" forwards into the app;
// middleware.ts is what will actually decide dashboard vs. login once
// auth lands (FRONTEND_ARCHITECTURE.md §3). Redirecting to /dashboard
// here, not /login, so the shell is reachable to look at right now.
export default function RootPage() {
  redirect("/dashboard");
}
