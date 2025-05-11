// contexts/auth-context.tsx

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchUserInfo } from "@/services/user.service";
import { decodeToken } from "@/utils/tokenUtils";

interface User {
  id: string;
  name: string;
  role: "super_admin" | "org_admin" | "branch_admin" | "org_member";
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken"); // use cookies if HttpOnly
    if (token) {
      try {
        const decoded = decodeToken();
        if (decoded && decoded.user_id && decoded.org_id) {
          fetchUserInfo(decoded.org_id, decoded.user_id)
            .then((userData) => {
              // Map backend role to allowed UserRole
              let mappedRole: User["role"] = "org_member";
              switch (userData.role) {
                case "super_admin":
                case "org_admin":
                case "branch_admin":
                case "org_member":
                  mappedRole = userData.role;
                  break;
                default:
                  mappedRole = "org_member";
              }
              setUser({
                ...userData,
                id: String(userData.id),
                role: mappedRole,
                permissions: [],
              });
            })
            .catch((err) => {
              console.error("Failed to fetch user info:", err);
              setUser(null);
            })
            .finally(() => setLoading(false));
          return;
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Invalid token:", err);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// RBAC additions
export type UserRole =
  | "super_admin"
  | "org_admin"
  | "branch_admin"
  | "org_member";

export const ROLE_URL_MAP: Record<UserRole, string> = {
  super_admin: "superadmin",
  org_admin: "organization",
  branch_admin: "branch",
  org_member: "employee/test",
};

export const URL_ROLE_MAP: Record<string, UserRole> = {
  superadmin: "super_admin",
  organization: "org_admin",
  branch: "branch_admin",
  "employee/test": "org_member",
};

const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  super_admin: ["super_admin", "org_admin", "branch_admin", "org_member"],
  org_admin: ["org_admin"],
  branch_admin: ["branch_admin"],
  org_member: ["org_member"],
};

function isAuthorized(
  userRole: UserRole | null,
  allowedRoles: UserRole[]
): boolean {
  if (!userRole) return false;
  return allowedRoles.some((role) => ROLE_HIERARCHY[userRole]?.includes(role));
}

function getRoleUrl(role: UserRole | null): string {
  if (!role) return "";
  return ROLE_URL_MAP[role] || "";
}

// Extend useAuth to provide RBAC helpers
export const useRBACAuth = () => {
  const { user, loading } = useAuth();
  // Map legacy roles to new UserRole
  let role: UserRole | null = null;
  if (user) {
    switch (user.role) {
      case "super_admin":
        role = "super_admin";
        break;
      case "org_admin":
        role = "org_admin";
        break;
      case "branch_admin":
        role = "branch_admin";
        break;
      case "org_member":
        role = "org_member";
        break;
      default:
        role = null;
    }
  }
  return {
    user,
    loading,
    role,
    isAuthorized: (allowedRoles: UserRole[]) =>
      isAuthorized(role, allowedRoles),
    getRoleUrl,
  };
};
