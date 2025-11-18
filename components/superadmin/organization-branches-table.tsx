"use client";

import { useState, useMemo, useEffect } from "react";
import { getAllOrgMembers, User } from "@/services/user.service";
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
  Edit,
} from "lucide-react";
import {
  getAllBranches,
  Branch,
  deleteBranch,
} from "@/services/branch.service";
import { useRouter } from "next/navigation";
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
import { Loader2, Building2, Search } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

import employee from "@/app/dashboard/employee";

interface OrganizationBranchesTableProps {
  organizationId: number;
  onViewDetails?: (employeeId: number) => void;
}

export function OrganizationBranchesTable({
  organizationId,
  onViewDetails,
}: OrganizationBranchesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [Branches, setBranches] = useState<Branch[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const members = await getAllBranches(organizationId);
        const normalizedBranches = members.map((member) => ({
          ...member,
          name: member.name?.toLowerCase() || "",
          email: member.email?.toLowerCase() || "",
          address: member.address?.toLowerCase() || "",
          created_at: member.created_at?.toLowerCase() || "",
        }));
        setBranches(normalizedBranches);
      } catch (error) {
        console.error("Error fetching Branches:", error);
      }
    };

    fetchBranches();
  }, [organizationId]);

  const handleDeleteClick = (branchId: number) => {
    setBranchToDelete(branchId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteBranch = async () => {
    if (!branchToDelete) return;
    
    setDeleting(true);
    try {
      await deleteBranch(organizationId, branchToDelete);
      setBranches((prev) => prev.filter((emp) => emp.id !== branchToDelete));
      toast({
        title: "Branch Removed",
        description: "The branch has been successfully removed.",
      });
      setDeleteDialogOpen(false);
      setBranchToDelete(null);
    } catch (error: any) {
      let errorMessage = "Failed to remove branch. Please try again.";
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

  const filteredBranches = useMemo(() => {
    return Branches.filter((branch) => {
      const matchesSearch =
        branch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.address?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [Branches, searchTerm]);

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
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Branches..."
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
              <TableHead>Address</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBranches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="p-0">
                  <EmptyState
                    icon={searchTerm ? Search : Building2}
                    title={searchTerm ? "No matching branches" : "No branches found"}
                    description={
                      searchTerm
                        ? "Try adjusting your search terms to find branches."
                        : "This organization doesn't have any branches yet."
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              filteredBranches.map((Branch) => (
                <TableRow
                  key={Branch.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onViewDetails?.(Branch.id)}
                >
                  <TableCell className="font-medium">
                    {Branch.name || "N/A"}
                  </TableCell>
                  <TableCell>{Branch.email || "N/A"}</TableCell>
                  <TableCell>{Branch.address || "N/A"}</TableCell>
                  <TableCell>{Branch.phone_number || "N/A"}</TableCell>
                  <TableCell>
                    {Branch.created_at
                      ? new Date(Branch.created_at).toLocaleDateString()
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
                            const branchId = Branch.id;
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
                            onViewDetails?.(Branch.id);
                          }}
                          disabled
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          <span>Details</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/dashboard/superadmin/organizations/${organizationId}/branches/${Branch.id}/edit`
                            )
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit Branch</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(Branch.id);
                          }}
                          className="text-red-500"
                        >
                          <Trash className="mr-2 h-4 w-4 " />
                          <span>Remove Branch</span>
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Branch</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this branch? This action cannot be undone and all associated data will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBranch}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
