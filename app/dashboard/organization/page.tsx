import { PageTitle } from "@/components/page-title"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BranchesChart } from "@/components/organization/branches-chart"
import { EmployeeCompletionChart } from "@/components/organization/employee-completion-chart"
import { TestTypeDistribution } from "@/components/organization/test-type-distribution"
import { RecentEmployeeActivity } from "@/components/organization/recent-employee-activity"

export default function OrganizationDashboard() {
  return (
    <div className="space-y-6">
      <PageTitle title="Organization Dashboard" description="Overview of branches, employees, and test activities" />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground">+32 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.5%</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72.3</div>
            <p className="text-xs text-muted-foreground">+1.8 from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-1">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Employee Test Completion</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <EmployeeCompletionChart />
          </CardContent>
        </Card>
      </div>
      {/* Recent Employee Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Employee Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentEmployeeActivity />
        </CardContent>
      </Card>
    </div>
  )
}
