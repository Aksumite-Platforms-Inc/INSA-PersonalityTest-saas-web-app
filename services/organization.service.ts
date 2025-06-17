// src/services/organization.service.ts

import apiClient from "@/services/apiClient";
import { ApiResponse } from "@/types/api-response.type";
import { extractApiError } from "@/lib/errorHandler";

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
}): Promise<Organization> => {
  try {
    const response = await apiClient.post<ApiResponse<Organization>>(
      "/sys/organization",
      data
    );
    if (!(response.status >= 200 && response.status < 300) || !response.data?.success) {
      const message = response.data?.message || `Failed to create organization.`;
      throw new Error(message);
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(extractApiError(error, "Failed to create organization. Please try again."));
  }
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
  try {
    const response = await apiClient.put<ApiResponse<Organization>>(
      `/sys/organization/${id}`,
      data
    );
    if (!(response.status >= 200 && response.status < 300) || !response.data?.success) {
      const message = response.data?.message || `Failed to update organization.`;
      throw new Error(message);
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(extractApiError(error, "Failed to update organization. Please try again."));
  }
};

/** Delete an organization */
export const deleteOrganization = async (id: number): Promise<void> => {
  try {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/sys/organization/${id}`
    );
    if (!(response.status >= 200 && response.status < 300) || !response.data?.success) {
      const message = response.data?.message || `Failed to delete organization.`;
      throw new Error(message);
    }
  } catch (error: any) {
    throw new Error(extractApiError(error, "Failed to delete organization. Please try again."));
  }
};

/** Get an organization by ID */
export const getOrganizationById = async (
  id: number
): Promise<Organization> => {
  try {
    const response = await apiClient.get<ApiResponse<Organization>>(
      `/sys/organization/${id}`
    );
    if (!(response.status >= 200 && response.status < 300) || !response.data?.success) {
      const message = response.data?.message || `Failed to fetch organization.`;
      throw new Error(message);
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(extractApiError(error, "Failed to fetch organization. Please try again."));
  }
};

/** List all organizations */
export const listOrganizations = async (): Promise<Organization[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Organization[]>>(
      "/sys/organization"
    );
    if (!(response.status >= 200 && response.status < 300)) {
      throw new Error(response.statusText || "Failed to fetch organizations.");
    }
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      throw new Error("Unexpected response format.");
    }
  } catch (error: any) {
    throw new Error(extractApiError(error, "Failed to fetch organizations. Please try again."));
  }
};

/** Activate an organization */
export const activateOrganization = async (id: number): Promise<void> => {
  try {
    const response = await apiClient.post<ApiResponse<null>>(
      `/sys/organization/${id}/activate`
    );
    if (!(response.status >= 200 && response.status < 300) || !response.data?.success) {
      const message = response.data?.message || `Failed to activate organization.`;
      throw new Error(message);
    }
  } catch (error: any) {
    throw new Error(extractApiError(error, "Failed to activate organization. Please try again."));
  }
};

/** Deactivate an organization */
export const deactivateOrganization = async (id: number): Promise<void> => {
  try {
    const response = await apiClient.post<ApiResponse<null>>(
      `/sys/organization/${id}/deactivate`
    );
    if (!(response.status >= 200 && response.status < 300) || !response.data?.success) {
      const message = response.data?.message || `Failed to deactivate organization.`;
      throw new Error(message);
    }
  } catch (error: any) {
    throw new Error(extractApiError(error, "Failed to deactivate organization. Please try again."));
  }
};

/** Assign admin to organization */
export const assignAdminToOrganization = async (
  orgId: number,
  Email: string
): Promise<Admin> => {
  try {
    const response = await apiClient.post<ApiResponse<Admin>>(
      `/sys/organization/${orgId}/admin`,
      { Email }
    );
    if (!(response.status >= 200 && response.status < 300) || !response.data?.success) {
      const message = response.data?.message || `Failed to assign admin.`;
      throw new Error(message);
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(extractApiError(error, "Failed to assign admin. Please try again."));
  }
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
