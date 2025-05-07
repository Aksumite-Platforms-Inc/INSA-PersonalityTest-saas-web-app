"use client";

import { PageTitle } from "@/components/page-title";
import { EmployeeList } from "@/components/branch/employee-list";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { use, useEffect, useState } from "react";
import { getBranchId, getOrganizationId } from "@/utils/tokenUtils";
import { useRouter, useSearchParams } from "next/navigation";

export default function BranchesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orgId, setOrgId] = useState<number | null>(null);
  const [branchId, setBranchId] = useState<number | null>(null);

  useEffect(() => {
    const organizationId = getOrganizationId();
    const branchIdFromParams = searchParams.get("branchId");

    setBranchId(branchIdFromParams ? Number(branchIdFromParams) : null);
    setOrgId(organizationId);

    if (!organizationId) {
      console.error("Token data is missing or invalid.");
      return;
    }
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle
          title="Branches Management"
          description="Manage all branches in your organization"
        />
        {
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        }
      </div>

      <EmployeeList
        organizationId={Number(orgId)}
        branchId={Number(branchId)}
      />
    </div>
  );
}
