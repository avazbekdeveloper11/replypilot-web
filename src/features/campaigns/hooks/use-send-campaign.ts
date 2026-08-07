import { useMutation } from "@tanstack/react-query";

import { sendCampaign } from "../api/campaigns.api";

export function useSendCampaign() {
  return useMutation({
    mutationFn: sendCampaign,
  });
}
