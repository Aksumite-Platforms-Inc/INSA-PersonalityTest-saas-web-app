// services/apiClient.ts
import axios from "axios";
import { logoutUser } from "./auth.service";
import type { ApiResponse } from "@/types/api-response.type";

const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://personality.insa.gov.et/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/sso/login")
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post<
          ApiResponse<{ access_token: string }>
        >(
          `${apiClient.defaults.baseURL}/sso/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = refreshResponse.data?.data?.access_token;
        if (newToken) {
          localStorage.setItem("authToken", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (err) {
        logoutUser();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
