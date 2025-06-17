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
 * Fetches the current user's information
 * @returns User object containing user details
 */
export const fetchUserInfo = async (user_id: number): Promise<User> => {
  const token = getAccessToken();
  if (!token) throw new Error("Authorization token is missing.");

  const response = await apiClient.get<ApiResponse<User>>(
    `/organization/members/${user_id}/me`
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch user info.");
  }

  return response.data.data;
};
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
    `/organization/${orgId}/branches/${branchId}/members`
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

export const updateProfile = async (
  userId: number,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    position?: string;
    department?: string;
    status?: string;
  }
): Promise<User> => {
  const token = getAccessToken();
  if (!token) throw new Error("Authorization token is missing.");

  const response = await apiClient.put<ApiResponse<User>>(
    `/organization/members/${userId}/update`,
    data
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to update user.");
  }

  return response.data.data;
};

export const updateMember = async (
  memberId: number,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    position?: string;
    department?: string;
  }
): Promise<User> => {
  const token = getAccessToken();
  if (!token) throw new Error("Authorization token is missing.");

  const response = await apiClient.put<ApiResponse<User>>(
    `/organization/members/${memberId}/update`,
    data
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to update member.");
  }

  return response.data.data;
};

export const addUser = async (data: {
  name: string;
  email: string;
  phone_number: string;
  position: string;
  department: string;
}): Promise<User> => {
  const token = getAccessToken();
  if (!token) throw new Error("Authorization token is missing.");

  const response = await apiClient.post<ApiResponse<User>>(
    `/organization/members`,
    data
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to add user.");
  }

  return response.data.data;
};
export const bulkAddUsers = async (
  data: {
    name: string;
    email: string;
    phone_number: string;
    position: string;
    department: string;
  }[]
): Promise<User[]> => {
  const token = getAccessToken();
  if (!token) throw new Error("Authorization token is missing.");

  const response = await apiClient.post<ApiResponse<User[]>>(
    `/organization/addbulkmembers`,
    { users: data } // Adjusted to match the expected API structure
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to bulk add users.");
  }

  return response.data.data;
};
export const updateEmployeeStatus = async (
  memberId: number,
  status: string
): Promise<{ success: boolean; message?: string }> => {
  const token = getAccessToken();
  if (!token) throw new Error("Authorization token is missing.");

  const response = await apiClient.patch<ApiResponse<null>>(
    `/organization/members/${memberId}/status`,
    { status }
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Failed to update employee status."
    );
  }

  return { success: true, message: response.data.message };
};

export const activateAccount = async (
  email: string,
  code: string,
  password: string
) => {
  const response = await apiClient.post<ApiResponse<User>>(
    "/organization/members/activate",
    { email, activation_code: code, new_password: password },
    { withCredentials: true }
  );

  if (!response.data?.success) {
    console.error("Activate Account Error:", response.data);
    throw new Error(response.data?.message || "Failed to activate account.");
  }

  return response.data.data;
};
export const resetPassword = async (
  email: string,
  code: string,
  password: string
) => {
  try {
    const response = await apiClient.post(
      "/organization/members/validateresetpassword",
      { email, reset_code: code, new_password: password },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};
/**
 * Activates an organization
 * @param orgId - ID of the organization
 */
export const activateOrganization = async (
  orgId: number
): Promise<{ success: boolean; message?: string }> => {
  const token = getAccessToken();
  if (!token) throw new Error("Authorization token is missing.");

  const response = await apiClient.post<ApiResponse<null>>(
    `/sys/organization/${orgId}/activate`
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Failed to activate organization."
    );
  }

  return { success: true, message: response.data.message };
};

/**
 * Deactivates an organization
 * @param orgId - ID of the organization
 */
export const deactivateOrganization = async (
  orgId: number
): Promise<{ success: boolean; message?: string }> => {
  const token = getAccessToken();
  if (!token) throw new Error("Authorization token is missing.");

  const response = await apiClient.post<ApiResponse<null>>(
    `/sys/organization/${orgId}/inactive`
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Failed to deactivate organization."
    );
  }

  return { success: true, message: response.data.message };
};
