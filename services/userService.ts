// services/userService.ts
import api from "./api";
import { APIResponse } from "@/types/api";
import { handleApiError } from "@/lib/errorHandler";

// Updated error handling to ensure compatibility with APIResponse<any[]>
export const getAllOrgMembers = async (
  orgId: number
): Promise<APIResponse<any[]>> => {
  try {
    const response = await api.get<any[]>(`/organization/${orgId}/members`);
    return { data: response.data, error: null, success: true };
  } catch (error: any) {
    return {
      data: [],
      error: error.response?.data?.message || "An unexpected error occurred",
      success: false,
    };
  }
};

export const deleteOrgMember = async (
  orgId: number,
  memberId: number
): Promise<APIResponse<null>> => {
  try {
    await api.delete(`/organization/${orgId}/members/${memberId}`);
    return { data: null, error: null, success: true };
  } catch (error: any) {
    return handleApiError(error);
  }
};
