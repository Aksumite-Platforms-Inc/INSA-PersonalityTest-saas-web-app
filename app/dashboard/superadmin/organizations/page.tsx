"use client";

import { useState, useEffect } from "react";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { OrganizationsTable } from "@/components/superadmin/organizations-table";
import { useRouter } from "next/navigation";

import {
  listOrganizations,
  createOrganization,
  deleteOrganization,
  updateOrganization,
  assignAdminToOrganization,
  activateOrganization,
  deactivateOrganization,
} from "@/services/organization.service";
import { useToast } from "@/hooks/use-toast";

interface OrganizationWithDetails {
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
  // testsCompleted: number;
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<OrganizationWithDetails[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { toast } = useToast();
  const [formData, setFormData] = useState<{
    id?: number;
    name: string;
    sector: string;
  }>({
    id: undefined,
    name: "",
    sector: "",
  });

  const router = useRouter();

  const fetchAllOrganizations = async () => {
    try {
      setLoading(true);
      setError("");
      const orgs = await listOrganizations(); // assumes this returns Organization[]
      const detailed = orgs.map((org) => ({
        ...org,
        users: 0,
        testsCompleted: 0,
      }));
      setOrganizations(detailed);
    } catch (err) {
      setError("Failed to fetch organizations.");
      console.error("List Organizations Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrganizations();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this organization?")) return;
    setLoading(true);
    try {
      await deleteOrganization(id);
      setOrganizations((prev) => prev.filter((o) => o.id !== id));
      setSuccessMessage("Organization deleted.");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting organization.");
    } finally {
      setLoading(false);
    }
  };

  const handleActivateOrg = async (orgId: number) => {
    if (!confirm(`Are you sure you want to activate this organization?`))
      return;

    try {
      await activateOrganization(orgId);

      // Update the organization status locally without refreshing the page
      setOrganizations((prev) =>
        prev.map((org) =>
          org.id === orgId ? { ...org, status: "active" } : org
        )
      );

      toast({
        title: "Status Updated",
        description: `Organization has been activated successfully!`,
      });
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
    }
  };

  const handleDeactivateOrg = async (orgId: number) => {
    if (!confirm(`Are you sure you want to suspend this organization?`)) return;

    try {
      await deactivateOrganization(orgId);

      // Update the organization status locally without refreshing the page
      setOrganizations((prev) =>
        prev.map((org) =>
          org.id === orgId ? { ...org, status: "Inactive" } : org
        )
      );

      toast({
        title: "Status Updated",
        description: `Organization has been suspended successfully!`,
      });
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
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle
          title="Organizations Management"
          description="Manage all organizations in the platform"
        />
        <Button
          onClick={() => router.push("/dashboard/superadmin/organizations/new")}
          disabled={loading}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {loading ? "Loading..." : "Add Organization"}
        </Button>
      </div>

      <OrganizationsTable
        organizations={organizations}
        onDelete={handleDelete}
        onActivate={handleActivateOrg}
        onDeactivate={handleDeactivateOrg}
      />

      {successMessage && (
        <div className="fixed top-10 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="fixed top-20 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {error}
        </div>
      )}
    </div>
  );
}
