// services/branchService.ts
import api from "./api";
import { APIResponse } from "@/types/api";
import { handleApiError } from "@/lib/errorHandler";

export const createBranch = async (
  orgId: number,
  name: string
): Promise<APIResponse<any>> => {
  try {
    const response = await api.post(`/organization/${orgId}/branches`, {
      name,
    });
    return { data: response.data, error: null, success: true };
  } catch (error: any) {
    return handleApiError(error);
  }
};

// Updated error handling to ensure compatibility with APIResponse<any[]>
export const getAllBranches = async (): Promise<APIResponse<any[]>> => {
  try {
    const response = await api.get<any[]>("/organization/branches");
    return { data: response.data, error: null, success: true };
  } catch (error: any) {
    return {
      data: [],
      error: error.response?.data?.message || "An unexpected error occurred",
      success: false,
    };
  }
};
