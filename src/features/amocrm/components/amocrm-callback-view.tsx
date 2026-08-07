"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";

import { useCompleteAmoCRMConnect } from "../hooks/use-complete-amocrm-connect";

/**
 * The page amoCRM's OAuth screen redirects the browser back to
 * (AMOCRM_REDIRECT_URL). Reads `code`/`state`/`referer` off its own URL
 * and calls the BFF once to complete the exchange — same pattern as
 * InstagramCallbackView, including the ref guard against React 18
 * Strict Mode's double-invoke (the backend's OAuth state is single-use).
 * `referer` is amoCRM-specific — it's the ONLY place the connected
 * account's subdomain is available (see backend
 * amocrm.OAuthUseCase.Complete's doc comment); Instagram's callback has
 * no equivalent param since Meta has a single global API host.
 */
export function AmoCRMCallbackView() {
  const searchParams = useSearchParams();
  const mutation = useCompleteAmoCRMConnect();
  const attempted = React.useRef(false);
  const t = useTranslations("amocrm");

  React.useEffect(() => {
    if (attempted.current) return;

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const referer = searchParams.get("referer");
    const oauthError = searchParams.get("error");

    if (oauthError) {
      attempted.current = true;
      mutation.reset();
      // amoCRM itself denied/cancelled — nothing to exchange.
      return;
    }

    if (!code || !state || !referer) return;

    attempted.current = true;
    mutation.mutate({ code, state, referer });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const oauthError = searchParams.get("error");

  if (oauthError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <ExclamationTriangleIcon className="size-10 text-destructive" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">{t("connectionCancelled")}</p>
          <Button asChild>
            <Link href="/settings">{t("backToSettings")}</Link>
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
            {t("connected", { subdomain: mutation.data.subdomain })}
          </p>
          <Button asChild>
            <Link href="/settings">{t("backToSettings")}</Link>
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
          <p className="text-sm font-medium text-foreground">{t("couldntConnect")}</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {mutation.error instanceof ApiError ? mutation.error.message : t("genericError")}
          </p>
          <Button asChild>
            <Link href="/settings">{t("backToSettings")}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm text-muted-foreground">{t("connecting")}</p>
      </CardContent>
    </Card>
  );
}
