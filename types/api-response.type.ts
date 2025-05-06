// src/types/api-response.type.ts

export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message?: string;
  data: T;
}
