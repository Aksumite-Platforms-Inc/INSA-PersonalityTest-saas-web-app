"use client";

import { useState, useEffect } from "react";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { OrganizationsTable } from "@/components/superadmin/organizations-table";
import { ManualOrgModal } from "@/components/superadmin/ManualOrgModal";

import {
  listOrganizations,
  createOrganization,
  deleteOrganization,
  updateOrganization,
} from "@/services/organization.service";

interface OrganizationWithDetails {
  id: number;
  name: string;
  sector: string;
  status: string;
  createdAt: string;
  users: number;
  testsCompleted: number;
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<OrganizationWithDetails[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<{
    id?: number;
    name: string;
    sector: string;
  }>({
    id: undefined,
    name: "",
    sector: "",
  });

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

  const handleOpenModal = (org?: OrganizationWithDetails) => {
    if (org) {
      setFormData({ id: org.id, name: org.name, sector: org.sector });
    } else {
      setFormData({ id: undefined, name: "", sector: "" });
    }
    setShowModal(true);
  };

  const handleSubmit = async (data: {
    id?: number;
    name: string;
    sector: string;
  }) => {
    setLoading(true);
    try {
      if (data.id) {
        await updateOrganization(data.id, {
          name: data.name,
          sector: data.sector,
        });
        setSuccessMessage("Organization updated successfully!");
      } else {
        const newOrg = await createOrganization({
          name: data.name,
          sector: data.sector,
        });
        setOrganizations((prev) => [
          ...prev,
          { ...newOrg, users: 0, testsCompleted: 0 },
        ]);
        setSuccessMessage("Organization created successfully!");
      }
      await fetchAllOrganizations();
      setShowModal(false);
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving organization.");
    } finally {
      setLoading(false);
    }
  };

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
        <Button onClick={() => handleOpenModal()} disabled={loading}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {loading ? "Loading..." : "Add Organization"}
        </Button>
      </div>

      <ManualOrgModal
        open={showModal}
        onClose={() => setShowModal(false)}
        initialData={formData}
        onSubmit={handleSubmit}
      />

      <OrganizationsTable
        organizations={organizations}
        onEdit={(id) => {
          const org = organizations.find((o) => o.id === id);
          if (org) handleOpenModal(org);
        }}
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
