"use client";

import { useState, useEffect } from "react";
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
import { Modal } from "@/components/ui/modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Shield,
  Edit,
  Trash2,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { deleteBranch, getAllBranches } from "@/services/branch.service";
import { getOrganizationById } from "@/services/organization.service";
import { assignAdminToBranch } from "@/services/branch.service";
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
import { Loader2, Building2, Search } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export function BranchesTable({ organizationId }: { organizationId: number }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [branches, setBranches] = useState<any[]>([]);
  const [organization, setOrganization] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      try {
        const response = await getAllBranches(organizationId);
        setBranches(response);
      } catch (error) {
        console.error("Error fetching branches:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, [organizationId]);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await getOrganizationById(organizationId);
        setOrganization(response);
      } catch (error) {
        console.error("Error fetching organization:", error);
      }
    };
    fetchOrganization();
  }, [organizationId]);

  const handleAssignAdmin = async () => {
    if (!selectedBranchId || !adminEmail) {
      toast({
        title: "Error",
        description: "Please provide a valid email.",
        variant: "destructive",
      });
      return;
    }
    setAssigning(true);
    try {
      await assignAdminToBranch(organizationId, selectedBranchId, adminEmail);
      toast({
        title: "Success",
        description: "Admin assigned successfully.",
      });
      setIsModalOpen(false);
      setAdminEmail("");
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
      setAssigning(false);
    }
  };

  const filteredBranches = branches.filter(
    (branch) =>
      (branch &&
        branch.name &&
        (branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (branch.address &&
            branch.address
              .toLowerCase()
              .includes(searchTerm.toLowerCase())))) ||
      (branch.phone_number &&
        branch.phone_number.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteClick = (branchId: number) => {
    setBranchToDelete(branchId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!branchToDelete) return;
    
    setDeleting(true);
    try {
      const { success } = await deleteBranch(organizationId, branchToDelete);
      if (success) {
        setBranches((prev) => prev.filter((b) => b.id !== branchToDelete));
        toast({
          title: "Branch Deleted",
          description: "The branch has been successfully deleted.",
        });
        setDeleteDialogOpen(false);
        setBranchToDelete(null);
      } else {
        toast({
          title: "Error",
          description: "Failed to delete branch. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      let errorMessage = "Failed to delete branch. Please try again.";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 mr-2" />
        <span className="text-muted-foreground">Loading branches...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search branches..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-4">
          <h2 className="text-lg font-bold">Assign Admin</h2>
          <Input
            placeholder="Enter admin email"
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            className="mt-2"
            required
            disabled={assigning}
          />
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={assigning}
            >
              Cancel
            </Button>
            <Button
              className="ml-2"
              onClick={handleAssignAdmin}
              disabled={assigning}
            >
              {assigning ? "Assigning..." : "Assign"}
            </Button>
          </div>
        </div>
      </Modal>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBranches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="p-0">
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
              filteredBranches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className="font-medium">
                    {branch.name || "Unnamed Branch"}
                  </TableCell>
                  <TableCell>{organization?.name || "N/A"}</TableCell>
                  <TableCell>{branch.address}</TableCell>
                  <TableCell>{branch.phone_number}</TableCell>
                  <TableCell>
                    {new Date(branch.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 group relative">
                      {/* Assign Admin Icon with Tooltip */}
                      <div className="relative flex items-center">
                        <Shield
                          className="h-4 w-4 cursor-pointer"
                          onClick={() => {
                            setSelectedBranchId(branch.id);
                            setIsModalOpen(true);
                          }}
                          aria-label="Assign Admin"
                        />
                        {/* Tooltip */}
                        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                          Assign Admin
                        </span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/dashboard/organization/branches/${branch.id}`
                              )
                            }
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              if (branch.id && branch.id !== 0) {
                                router.push(
                                  `/dashboard/organization/employees?branchId=${branch.id}`
                                );
                              } else {
                                toast({
                                  title: "Error",
                                  description:
                                    "Invalid branch ID. Cannot manage employees.",
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            <Users className="mr-2 h-4 w-4" />
                            <span>Manage Employees</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteClick(branch.id)}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Branch</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this branch? This action cannot be undone and all associated data will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
