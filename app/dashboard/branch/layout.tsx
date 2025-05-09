import type React from "react";
import { RouteGuard } from "../../../components/route-guard";

export default function BranchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allowedRoles={["branch_admin", "org_admin", "super_admin"]}>
      {children}
    </RouteGuard>
  );
}
