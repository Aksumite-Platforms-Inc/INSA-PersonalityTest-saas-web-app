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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Edit, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  deleteBranch,
  getAllBranches,
} from "@/services/branch.service";
import { getOrganizationById } from "@/services/organization.service";

export function BranchesTable({ organizationId }: { organizationId: number }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [branches, setBranches] = useState<any[]>([]);
  const [organization, setOrganization] = useState<any | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await getAllBranches(organizationId);
        setBranches(response);
      } catch (error) {
        console.error("Error fetching branches:", error);
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

  const filteredBranches = branches.filter((branch) => branch && branch.name);

  const handleDelete = async (branchId: number) => {
    if (!confirm("Are you sure you want to delete this branch?")) return;
    const { success } = await deleteBranch(branchId);
    if (success) {
      setBranches((prev) => prev.filter((b) => b.id !== branchId));
    } else {
      toast({
        title: "Error",
        description: "Failed to delete branch",
        variant: "destructive",
      });
    }
  };

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
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No branches found
                </TableCell>
              </TableRow>
            ) : (
              filteredBranches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className="font-medium">{branch.name || "Unnamed Branch"}</TableCell>
                  <TableCell>{organization?.name || "N/A"}</TableCell>
                  <TableCell>{branch.address}</TableCell>
                  <TableCell>{branch.phone_number}</TableCell>
                  <TableCell>{new Date(branch.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/organization/branches/${branch.id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            if (branch.id && branch.id !== 0) {
                              router.push(`/dashboard/organization/employees?branchId=${branch.id}`);
                            } else {
                              toast({
                                title: "Error",
                                description: "Invalid branch ID. Cannot manage employees.",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          <span>Manage Employees</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(branch.id)}>
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
  );
}
