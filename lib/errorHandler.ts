import { APIResponse } from "@/types/api";

export const handleApiError = (error: any): APIResponse<null> => {
  const errorMessage =
    error.response?.data?.message || "An unexpected error occurred";
  return {
    success: false,
    data: null,
    message: errorMessage,
    code: null,
  };
};

/**
 * Extracts a user-friendly error message from an API error object.
 * Falls back to a provided message if none is found.
 */
export function extractApiError(error: any, fallbackMessage: string): string {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.statusText) return error.response.statusText;
  if (error?.message) return error.message;
  return fallbackMessage;
}
