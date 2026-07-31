"use client";

import * as React from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormAlert } from "@/components/feedback/form-alert";
import { ApiError } from "@/lib/api/errors";

import { useSuspendOrganization } from "../hooks/use-suspend-organization";
import { useReactivateOrganization } from "../hooks/use-reactivate-organization";
import type { AdminOrganization } from "../types";

/**
 * Suspend/reactivate only touches this app's own login gate — it does
 * NOT cancel or pause the org's Stripe subscription. See the backend's
 * usecase/admin.UseCase.SuspendOrganization doc comment. The confirm
 * dialog says this explicitly so an admin doesn't assume it also stops
 * billing.
 */
export function OrganizationRowActions({ org }: { org: AdminOrganization }) {
  const [suspendOpen, setSuspendOpen] = React.useState(false);
  const [reactivateOpen, setReactivateOpen] = React.useState(false);

  const suspendMutation = useSuspendOrganization();
  const reactivateMutation = useReactivateOrganization();

  const isSuspended = org.organization.status === "suspended";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Organization actions">
            <EllipsisHorizontalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isSuspended ? (
            <DropdownMenuItem
              onSelect={() => {
                reactivateMutation.reset();
                setReactivateOpen(true);
              }}
            >
              Reactivate
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => {
                suspendMutation.reset();
                setSuspendOpen(true);
              }}
            >
              Suspend
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={suspendOpen} onOpenChange={setSuspendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend {org.organization.name}?</DialogTitle>
            <DialogDescription>
              Blocks login for every member of this organization, starting at their
              next login or token refresh. This does not cancel their Stripe
              subscription — handle billing separately if needed.
            </DialogDescription>
          </DialogHeader>

          {suspendMutation.isError && (
            <FormAlert variant="error">
              {suspendMutation.error instanceof ApiError
                ? suspendMutation.error.message
                : "Something went wrong. Please try again."}
            </FormAlert>
          )}

          <DialogFooter>
            <Button
              variant="destructive"
              disabled={suspendMutation.isPending}
              onClick={() =>
                suspendMutation.mutate(org.organization.id, {
                  onSuccess: () => setSuspendOpen(false),
                })
              }
            >
              {suspendMutation.isPending ? "Suspending…" : "Suspend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={reactivateOpen} onOpenChange={setReactivateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reactivate {org.organization.name}?</DialogTitle>
            <DialogDescription>Restores login access for this organization.</DialogDescription>
          </DialogHeader>

          {reactivateMutation.isError && (
            <FormAlert variant="error">
              {reactivateMutation.error instanceof ApiError
                ? reactivateMutation.error.message
                : "Something went wrong. Please try again."}
            </FormAlert>
          )}

          <DialogFooter>
            <Button
              disabled={reactivateMutation.isPending}
              onClick={() =>
                reactivateMutation.mutate(org.organization.id, {
                  onSuccess: () => setReactivateOpen(false),
                })
              }
            >
              {reactivateMutation.isPending ? "Reactivating…" : "Reactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
