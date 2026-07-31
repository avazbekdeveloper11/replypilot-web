"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useInstagramAccounts } from "../hooks/use-instagram-accounts";
import { ConnectedAccountsList } from "./connected-accounts-list";
import { ConnectInstagramButton } from "./connect-instagram-button";

export function InstagramAccountsView() {
  const { data } = useInstagramAccounts();
  const hasAccounts = !!data && data.length > 0;

  return (
    <div className="flex flex-col gap-6">
      {hasAccounts && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Connect another account</CardTitle>
          </CardHeader>
          <CardContent>
            <ConnectInstagramButton />
          </CardContent>
        </Card>
      )}

      <ConnectedAccountsList />
    </div>
  );
}
