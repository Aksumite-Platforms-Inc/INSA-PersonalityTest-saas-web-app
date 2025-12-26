// services/export.service.ts

import apiClient from "@/services/apiClient";

/**
 * Utility function to extract filename from Content-Disposition header
 */
const extractFilename = (contentDisposition: string | undefined, defaultFilename: string): string => {
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (filenameMatch && filenameMatch[1]) {
      return filenameMatch[1].replace(/['"]/g, "");
    }
  }
  return defaultFilename;
};

/**
 * Utility function to trigger file download from blob data
 */
const downloadBlob = (data: BlobPart, filename: string, mimeType: string): void => {
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * Export user test results as PDF
 * @param userId - The user ID to export results for
 */
export const exportUserPdf = async (userId: number): Promise<void> => {
  try {
    const response = await apiClient.get<Blob>(
      `/organization/export/user/${userId}/pdf`,
      {
        responseType: "blob",
      }
    );

    const filename = extractFilename(
      response.headers["content-disposition"],
      `user_${userId}_personality_test_results.pdf`
    );
    downloadBlob(response.data as BlobPart, filename, "application/pdf");
  } catch (error: any) {
    console.error("Error exporting user PDF:", error);
    throw new Error(error.response?.data?.message || "Failed to export user PDF. Please try again.");
  }
};

/**
 * Export organization test results as ZIP
 * @param orgId - The organization ID to export results for
 */
export const exportOrganizationZip = async (orgId: number): Promise<void> => {
  try {
    const response = await apiClient.get<Blob>(
      `/organization/export/organization/${orgId}/zip`,
      {
        responseType: "blob",
      }
    );

    const filename = extractFilename(
      response.headers["content-disposition"],
      `organization_${orgId}_personality_test_results.zip`
    );
    downloadBlob(response.data as BlobPart, filename, "application/zip");
  } catch (error: any) {
    console.error("Error exporting organization ZIP:", error);
    throw new Error(error.response?.data?.message || "Failed to export organization ZIP. Please try again.");
  }
};

/**
 * Export branch test results as ZIP
 * @param branchId - The branch ID to export results for
 */
export const exportBranchZip = async (branchId: number): Promise<void> => {
  try {
    const response = await apiClient.get<Blob>(
      `/organization/export/branch/${branchId}/zip`,
      {
        responseType: "blob",
      }
    );

    const filename = extractFilename(
      response.headers["content-disposition"],
      `branch_${branchId}_personality_test_results.zip`
    );
    downloadBlob(response.data as BlobPart, filename, "application/zip");
  } catch (error: any) {
    console.error("Error exporting branch ZIP:", error);
    throw new Error(error.response?.data?.message || "Failed to export branch ZIP. Please try again.");
  }
};
