import { useMutation, useQueryClient } from "@tanstack/react-query";

import { setGeminiSettings } from "../api/admin.api";
import { adminGeminiSettingsQueryKey } from "./use-gemini-settings";

export function useSetGeminiSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setGeminiSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminGeminiSettingsQueryKey });
    },
  });
}
