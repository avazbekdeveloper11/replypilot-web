"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormAlert } from "@/components/feedback/form-alert";
import { ApiError } from "@/lib/api/errors";

import { useRoles } from "../hooks/use-roles";
import { useUpdateMemberRole } from "../hooks/use-update-member-role";
import { useRemoveMember } from "../hooks/use-remove-member";
import type { TeamMember } from "../types";

/** Row-level actions for one team member — change role, remove. Removing
 * yourself is refused server-side (see the backend usecase), so the error
 * from that attempt is just shown as-is rather than pre-empted client-side
 * with a "who am I" lookup this app doesn't have yet. */
export function MemberRowActions({ member }: { member: TeamMember }) {
  const [roleDialogOpen, setRoleDialogOpen] = React.useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false);
  const [selectedRoleId, setSelectedRoleId] = React.useState(member.role.id);
  const t = useTranslations("team");

  const rolesQuery = useRoles();
  const updateRoleMutation = useUpdateMemberRole();
  const removeMutation = useRemoveMember();

  function submitRoleChange() {
    updateRoleMutation.mutate(
      { id: member.id, role_id: selectedRoleId },
      { onSuccess: () => setRoleDialogOpen(false) },
    );
  }

  function submitRemove() {
    removeMutation.mutate(member.id, { onSuccess: () => setRemoveDialogOpen(false) });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={t("memberActions")}>
            <EllipsisHorizontalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => {
              setSelectedRoleId(member.role.id);
              updateRoleMutation.reset();
              setRoleDialogOpen(true);
            }}
          >
            {t("changeRole")}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => {
              removeMutation.reset();
              setRemoveDialogOpen(true);
            }}
          >
            {t("removeFromOrganization")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("changeRole")}</DialogTitle>
            <DialogDescription>{member.user.full_name}</DialogDescription>
          </DialogHeader>

          <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(rolesQuery.data ?? []).map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {updateRoleMutation.isError && (
            <FormAlert variant="error">
              {updateRoleMutation.error instanceof ApiError
                ? updateRoleMutation.error.message
                : t("genericError")}
            </FormAlert>
          )}

          <DialogFooter>
            <Button onClick={submitRoleChange} disabled={updateRoleMutation.isPending}>
              {updateRoleMutation.isPending ? t("saving") : t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("removeMemberTitle", { name: member.user.full_name })}</DialogTitle>
            <DialogDescription>{t("removeMemberDescription")}</DialogDescription>
          </DialogHeader>

          {removeMutation.isError && (
            <FormAlert variant="error">
              {removeMutation.error instanceof ApiError
                ? removeMutation.error.message
                : t("genericError")}
            </FormAlert>
          )}

          <DialogFooter>
            <Button
              variant="destructive"
              onClick={submitRemove}
              disabled={removeMutation.isPending}
            >
              {removeMutation.isPending ? t("removing") : t("remove")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
