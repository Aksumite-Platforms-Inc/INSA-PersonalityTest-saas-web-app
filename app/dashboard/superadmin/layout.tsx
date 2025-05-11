// app/dashboard/superadmin/layout.tsx
import { RouteGuard } from "@/components/route-guard";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteGuard allowedRoles={["super_admin"]}>{children}</RouteGuard>;
}
