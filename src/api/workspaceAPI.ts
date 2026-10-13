import type { Collaborator, User } from "@/lib/types";
import { api } from "./auth";

export interface Workspace {
  id: number;
  workspaceName: string;
  workspaceDescription: string;
  createdBy: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkspaceRequest {
  workspaceName: string;
  workspaceDescription: string;
}

export const workspaceAPI = {
  getAll: async (): Promise<Workspace[]> => {
    const response = await api.get("/api/v1/dashboard/ws");
    return response.data;
  },

  create: async (data: WorkspaceRequest): Promise<Workspace> => {
    // console.log("Sending workspace data:", data);
    const response = await api.post("/api/v1/dashboard/ws", data);
    // console.log("Response:", response);
    // console.log("Response data:", response.data);
    return response.data;
  },

  getById: async (id: number): Promise<Workspace> => {
    const response = await api.get(`/api/v1/dashboard/ws/${id}`);
    return response.data;
  },

  update: async (id: number, data: WorkspaceRequest): Promise<Workspace> => {
    const response = await api.put(`/api/v1/dashboard/ws/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/v1/dashboard/ws/${id}`);
  },

  getAllUsers: async (): Promise<User[]> => {
    const res = await api.get("/api/v1/dashboard/users");
    return res.data;
  },

  getCollaborators: async (workspaceId: number): Promise<Collaborator[]> => {
    const res = await api.get(
      `/api/v1/dashboard/ws/${workspaceId}/collaborators`
    );
    return res.data;
  },

  addCollaborator: async ({
    workspaceId,
    userId,
  }: {
    workspaceId: number;
    userId: number;
  }): Promise<void> => {
    await api.post(
      `/api/v1/dashboard/ws/${workspaceId}/collaborators?userId=${userId}`
    );
  },
};
