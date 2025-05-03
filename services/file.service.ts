// src/services/file.service.ts

import { ApiResponse } from "@/types/api-response.type";
import apiClient from "./apiClient";
import { getAccessToken } from "./auth.service";

export interface UserUpload {
  name: string;
  email: string;
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Validates user data from Excel
 */
export const validateUsers = (users: UserUpload[]): UserUpload[] => {
  return users.filter((user) => {
    return (
      user.name.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)
    );
  });
};

/**
 * Uploads parsed and validated Excel users to backend
 */
export const uploadExcelUsers = async (
  users: UserUpload[]
): Promise<{ success: boolean; message?: string }> => {
  const token = getAccessToken();
  if (!token) throw new Error("Authorization token is missing.");

  const validUsers = validateUsers(users);
  if (validUsers.length === 0) throw new Error("No valid users found.");

  const response = await apiClient.post<ApiResponse<null>>(
    "/organization/addbulkmembers",
    { users: validUsers },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Upload failed.");
  }

  return { success: true, message: response.data.message };
};

/**
 * Reads and parses Excel file client-side into user objects
 */
export const parseExcelFile = async (file: File): Promise<UserUpload[]> => {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File too large. Max ${MAX_FILE_SIZE_MB}MB allowed.`);
  }

  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = await import("xlsx").then((XLSX) =>
          XLSX.read(data, { type: "array" })
        );

        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const raw = await import("xlsx").then((XLSX) =>
          XLSX.utils.sheet_to_json(firstSheet)
        );

        const parsed: UserUpload[] = (raw as any[]).map((row) => ({
          name: row.name || row.Name || "",
          email: row.email || row.Email || "",
        }));

        resolve(parsed);
      } catch (err) {
        reject(new Error("Failed to parse Excel file."));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read the file."));
    };

    reader.readAsArrayBuffer(file);
  });
};
