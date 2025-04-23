import api from "./api";
import { APIResponse } from "@/types/api";
import { handleApiError } from "@/lib/errorHandler";

export const createOrganization = async (
  name: string,
  adminId: number
): Promise<APIResponse<any>> => {
  try {
    const response = await api.post("/sys/organization", { name, adminId });
    return { data: response.data, error: null, success: true };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const getOrganizations = async (): Promise<APIResponse<any[]>> => {
  try {
    const response = await api.get<any[]>("/sys/organization");
    return { data: response.data, error: null, success: true };
  } catch (error: any) {
    return {
      data: [],
      error: error.response?.data?.message || "An unexpected error occurred",
      success: false,
    };
  }
};

export const deleteOrganization = async (
  orgId: number
): Promise<APIResponse<null>> => {
  try {
    await api.delete(`/sys/organization/${orgId}`);
    return { data: null, error: null, success: true };
  } catch (error: any) {
    return handleApiError(error);
  }
};
