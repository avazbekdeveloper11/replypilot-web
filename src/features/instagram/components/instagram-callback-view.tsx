"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";

import { useCompleteInstagramConnect } from "../hooks/use-complete-instagram-connect";

/**
 * The page Instagram's OAuth screen redirects the browser back to
 * (META_REDIRECT_URL). Reads `code`/`state` off its own URL and calls the
 * BFF once to complete the exchange — the browser never talks to the Go
 * API directly, same BFF boundary as every other feature in this app.
 * Runs the mutation exactly once even under React 18 Strict Mode's
 * double-invoke in development (the ref guard below), since the
 * backend's OAuth state is single-use — a second call with the same
 * `state` would fail with "invalid, expired, or already-used".
 */
export function InstagramCallbackView() {
  const searchParams = useSearchParams();
  const mutation = useCompleteInstagramConnect();
  const attempted = React.useRef(false);

  React.useEffect(() => {
    if (attempted.current) return;

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const oauthError = searchParams.get("error_description") ?? searchParams.get("error");

    if (oauthError) {
      attempted.current = true;
      mutation.reset();
      // Instagram itself denied/cancelled — nothing to exchange.
      return;
    }

    if (!code || !state) return;

    attempted.current = true;
    mutation.mutate({ code, state });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const oauthError = searchParams.get("error_description") ?? searchParams.get("error");

  if (oauthError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <ExclamationTriangleIcon className="size-10 text-destructive" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">Instagram connection cancelled</p>
          <p className="max-w-sm text-sm text-muted-foreground">{oauthError}</p>
          <Button asChild>
            <Link href="/instagram">Back to Instagram accounts</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (mutation.isSuccess) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <CheckCircleIcon className="size-10 text-success" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">
            @{mutation.data.username ?? "Account"} connected
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            ReplyPilot can now read and reply to this account&apos;s DMs.
          </p>
          <Button asChild>
            <Link href="/instagram">Back to Instagram accounts</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (mutation.isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <ExclamationTriangleIcon className="size-10 text-destructive" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">Couldn&apos;t connect Instagram</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {mutation.error instanceof ApiError
              ? mutation.error.message
              : "Something went wrong. Please try again."}
          </p>
          <Button asChild>
            <Link href="/instagram">Back to Instagram accounts</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm text-muted-foreground">Connecting your Instagram account…</p>
      </CardContent>
    </Card>
  );
}
