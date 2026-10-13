import { aiAPI, type AIGenerateRequest } from "@/api/aiApi";
import { useMutation } from "@tanstack/react-query";

export const useAIGenerateDiagram = () => {
  return useMutation({
    mutationFn: (request: AIGenerateRequest) => aiAPI.generateDiagram(request),
    onError: (error: Error) => {
      console.error("AI generation failed:", error);
    },
  });
};
