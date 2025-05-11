// src/utils/tokenUtils.ts
import { jwtDecode } from "jwt-decode";

export const getAccessToken = (): string | null => {
  return typeof window !== "undefined"
    ? localStorage.getItem("authToken")
    : null; // already correct, just ensure all usage is 'authToken'
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

export const getOrganizationId = (): number | null => {
  return decodeToken()?.org_id || null;
};

export const getBranchId = (): number | null => {
  return decodeToken()?.branch_id || null;
};

export const getUserId = (): number | null => {
  return decodeToken()?.user_id || null;
};

export const getUserEmail = (): string | null => {
  return decodeToken()?.email || null;
};

export const logout = (): void => {
  // if (typeof window !== "undefined") {
  localStorage.removeItem("authToken");
  document.cookie = "authToken=; path=/; max-age=0"; // Clear cookie
  // }
};
