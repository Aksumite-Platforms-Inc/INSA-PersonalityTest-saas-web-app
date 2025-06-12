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
} from "lucide-react";
import { getAllBranches, Branch } from "@/services/branch.service";

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
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No Branches found
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
                  <TableCell></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
