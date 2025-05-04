import apiClient from "./apiClient";
import { ApiResponse } from "@/types/api-response.type";
import { RefreshTokenResponse } from "@/types/auth-response.type";

const TOKEN_KEY = "authToken";

/**
 * Logs in a user and stores the access token.
 * @param email - User email
 * @param password - User password
 * @param isSystemAdmin - Determines the login endpoint
 */
export const loginUser = async (
  email: string,
  password: string,
  isSystemAdmin: boolean
): Promise<{ token: string; message?: string }> => {
  const endpoint = isSystemAdmin ? "/sys/login" : "/sso/login";

  const response = await apiClient.post<ApiResponse<{ token: string }>>(
    endpoint,
    { email, password },
    { withCredentials: true } // Ensures refresh token cookie is set
  );

  if (!response.data.success || !response.data.data.token) {
    throw new Error(response.data.message || "Login failed.");
  }

  const token = response.data.data.token;
  localStorage.setItem(TOKEN_KEY, token);

  return {
    token,
    message: response.data.message,
  };
};

/**
 * Logs out the user by removing the access token.
 * Optionally, notify the backend to invalidate the session.
 */
export const logoutUser = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  // Optionally, you can notify the server via:
  // await apiClient.post('/sso/logout');
};

/**
 * Retrieves the current access token from localStorage.
 */
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Used by interceptors to refresh expired access tokens.
 */
export const refreshAccessToken = async (): Promise<string> => {
  const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
    "/sso/refresh",
    {},
    { withCredentials: true } // send refresh token cookie
  );

  if (!response.data.success || !response.data.data.access_token) {
    throw new Error(response.data.message || "Token refresh failed.");
  }

  const newToken = response.data.data.access_token;
  localStorage.setItem(TOKEN_KEY, newToken);
  return newToken;
};

/**
 * Re-exported as getAccessToken for consistent naming across the app.
 */
export const getAccessToken = getToken;
