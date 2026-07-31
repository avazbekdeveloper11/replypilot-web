"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/feedback/error-state";

import { useMe } from "../hooks/use-me";
import { ProfileForm } from "./profile-form";
import { ChangePasswordForm } from "./change-password-form";

export function ProfileView() {
  const { data: user, isPending, isError, error, refetch } = useMe();

  if (isPending) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Loading profile…
        </CardContent>
      </Card>
    );
  }

  if (isError || !user) {
    return (
      <Card>
        <CardContent className="p-0">
          <ErrorState
            className="py-16"
            title="Couldn't load your profile"
            description={error instanceof Error ? error.message : undefined}
            onRetry={() => refetch()}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
