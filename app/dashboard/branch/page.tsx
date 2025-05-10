"use client";

import { useEffect, useState } from "react";
// import { getBranchStats } from "@/services/branchService";
import { PageTitle } from "@/components/page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeProgressChart } from "@/components/branch/employee-progress-chart";
import { EmployeeList } from "@/components/branch/employee-list";

export default function BranchDashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    testsCompleted: 0,
    completionRate: 0,
    changeInEmployees: 0,
    changeInTests: 0,
    changeInCompletionRate: 0,
  });

  // useEffect(() => {
  //   const fetchStats = async () => {
  //     const { data, success, error } = await getBranchStats();
  //     if (success) {
  //       setStats(data);
  //     } else {
  //       console.error("Failed to fetch branch stats:", error);
  //     }
  //   };

  //   fetchStats();
  // }, []);

  return (
    <div className="space-y-6">
      <PageTitle
        title="Branch Dashboard"
        description="Monitor employee test progress and performance"
      />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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

      {/* Charts */}

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Employee Progress</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <EmployeeProgressChart />
        </CardContent>
      </Card>

      {/* Employee List */}
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
