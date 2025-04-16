import { PageTitle } from "@/components/page-title"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmployeeProgressChart } from "@/components/branch/employee-progress-chart"
import { TestCompletionTimeline } from "@/components/branch/test-completion-timeline"
import { TopPerformers } from "@/components/branch/top-performers"
import { EmployeeList } from "@/components/branch/employee-list"

export default function BranchDashboard() {
  return (
    <div className="space-y-6">
      <PageTitle title="Branch Dashboard" description="Monitor employee test progress and performance" />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+4 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">423</div>
            <p className="text-xs text-muted-foreground">+18 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82.4%</div>
            <p className="text-xs text-muted-foreground">+3.6% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Employee Progress</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <EmployeeProgressChart />
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Test Completion Timeline</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <TestCompletionTimeline />
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <TopPerformers />
        </CardContent>
      </Card>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Test Status</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeeList />
        </CardContent>
      </Card>
    </div>
  )
}
