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

/** Keys into the "conversations" namespace — the label shown for a
 * media message when there's no attachment_url to actually render (see
 * Message.attachment_url's doc comment on when that happens). */
const MEDIA_PLACEHOLDER_KEY: Record<string, string> = {
  image: "imagePlaceholder",
  video: "videoPlaceholder",
  audio: "voiceMessagePlaceholder",
  file: "filePlaceholder",
};

function MessageAttachment({ message }: { message: Message }) {
  const t = useTranslations("conversations");
  const { message_type, attachment_url, content } = message;

  if (!attachment_url) {
    const key = MEDIA_PLACEHOLDER_KEY[message_type];
    return key ? <span className="italic opacity-70">{t(key)}</span> : null;
  }

  switch (message_type) {
    case "image":
      // eslint-disable-next-line @next/next/no-img-element -- remote,
      // per-org attachment URLs; not something next/image's static
      // optimization pipeline is set up for here.
      return <img src={attachment_url} alt={content ?? ""} className="max-h-64 max-w-full rounded-lg object-contain" />;
    case "video":
      return <video controls src={attachment_url} className="max-h-64 max-w-full rounded-lg" />;
    case "audio":
      return <audio controls src={attachment_url} className="max-w-full" />;
    case "file":
      return (
        <a href={attachment_url} target="_blank" rel="noreferrer" className="underline">
          {t("openAttachment")}
        </a>
      );
    default:
      return null;
  }
}

export function MessageBubble({ message }: { message: Message }) {
  const isInbound = message.direction === "inbound";
  const t = useTranslations("conversations");
  const locale = useLocale() as Locale;

  const hasAttachment = message.message_type !== "text" && message.message_type !== "unsupported";

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
        {hasAttachment || message.content ? (
          <div className="flex flex-col gap-2">
            {hasAttachment && <MessageAttachment message={message} />}
            {message.content && <span>{message.content}</span>}
          </div>
        ) : (
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
