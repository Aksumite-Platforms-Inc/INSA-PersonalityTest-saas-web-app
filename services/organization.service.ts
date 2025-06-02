// src/services/organization.service.ts

import apiClient from "@/services/apiClient";
import { ApiResponse } from "@/types/api-response.type";

export interface Organization {
  id: number;
  name: string;
  email: string;
  agreement: string;
  status: string;
  address: string;
  sector: string;
  phone_number: string;
  created_at: Date;
  updated_at: Date;
}
export interface Admin {
  id: number;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

/** Create a new organization */
export const createOrganization = async (data: {
  name: string;
  email: string;
  status: string;
  address: string;
  sector: string;
  phone_number: string;
}): Promise<{ id: number }> => {
  console.log("Payload for createOrganization:", data);
  const response = await apiClient.post<ApiResponse<Organization>>(
    "/sys/organization",
    data
  );

  console.log("Full API response:", response.data);

  if (!response.data?.success) {
    console.error("Create Org Error:", response.data);
    throw new Error(response.data?.message || "Failed to create organization.");
  }

  const organization = response.data.data;
  if (!organization || typeof organization.id !== "number") {
    console.error("Organization ID is missing in the response:", response.data);
    throw new Error("Organization creation failed: Missing ID.");
  }

  return { id: organization.id }; // Return the ID
};

/** Update an organization */
export const updateOrganization = async (
  id: number,
  data: {
    name: string;
    sector: string;
    email?: string;
    address?: string;
    status: string;
  }
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
  Email: string
  // adminName: string
): Promise<Admin> => {
  const response = await apiClient.post<ApiResponse<Admin>>(
    `/sys/organization/${orgId}/admin`,
    {
      Email,
      //  adminName
    }
  );

  if (!response.data?.success) {
    console.error("Assign Admin Error:", response.data);
    throw new Error(response.data?.message || "Failed to assign admin.");
  }

  return response.data.data;
};
// export const getOrganizatioByEmail = async (
//   email: string
// ): Promise<Organization | null> => {
//   try {
//     const response = await apiClient.get<ApiResponse<Organization>>(
//       `/sys/organization/email/${email}`
//     );

//     if (!response.data?.success) {
//       console.error("Fetch Org By Email Error:", response.data);
//       return null;
//     }

//     return response.data.data;
//   } catch (error) {
//     console.error("Error fetching organization by email:", error);
//     return null;
//   }
// };
