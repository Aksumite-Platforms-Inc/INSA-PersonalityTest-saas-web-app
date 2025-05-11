// app/dashboard/organization/layout.tsx
import { RouteGuard } from "@/components/route-guard";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteGuard allowedRoles={["org_admin"]}>{children}</RouteGuard>;
}
