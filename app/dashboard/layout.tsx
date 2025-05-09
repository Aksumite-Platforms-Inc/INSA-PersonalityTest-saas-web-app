import type React from "react";
import { RouteGuard } from "../../components/route-guard";

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteGuard allowedRoles={["super_admin"]}>{children}</RouteGuard>;
}
