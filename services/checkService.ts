import api from "./api";
import { APIResponse } from "@/types/api";
import { handleApiError } from "@/lib/errorHandler";

export const validateResetPassword = async (
  token: string,
  newPassword: string
): Promise<APIResponse<null>> => {
  try {
    await api.post("/organization/members/validateresetpassword", {
      token,
      newPassword,
    });
    return { data: null, error: null, success: true };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const activateMember = async (
  memberId: number
): Promise<APIResponse<null>> => {
  try {
    await api.post("/organization/members/activate", { memberId });
    return { data: null, error: null, success: true };
  } catch (error: any) {
    return handleApiError(error);
  }
};
