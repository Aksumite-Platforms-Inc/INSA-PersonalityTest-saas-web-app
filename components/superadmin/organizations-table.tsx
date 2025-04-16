"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Trash2, Shield, Ban } from "lucide-react"

// Demo data
const organizations = [
  {
    id: 1,
    name: "Ministry of Education",
    sector: "Government",
    status: "active",
    users: 245,
    testsCompleted: 189,
    complianceStatus: "compliant",
    createdAt: "2023-01-15",
  },
  {
    id: 2,
    name: "Ministry of Health",
    sector: "Government",
    status: "active",
    users: 312,
    testsCompleted: 278,
    complianceStatus: "compliant",
    createdAt: "2023-02-03",
  },
  {
    id: 3,
    name: "Addis Ababa University",
    sector: "Education",
    status: "active",
    users: 156,
    testsCompleted: 98,
    complianceStatus: "warning",
    createdAt: "2023-03-21",
  },
  {
    id: 4,
    name: "Commercial Bank of Ethiopia",
    sector: "Finance",
    status: "active",
    users: 203,
    testsCompleted: 175,
    complianceStatus: "compliant",
    createdAt: "2023-04-10",
  },
  {
    id: 5,
    name: "Ethiopian Airlines",
    sector: "Transportation",
    status: "active",
    users: 178,
    testsCompleted: 145,
    complianceStatus: "compliant",
    createdAt: "2023-05-05",
  },
  {
    id: 6,
    name: "Ethio Telecom",
    sector: "Telecommunications",
    status: "suspended",
    users: 220,
    testsCompleted: 0,
    complianceStatus: "non-compliant",
    createdAt: "2023-06-18",
  },
]

export function OrganizationsTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.sector.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Function to render status badge with appropriate variant
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Active
          </Badge>
        )
      case "suspended":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Suspended
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Function to render compliance status badge with appropriate variant
  const renderComplianceBadge = (status: string) => {
    switch (status) {
      case "compliant":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Compliant
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Warning
          </Badge>
        )
      case "non-compliant":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Non-Compliant
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
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
              <TableHead>Name</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Tests Completed</TableHead>
              <TableHead>Compliance</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrganizations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No organizations found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrganizations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell>{org.sector}</TableCell>
                  <TableCell>{renderStatusBadge(org.status)}</TableCell>
                  <TableCell>{org.users}</TableCell>
                  <TableCell>{org.testsCompleted}</TableCell>
                  <TableCell>{renderComplianceBadge(org.complianceStatus)}</TableCell>
                  <TableCell>{new Date(org.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Compliance</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {org.status === "active" ? (
                          <DropdownMenuItem className="text-red-600">
                            <Ban className="mr-2 h-4 w-4" />
                            <span>Suspend</span>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600">
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Activate</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
