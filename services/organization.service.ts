// src/services/organization.service.ts

import apiClient from "@/services/apiClient";
import { ApiResponse } from "@/types/api-response.type";

export interface Organization {
  id: number;
  name: string;
  sector: string;
  status: string;
  createdAt: string;
}

/** Create a new organization */
export const createOrganization = async (data: {
  name: string;
  sector: string;
}): Promise<Organization> => {
  const response = await apiClient.post<ApiResponse<Organization>>(
    "/sys/organization",
    data
  );

  if (!response.data?.success) {
    console.error("Create Org Error:", response.data);
    throw new Error(response.data?.message || "Failed to create organization.");
  }

  return response.data.data;
};

/** Update an organization */
export const updateOrganization = async (
  id: number,
  data: { name: string; sector: string }
): Promise<Organization> => {
  const response = await apiClient.put<ApiResponse<Organization>>(
    `/sys/organization/${id}`,
    data
  );

  if (!response.data?.success) {
    console.error("Update Org Error:", response.data);
    throw new Error(response.data?.message || "Failed to update organization.");
  }

  return response.data.data;
};

/** Delete an organization */
export const deleteOrganization = async (id: number): Promise<void> => {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/sys/organization/${id}`
  );

  if (!response.data?.success) {
    console.error("Delete Org Error:", response.data);
    throw new Error(response.data?.message || "Failed to delete organization.");
  }
};

/** Get an organization by ID */
export const getOrganizationById = async (
  id: number
): Promise<Organization> => {
  const response = await apiClient.get<ApiResponse<Organization>>(
    `/sys/organization/${id}`
  );

  if (!response.data?.success) {
    console.error("Fetch Org By ID Error:", response.data);
    throw new Error(response.data?.message || "Failed to fetch organization.");
  }

  return response.data.data;
};

/** List all organizations */
export const listOrganizations = async (): Promise<Organization[]> => {
  const response = await apiClient.get<Organization[]>("/sys/organization");

  // Just return directly if it's already an array
  if (!Array.isArray(response.data)) {
    console.error("Unexpected response format:", response.data);
    throw new Error("Failed to fetch organizations.");
  }

  return response.data;
};

/** Activate an organization */
export const activateOrganization = async (id: number): Promise<void> => {
  const response = await apiClient.post<ApiResponse<null>>(
    `/sys/organization/${id}/activate`
  );

  if (!response.data?.success) {
    console.error("Activate Org Error:", response.data);
    throw new Error(
      response.data?.message || "Failed to activate organization."
    );
  }
};

/** Deactivate an organization */
export const deactivateOrganization = async (id: number): Promise<void> => {
  const response = await apiClient.post<ApiResponse<null>>(
    `/sys/organization/${id}/deactivate`
  );

  if (!response.data?.success) {
    console.error("Deactivate Org Error:", response.data);
    throw new Error(
      response.data?.message || "Failed to deactivate organization."
    );
  }
};

/** Assign admin to organization */
export const assignAdminToOrganization = async (
  orgId: number,
  adminId: number
): Promise<void> => {
  const response = await apiClient.post<ApiResponse<null>>(
    `/sys/organization/${orgId}/admin`,
    { adminId }
  );

  if (!response.data?.success) {
    console.error("Assign Admin Error:", response.data);
    throw new Error(response.data?.message || "Failed to assign admin.");
  }
};
