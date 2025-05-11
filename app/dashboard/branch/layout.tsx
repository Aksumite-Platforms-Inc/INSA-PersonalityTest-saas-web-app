// app/dashboard/branch/layout.tsx
import { RouteGuard } from "@/components/route-guard";

export default function BranchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteGuard allowedRoles={["branch_admin"]}>{children}</RouteGuard>;
}
