// dashboard/branch/page.tsx
"use client";

import { RouteGuard } from "@/components/route-guard";
import { useState, useEffect, useMemo } from "react";
import { PageTitle } from "@/components/page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestBreakdownChart } from "@/components/dashboard/test-breakdown-chart";
import { IncompleteTestsList } from "@/components/dashboard/incomplete-tests-list";
import { getTestCompletionStatus, TestCompletionStatus } from "@/services/test.service";
import { getOrganizationId, getBranchId } from "@/utils/tokenUtils";
import { PageLoader } from "@/components/ui/loaders";
import { Users, CheckCircle2, TrendingUp, AlertCircle } from "lucide-react";

function BranchDashboardContent() {
  const [allUsers, setAllUsers] = useState<TestCompletionStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const orgId = getOrganizationId();
        const branchId = getBranchId();
        if (!orgId || !branchId) {
          setError("Organization or Branch ID not found. Please log in again.");
          setLoading(false);
          return;
        }

        const completionResponse = await getTestCompletionStatus(orgId, branchId);
        if (completionResponse.success && completionResponse.data) {
          setAllUsers(completionResponse.data);
        }
      } catch (err) {
        setError("Failed to fetch branch stats.");
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Calculate analytics from allUsers
  const analytics = useMemo(() => {
    const totalEmployees = allUsers.length;
    const completedUsers = allUsers.filter((u) => u.remaining_tests_count === 0).length;
    const inProgressUsers = allUsers.filter(
      (u) => u.remaining_tests_count > 0 && u.remaining_tests_count < 4
    ).length;
    const notStartedUsers = allUsers.filter((u) => u.overall_status === "not_started").length;
    const completionRate = totalEmployees > 0 ? Math.round((completedUsers / totalEmployees) * 100) : 0;

    // Test breakdown
    const testBreakdown = {
      mbti: allUsers.filter((u) => u.mbti_completed).length,
      bigFive: allUsers.filter((u) => u.big_five_completed).length,
      riasec: allUsers.filter((u) => u.riasec_completed).length,
      enneagram: allUsers.filter((u) => u.enneagram_completed).length,
    };

    return {
      totalEmployees,
      completedUsers,
      inProgressUsers,
      notStartedUsers,
      completionRate,
      testBreakdown,
    };
  }, [allUsers]);

  if (loading) {
    return <PageLoader loading={true} />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageTitle title="Branch Dashboard" description="Monitor employee test progress and performance" />
        <div className="text-red-500 font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle
        title="Branch Dashboard"
        description="Monitor employee test progress and performance"
      />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.inProgressUsers} in progress, {analytics.notStartedUsers} not started
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.completedUsers}</div>
            {analytics.completedUsers === 0 && (
              <p className="text-xs text-red-500">No tests have been completed yet.</p>
            )}
            <p className="text-xs text-muted-foreground">Employees who completed all 4 tests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics.completedUsers} of {analytics.totalEmployees} employees completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.inProgressUsers}</div>
            <p className="text-xs text-muted-foreground">Employees with partial completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Test Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <TestBreakdownChart data={analytics.testBreakdown} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users with Incomplete Tests</CardTitle>
          </CardHeader>
          <CardContent className="h-80 overflow-auto">
            <IncompleteTestsList users={allUsers} maxItems={8} />
          </CardContent>
        </Card>
      </div>

      {/* Test Type Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">MBTI Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.testBreakdown.mbti}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalEmployees > 0
                ? Math.round((analytics.testBreakdown.mbti / analytics.totalEmployees) * 100)
                : 0}
              % of employees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Big Five Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.testBreakdown.bigFive}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalEmployees > 0
                ? Math.round((analytics.testBreakdown.bigFive / analytics.totalEmployees) * 100)
                : 0}
              % of employees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">RIASEC Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.testBreakdown.riasec}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalEmployees > 0
                ? Math.round((analytics.testBreakdown.riasec / analytics.totalEmployees) * 100)
                : 0}
              % of employees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Enneagram Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.testBreakdown.enneagram}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalEmployees > 0
                ? Math.round((analytics.testBreakdown.enneagram / analytics.totalEmployees) * 100)
                : 0}
              % of employees
            </p>
          </CardContent>
        </Card>
      </div>
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
