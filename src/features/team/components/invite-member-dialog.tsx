"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { PlusIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

import { buildInviteSchema, type InviteValues } from "../schemas/invite.schema";
import { useRoles } from "../hooks/use-roles";
import { useInviteMember } from "../hooks/use-invite-member";

/**
 * Invite only works for an email that already has a ReplyPilot account —
 * see the backend usecase's doc comment (internal/usecase/team/usecase.go)
 * for why. The 400 it returns for an unknown email is already a clear,
 * actionable sentence, so it's shown as-is rather than re-worded here.
 */
export function InviteMemberDialog() {
  const [open, setOpen] = React.useState(false);
  const rolesQuery = useRoles();
  const inviteMutation = useInviteMember();
  const t = useTranslations("team");
  const tv = useTranslations("validation");

  const inviteSchema = React.useMemo(() => buildInviteSchema(tv), [tv]);

  const form = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "", role_id: "" },
  });

  function onSubmit(values: InviteValues) {
    inviteMutation.mutate(values, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        inviteMutation.reset();
      },
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          form.reset();
          inviteMutation.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="size-4" />
          {t("inviteMember")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("inviteMemberTitle")}</DialogTitle>
          <DialogDescription>{t("inviteMemberDescription")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-email">{t("emailLabel")}</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="teammate@company.com"
              aria-invalid={!!form.formState.errors.email}
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-role">{t("role")}</Label>
            <Select
              value={form.watch("role_id")}
              onValueChange={(value) => form.setValue("role_id", value, { shouldValidate: true })}
            >
              <SelectTrigger id="invite-role" className="w-full">
                <SelectValue placeholder={t("selectRolePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {(rolesQuery.data ?? []).map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.role_id && (
              <p className="text-xs text-destructive">{form.formState.errors.role_id.message}</p>
            )}
          </div>

          {inviteMutation.isError && (
            <FormAlert variant="error">
              {inviteMutation.error instanceof ApiError
                ? inviteMutation.error.message
                : t("genericError")}
            </FormAlert>
          )}

          <DialogFooter>
            <Button type="submit" disabled={inviteMutation.isPending}>
              {inviteMutation.isPending ? t("inviting") : t("sendInvite")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
