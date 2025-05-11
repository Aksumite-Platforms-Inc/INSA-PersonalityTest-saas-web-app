"use client";
import { PageTitle } from "@/components/page-title";
import { BranchesTable } from "@/components/organization/branches-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { getOrganizationId } from "@/utils/tokenUtils";
import { useState, useEffect } from "react";

export default function BranchesPage() {
  const router = useRouter();
  const [orgId, setOrgId] = useState<number | null>(null);

  useEffect(() => {
    const organizationId = getOrganizationId(); // Assuming this function retrieves the token data
    if (!organizationId) {
      console.error("Token data is missing or invalid.");
      return;
    }
    console.log("Organization ID:", organizationId);

    if (!organizationId) {
      console.error("Organization ID is missing from the token.");
      return;
    }

    setOrgId(organizationId);
  }, []);

  if (!orgId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle
          title="Branches Management"
          description="Manage all branches in your organization"
        />
        <Button
          onClick={() => router.push("/dashboard/organization/branches/new")}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Branch
        </Button>
      </div>

      <BranchesTable organizationId={orgId} />
    </div>
  );
}
