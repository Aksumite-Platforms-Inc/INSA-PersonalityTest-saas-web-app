"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react"

// Demo data
const organizations = [
  {
    id: 1,
    name: "Ministry of Education",
    complianceRate: 98.5,
    lastAudit: "2023-05-15",
    issues: 0,
    status: "compliant",
  },
  {
    id: 2,
    name: "Ministry of Health",
    complianceRate: 97.2,
    lastAudit: "2023-05-10",
    issues: 1,
    status: "compliant",
  },
  {
    id: 3,
    name: "Addis Ababa University",
    complianceRate: 85.8,
    lastAudit: "2023-04-28",
    issues: 3,
    status: "warning",
  },
  {
    id: 4,
    name: "Commercial Bank of Ethiopia",
    complianceRate: 96.5,
    lastAudit: "2023-05-05",
    issues: 1,
    status: "compliant",
  },
  {
    id: 5,
    name: "Ethiopian Airlines",
    complianceRate: 94.8,
    lastAudit: "2023-05-12",
    issues: 2,
    status: "compliant",
  },
  {
    id: 6,
    name: "Ethio Telecom",
    complianceRate: 72.5,
    lastAudit: "2023-04-15",
    issues: 8,
    status: "non-compliant",
  },
]

export function ComplianceTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOrganizations = organizations.filter((org) => org.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Function to render status badge with appropriate variant
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "compliant":
        return (
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Compliant
            </Badge>
          </div>
        )
      case "warning":
        return (
          <div className="flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              Warning
            </Badge>
          </div>
        )
      case "non-compliant":
        return (
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              Non-Compliant
            </Badge>
          </div>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Function to render progress bar with appropriate color
  const getProgressColor = (rate: number) => {
    if (rate >= 90) return "bg-green-500"
    if (rate >= 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search organizations..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Compliance Rate</TableHead>
              <TableHead>Last Audit</TableHead>
              <TableHead>Issues</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrganizations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No organizations found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrganizations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-full max-w-[100px]">
                        <Progress
                          value={org.complianceRate}
                          className="h-2"
                          indicatorClassName={getProgressColor(org.complianceRate)}
                        />
                      </div>
                      <span>{org.complianceRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(org.lastAudit).toLocaleDateString()}</TableCell>
                  <TableCell>{org.issues}</TableCell>
                  <TableCell>{renderStatusBadge(org.status)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View Report
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
