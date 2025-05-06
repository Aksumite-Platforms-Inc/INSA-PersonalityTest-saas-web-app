"use client";

import { useState, useEffect } from "react";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { OrganizationsTable } from "@/components/superadmin/organizations-table";
import { ManualOrgModal } from "@/components/superadmin/ManualOrgModal";
import { useRouter } from "next/navigation";

import {
  listOrganizations,
  createOrganization,
  deleteOrganization,
  updateOrganization,
} from "@/services/organization.service";

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
