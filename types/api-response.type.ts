// src/types/api-response.type.ts

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
