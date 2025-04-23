import api from "./api";
import { handleApiError } from "@/lib/errorHandler";

interface UploadFileResponse {
  data: any;
  error: any;
  success: boolean;
}

export const uploadFile = async (file: File): Promise<UploadFileResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { data: response.data, error: null, success: true };
  } catch (error: any) {
    return handleApiError(error);
  }
};
