// services/auth.service.ts
import apiClient from "./apiClient";
import type { ApiResponse } from "@/types/api-response.type";

/**
 * Logs in a user and stores the access token from response.
 */
export interface RawAuthResponse {
  token: string;
  user_id: number;
  role: string;
  org_id?: number;
  branch_id?: number;
}

export const loginUser = async (
  email: string,
  password: string
): Promise<RawAuthResponse> => {
  const res = await apiClient.post<ApiResponse<RawAuthResponse>>(
    "/sso/login",
    { email, password },
    { withCredentials: true }
  );

  const data = res.data.data;
  localStorage.setItem("authToken", data.token);
  return data;
};

/**
 * Logs out a user by removing the token and cookie.
 */
export const logoutUser = (): void => {
  localStorage.removeItem("authToken");
  document.cookie = "authToken=; path=/; max-age=0";
};
