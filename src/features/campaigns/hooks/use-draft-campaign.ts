import { useMutation } from "@tanstack/react-query";

import { draftCampaign } from "../api/campaigns.api";

/** No query key / cache — a draft is a one-off preview, not data that
 * gets refetched or invalidated (see campaign.UseCase's doc comment on
 * why Draft/Send are stateless). */
export function useDraftCampaign() {
  return useMutation({
    mutationFn: draftCampaign,
  });
}
