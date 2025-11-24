"use client";

import { useState, useEffect } from "react";
import {
  getAllBranchMembers,
  deleteOrgMember,
  updateEmployeeStatus,
} from "@/services/user.service";
import {
  getTestCompletionStatus,
  TestCompletionStatus,
} from "@/services/test.service";
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
import { Loader2 } from "lucide-react";
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
  Download,
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
import { ComponentLoader } from "@/components/ui/loaders";
import { EmptyState } from "@/components/ui/empty-state";
import { Users } from "lucide-react";
import { exportEmployeesToExcel } from "@/utils/exportToExcel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EmployeeListProps {
  organizationId: number;
  branchId: number;
  onViewDetails?: (employeeId: number) => void;
}

export function EmployeeList({ organizationId, branchId }: EmployeeListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [completionStatus, setCompletionStatus] = useState<
    Map<number, TestCompletionStatus>
  >(new Map());
  const [loadingCompletionStatus, setLoadingCompletionStatus] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);
  const [employeeToUpdate, setEmployeeToUpdate] = useState<{ id: number; status: string } | null>(null);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!branchId || branchId === 0) return;
      setLoading(true);
      try {
        const fetchedEmployees = await getAllBranchMembers(
          organizationId,
          branchId
        );
        setEmployees(fetchedEmployees);
        console.log("orgid and branch id:", organizationId, branchId);
      } catch (error) {
        console.error("Error fetching branch employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [organizationId, branchId]);

  // Fetch completion status when organizationId or branchId changes
  useEffect(() => {
    if (!organizationId || !branchId || branchId === 0) {
      setCompletionStatus(new Map());
      return;
    }

    setLoadingCompletionStatus(true);
    getTestCompletionStatus(organizationId, branchId)
      .then((res) => {
        if (res.success && res.data) {
          // Create a map of user_id -> completion status for quick lookup
          const statusMap = new Map<number, TestCompletionStatus>();
          res.data.forEach((status) => {
            statusMap.set(status.user_id, status);
          });
          setCompletionStatus(statusMap);
        }
      })
      .catch((err) => {
        console.error("Error fetching completion status:", err);
        // Don't show error to user, just log it
      })
      .finally(() => {
        setLoadingCompletionStatus(false);
      });
  }, [organizationId, branchId]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleUpdateStatusClick = (empId: number, newStatus: string) => {
    setEmployeeToUpdate({ id: empId, status: newStatus });
    setStatusDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!employeeToUpdate) return;

    setProcessing(true);
    try {
      await updateEmployeeStatus(employeeToUpdate.id, employeeToUpdate.status);

      // Refresh the employee list after successful status update
      const fetchedEmployees = await getAllBranchMembers(
        organizationId,
        branchId
      );
      setEmployees(fetchedEmployees);

      toast({
        title: "Status Updated",
        description: `Employee status has been updated to ${employeeToUpdate.status}.`,
      });
      setStatusDialogOpen(false);
      setEmployeeToUpdate(null);
    } catch (error: any) {
      let errorMessage = "Something went wrong. Please check your internet.";
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
      setProcessing(false);
    }
  };

  const handleDeleteClick = (empId: number) => {
    setEmployeeToDelete(empId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!employeeToDelete) return;

    setProcessing(true);
    try {
      await deleteOrgMember(organizationId, employeeToDelete);

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
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    } catch (error: any) {
      let errorMessage = "Something went wrong. Please check your internet.";
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
      setProcessing(false);
    }
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case "inactive":
        return (
          <Badge className="bg-yellow-100 text-yellow-700">Suspended</Badge>
        );
      // case "not-started":
      //   return <Badge className="bg-red-100 text-red-700">Not Started</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Helper function to format incomplete tests list
  const formatIncompleteTests = (
    incompleteTestsList: string | null
  ): string[] => {
    if (!incompleteTestsList) return [];
    return incompleteTestsList.split(",").map((test) => test.trim());
  };

  // Helper function to get test display name
  const getTestDisplayName = (testName: string): string => {
    const testMap: Record<string, string> = {
      mbti: "MBTI",
      big_five: "Big Five",
      riasec: "RIASEC",
      enneagram: "Enneagram",
    };
    return testMap[testName.toLowerCase()] || testName;
  };

  // Helper function to render incomplete tests badge
  const renderIncompleteTests = (employeeId: number) => {
    const status = completionStatus.get(employeeId);
    
    // If no status found, show all tests as incomplete
    if (!status) {
      const allTests = ["mbti", "big_five", "riasec", "enneagram"];
      return (
        <div className="flex flex-wrap gap-1">
          {allTests.map((test) => (
            <Badge
              key={test}
              variant="outline"
              className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs"
            >
              {getTestDisplayName(test)}
            </Badge>
          ))}
        </div>
      );
    }

    // If all tests are completed, show success indicator
    if (status.remaining_tests_count === 0) {
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200 text-xs"
        >
          All Completed
        </Badge>
      );
    }

    // Show incomplete tests
    const incompleteTests = formatIncompleteTests(status.incomplete_tests_list);
    if (incompleteTests.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-1">
        {incompleteTests.map((test) => (
          <Badge
            key={test}
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs"
          >
            {getTestDisplayName(test)}
          </Badge>
        ))}
      </div>
    );
  };

  const handleExportToExcel = () => {
    try {
      // Prepare employee data with completion status
      const employeesWithStatus = filteredEmployees.map((emp) => {
        const status = completionStatus.get(emp.id);
        return {
          ...emp,
          ...status,
        };
      });

      exportEmployeesToExcel(
        employeesWithStatus,
        completionStatus,
        `branch_employees_report_${organizationId}_${branchId}`,
        {
          searchTerm: searchTerm || undefined,
        }
      );

      toast({
        title: "Export Successful",
        description: `Exported ${filteredEmployees.length} employees to Excel.`,
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={handleExportToExcel}
          variant="outline"
          className="gap-2"
          disabled={filteredEmployees.length === 0}
        >
          <Download className="h-4 w-4" />
          Export to Excel
        </Button>
      </div>
      <ComponentLoader loading={loading} size={40}>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Test Status</TableHead>
                <TableHead>Registered On</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <EmptyState
                      icon={searchTerm ? Search : Users}
                      title={searchTerm ? "No matching employees" : "No employees found"}
                      description={
                        searchTerm
                          ? "Try adjusting your search terms to find employees."
                          : "This branch doesn't have any employees yet."
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                paginatedEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{renderStatusBadge(employee.status)}</TableCell>
                    <TableCell>
                      {loadingCompletionStatus ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        renderIncompleteTests(employee.id)
                      )}
                    </TableCell>
                    <TableCell>
                      {employee.created_at
                        ? new Date(employee.created_at).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
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

                            {employee.status === "active" ? (
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                  handleUpdateStatusClick(employee.id, "inactive")
                                }
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                <span>Suspend</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="text-green-600"
                                onClick={() =>
                                  handleUpdateStatusClick(employee.id, "active")
                                }
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                <span>Activate</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(employee.id)}
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
      </ComponentLoader>
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this employee? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={processing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {processing ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Employee Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update the employee status to{" "}
              <strong>{employeeToUpdate?.status}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUpdateStatus}
              disabled={processing}
            >
              {processing ? "Updating..." : "Update"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
