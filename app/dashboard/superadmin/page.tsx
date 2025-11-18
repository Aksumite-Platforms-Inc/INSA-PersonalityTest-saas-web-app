"use client";

import { PageTitle } from "@/components/page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrganizationsChart } from "@/components/dashboard/organizations-chart";
import { TestCompletionRateChart } from "@/components/dashboard/test-completion-rate-chart";
import { TestBreakdownChart } from "@/components/dashboard/test-breakdown-chart";
import { IncompleteTestsList } from "@/components/dashboard/incomplete-tests-list";
import { listOrganizations } from "@/services/organization.service";
import { getTestCompletionStatus, TestCompletionStatus } from "@/services/test.service";
import { PageLoader } from "@/components/ui/loaders";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useEffect, useState, useMemo } from "react";
import { Building2, Users, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";

export default function SuperadminDashboard() {
  const [totalOrganizations, setTotalOrganizations] = useState(0);
  const [organizationsBySector, setOrganizationsBySector] = useState<Record<string, number>>({});
  const [allUsers, setAllUsers] = useState<TestCompletionStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const isOnline = useOnlineStatus();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch organizations
        const organizations = await listOrganizations();
        setTotalOrganizations(organizations.length);

        // Count orgs by sector
        const sectorCounts: Record<string, number> = {};
        organizations.forEach((org) => {
          const sector = org.sector || "Unknown";
          sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
        });
        setOrganizationsBySector(sectorCounts);

        // Fetch all users' test completion status
        const completionResponse = await getTestCompletionStatus();
        if (completionResponse.success && completionResponse.data) {
          setAllUsers(completionResponse.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate analytics from allUsers
  const analytics = useMemo(() => {
    const totalUsers = allUsers.length;
    const completedUsers = allUsers.filter((u) => u.remaining_tests_count === 0).length;
    const inProgressUsers = allUsers.filter(
      (u) => u.remaining_tests_count > 0 && u.remaining_tests_count < 4
    ).length;
    const notStartedUsers = allUsers.filter((u) => u.overall_status === "not_started").length;
    const completionRate = totalUsers > 0 ? Math.round((completedUsers / totalUsers) * 100) : 0;

    // Test breakdown
    const testBreakdown = {
      mbti: allUsers.filter((u) => u.mbti_completed).length,
      bigFive: allUsers.filter((u) => u.big_five_completed).length,
      riasec: allUsers.filter((u) => u.riasec_completed).length,
      enneagram: allUsers.filter((u) => u.enneagram_completed).length,
    };

    // Organization completion data
    const orgCompletionMap = new Map<string, { completed: number; total: number }>();
    allUsers.forEach((user) => {
      const orgName = user.organization_name || "Unknown";
      const current = orgCompletionMap.get(orgName) || { completed: 0, total: 0 };
      current.total++;
      if (user.remaining_tests_count === 0) {
        current.completed++;
      }
      orgCompletionMap.set(orgName, current);
    });

    const orgCompletionData = Array.from(orgCompletionMap.entries())
      .map(([name, data]) => ({
        name: name.length > 15 ? name.substring(0, 15) + "..." : name,
        completed: data.completed,
        incomplete: data.total - data.completed,
        total: data.total,
      }))
      .slice(0, 10); // Top 10 organizations

    return {
      totalUsers,
      completedUsers,
      inProgressUsers,
      notStartedUsers,
      completionRate,
      testBreakdown,
      orgCompletionData,
    };
  }, [allUsers]);

  if (!isOnline) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <PageTitle
          title="No Internet Connection"
          description="Please check your connection and try again."
        />
      </div>
    );
  }

  return (
    <PageLoader loading={loading}>
      <div className="space-y-6">
        <PageTitle
          title="Superadmin Dashboard"
          description="Overview of all organizations and test activities"
        />

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrganizations}</div>
              <p className="text-xs text-muted-foreground">Active organizations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Across all organizations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.completedUsers}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.inProgressUsers} in progress, {analytics.notStartedUsers} not started
              </p>
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
                {analytics.completedUsers} of {analytics.totalUsers} users completed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Organizations by Sector</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <OrganizationsChart data={organizationsBySector} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Completion by Organization</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {analytics.orgCompletionData.length > 0 ? (
                <TestCompletionRateChart data={analytics.orgCompletionData} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
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

        {/* Additional Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">MBTI Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.testBreakdown.mbti}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.totalUsers > 0
                  ? Math.round((analytics.testBreakdown.mbti / analytics.totalUsers) * 100)
                  : 0}
                % of users
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
                {analytics.totalUsers > 0
                  ? Math.round((analytics.testBreakdown.bigFive / analytics.totalUsers) * 100)
                  : 0}
                % of users
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
                {analytics.totalUsers > 0
                  ? Math.round((analytics.testBreakdown.riasec / analytics.totalUsers) * 100)
                  : 0}
                % of users
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
                {analytics.totalUsers > 0
                  ? Math.round((analytics.testBreakdown.enneagram / analytics.totalUsers) * 100)
                  : 0}
                % of users
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLoader>
  );
}
