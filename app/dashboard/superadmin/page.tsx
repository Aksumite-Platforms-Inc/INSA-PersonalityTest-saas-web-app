"use client";

import { PageTitle } from "@/components/page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrganizationsChart } from "@/components/dashboard/organizations-chart";
import { TestsCompletedChart } from "@/components/dashboard/tests-completed-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { listOrganizations } from "@/services/organization.service";
import { PageLoader } from "@/components/ui/loaders";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useEffect, useState } from "react";

export default function SuperadminDashboard() {
  const [totalOrganizations, setTotalOrganizations] = useState(0);
  const [organizationsBySector, setOrganizationsBySector] = useState<Record<string, number>>({});
  const [testsCompleted, setTestsCompleted] = useState(0);
  const [testsPerMonth, setTestsPerMonth] = useState<number[]>([]);
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
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Organizations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrganizations}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
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
              <div className="text-2xl font-bold">{testsCompleted}</div>
              <p className="text-xs text-muted-foreground">
                __% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Organizations by Sector</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <OrganizationsChart data={organizationsBySector} />
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Tests Completed</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <TestsCompletedChart />
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card> */}
      </div>
    </PageLoader>
  );
}
