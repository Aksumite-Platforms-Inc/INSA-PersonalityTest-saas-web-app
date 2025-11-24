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
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { getBranchMembers } from "@/services/branch.service";
import {
  getTestCompletionStatus,
  TestCompletionStatus,
} from "@/services/test.service";
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
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/ui/empty-state";
import { Users } from "lucide-react";
import { exportEmployeesToExcel } from "@/utils/exportToExcel";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [completionStatus, setCompletionStatus] = useState<
    Map<number, TestCompletionStatus>
  >(new Map());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const itemsPerPage = 10;

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

  const handleDeleteClick = (employeeId: number) => {
    setEmployeeToDelete(employeeId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    
    setDeleting(true);
    try {
      await deleteOrgMember(organizationId, employeeToDelete);
      setEmployees((prev) => prev.filter((emp) => emp.id !== employeeToDelete));
      toast({
        title: "Employee Removed",
        description: "The employee has been successfully removed.",
      });
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    } catch (error: any) {
      let errorMessage = "Failed to delete employee. Please try again.";
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
      setDeleting(false);
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

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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

  const renderTestStatusBadge = (employeeId: number) => {
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
            {paginatedEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="p-0">
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
                            handleDeleteClick(employee.id);
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
      {totalPages > 1 && (
        <div className="flex justify-end items-center space-x-2 mt-4">
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
            <AlertDialogTitle>Remove Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this employee? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEmployee}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
