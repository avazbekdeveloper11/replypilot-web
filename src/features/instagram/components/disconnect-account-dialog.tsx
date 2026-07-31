"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormAlert } from "@/components/feedback/form-alert";
import { ApiError } from "@/lib/api/errors";

import { useDisconnectInstagramAccount } from "../hooks/use-disconnect-instagram-account";
import type { InstagramAccount } from "../types";

export function DisconnectAccountDialog({ account }: { account: InstagramAccount }) {
  const [open, setOpen] = React.useState(false);
  const mutation = useDisconnectInstagramAccount();

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) mutation.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Disconnect
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disconnect @{account.username ?? account.id}?</DialogTitle>
          <DialogDescription>
            ReplyPilot stops replying to this account&apos;s DMs immediately. This only
            removes ReplyPilot&apos;s stored access — to fully revoke it, also remove
            ReplyPilot from Instagram&apos;s own &quot;Apps and websites&quot; settings.
          </DialogDescription>
        </DialogHeader>

        {mutation.isError && (
          <FormAlert variant="error">
            {mutation.error instanceof ApiError
              ? mutation.error.message
              : "Something went wrong. Please try again."}
          </FormAlert>
        )}

        <DialogFooter>
          <Button
            variant="destructive"
            disabled={mutation.isPending}
            onClick={() =>
              mutation.mutate(account.id, { onSuccess: () => setOpen(false) })
            }
          >
            {mutation.isPending ? "Disconnecting…" : "Disconnect"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
