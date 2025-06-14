// components/RouteGuard.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { isTokenExpired } from "@/utils/tokenUtils";
import { useToast } from "@/hooks/use-toast";

interface RouteGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const roleRedirectMap: Record<string, string> = {
  super_admin: "/dashboard/superadmin",
  org_admin: "/dashboard/organization",
  branch_admin: "/dashboard/branch",
  org_member: "/dashboard/employee/test",
};

export const RouteGuard = ({ allowedRoles, children }: RouteGuardProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      // Check for missing or expired token
      if (!user || isTokenExpired()) {
        router.replace("/login");
        toast({
          title: "Session expired",
          description: "Please log in again.",
          variant: "destructive",
        });
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        const redirectPath = roleRedirectMap[user.role] || "/dashboard";
        if (pathname !== redirectPath) {
          router.replace(redirectPath); // ⬅ Redirect to correct dashboard
        }
        setAuthorized(false); // Prevent rendering
      } else {
        setAuthorized(true); // ✅ Only then render children
      }
    }
  }, [user, loading, pathname, allowedRoles, router]);

  // Don't render anything while loading or redirecting
  if (loading || !authorized) return null;

  return <>{children}</>;
};
