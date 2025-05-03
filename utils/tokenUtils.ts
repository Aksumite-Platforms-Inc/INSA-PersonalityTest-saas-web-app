// src/utils/tokenUtils.ts
import { jwtDecode } from "jwt-decode";

export const getAccessToken = (): string | null => {
  return typeof window !== "undefined"
    ? localStorage.getItem("authToken")
    : null;
};

export interface DecodedToken {
  user_id: number;
  email: string;
  role: string;
  name: string;
  org_id?: number;
  branch_id?: number;
  exp: number;
}

export const decodeToken = (): DecodedToken | null => {
  try {
    const token = getAccessToken();
    if (!token) return null;
    return jwtDecode(token);
  } catch (err) {
    return null;
  }
};

export const isTokenExpired = (): boolean => {
  const decoded = decodeToken();
  return !decoded || decoded.exp * 1000 < Date.now();
};

export const getUserRole = (): string => {
  return decodeToken()?.role || "unknown";
};
