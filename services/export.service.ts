// services/export.service.ts

import apiClient from "@/services/apiClient";

/**
 * Export user test results as PDF
 * @param userId - The user ID to export results for
 * @returns A blob of the PDF file
 */
export const exportUserPdf = async (userId: number): Promise<void> => {
  try {
    const response = await apiClient.get<Blob>(
      `/organization/export/user/${userId}/pdf`,
      {
        responseType: "blob",
      }
    );

    // Extract filename from Content-Disposition header or generate one
    const contentDisposition = response.headers["content-disposition"];
    let filename = `user_${userId}_personality_test_results.pdf`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, "");
      }
    }

    // Create blob and trigger download
    const blob = new Blob([response.data as BlobPart], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error("Error exporting user PDF:", error);
    throw new Error(error.response?.data?.message || "Failed to export user PDF. Please try again.");
  }
};

/**
 * Export organization test results as ZIP
 * @param orgId - The organization ID to export results for
 * @returns A blob of the ZIP file
 */
export const exportOrganizationZip = async (orgId: number): Promise<void> => {
  try {
    const response = await apiClient.get<Blob>(
      `/organization/export/organization/${orgId}/zip`,
      {
        responseType: "blob",
      }
    );

    // Extract filename from Content-Disposition header or generate one
    const contentDisposition = response.headers["content-disposition"];
    let filename = `organization_${orgId}_personality_test_results.zip`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, "");
      }
    }

    // Create blob and trigger download
    const blob = new Blob([response.data as BlobPart], { type: "application/zip" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error("Error exporting organization ZIP:", error);
    throw new Error(error.response?.data?.message || "Failed to export organization ZIP. Please try again.");
  }
};

/**
 * Export branch test results as ZIP
 * @param branchId - The branch ID to export results for
 * @returns A blob of the ZIP file
 */
export const exportBranchZip = async (branchId: number): Promise<void> => {
  try {
    const response = await apiClient.get<Blob>(
      `/organization/export/branch/${branchId}/zip`,
      {
        responseType: "blob",
      }
    );

    // Extract filename from Content-Disposition header or generate one
    const contentDisposition = response.headers["content-disposition"];
    let filename = `branch_${branchId}_personality_test_results.zip`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, "");
      }
    }

    // Create blob and trigger download
    const blob = new Blob([response.data as BlobPart], { type: "application/zip" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error("Error exporting branch ZIP:", error);
    throw new Error(error.response?.data?.message || "Failed to export branch ZIP. Please try again.");
  }
};
