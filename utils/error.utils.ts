import { ApiResponse } from "@/types/api-response.type";

export function handleApiError<T = any>(error: any): ApiResponse<T> {
  const response = error?.response;

  return {
    code: response?.status || 500,
    success: false,
    message:
      response?.data?.message || error?.message || "Something went wrong.",
    data: null as unknown as T,
  };
}
