import { api } from "./auth";

export interface CanvasElement {
  id: string;
  workspace: { id: number };
  type: string;
  data: string;
  createdBy: { id: number };
  createdAt?: string;
  updatedAt?: string;
}

export const canvasAPI = {
  getAll: async (workspaceId: number): Promise<CanvasElement[]> => {
    const res = await api.get(
      `/api/v1/dashboard/workspaces/${workspaceId}/canvas`
    );
    return res.data;
  },
};
