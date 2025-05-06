// types/api.d.ts
export type APIResponse<T> = {
  success: boolean;
  data: T | null;
  message: string | null;
  code: number | null;
};
