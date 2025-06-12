// dashboard/branch/page.tsx
"use client";

import { RouteGuard } from "@/components/route-guard";
import { useState } from "react";
import { PageTitle } from "@/components/page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeProgressChart } from "@/components/branch/employee-progress-chart";
import { EmployeeList } from "@/components/branch/employee-list";

function BranchDashboardContent() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    testsCompleted: 0,
    completionRate: 0,
    changeInEmployees: 0,
    changeInTests: 0,
    changeInCompletionRate: 0,
  });

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

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Employee Progress</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <EmployeeProgressChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employee Test Status</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <EmployeeList organizationId={} branchId={} /> */}
        </CardContent>
      </Card>
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
