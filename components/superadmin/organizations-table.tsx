"use client";

import { useEffect, useState } from "react";
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
  Edit,
  Trash2,
  Shield,
  Ban,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getAllOrgMembers } from "@/services/user.service";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/hooks/use-toast";
import { assignAdminToOrganization } from "@/services/organization.service";

// Define the props for the table
interface Organization {
  id: number;
  name: string;
  email: string;
  agreement: string;
  status: string;
  address: string;
  sector: string;
  phone_number: string;
  created_at: Date; //------
  updated_at: Date;
}

interface OrganizationsTableProps {
  organizations: Organization[];
  onDelete: (id: number) => void;
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
}

export function OrganizationsTable({
  organizations,
  onDelete,
  onActivate,
  onDeactivate,
}: OrganizationsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [userCounts, setUserCounts] = useState<Record<number, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [adminEmail, setAdminEmail] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const counts: Record<number, number> = {};
        for (const org of organizations) {
          const members = await getAllOrgMembers(org.id);
          counts[org.id] = members.length;
        }
        setUserCounts(counts);
      } catch (err) {
        console.error("Failed to fetch user counts:", err);
      }
    };

    fetchUserCounts();
  }, [organizations]);

  const handleAssignAdmin = async () => {
    if (!selectedOrgId || !adminEmail) {
      toast({
        title: "Error",
        description: "Please provide a valid email.",
        variant: "destructive",
      });
      return;
    }

    try {
      await assignAdminToOrganization(selectedOrgId, adminEmail);
      toast({
        title: "Success",
        description: "Admin assigned successfully.",
      });
      setIsModalOpen(false);
      setAdminEmail("");
    } catch (error) {
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
    }
  };

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to render status badge with appropriate variant
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
      case "suspended":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Suspended
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
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search organizations..."
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
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            className="mt-2"
          />
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button className="ml-2" onClick={handleAssignAdmin}>
              Assign
            </Button>
          </div>
        </div>
      </Modal>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Users</TableHead>
              {/* <TableHead>Tests Completed</TableHead> */}
              <TableHead>Created</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrganizations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No organizations found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrganizations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell>{org.sector}</TableCell>
                  <TableCell>{renderStatusBadge(org.status)}</TableCell>
                  <TableCell>{userCounts[org.id] || 0}</TableCell>
                  {/* <TableCell>{org.testsCompleted}</TableCell> */}

                  <TableCell>
                    {new Date(org.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 group relative">
                      {/* Assign Admin Icon with Tooltip */}
                      <div className="relative flex items-center">
                        <Shield
                          className="h-4 w-4 cursor-pointer"
                          onClick={() => {
                            setSelectedOrgId(org.id);
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
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/dashboard/superadmin/organizations/${org.id}/edit`
                              )
                            }
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/dashboard/superadmin/organizations/${org.id}`
                              )
                            }
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Details</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          {org.status === "active" ? (
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => onDeactivate(org.id)}
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              <span>Suspend</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-green-600"
                              onClick={() => onActivate(org.id)}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              <span>Activate</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => onDelete(org.id)}
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
    </div>
  );
}
