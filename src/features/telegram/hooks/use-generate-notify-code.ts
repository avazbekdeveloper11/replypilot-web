import { useMutation } from "@tanstack/react-query";
import { generateTelegramNotifyCode } from "../api/telegram.api";

/** Does not invalidate telegramAccountsQueryKey — generating a code doesn't
 * change anything on TelegramAccount itself (NotifyVerifyCode isn't part of
 * the response shape at all, see TelegramAccount's doc comment), only the
 * webhook's later handlePlainMessage match does, which is why
 * use-telegram-accounts.ts keeps polling separately once a code is shown
 * (see TelegramIntegrationCard's NotifyCodePanel). */
export function useGenerateNotifyCode() {
  return useMutation({ mutationFn: generateTelegramNotifyCode });
}
