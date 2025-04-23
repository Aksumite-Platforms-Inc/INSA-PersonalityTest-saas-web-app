// types/api.d.ts
export type APIResponse<T> = {
  data: T | null;
  error: string | null;
  success: boolean;
};
