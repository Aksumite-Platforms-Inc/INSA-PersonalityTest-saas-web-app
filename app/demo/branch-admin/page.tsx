"use client";

import { PageTitle } from "@/components/page-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

// Demo data
const data = [
  { name: "Completed All Tests", value: 98 },
  { name: "Partially Completed", value: 42 },
  { name: "Not Started", value: 16 },
];

// Demo data
const employees = [
  {
    id: 1,
    name: "Abebe Kebede",
    department: "Finance",
    position: "Accountant",
    testStatus: "completed",
    lastActivity: "2023-03-15",
  },
  {
    id: 2,
    name: "Tigist Haile",
    department: "HR",
    position: "HR Specialist",
    testStatus: "in-progress",
    lastActivity: "2023-03-14",
  },
  {
    id: 3,
    name: "Dawit Tadesse",
    department: "IT",
    position: "Systems Administrator",
    testStatus: "completed",
    lastActivity: "2023-03-12",
  },
  {
    id: 4,
    name: "Hiwot Girma",
    department: "Operations",
    position: "Operations Manager",
    testStatus: "not-started",
    lastActivity: null,
  },
  {
    id: 5,
    name: "Solomon Tesfaye",
    department: "Marketing",
    position: "Marketing Specialist",
    testStatus: "completed",
    lastActivity: "2023-03-10",
  },
  {
    id: 6,
    name: "Meron Alemu",
    department: "Finance",
    position: "Financial Analyst",
    testStatus: "completed",
    lastActivity: "2023-03-09",
  },
  {
    id: 7,
    name: "Yonas Bekele",
    department: "Management",
    position: "Project Manager",
    testStatus: "completed",
    lastActivity: "2023-03-08",
  },
  {
    id: 8,
    name: "Sara Tesfaye",
    department: "Research",
    position: "Research Specialist",
    testStatus: "in-progress",
    lastActivity: "2023-03-15",
  },
  {
    id: 9,
    name: "Dawit Haile",
    department: "Operations",
    position: "Operations Lead",
    testStatus: "completed",
    lastActivity: "2023-03-07",
  },
  {
    id: 10,
    name: "Hanna Girma",
    department: "IT",
    position: "Technical Specialist",
    testStatus: "completed",
    lastActivity: "2023-03-06",
  },
];

const COLORS = ["#4ade80", "#facc15", "#f87171"];

export default function DemoBranchDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Function to render status badge with appropriate variant
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Completed
          </Badge>
        );
      case "in-progress":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            In Progress
          </Badge>
        );
      case "not-started":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Not Started
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  return (
    <div className="space-y-6">
      <PageTitle
        title="Branch Dashboard"
        description="Monitor employee test progress and performance (mock data)"
      />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">123</div>
            <p className="text-xs text-muted-foreground">Static demo data</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tests Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">310</div>
            <p className="text-xs text-muted-foreground">Mocked for preview</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76.5%</div>
            <p className="text-xs text-muted-foreground">Simulated trend</p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Employee Progress</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e5e7eb",
                  color: "#000000",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Placeholder Employee List */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Test Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
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
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Test Status</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No employees found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">
                          {employee.name}
                        </TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>
                          {renderStatusBadge(employee.testStatus)}
                        </TableCell>
                        <TableCell>
                          {employee.lastActivity
                            ? new Date(
                                employee.lastActivity
                              ).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev: number) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev: number) =>
                      Math.min(prev + 1, totalPages)
                    )
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Demo Notice */}
      <div className="bg-yellow-100 p-4 text-center text-yellow-800 font-medium rounded-lg">
        This is a demo version of the branch dashboard. Data shown is not live.
      </div>
    </div>
  );
}
