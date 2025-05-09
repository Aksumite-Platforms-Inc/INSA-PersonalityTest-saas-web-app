import type React from "react";
import { RouteGuard } from "../../../components/route-guard";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard
      allowedRoles={["org_member", "branch_admin", "org_admin", "super_admin"]}
    >
      {children}
    </RouteGuard>
  );
}
