import { APIResponse } from "@/types/api";

export const handleApiError = (error: any): APIResponse<null> => {
  const errorMessage =
    error.response?.data?.message || "An unexpected error occurred";
  return {
    data: null,
    error: errorMessage,
    success: false,
  };
};
