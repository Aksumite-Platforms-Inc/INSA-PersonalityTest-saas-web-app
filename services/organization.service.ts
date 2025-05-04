import apiClient from "./apiClient";
import { ApiResponse } from "@/types/api-response.type";

export interface Organization {
  id: number;
  name: string;
  sector: string;
  status: string;
  createdAt: string;
}

/**
 * Creates a new organization
 */
export const createOrganization = async (data: {
  name: string;
  sector: string;
}): Promise<Organization> => {
  const response = await apiClient.post<ApiResponse<Organization>>(
    "/sys/organization",
    data
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to create organization.");
  }

  return response.data.data;
};

/**
 * Updates an existing organization
 */
export const updateOrganization = async (
  id: number,
  data: { name: string; sector: string }
): Promise<Organization> => {
  const response = await apiClient.put<ApiResponse<Organization>>(
    `/sys/organization/${id}`,
    data
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to update organization.");
  }

  return response.data.data;
};

/**
 * Deletes an organization
 */
export const deleteOrganization = async (id: number): Promise<void> => {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/sys/organization/${id}`
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to delete organization.");
  }
};

/**
 * Fetches an organization by ID
 */
export const getOrganizationById = async (
  id: number
): Promise<Organization> => {
  const response = await apiClient.get<ApiResponse<Organization>>(
    `/sys/organization/${id}`
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch organization.");
  }

  return response.data.data;
};

/**
 * Fetches all organizations
 */
export const listOrganizations = async (): Promise<Organization[]> => {
  const response = await apiClient.get<ApiResponse<Organization[]>>(
    "/sys/organization"
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch organizations.");
  }

  return response.data.data;
};

/**
 * Fetches all organizations with pagination
 */
// export const listOrganizationsWithPagination = async (
//     page: number,
//     limit: number
//     ): Promise<{ organizations: Organization[]; total: number }> => {
//     const response = await apiClient.get<ApiResponse<{
//         organizations: Organization[];
//         total: number;
//     }>>(`/sys/organization?page=${page}&limit=${limit}`);

//     if (!response.data.success) {
//         throw new Error(
//         response.data.message || "Failed to fetch organizations with pagination."
//         );
//     }

//     return response.data.data;
//     }

/** assign admin to organization */
export const assignAdminToOrganization = async (
  orgId: number,
  adminId: number
): Promise<void> => {
  const response = await apiClient.post<ApiResponse<null>>(
    `/sys/organization/${orgId}/admin/`
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Failed to assign admin to organization."
    );
  }
};

/**
 * Activates an organization
 */
export const activateOrganization = async (id: number): Promise<void> => {
  const response = await apiClient.post<ApiResponse<null>>(
    `/sys/organization/${id}/activate`
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Failed to activate organization."
    );
  }
};

/**
 * Deactivates an organization
 */
export const deactivateOrganization = async (id: number): Promise<void> => {
  const response = await apiClient.post<ApiResponse<null>>(
    `/sys/organization/${id}/deactivate`
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Failed to deactivate organization."
    );
  }
};
