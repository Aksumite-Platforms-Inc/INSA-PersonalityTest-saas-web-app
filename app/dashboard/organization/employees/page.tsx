"use client";

import { PageTitle } from "@/components/page-title";
import { EmployeeList } from "@/components/branch/employee-list";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { use, useEffect, useState } from "react";
import { getBranchId, getOrganizationId } from "@/utils/tokenUtils";
import { useRouter } from "next/navigation";
import { getBranchById } from "@/services/branch.service";
import SearchParamsWrapper from "@/components/SearchParamsWrapper";

export default function BranchesPage() {
  return (
    <SearchParamsWrapper>
      {(searchParams) => <BranchesPageContent searchParams={searchParams} />}
    </SearchParamsWrapper>
  );
}

function BranchesPageContent({ searchParams }: { searchParams: URLSearchParams }) {
  const router = useRouter();
  const [orgId, setOrgId] = useState<number | null>(null);
  const [branchId, setBranchId] = useState<number | null>(null);
  const [branch, setBranch] = useState<any | null>(null);

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

  useEffect(() => {
    const organizationId = getOrganizationId();
    const fetchOrganization = async () => {
      try {
        const response = await getBranchById(
          // Number(organizationId),
          Number(branchId)
        );
        setBranch(response);
      } catch (error) {
        console.error("Error fetching organization:", error);
      }
    };

    fetchOrganization();
  }, [branchId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle
          title={`Branch (${branch?.name || ""}) Employees Management`}
          description="Manage employees in your branch"
        />
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>
      <EmployeeList organizationId={Number(orgId)} branchId={Number(branchId)} />
    </div>
  );
}
