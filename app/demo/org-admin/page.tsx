"use client";
import { PageTitle } from "@/components/page-title";
import { BranchesTable } from "@/components/organization/branches-table";
import { Button } from "@/components/ui/button";
import {
  Ban,
  Edit,
  MoreHorizontal,
  PlusCircle,
  Search,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Input } from "@/components/ui/input";

// Dummy data for testing
const branches = [
  {
    id: 1,
    name: "Addis Ababa HQ",
    manager: "Abebe Kebede",
    employees: 78,
    testsCompleted: 245,
    status: "active",
    createdAt: "2023-01-15",
  },
  {
    id: 2,
    name: "Bahir Dar",
    manager: "Tigist Haile",
    employees: 45,
    testsCompleted: 132,
    status: "active",
    createdAt: "2023-02-03",
  },
  {
    id: 3,
    name: "Hawassa",
    manager: "Dawit Tadesse",
    employees: 32,
    testsCompleted: 98,
    status: "active",
    createdAt: "2023-03-21",
  },
  {
    id: 4,
    name: "Mekelle",
    manager: "Hiwot Girma",
    employees: 28,
    testsCompleted: 76,
    status: "inactive",
    createdAt: "2023-04-10",
  },
  {
    id: 5,
    name: "Dire Dawa",
    manager: "Solomon Tesfaye",
    employees: 35,
    testsCompleted: 105,
    status: "active",
    createdAt: "2023-05-05",
  },
  {
    id: 6,
    name: "Adama",
    manager: "Meron Alemu",
    employees: 42,
    testsCompleted: 118,
    status: "active",
    createdAt: "2023-06-18",
  },
  {
    id: 7,
    name: "Gondar",
    manager: "Yonas Bekele",
    employees: 30,
    testsCompleted: 85,
    status: "active",
    createdAt: "2023-07-22",
  },
  {
    id: 8,
    name: "Jimma",
    manager: "Sara Tesfaye",
    employees: 25,
    testsCompleted: 72,
    status: "active",
    createdAt: "2023-08-14",
  },
];

export default function BranchesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredBranches = branches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle
          title="Branches Management"
          description="Manage all branches in your organization"
        />
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Branch
        </Button>
      </div>

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
                <TableHead>Manager</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Tests Completed</TableHead>
                <TableHead>Status</TableHead>
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
                    <TableCell>{branch.manager}</TableCell>
                    <TableCell>{branch.employees}</TableCell>
                    <TableCell>{branch.testsCompleted}</TableCell>
                    <TableCell>{renderStatusBadge(branch.status)}</TableCell>
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
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            <span>Manage Employees</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          {branch.status === "active" ? (
                            <DropdownMenuItem className="text-red-600">
                              <Ban className="mr-2 h-4 w-4" />
                              <span>Deactivate</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-green-600">
                              <Shield className="mr-2 h-4 w-4" />
                              <span>Activate</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600">
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
    </div>
  );
}
