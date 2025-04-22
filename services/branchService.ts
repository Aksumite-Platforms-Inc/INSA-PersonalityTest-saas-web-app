import api from "./api";

export const getBranches = async (organizationId: string) => {
  try {
    const response = await api.get(`/organization/${organizationId}/branches`);
    return response.data;
  } catch (error) {
    console.error("Error fetching branches:", error);
    throw error;
  }
};

export const createBranch = async (organizationId: string, branchData: any) => {
  try {
    const response = await api.post(
      `/organization/${organizationId}/branches`,
      branchData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating branch:", error);
    throw error;
  }
};
