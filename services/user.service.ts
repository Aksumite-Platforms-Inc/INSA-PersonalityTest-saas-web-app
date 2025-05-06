// src/services/user.service.ts
import apiClient from "./apiClient";
import { getAccessToken } from "@/utils/tokenUtils";
import { ApiResponse } from "@/types/api-response.type";

// Define the shape of a user returned by the API
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  department: string;
  position: string;
  org_id: number;
  branch_id: number;
  created_at: string;
  activation_code?: string;
}

/**
 * Fetches all members of an organization
 * @param orgId - ID of the organization
 */
export const getAllOrgMembers = async (orgId: number): Promise<User[]> => {
  const token = getAccessToken();
  if (!token) throw new Error("Authorization token is missing.");

  const response = await apiClient.get<ApiResponse<User[]>>(
    `/organization/${orgId}/members`
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch members.");
  }

  return response.data.data;
};

/**
 * Fetches all members of a branch in an organization
 * @param orgId - ID of the organization
 * @param branchId - ID of the branch
 */
export const getAllBranchMembers = async (
  orgId: number,
  branchId: number
): Promise<User[]> => {
  const token = getAccessToken();
  if (!token) throw new Error("Authorization token is missing.");

  const response = await apiClient.get<ApiResponse<User[]>>(
    `/organization/${orgId}/branchs/${branchId}/members`
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch branch members.");
  }

  return response.data.data;
};

/**
 * Deletes a member from an organization
 * @param orgId - ID of the organization
 * @param memberId - ID of the user/member
 */
export const deleteOrgMember = async (
  orgId: number,
  memberId: number
): Promise<{ success: boolean; message?: string }> => {
  const token = getAccessToken();
  if (!token) throw new Error("Authorization token is missing.");

  const response = await apiClient.delete<ApiResponse<null>>(
    `/organization/${orgId}/members/${memberId}`
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to delete member.");
  }

  return { success: true, message: response.data.message };
};
