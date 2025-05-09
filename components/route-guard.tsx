// components/RouteGuard.tsx

"use client";

import { useAuth } from "@/app/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RouteGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!allowedRoles.includes(user.role)) {
        router.push("/unauthorized");
      }
    }
  }, [loading, user, router, allowedRoles]);

  if (loading || !user) return <div>Loading...</div>;
  return <>{children}</>;
}
