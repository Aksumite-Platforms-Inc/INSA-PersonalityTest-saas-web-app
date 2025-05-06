"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getBranchById, updateBranch } from "@/services/branch.service";
import { PageTitle } from "@/components/page-title";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BranchData {
  id: number;
  name: string;
  manager: string;
  status: string;
}

export default function BranchEditPage() {
  const router = useRouter();
  const { branchId } = useParams();

  const [branch, setBranch] = useState<BranchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!branchId) return;

    const fetchBranch = async () => {
      setLoading(true);
      try {
        const res = await getBranchById(Number(branchId));
        if (res.success && res.data) {
          setBranch(res.data);
        } else {
          setError(res.error || "Failed to load branch details.");
        }
      } catch (err) {
        setError("An error occurred while fetching branch details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBranch();
  }, [branchId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!branch) return;
    setBranch({ ...branch, [name]: value });
  };

  const handleSave = async () => {
    if (!branch) return;

    setIsSaving(true);
    try {
      // Fill in missing properties with default values
      const branchToUpdate: BranchData = {
        id: branch.id,
        name: branch.name,
        manager: branch.manager,
        status: branch.status ?? "inactive",
      };

      const res = await updateBranch(branch.id, branchToUpdate);
      if (res.success) {
        router.back();
      } else {
        setError(res.error || "Failed to save changes.");
      }
    } catch (err) {
      setError("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert>{error}</Alert>;

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.back()}>
        Back
      </Button>
      <PageTitle
        title={`Edit Branch: ${branch?.name ?? "Loading..."}`}
        description="Modify branch details and save changes"
      />
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block font-medium">Branch Name</label>
          <Input
            name="name"
            value={branch?.name ?? ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block font-medium">Manager</label>
          <Input
            name="manager"
            value={branch?.manager ?? ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block font-medium">Status</label>
          <Input
            name="status"
            value={branch?.status ?? ""}
            onChange={handleChange}
          />
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
