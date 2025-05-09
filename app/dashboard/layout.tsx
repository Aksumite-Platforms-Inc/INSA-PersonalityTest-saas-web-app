import { RouteGuard } from "@/components/route-guard";
import type React from "react";
import { AppShell } from "@/components/app-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only authenticated users with any valid role can access dashboard
  return (
    <RouteGuard
      allowedRoles={["super_admin", "org_admin", "branch_admin", "org_member"]}
    >
      <AppShell>{children}</AppShell>
    </RouteGuard>
  );
}
