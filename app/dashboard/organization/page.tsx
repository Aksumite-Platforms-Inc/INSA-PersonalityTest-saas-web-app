"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageTitle } from "@/components/page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeCompletionChart } from "@/components/organization/employee-completion-chart";
import { RecentEmployeeActivity } from "@/components/organization/recent-employee-activity";
import { DocumentNotifications } from "@/components/organization/document-notifications";
import { getOrganizationId } from "@/utils/tokenUtils";
import { getAllBranches } from "@/services/branch.service";
import { getAllOrgMembers } from "@/services/user.service";

export default function OrganizationDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalBranches: 0,
    totalEmployees: 0,
    completionRate: 0,
    changeInBranches: 0,
    changeInEmployees: 0,
    changeInCompletionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const orgId = getOrganizationId();
        if (!orgId) {
          setError("Organization ID not found. Please log in again.");
          setLoading(false);
          return;
        }
        const [branches, employees] = await Promise.all([
          getAllBranches(orgId),
          getAllOrgMembers(orgId),
        ]);
        setStats((prev) => ({
          ...prev,
          totalBranches: branches.length,
          totalEmployees: employees.length,
        }));
      } catch (err) {
        setError("Failed to fetch organization stats.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading organization stats...</div>;
  if (error) return <div className="text-red-500 font-semibold">{error}</div>;

  return (
    <div className="space-y-6">
      <PageTitle
        title="Organization Dashboard"
        description="Overview of branches, employees, and test activities"
      />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Branches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBranches}</div>
            <p className="text-xs text-muted-foreground">
              {stats.changeInBranches > 0
                ? `+${stats.changeInBranches}`
                : stats.changeInBranches}{" "}
              from last month
            </p>
          </CardContent>
        </Card>
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
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Test Completion Rate
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
        </Card> */}
      </div>

      {/* Chart */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Employee Test Completion</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <EmployeeCompletionChart />
        </CardContent>
      </Card> */}

      {/* Recent Employee Activity */}
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full">
          <DocumentNotifications />
        </div>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Employee Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentEmployeeActivity />
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
