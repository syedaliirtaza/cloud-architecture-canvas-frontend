import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceAPI, type WorkspaceRequest } from "@/api/workspaceAPI";

export const useWorkspaces = () =>
  useQuery({
    queryKey: ["workspaces"],
    queryFn: workspaceAPI.getAll,
    staleTime: 5 * 60 * 1000,
  });

export const useWorkspace = (id: number) =>
  useQuery({
    queryKey: ["workspace", id],
    queryFn: () => workspaceAPI.getById(id),
    enabled: !!id,
  });

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: workspaceAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: WorkspaceRequest }) =>
      workspaceAPI.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.id] });
    },
  });
};

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => workspaceAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};
