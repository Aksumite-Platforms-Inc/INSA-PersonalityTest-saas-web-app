"use client";

import { useEffect, useState } from "react";

// Define or import the OrganizationData type
interface OrganizationData {
  name: string;
  sector: string;
  status: string;
}
import { useRouter, useParams } from "next/navigation";
import { getAllOrgMembers } from "@/services/user.service";
import { getBranchById } from "@/services/branch.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageTitle } from "@/components/page-title";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function OrganizationDetailsPage() {
  const router = useRouter();
  const { orgId } = useParams();

  const [organization, setOrganization] = useState<OrganizationData | null>(
    null
  );
  const [employees, setEmployees] = useState<
    {
      id: number;
      branchName: string;
      name: string;
      email: string;
      phone: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState("");
  const [sortColumn, setSortColumn] = useState<
    keyof (typeof employees)[0] | null
  >(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    if (!orgId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const orgData = await getBranchById(Number(orgId), 0); // Assuming branch ID 0 for organization details
        const organizationData = {
          ...orgData,
          sector: "Unknown", // Provide a default or fetch if available
          status: "Active", // Provide a default or fetch if available
        };
        setOrganization(organizationData);
        const employeeData = await getAllOrgMembers(Number(orgId));
        setEmployees(
          employeeData.map((employee) => ({
            id: employee.id,
            branchName: "", // Add branch name if available in employee data
            name: employee.name,
            email: employee.email,
            phone: "", // Add phone if available in employee data
          }))
        );
      } catch (err) {
        setError("Failed to load organization details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orgId]);

  const filteredEmployees = employees.filter((employee) =>
    Object.values(employee).some((value) =>
      value.toString().toLowerCase().includes(filter.toLowerCase())
    )
  );

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedEmployees = sortedEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);

  const handleSort = (column: keyof (typeof employees)[0]) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <Spinner />;
  if (error) return <Alert>{error}</Alert>;

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={handleBack}>
        Back
      </Button>
      <PageTitle
        title={organization?.name || "Organization Details"}
        description="View organization information and employees"
      />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Organization Information</h2>
        <p>
          <strong>Sector:</strong> {organization?.sector}
        </p>
        <p>
          <strong>Status:</strong> {organization?.status}
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Employees</h2>
        <input
          type="text"
          placeholder="Filter employees..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        />
        <Table className="border rounded-lg shadow-md">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("branchName")}
              >
                Branch Name
                {sortColumn === "branchName" &&
                  (sortOrder === "asc" ? (
                    <ChevronUp className="inline ml-2 h-4 w-4" />
                  ) : (
                    <ChevronDown className="inline ml-2 h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("name")}
              >
                Employee Name
                {sortColumn === "name" &&
                  (sortOrder === "asc" ? (
                    <ChevronUp className="inline ml-2 h-4 w-4" />
                  ) : (
                    <ChevronDown className="inline ml-2 h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("email")}
              >
                Email
                {sortColumn === "email" &&
                  (sortOrder === "asc" ? (
                    <ChevronUp className="inline ml-2 h-4 w-4" />
                  ) : (
                    <ChevronDown className="inline ml-2 h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("phone")}
              >
                Phone Number
                {sortColumn === "phone" &&
                  (sortOrder === "asc" ? (
                    <ChevronUp className="inline ml-2 h-4 w-4" />
                  ) : (
                    <ChevronDown className="inline ml-2 h-4 w-4" />
                  ))}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEmployees.map((employee) => (
              <TableRow key={employee.id} className="hover:bg-gray-500">
                <TableCell>{employee.branchName}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
