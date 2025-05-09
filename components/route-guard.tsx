"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, type UserRole } from "../app/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { user, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();

  useEffect(() => {
    // Wait until authentication status is determined
    if (status === "loading") return;

    // If user is not authenticated, redirect to login
    if (status === "unauthenticated") {
      toast.warning({
        title: "Authentication required",
        description: "Please log in to access this page",
      });
      router.push("/login");
      return;
    }

    // If user is authenticated but not authorized for this route
    if (user && !allowedRoles.includes(user.role)) {
      toast.error({
        title: "Access denied",
        description: "You don't have permission to access this page",
      });
      router.push(`/dashboard/${user.role}`);
    }
  }, [user, status, allowedRoles, router, pathname, toast]);

  // Show nothing while checking authentication
  if (status === "loading" || status === "unauthenticated") {
    return null;
  }

  // If user doesn't have permission, don't render children
  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  // User is authenticated and authorized
  return <>{children}</>;
}
