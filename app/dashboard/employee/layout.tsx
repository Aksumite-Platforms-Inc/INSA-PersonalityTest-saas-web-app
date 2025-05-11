// app/dashboard/employee/layout.tsx
import { RouteGuard } from "@/components/route-guard";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteGuard allowedRoles={["org_member"]}>{children}</RouteGuard>;
}
