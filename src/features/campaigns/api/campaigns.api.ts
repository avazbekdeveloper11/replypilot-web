import { apiFetch } from "@/lib/api/client";
import type { CampaignDraft, CampaignSendResult } from "../types";

export function draftCampaign(instruction: string) {
  return apiFetch<CampaignDraft>("/api/campaigns/draft", {
    method: "POST",
    body: JSON.stringify({ instruction }),
  });
}

export interface SendCampaignInput {
  message: string;
  conversation_ids: string[];
}

export function sendCampaign(input: SendCampaignInput) {
  return apiFetch<CampaignSendResult>("/api/campaigns/send", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
