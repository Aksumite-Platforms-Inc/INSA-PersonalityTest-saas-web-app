// // services/branchService.ts
// import api from "./api";
// import { APIResponse } from "@/types/api";
// import { handleApiError } from "@/lib/errorHandler";

// export const createBranch = async (
//   orgId: number,
//   name: string
// ): Promise<APIResponse<any>> => {
//   try {
//     const response = await api.post(`/organization/${orgId}/branches`, {
//       name,
//     });
//     return { data: response.data, error: null, success: true };
//   } catch (error: any) {
//     return handleApiError(error);
//   }
// };

// // Updated error handling to ensure compatibility with APIResponse<any[]>
// export const getAllBranches = async (): Promise<APIResponse<any[]>> => {
//   try {
//     const response = await api.get<any[]>("/organization/branches");
//     return { data: response.data, error: null, success: true };
//   } catch (error: any) {
//     return {
//       data: [],
//       error: error.response?.data?.message || "An unexpected error occurred",
//       success: false,
//     };
//   }
// };

// export const getBranchById = async (
//   branchId: number
// ): Promise<APIResponse<any>> => {
//   try {
//     const response = await api.get(`/organization/branches/${branchId}`);
//     return { data: response.data, error: null, success: true };
//   } catch (error: any) {
//     return handleApiError(error);
//   }
// };

// // Update branch
// export const updateBranch = async (
//   branchId: number,
//   name: string
// ): Promise<APIResponse<any>> => {
//   try {
//     const response = await api.put(`/organization/branches/${branchId}`, {
//       name,
//     });
//     return { data: response.data, error: null, success: true };
//   } catch (error: any) {
//     return handleApiError(error);
//   }
// };

//delete branch through API call
// export const deleteBranch = async (
//   branchId: number
// ): Promise<APIResponse<null>> => {
//   try {
//     const response = await api.delete(`/organization/branches/${branchId}`);
//     return { data: null, error: null, success: true };
//   } catch (error: any) {
//     return handleApiError(error);
//   }
// };

//for testing purposes only-crud operations through API calls are done above on this file
import { handleApiError } from "@/lib/errorHandler";
import { APIResponse } from "@/types/api";
import api from "./api";

// Dummy data for testing
const branches = [
  {
    id: 1,
    name: "Addis Ababa HQ",
    manager: "Abebe Kebede",
    employees: 78,
    testsCompleted: 245,
    status: "active",
    createdAt: "2023-01-15",
  },
  {
    id: 2,
    name: "Bahir Dar",
    manager: "Tigist Haile",
    employees: 45,
    testsCompleted: 132,
    status: "active",
    createdAt: "2023-02-03",
  },
  {
    id: 3,
    name: "Hawassa",
    manager: "Dawit Tadesse",
    employees: 32,
    testsCompleted: 98,
    status: "active",
    createdAt: "2023-03-21",
  },
  {
    id: 4,
    name: "Mekelle",
    manager: "Hiwot Girma",
    employees: 28,
    testsCompleted: 76,
    status: "inactive",
    createdAt: "2023-04-10",
  },
  {
    id: 5,
    name: "Dire Dawa",
    manager: "Solomon Tesfaye",
    employees: 35,
    testsCompleted: 105,
    status: "active",
    createdAt: "2023-05-05",
  },
  {
    id: 6,
    name: "Adama",
    manager: "Meron Alemu",
    employees: 42,
    testsCompleted: 118,
    status: "active",
    createdAt: "2023-06-18",
  },
  {
    id: 7,
    name: "Gondar",
    manager: "Yonas Bekele",
    employees: 30,
    testsCompleted: 85,
    status: "active",
    createdAt: "2023-07-22",
  },
  {
    id: 8,
    name: "Jimma",
    manager: "Sara Tesfaye",
    employees: 25,
    testsCompleted: 72,
    status: "active",
    createdAt: "2023-08-14",
  },
];

export const getAllBranches = async (): Promise<APIResponse<any[]>> => {
  return { data: branches, error: null, success: true };
};

export const getBranchById = async (
  branchId: number
): Promise<APIResponse<any>> => {
  const branch = branches.find((b) => b.id === branchId);
  if (branch) {
    return { data: branch, error: null, success: true };
  } else {
    return { data: null, error: "Branch not found", success: false };
  }
};
interface BranchData {
  name?: string;
  manager?: string;
  employees?: number;
  testsCompleted?: number;
  status?: string;
  createdAt?: string;
}

export async function updateBranch(id: number, branch: BranchData) {
  try {
    // Find the index of the branch in the array
    const index = branches.findIndex((b) => b.id === id);

    if (index === -1) {
      return { success: false, error: "Branch not found." };
    }

    // Update the branch at that index with the new data
    branches[index] = {
      ...branches[index], // Keep other properties the same
      ...branch, // Overwrite properties with the new ones
    };

    // Return a success response
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: "Failed to update branch." };
  }
}

// Delete branch functionality for testing purposes only
export const deleteBranch = async (
  branchId: number
): Promise<APIResponse<null>> => {
  try {
    const index = branches.findIndex((b) => b.id === branchId);

    if (index === -1) {
      return {
        data: null,
        error: "Branch not found.",
        success: false,
      };
    }

    branches.splice(index, 1); // Remove the branch
    return {
      data: null,
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: "Failed to delete branch.",
      success: false,
    };
  }
};
