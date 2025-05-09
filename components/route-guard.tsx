// components/RouteGuard.tsx

"use client";

import {
  useRBACAuth,
  UserRole,
  ROLE_URL_MAP,
} from "@/app/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function RouteGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}) {
  const { user, loading, role, isAuthorized } = useRBACAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!isAuthorized(allowedRoles)) {
        // Redirect to the user's allowed dashboard root if not authorized for this route
        if (role && ROLE_URL_MAP[role]) {
          router.push(`/dashboard/${ROLE_URL_MAP[role]}`);
        } else {
          router.push("/unauthorized");
        }
      }
    }
  }, [loading, user, isAuthorized, allowedRoles, router, role, pathname]);

  if (loading || !user) return <div>Loading...</div>;
  return <>{children}</>;
}
