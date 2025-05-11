// components/RouteGuard.tsx
"use client";

import { useEffect } from "react";
import { useAuth } from "@/app/contexts/auth-context";
import { useRouter } from "next/navigation";

interface RouteGuardProps {
  allowedRoles: string[];
  fallbackRedirect?: string;
  children: React.ReactNode;
}

export const RouteGuard = ({
  allowedRoles,
  fallbackRedirect = "/unauthorized",
  children,
}: RouteGuardProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (!allowedRoles.includes(user.role)) {
        // Redirect to their correct dashboard if fallback isn't specified
        const rolePath = {
          super_admin: "/dashboard/superadmin",
          org_admin: "/dashboard/organization",
          branch_admin: "/dashboard/branch",
          org_member: "/dashboard/employee/test",
        }[user.role];

        router.replace(fallbackRedirect || rolePath);
      }
    }
  }, [user, loading, allowedRoles, router]);

  if (loading || !user) return <div>Loading...</div>;

  return <>{children}</>;
};
