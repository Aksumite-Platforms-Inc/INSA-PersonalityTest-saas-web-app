"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import {
  BarChart3,
  Building2,
  Users,
  Folder,
  ClipboardList,
  // BarChart is already imported, ensure it's used or remove if not
  BarChart,
  Settings,
  Home,
  FileText, // Added for "My Results" if BarChart is taken
} from "lucide-react";

interface SidebarProps {
  open: boolean;
}

export function Sidebar({ open }: SidebarProps) {
  const { t } = useTranslation();
  const pathname = usePathname();

  // Determine user role from pathname
  const role = pathname?.split("/")[2] || "employee";

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
        open ? "w-64" : "w-0 md:w-16",
        "mt-16" // Account for header height
      )}
    >
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {/* Common navigation items (exclude Dashboard for employee) */}
          {role !== "employee" && (
            <SidebarItem
              href={`/dashboard/${role}`}
              icon={Home}
              label={t("sidebar.dashboard")}
              active={pathname === `/dashboard/${role}`}
              open={open}
            />
          )}

          {/* Role-specific navigation items */}
          {role === "superadmin" && (
            <>
              <SidebarItem
                href="/dashboard/superadmin/organizations"
                icon={Building2}
                label={t("sidebar.organizations")}
                active={pathname?.includes("/organizations") ?? false}
                open={open}
              />

              <SidebarItem
                href="/dashboard/superadmin/results/org-test-results"
                icon={BarChart3}
                label={t("sidebar.results")}
                active={pathname?.includes("/results") ?? false}
                open={open}
              />
            </>
          )}

          {role === "organization" && (
            <>
              <SidebarItem
                href="/dashboard/organization/branches/"
                icon={Building2}
                label={t("sidebar.branches")}
                active={pathname?.includes("/branches") ?? false}
                open={open}
              />

              <SidebarItem
                href="/dashboard/organization/documents/"
                icon={Folder}
                label={t("sidebar.documents")}
                active={pathname?.includes("/documents") ?? false}
                open={open}
              />
            </>
          )}

          {role === "branch" && (
            <>
              <SidebarItem
                href="/dashboard/branch/users"
                icon={Users}
                label={t("sidebar.users")}
                active={pathname?.includes("/users") ?? false}
                open={open}
              />
            </>
          )}

          {role === "employee" && (
            <>
              <SidebarItem
                href="/dashboard/employee/test"
                icon={ClipboardList}
                label={t("sidebar.takeTest")}
                active={pathname?.includes("/dashboard/employee/test") ?? false}
                open={open}
              />
              <SidebarItem
                href="/dashboard/employee/results"
                icon={BarChart} // Or FileText if BarChart has other semantic meaning here
                label={t("sidebar.myResults")} // Assuming "My Results"
                active={pathname === "/dashboard/employee/results"}
                open={open}
              />
            </>
          )}

          {/* Settings is available for all roles */}
          <SidebarItem
            href={`/dashboard/${role}/settings`}
            icon={Settings}
            label={t("sidebar.settings")}
            active={pathname?.includes("/settings") ?? false}
            open={open}
          />
        </nav>
      </div>
    </aside>
  );
}

interface SidebarItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  open: boolean;
}

function SidebarItem({
  href,
  icon: Icon,
  label,
  active,
  open,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Icon size={20} className={cn("flex-shrink-0", !open && "mx-auto")} />
      {open && <span className="ml-3">{label}</span>}
    </Link>
  );
}
