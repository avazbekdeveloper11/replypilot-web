"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("instagram");

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
          {t("disconnect")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("disconnectTitle", { username: account.username ?? account.id })}
          </DialogTitle>
          <DialogDescription>{t("disconnectDescription")}</DialogDescription>
        </DialogHeader>

        {mutation.isError && (
          <FormAlert variant="error">
            {mutation.error instanceof ApiError ? mutation.error.message : t("genericError")}
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
            {mutation.isPending ? t("disconnecting") : t("disconnect")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
