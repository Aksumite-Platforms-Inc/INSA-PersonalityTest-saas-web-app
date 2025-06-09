"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getBranchById, updateBranch } from "@/services/branch.service";
import { PageTitle } from "@/components/page-title";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getOrganizationId } from "@/utils/tokenUtils";
import { useToast } from "@/hooks/use-toast";

interface BranchData {
  id: number;
  name: string;
  manager: string;
  status: string;
}

export default function BranchEditPage() {
  const router = useRouter();
  const { branchId } = useParams();
  const organizationId = getOrganizationId();
  const [branch, setBranch] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!branchId) return;
    console.log("branchId:", branchId);

    const fetchBranch = async () => {
      setLoading(true);
      try {
        const res = await getBranchById(
          Number(organizationId),
          Number(branchId)
        );
        setBranch(res);
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
    console.log;
    setIsSaving(true);
    try {
      const { id, name, email, phone_number, address } = branch;
      const data = { id, name, email, phone_number, address };
      await updateBranch(Number(branchId), data);

      toast({
        title: "Organization Updated",
        description: `Successfully updated ${name}`,
      });

      router.push("/dashboard/organization/branches");
    } catch (err) {
      toast({
        title: "Update Failed",
        description: "Something went wrong while updating.",
        variant: "destructive",
      });
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
          <label className="block font-medium">Branch Email</label>
          <Input
            name="email"
            type="email"
            value={branch?.email ?? ""}
            placeholder="email@example.com"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block font-medium">Phone Number</label>
          <Input
            name="phone_number"
            type="tel"
            placeholder="+1234567890"
            value={branch?.phone_number ?? ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block font-medium">Address</label>
          <Input
            name="address"
            type="text"
            placeholder="123 Main St, City, Country"
            value={branch?.address ?? ""}
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
