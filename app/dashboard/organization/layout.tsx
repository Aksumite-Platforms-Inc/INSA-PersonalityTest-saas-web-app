import type React from "react";
import { RouteGuard } from "../../../components/route-guard";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allowedRoles={["org_admin", "super_admin"]}>
      {children}
    </RouteGuard>
  );
}
