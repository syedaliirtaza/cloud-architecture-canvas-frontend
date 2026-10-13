import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceAPI } from "@/api/workspaceAPI";

export const useAllUsers = () =>
  useQuery({
    queryKey: ["allUsers"],
    queryFn: workspaceAPI.getAllUsers,
    staleTime: 5 * 60 * 1000,
  });

export const useCollaborators = (workspaceId: number) =>
  useQuery({
    queryKey: ["collaborators", workspaceId],
    queryFn: () => workspaceAPI.getCollaborators(workspaceId),
    enabled: !!workspaceId,
  });

export const useAddCollaborator = (workspaceId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) =>
      workspaceAPI.addCollaborator({ workspaceId, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collaborators", workspaceId],
      });
    },
  });
};
