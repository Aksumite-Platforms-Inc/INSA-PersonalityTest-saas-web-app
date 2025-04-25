"use client";

import { useState, useEffect } from "react";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { OrganizationsTable } from "@/components/superadmin/organizations-table";
import { orgService } from "@/services/orgService";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { set } from "react-hook-form";

interface OrgModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: { id?: number; name: string; sector: string }) => void;
  initialData: { id?: number; name: string; sector: string };
}

export const ManualOrgModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: OrgModalProps) => {
  const [formData, setFormData] = useState({
    id: initialData?.id ?? undefined,
    name: initialData?.name ?? "",
    sector: initialData?.sector ?? "",
  });

  useEffect(() => {
    setFormData({
      id: initialData?.id ?? undefined,
      name: initialData?.name ?? "",
      sector: initialData?.sector ?? "",
    });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!formData.name || !formData.sector) {
      alert("All fields are required.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {formData.id ? "Edit Organization" : "Add Organization"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Organization Name"
          />
          <Input
            name="sector"
            value={formData.sector}
            onChange={handleChange}
            placeholder="Sector"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {formData.id ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface OrganizationData {
  id: number;
  name: string;
  sector: string;
  status: string;
  users: number;
  testsCompleted: number;
  complianceStatus: string;
  createdAt: string;
}

export default function OrganizationsPage() {
  const [successMessage, setSuccessMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<{
    id?: number;
    name: string;
    sector: string;
  }>({ id: undefined, name: "", sector: "" });
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState<OrganizationData[]>([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoading(true);
      try {
        const data = await orgService.getAllOrganizations();
        setOrganizations(data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
        alert("Error fetching organizations.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);
  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage]);

  const handleAddOrganization = () => {
    setFormData({ id: undefined, name: "", sector: "" });
    setShowModal(true);
  };

  const handleEditOrganization = (org: OrganizationData) => {
    setFormData({ id: org.id, name: org.name, sector: org.sector });
    setShowModal(true);
  };

  const handleSaveOrganization = async (data: {
    id?: number;
    name: string;
    sector: string;
  }) => {
    setLoading(true);
    try {
      if (data.id) {
        await orgService.updateOrganization(data.id, data);
        setOrganizations((prev) =>
          prev.map((org) => (org.id === data.id ? { ...org, ...data } : org))
        );
        setSuccessMessage("Organization updated successfully!");
      } else {
        await orgService.createOrganization(data);
        const updatedList = await orgService.getAllOrganizations();
        setOrganizations(updatedList);
        setSuccessMessage("Organization created successfully!");
      }
    } catch (error) {
      console.error("Error saving organization:", error);
      alert("Error saving organization.");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const handleDeleteOrganization = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this organization?")) {
      setLoading(true);
      try {
        await orgService.deleteOrganization(id);
        setOrganizations((prev) => prev.filter((org) => org.id !== id));
        alert("Organization deleted successfully!");
      } catch (error) {
        console.error("Error deleting organization:", error);
        alert("Error deleting organization.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle
          title="Organizations Management"
          description="Manage all organizations in the platform"
        />
        <Button onClick={handleAddOrganization} disabled={loading}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {loading ? "Adding..." : "Add Organization"}
        </Button>
      </div>
      <ManualOrgModal
        open={showModal}
        onClose={() => setShowModal(false)}
        initialData={formData}
        onSubmit={handleSaveOrganization}
      />
      <OrganizationsTable
        organizations={organizations}
        onEdit={handleEditOrganization}
        onDelete={handleDeleteOrganization}
      />
      {successMessage && (
        <div className="fixed top-10 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-all duration-300">
          {successMessage}
        </div>
      )}
    </div>
  );
}
