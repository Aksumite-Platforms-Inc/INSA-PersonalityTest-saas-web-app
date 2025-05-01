// services/authService.ts
import api from "./api";
import { APIResponse } from "@/types/api";
import { handleApiError } from "@/lib/errorHandler";

export const login = async (
  email: string,
  password: string
): Promise<APIResponse<any>> => {
  try {
    const response = await api.post("/sys/login", { email, password });
    return {
      data: response.data,
      success: true,
      message: "Login successful",
      code: 200,
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const resetPassword = async (
  email: string
): Promise<APIResponse<null>> => {
  try {
    await api.post("/organization/members/resetpassword", { email });
    return { success: true, error: null, data: null };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const logout = () => {
  localStorage.removeItem("authToken");
};
