import { PageTitle } from "@/components/page-title"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ComplianceTable } from "@/components/superadmin/compliance-table"
import { ComplianceChart } from "@/components/superadmin/compliance-chart"

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <PageTitle
        title="Compliance Monitoring"
        description="Monitor organization compliance with testing requirements"
      />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.4%</div>
            <p className="text-xs text-muted-foreground">+1.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliant Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21/24</div>
            <p className="text-xs text-muted-foreground">3 organizations need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">All data properly retained</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.7%</div>
            <p className="text-xs text-muted-foreground">-0.3% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Trends</CardTitle>
          <CardDescription>Monthly compliance rates across all organizations</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ComplianceChart />
        </CardContent>
      </Card>

      {/* Compliance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Compliance Status</CardTitle>
          <CardDescription>Detailed compliance information for each organization</CardDescription>
        </CardHeader>
        <CardContent>
          <ComplianceTable />
        </CardContent>
      </Card>
    </div>
  )
}
