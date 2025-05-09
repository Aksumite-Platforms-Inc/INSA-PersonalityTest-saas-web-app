"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

// Define user types
export type UserRole =
  | "super_admin"
  | "org_admin"
  | "branch_admin"
  | "org_member"
  | null;
export type AuthStatus = "authenticated" | "unauthenticated" | "loading";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  branchId?: string;
}

interface AuthContextType {
  user: User | null;
  status: AuthStatus;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  isAuthorized: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const MOCK_USERS = [
  {
    id: "1",
    email: "superadmin@example.com",
    password: "password",
    name: "Super Admin",
    role: "superadmin" as UserRole,
  },
  {
    id: "2",
    email: "org@example.com",
    password: "password",
    name: "Organization Admin",
    role: "organization" as UserRole,
    organizationId: "org1",
  },
  {
    id: "3",
    email: "branch@example.com",
    password: "password",
    name: "Branch Manager",
    role: "branch" as UserRole,
    organizationId: "org1",
    branchId: "branch1",
  },
  {
    id: "4",
    email: "employee@example.com",
    password: "password",
    name: "Employee User",
    role: "employee" as UserRole,
    organizationId: "org1",
    branchId: "branch1",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setStatus("authenticated");
      } catch (error) {
        localStorage.removeItem("user");
        setStatus("unauthenticated");
      }
    } else {
      setStatus("unauthenticated");
    }
  }, []);

  // Redirect unauthenticated users away from protected routes
  useEffect(() => {
    if (status === "loading") return;

    const isLoginPage = pathname === "/login";
    const isPublicPage =
      pathname === "/" ||
      pathname.startsWith("/_next") ||
      pathname.includes("/api/");

    if (!user && !isLoginPage && !isPublicPage) {
      toast.toast({
        title: "Authentication required",
        description: "Please log in to access this page",
        // variant: "warning",
      });
      router.push("/login");
    }

    // Check if user has access to the current route
    if (user && pathname.includes("/dashboard/")) {
      const routeRole = pathname.split("/")[2];
      if (routeRole && user.role !== routeRole) {
        toast.toast({
          title: "Access denied",
          description: "You don't have permission to access this page",
          //   variant: "error",
        });
        router.push(`/dashboard/${user.role}`);
      }
    }
  }, [pathname, user, status, router, toast]);

  const login = async (
    email: string,
    password: string,
    role: string
  ): Promise<boolean> => {
    // In a real app, this would be an API call
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password && u.role === role
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      setStatus("authenticated");
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    setStatus("unauthenticated");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const isAuthorized = (allowedRoles: UserRole[]): boolean => {
    return !!user && !!allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, status, login, logout, isAuthorized }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
