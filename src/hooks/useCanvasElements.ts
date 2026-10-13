import { useQuery } from "@tanstack/react-query";
import { canvasAPI } from "@/api/canvasAPI";

export const useCanvasElements = (workspaceId: number) =>
  useQuery({
    queryKey: ["canvasElements", workspaceId],
    queryFn: () => canvasAPI.getAll(workspaceId),
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000,
  });
