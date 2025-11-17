// services/apiClient.ts
import axios from "axios";
import { logoutUser } from "./auth.service";
import type { ApiResponse } from "@/types/api-response.type";
import toast from "react-hot-toast";

const apiClient = axios.create({
// baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://personality.insa.gov.et/api/v1",  
  // baseURL: "http://localhost:8080/api/v1",
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
        toast.error("Session expired. Please log in again."); // ✅ Toast for refresh failure
        return Promise.reject(err);
      }
    }

    // ✅ Toast for other errors
    let message = "Something went wrong. Please try again.";

    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (typeof error.response?.data === "string") {
      message = error.response.data;
    }

    if (error.response?.data?.errors) {
      Object.values(error.response.data.errors).forEach((err: any) => {
        toast.error(err.toString());
      });
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
