import { PageTitle } from "@/components/page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrganizationsChart } from "@/components/dashboard/organizations-chart";
import { TestsCompletedChart } from "@/components/dashboard/tests-completed-chart";
import { RegionalHeatmap } from "@/components/dashboard/regional-heatmap";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default function SuperadminDashboard() {
  return (
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
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tests Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,345</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Test Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24m 32s</div>
            <p className="text-xs text-muted-foreground">-2m from last month</p>
          </CardContent>
        </Card> */}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Organizations</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <OrganizationsChart />
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

      {/* Regional Heatmap */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Regional Participation</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <RegionalHeatmap />
        </CardContent>
      </Card> */}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentActivity />
        </CardContent>
      </Card>
    </div>
  );
}
