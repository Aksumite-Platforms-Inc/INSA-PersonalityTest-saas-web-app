// src/services/branch.service.ts
import apiClient from "./apiClient";
import { getAccessToken } from "@/utils/tokenUtils";
import { ApiResponse } from "@/types/api-response.type";

// Define the shape of a branch
export interface Branch {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
  org_id: number;
  created_at: string;
  updated_at: string;
}

/**
 * Fetches all branches for the logged-in user's organization
 */
export const getAllBranches = async (orgId: number): Promise<Branch[]> => {
  const token = getAccessToken();
  if (!token) {
    console.error("Authorization token is missing. Please log in again.");
    throw new Error("Authorization token is missing.");
  }

  const response = await apiClient.get<ApiResponse<Branch[]>>(
    `/organization/${orgId}/branches`
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch branches.");
  }

  return response.data.data;
};

/**
 * Creates a new branch under the given organization
 * @param orgId - ID of the organization
 * @param name - Name of the new branch
 */
export const createBranch = async (
  orgId: number,
  name: string
): Promise<Branch> => {
  const token = getAccessToken();
  if (!token) {
    console.error("Authorization token is missing. Please log in again.");
    throw new Error("Authorization token is missing.");
  }

  const response = await apiClient.post<ApiResponse<Branch>>(
    `/organization/${orgId}/branches`,
    { name }
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to create branch.");
  }

  return response.data.data;
};

/**
 * Get all branch members for a specific branch
 * @param orgId - Organization ID
 * @param branchId - Branch ID
 */
// export const listOrganizations = async (): Promise<Organization[]> => {
//   const response = await apiClient.get<Organization[]>("/sys/organization");

//   // Just return directly if it's already an array
//   if (!Array.isArray(response.data)) {
//     console.error("Unexpected response format:", response.data);
//     throw new Error("Failed to fetch organizations.");
//   }

//   return response.data;
// };

export const getBranchMembers = async (
  orgId: number,
  branchId: number
): Promise<Branch[]> => {
  const token = getAccessToken();
  if (!token) throw new Error("Authorization token is missing.");

  const response = await apiClient.get<ApiResponse<Branch[]>>(
    `/organization/${orgId}/branchs/${branchId}/members`
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch members.");
  }

  return response.data.data;
};

/**
 * Updates the details of a specific branch
 * @param orgId - Organization ID
 * @param branchId - Branch ID
 * @param data - Updated branch data
 */
export const updateBranch = async (
  orgId: number,
  branchId: number,
  data: {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    address: string;
    // created_at: string;
  }
): Promise<Branch> => {
  const token = getAccessToken();
  if (!token) {
    console.error("Authorization token is missing. Please log in again.");
    throw new Error("Authorization token is missing.");
  }

  const response = await apiClient.put<ApiResponse<Branch>>(
    `/organization/${orgId}/branches/${branchId}`,
    data
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to update branch.");
  }

  return response.data.data;
};

/**
 * Fetches details of a specific branch
 * @param orgId - Organization ID
 * @param branchId - Branch ID
 */
export const getBranchById = async (
  orgId: number,
  branchId: number
): Promise<Branch> => {
  const token = getAccessToken();
  if (!token) {
    console.error("Authorization token is missing. Please log in again.");
    throw new Error("Authorization token is missing.");
  }

  const response = await apiClient.get<ApiResponse<Branch>>(
    `/organization/${orgId}/branches/${branchId}`
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch branch.");
  }

  return response.data.data;
};

/**
 * Deletes a branch by ID
 * @param branchId - Branch ID to delete
 */
export const deleteBranch = async (
  branchId: number
): Promise<{ success: boolean; message?: string }> => {
  const token = getAccessToken();
  if (!token) {
    console.error("Authorization token is missing. Please log in again.");
    throw new Error("Authorization token is missing.");
  }

  const response = await apiClient.delete<ApiResponse<null>>(
    `/organization/branches/${branchId}`
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to delete branch.");
  }

  return { success: true, message: response.data.message };
};

/**
 * Assigns an admin to a specific branch
 * @param orgId - Organization ID
 * @param branchId - Branch ID
 * @param email - Email of the user to promote as admin
 */
export const assignBranchAdmin = async (
  orgId: number,
  branchId: number,
  email: string
): Promise<{ success: boolean; message?: string }> => {
  const token = getAccessToken();
  if (!token) {
    console.error("Authorization token is missing. Please log in again.");
    throw new Error("Authorization token is missing.");
  }

  const response = await apiClient.post<ApiResponse<null>>(
    `/organization/${orgId}/branches/${branchId}/admin`,
    { email }
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to assign branch admin.");
  }

  return { success: true, message: response.data.message };
};
