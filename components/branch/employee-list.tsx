"use client";

import { useState, useEffect } from "react";
import {
  getAllBranchMembers,
  deleteOrgMember,
  updateEmployeeStatus,
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
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ExternalLink,
  Mail,
  FileText,
  UserCog,
  Shield,
  Ban,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface EmployeeListProps {
  organizationId: number;
  branchId: number;
  onViewDetails?: (employeeId: number) => void;
}

export function EmployeeList({ organizationId, branchId }: EmployeeListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [employees, setEmployees] = useState<any[]>([]);
  const { toast } = useToast();
  // const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!branchId || branchId === 0) return; // avoid invalid API calls

      try {
        const fetchedEmployees = await getAllBranchMembers(
          organizationId,
          branchId
        );
        setEmployees(fetchedEmployees);
        console.log("orgid and branch id:", organizationId, branchId);
      } catch (error) {
        console.error("Error fetching branch employees:", error);
      }
    };

    fetchEmployees();
  }, [organizationId, branchId]);

  const handleUpdateStatus = async (empId: number, newStatus: string) => {
    if (!confirm(`Are you sure you want to update the status to ${newStatus}?`))
      return;

    try {
      await updateEmployeeStatus(empId, newStatus);

      // Refresh the employee list after successful status update
      const fetchedEmployees = await getAllBranchMembers(
        organizationId,
        branchId
      );
      setEmployees(fetchedEmployees);

      toast({
        title: "Status Updated",
        description: `Employee status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response === "object" &&
        (error as any).response !== null &&
        "data" in (error as any).response &&
        typeof (error as any).response.data === "object" &&
        (error as any).response.data !== null &&
        "message" in (error as any).response.data
      ) {
        errorMessage = (error as any).response.data.message;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (empId: number) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    // setLoading(true);
    try {
      await deleteOrgMember(organizationId, empId);

      // setEmployees((prev) => prev.filter((emp) => emp.id !== empId));
      // Refresh the employee list after successful deletion
      const fetchedEmployees = await getAllBranchMembers(
        organizationId,
        branchId
      );
      setEmployees(fetchedEmployees);

      toast({
        title: "Employee Removed",
        description: `Employee has been removed successfully.`,
      });
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response === "object" &&
        (error as any).response !== null &&
        "data" in (error as any).response &&
        typeof (error as any).response.data === "object" &&
        (error as any).response.data !== null &&
        "message" in (error as any).response.data
      ) {
        errorMessage = (error as any).response.data.message;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      // setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case "in-progress":
        return (
          <Badge className="bg-yellow-100 text-yellow-700">In Progress</Badge>
        );
      case "not-started":
        return <Badge className="bg-red-100 text-red-700">Not Started</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
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
              <TableHead>Status</TableHead>
              <TableHead>Registered On</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  No employees found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{renderStatusBadge(employee.status)}</TableCell>
                  <TableCell>
                    {employee.created_at
                      ? new Date(employee.created_at).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  {/* create and action button to delete employee */}
                  <TableCell>
                    <div className="flex items-center space-x-2 group relative">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>

                          {/* <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/dashboard/superadmin/organizations/${org.id}`
                              )
                            }
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Details</span>
                          </DropdownMenuItem> */}

                          {/* <DropdownMenuSeparator /> */}
                          {employee.status === "active" ? (
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() =>
                                handleUpdateStatus(employee.id, "inactive")
                              }
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              <span>Suspend</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-green-600"
                              onClick={() =>
                                handleUpdateStatus(employee.id, "active")
                              }
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              <span>Activate</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={handleDelete.bind(null, employee.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
