"use client";

import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/feedback/form-alert";
import { ApiError } from "@/lib/api/errors";

import { useConnectInstagram } from "../hooks/use-connect-instagram";

/**
 * Kicks off the OAuth connect flow — a full-page navigation to Instagram's
 * own authorize screen, not a fetch. There is no way to do this via XHR/
 * fetch since Instagram returns an actual login page, not JSON.
 */
export function ConnectInstagramButton() {
  const mutation = useConnectInstagram();

  function handleClick() {
    mutation.mutate(undefined, {
      onSuccess: (result) => {
        window.location.href = result.authorization_url;
      },
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleClick} disabled={mutation.isPending}>
        {mutation.isPending ? "Redirecting to Instagram…" : "Connect Instagram account"}
      </Button>
      {mutation.isError && (
        <FormAlert variant="error">
          {mutation.error instanceof ApiError
            ? mutation.error.message
            : "Couldn't start the connect flow. Please try again."}
        </FormAlert>
      )}
    </div>
  );
}
