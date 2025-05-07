"use client";

import { useState, useEffect, use } from "react";
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
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Ban,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { deleteBranch, getAllBranches } from "@/services/branch.service"; // Import the service
import { getOrganizationById } from "@/services/organization.service"; // Import the service
import { getAllOrgMembers } from "@/services/user.service";
import { set } from "react-hook-form";
import toast from "react-hot-toast";

export function BranchesTable({ organizationId }: { organizationId: number }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [branches, setBranches] = useState<any[]>([]);
  const [organization, setOrganization] = useState<any | null>(null);
  const [totalEmployees, setTotalEmployees] = useState<any | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const router = useRouter();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await getAllBranches(organizationId);
        // Assuming the response has a success property and data property
        console.log("Branches response:", response);
        setBranches(response); // Adjust based on your API response structure
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
        console.log("Organization response:", response);
        // Assuming the response has a success property and data property
        setOrganization(response); // Assuming response is a single organization object
      } catch (error) {
        console.error("Error fetching organization:", error);
      }
    };

    fetchOrganization();
  }, [organizationId]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const members = await getAllOrgMembers(organizationId);
        setTotalEmployees(members.length); // Assuming members is an array of employees
      } catch (error) {
        setError((error as Error).message || "Failed to fetch employees.");
        toast({
          title: "Error!",
          description: String(error),
          variant: "destructive",
        });
      }
    };

    fetchEmployees();
  }, [organizationId]);

  const filteredBranches = branches.filter((branch) => branch && branch.name); // Ensure branch is not null or undefined

  const renderStatusBadge = (status: string) => {
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
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleDelete = async (branchId: number) => {
    if (!confirm("Are you sure you want to delete this branch?")) return;

    const { success } = await deleteBranch(branchId);

    if (success) {
      setBranches((prev) => prev.filter((b) => b.id !== branchId));
    } else {
      alert("Failed to delete branch: ");
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
              <TableHead>PhoneNumber</TableHead>
              <TableHead>TotalEmployees</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBranches.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No branches found
                </TableCell>
              </TableRow>
            ) : (
              filteredBranches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className="font-medium">{branch.name}</TableCell>
                  <TableCell>{organization.name}</TableCell>
                  <TableCell>{branch.address}</TableCell>
                  <TableCell>{branch.phone}</TableCell>
                  <TableCell>{totalEmployees}</TableCell>
                  <TableCell>
                    {new Date(branch.createdAt).toLocaleDateString()}
                  </TableCell>
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
                          onClick={() =>
                            router.push(
                              `/dashboard/organization/employees?branchId=${branch.id}`
                            )
                          }
                        >
                          <Users className="mr-2 h-4 w-4" />
                          <span>Manage Employees</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        {/* {branch.status === "active" ? (
                          <DropdownMenuItem className="text-red-600">
                            <Ban className="mr-2 h-4 w-4" />
                            <span>Deactivate</span>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600">
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Activate</span>
                          </DropdownMenuItem>
                        )} */}
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(branch.id)}
                        >
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
