"use client";

import { useState, useMemo, useEffect } from "react";
import {
  getAllOrgMembers,
  deleteOrgMember,
  User,
} from "@/services/user.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  ExternalLink,
  Mail,
  FileText,
  UserCog,
  Trash,
} from "lucide-react";
import { getBranchMembers } from "@/services/branch.service";
import {
  getTestCompletionStatus,
  TestCompletionStatus,
} from "@/services/test.service";

interface BranchEmployeesTableProps {
  organizationId: number;
  branchId: number;
  onViewDetails?: (employeeId: number) => void;
}

export function BranchEmployeesTable({
  organizationId,
  branchId,
  onViewDetails,
}: BranchEmployeesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<User[]>([]);
  const [completionStatus, setCompletionStatus] = useState<
    Map<number, TestCompletionStatus>
  >(new Map());

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const members = await getBranchMembers(organizationId, branchId);
        const normalizedMembers = members.map((member) => ({
          ...member,
          name: member.name?.toLowerCase() || "",
          email: member.email?.toLowerCase() || "",
          department: member.department?.toLowerCase() || "",
          position: member.position?.toLowerCase() || "",
          status: member.status?.toLowerCase() || "",
        }));
        setEmployees(normalizedMembers);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, [organizationId, branchId]);

  useEffect(() => {
    const fetchTestStatus = async () => {
      try {
        const response = await getTestCompletionStatus(
          organizationId,
          branchId
        );
        if (response.success && response.data) {
          const statusMap = new Map<number, TestCompletionStatus>();
          response.data.forEach((status) => {
            statusMap.set(status.user_id, status);
          });
          setCompletionStatus(statusMap);
        }
      } catch (error) {
        console.error("Error fetching test completion status:", error);
      }
    };

    if (organizationId && branchId) {
      fetchTestStatus();
    }
  }, [organizationId, branchId]);

  const handleDeleteEmployee = async (employeeId: number) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    try {
      // You need to implement deleteOrgMember in your user.service
      await deleteOrgMember(organizationId, employeeId);
      setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
    } catch (error) {
      alert("Failed to delete employee.");
      console.error(error);
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [employees, searchTerm]);

  const renderStatusBadge = (status?: string) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Inactive
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      default:
        // return <Badge variant="outline">Unknown</Badge>;
        return <Badge>{status}</Badge>;
    }
  };

  const renderTestStatusBadge = (employeeId: number) => {
    const status = completionStatus.get(employeeId);

    if (!status) {
      return (
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-700 border-gray-200"
        >
          Not Started
        </Badge>
      );
    }

    if (status.remaining_tests_count === 0) {
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          All Completed
        </Badge>
      );
    }

    if (status.completed_tests_count === 0) {
      return (
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-700 border-gray-200"
        >
          Not Started
        </Badge>
      );
    }

    return (
      <Badge
        variant="outline"
        className="bg-yellow-50 text-yellow-700 border-yellow-200"
      >
        In Progress ({status.completed_tests_count}/4)
      </Badge>
    );
  };

  return (
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
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Test Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[80px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow
                  key={employee.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onViewDetails?.(employee.id)}
                >
                  <TableCell className="font-medium">
                    {employee.name || "N/A"}
                  </TableCell>
                  <TableCell>{employee.email || "N/A"}</TableCell>
                  <TableCell>{employee.department || "N/A"}</TableCell>
                  <TableCell>{employee.position || "N/A"}</TableCell>
                  <TableCell>{renderStatusBadge(employee.status)}</TableCell>
                  <TableCell>
                    {renderTestStatusBadge(employee.id)}
                  </TableCell>
                  <TableCell>
                    {employee.created_at
                      ? new Date(employee.created_at).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Navigate to the superadmin employee test results page
                            // Use Next.js router for navigation
                            const employeeId = employee.id;
                            // You may need to import useRouter at the top if not already
                            // This is a workaround since this is not a page component
                            window.location.href = `/dashboard/superadmin/results/employee-tests?employeeId=${employeeId}`;
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails?.(employee.id);
                          }}
                          disabled
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          <span>Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => e.stopPropagation()}
                          disabled
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          <span>Send Email</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            // Navigate to the superadmin employee test results page
                            // Use Next.js router for navigation
                            const employeeId = employee.id;
                            // You may need to import useRouter at the top if not already
                            // This is a workaround since this is not a page component
                            window.location.href = `/dashboard/superadmin/results/employee-tests?employeeId=${employeeId}`;
                          }}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          <span>View Test Results</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => e.stopPropagation()}
                          disabled
                        >
                          <UserCog className="mr-2 h-4 w-4" />
                          <span>Edit Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            //
                            const employeeId = employee.id;

                            handleDeleteEmployee(employeeId);
                          }}
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4 " />
                          <span>Remove Employee</span>
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
  );
}
