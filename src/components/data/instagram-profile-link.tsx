import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

import { cn } from "@/lib/utils";

/**
 * Renders a customer's Instagram username, clickable through to their
 * profile (instagram.com/{username}) in a new tab. Falls back to
 * `fallback` (e.g. a translated "Unknown customer" string) when no
 * username is on record — see backend/internal/usecase/instagram's
 * WebhookUseCase: username is best-effort, resolved via the Graph API
 * after the fact, not something every webhook delivery is guaranteed to
 * carry.
 *
 * stopPropagation matters here specifically in conversation-list.tsx,
 * where this renders inside a row whose own click handler navigates to
 * the conversation detail page — without it, clicking the username would
 * both open Instagram AND navigate the row.
 */
export function InstagramProfileLink({
  username,
  fallback,
  className,
}: {
  username: string | null | undefined;
  fallback: string;
  className?: string;
}) {
  if (!username) {
    return <span className={cn("text-foreground", className)}>{fallback}</span>;
  }

  return (
    <a
      href={`https://instagram.com/${encodeURIComponent(username)}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "inline-flex items-center gap-1 text-foreground hover:text-brand hover:underline",
        className,
      )}
    >
      {username}
      <ArrowTopRightOnSquareIcon className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
    </a>
  );
}
