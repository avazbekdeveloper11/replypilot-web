"use client";

import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { intlLocale, type Locale } from "@/i18n/config";

import { formatMessageTime } from "../lib/format";
import type { Message } from "../types";

/** Keys into the "conversations" namespace's senderLabel.* subtree. */
const SENDER_LABEL_KEY: Record<string, string> = {
  ai: "senderAi",
  human: "senderTeam",
  system: "senderSystem",
};

export function MessageBubble({ message }: { message: Message }) {
  const isInbound = message.direction === "inbound";
  const t = useTranslations("conversations");
  const locale = useLocale() as Locale;

  return (
    <div className={cn("flex flex-col gap-1", isInbound ? "items-start" : "items-end")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
          isInbound
            ? "bg-secondary text-secondary-foreground"
            : "bg-brand text-brand-foreground",
        )}
      >
        {message.content ?? (
          <span className="italic opacity-70">{t("unsupportedMessageContent")}</span>
        )}
      </div>
      <div className="flex items-center gap-1.5 px-1 text-[11px] text-muted-foreground">
        {!isInbound && message.sender_type !== "customer" && (
          <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
            {SENDER_LABEL_KEY[message.sender_type] ? t(SENDER_LABEL_KEY[message.sender_type]) : message.sender_type}
          </Badge>
        )}
        <span>{formatMessageTime(message.created_at, intlLocale(locale))}</span>
      </div>
    </div>
  );
}
