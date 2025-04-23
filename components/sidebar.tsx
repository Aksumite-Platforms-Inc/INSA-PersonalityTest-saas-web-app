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
  ClipboardList,
  Settings,
  Shield,
  LineChart,
  Home,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
}

export function Sidebar({ open }: SidebarProps) {
  const { t } = useTranslation();
  const pathname = usePathname();

  // Determine user role from pathname
  const role = pathname.split("/")[2] || "employee";

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
          {/* Common navigation items */}
          <SidebarItem
            href={`/dashboard/${role}`}
            icon={Home}
            label={t("sidebar.dashboard")}
            active={pathname === `/dashboard/${role}`}
            open={open}
          />

          {/* Role-specific navigation items */}
          {role === "superadmin" && (
            <>
              <SidebarItem
                href="/dashboard/superadmin/organizations"
                icon={Building2}
                label={t("sidebar.organizations")}
                active={pathname.includes("/organizations")}
                open={open}
              />
              <SidebarItem
                href="/dashboard/superadmin/users"
                icon={Users}
                label={t("sidebar.users")}
                active={pathname.includes("/users")}
                open={open}
              />
              <SidebarItem
                href="/dashboard/superadmin/tests"
                icon={ClipboardList}
                label={t("sidebar.tests")}
                active={pathname.includes("/tests")}
                open={open}
              />
              <SidebarItem
                href="/dashboard/superadmin/compliance"
                icon={Shield}
                label={t("sidebar.compliance")}
                active={pathname.includes("/compliance")}
                open={open}
              />
            </>
          )}

          {role === "organization" && (
            <>
              <SidebarItem
                href="/dashboard/organization/branches"
                icon={Building2}
                label={t("sidebar.branches")}
                active={pathname.includes("/branches")}
                open={open}
              />
              <SidebarItem
                href="/dashboard/organization/employees"
                icon={Users}
                label={t("sidebar.employees")}
                active={pathname.includes("/employees")}
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
                active={pathname.includes("/users")}
                open={open}
              />
              <SidebarItem
                href="/dashboard/branch/"
                icon={BarChart3}
                label={t("sidebar.testProgress")}
                active={pathname.includes("/tests")}
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
                active={pathname.includes("/test")}
                open={open}
              />
              {/* <SidebarItem
                href="/dashboard/employee/results"
                icon={BarChart3}
                label={t("sidebar.results")}
                active={pathname.includes("/results")}
                open={open}
              /> */}
            </>
          )}

          {/* Settings is available for all roles */}
          <SidebarItem
            href={`/dashboard/${role}/settings`}
            icon={Settings}
            label={t("sidebar.settings")}
            active={pathname.includes("/settings")}
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
