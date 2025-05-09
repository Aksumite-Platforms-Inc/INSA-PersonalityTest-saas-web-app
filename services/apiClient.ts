// src/services/apiClient.ts
import axios from "axios";
import { getAccessToken, logoutUser } from "./auth.service";
import { ApiResponse } from "@/types/api-response.type";
import { RefreshTokenResponse } from "@/types/auth-response.type";
// Create reusable Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://personality.insa.gov.et/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Send refresh token cookie
});

// ✅ Attach access token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      // Fix: ensure headers exists
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Auto-refresh expired token on 401
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Only retry once
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/sso/login")
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post<
          ApiResponse<RefreshTokenResponse>
        >(
          `${apiClient.defaults.baseURL}/sso/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = refreshResponse.data?.data?.access_token;
        if (newToken) {
          localStorage.setItem("authToken", newToken);

          // Fix: ensure headers exist before retrying request
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        logoutUser(); // clear local session
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
