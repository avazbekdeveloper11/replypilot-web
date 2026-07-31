import { useQuery } from "@tanstack/react-query";

import { getGeminiSettings } from "../api/admin.api";

export const adminGeminiSettingsQueryKey = ["admin", "settings", "gemini"] as const;

export function useGeminiSettings() {
  return useQuery({
    queryKey: adminGeminiSettingsQueryKey,
    queryFn: getGeminiSettings,
  });
}
