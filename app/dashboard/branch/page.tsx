// dashboard/branch/page.tsx
"use client";

import { RouteGuard } from "@/components/route-guard";
import { useState, useEffect } from "react";
import { PageTitle } from "@/components/page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeProgressChart } from "@/components/branch/employee-progress-chart";
import { EmployeeList } from "@/components/branch/employee-list";
import { getAllBranchMembers } from "@/services/user.service";
import { getBranchById } from "@/services/branch.service";
import { getOrganizationId, getBranchId } from "@/utils/tokenUtils";

function BranchDashboardContent() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    testsCompleted: 0,
    completionRate: 0,
    changeInEmployees: 0,
    changeInTests: 0,
    changeInCompletionRate: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const orgId = getOrganizationId();
        const branchId = getBranchId();
        if (!orgId || !branchId) return;
        // Fetch all branch members
        const members = await getAllBranchMembers(orgId, branchId);
        // Calculate stats using is_completed flag returned by API
        const totalEmployees = members.length;
        const testsCompleted = members.filter((m) => !!m.is_completed).length;
        const completionRate =
          totalEmployees > 0
            ? Math.round((testsCompleted / totalEmployees) * 100)
            : 0;
        // TODO: Fetch and calculate changeInEmployees, changeInTests, changeInCompletionRate from backend if available
        setStats((prev) => ({
          ...prev,
          totalEmployees,
          testsCompleted,
          completionRate,
        }));
      } catch (err) {
        // Optionally handle error
        setStats((prev) => ({
          ...prev,
          totalEmployees: 0,
          testsCompleted: 0,
          completionRate: 0,
        }));
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <PageTitle
        title="Branch Dashboard"
        description="Monitor employee test progress and performance"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {stats.changeInEmployees > 0
                ? `+${stats.changeInEmployees}`
                : stats.changeInEmployees}{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Tests Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.testsCompleted}</div>
            <p className="text-xs text-muted-foreground">
              {stats.changeInTests > 0
                ? `+${stats.changeInTests}`
                : stats.changeInTests}{" "}
              from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.changeInCompletionRate > 0
                ? `+${stats.changeInCompletionRate}%`
                : stats.changeInCompletionRate}
              % from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* <Card>
        <CardHeader>
          <CardTitle className="text-center">Employee Progress</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <EmployeeProgressChart />
        </CardContent>
      </Card> */}

      {/* <Card>
        <CardHeader>
          <CardTitle>Employee Test Status</CardTitle>
        </CardHeader>
        <CardContent> */}
      {/* <EmployeeList organizationId={} branchId={} /> */}
      {/* </CardContent>
      </Card> */}
    </div>
  );
}

export default function BranchDashboardPage() {
  return (
    <RouteGuard allowedRoles={["branch_admin"]}>
      <BranchDashboardContent />
    </RouteGuard>
  );
}
