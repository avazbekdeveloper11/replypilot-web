"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormAlert } from "@/components/feedback/form-alert";
import { ApiError } from "@/lib/api/errors";

import { useSendMessage } from "../hooks/use-send-message";

/**
 * Only rendered by ConversationDetailView while status is human_active —
 * see conversation.UseCase.SendMessage's doc comment on why the backend
 * itself also enforces that, not just this component's visibility.
 */
export function MessageComposer({ conversationId }: { conversationId: string }) {
  const [text, setText] = React.useState("");
  const sendMutation = useSendMessage(conversationId);
  const t = useTranslations("conversations");

  const trimmed = text.trim();

  const handleSend = () => {
    if (!trimmed || sendMutation.isPending) return;
    sendMutation.mutate(trimmed, {
      onSuccess: () => setText(""),
    });
  };

  return (
    <div className="border-t border-border p-3">
      {sendMutation.isError && (
        <div className="pb-2">
          <FormAlert variant="error">
            {sendMutation.error instanceof ApiError ? sendMutation.error.message : t("genericError")}
          </FormAlert>
        </div>
      )}
      <div className="flex items-end gap-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            // Enter sends, Shift+Enter inserts a newline — standard chat
            // composer convention, matches what everyone typing this
            // already expects from Instagram/WhatsApp/Slack etc.
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={t("writeAReply")}
          disabled={sendMutation.isPending}
          className="min-h-0 flex-1 resize-none py-2"
          rows={1}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!trimmed || sendMutation.isPending}
          aria-label={t("send")}
        >
          <PaperAirplaneIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
