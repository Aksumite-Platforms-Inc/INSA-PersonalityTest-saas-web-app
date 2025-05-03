// src/services/test.service.ts
import apiClient from "./apiClient";
import { getAccessToken } from "@/utils/tokenUtils";
import { ApiResponse } from "@/types/api-response.type";

export const checkTestTaken = async (
  memberId: number,
  testId: number
): Promise<boolean> => {
  const token = getAccessToken();
  if (!token) throw new Error("Authorization token is missing.");

  const response = await apiClient.get<ApiResponse<boolean>>(
    `/organization/checktest/members/${memberId}/tests/${testId}`
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to check test status.");
  }

  return response.data.data;
};
