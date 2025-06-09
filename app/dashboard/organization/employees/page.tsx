"use client";

import { PageTitle } from "@/components/page-title";
import { EmployeeList } from "@/components/branch/employee-list";
import { Button } from "@/components/ui/button";
import { PlusCircle, Upload } from "lucide-react";
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

function BranchesPageContent({
  searchParams,
}: {
  searchParams: URLSearchParams;
}) {
  const router = useRouter();
  const [orgId, setOrgId] = useState<number | null>(null);
  const [branchId, setBranchId] = useState<number | null>(null);
  const [branch, setBranch] = useState<any | null>(null);

  useEffect(() => {
    const organizationId = getOrganizationId();
    const branchIdFromParams = searchParams.get("branchId");
    setOrgId(organizationId);
    setBranchId(Number(branchIdFromParams));
  }, [searchParams]);

  useEffect(() => {
    if (!branchId || isNaN(Number(branchId))) {
      setBranch(null);
      return;
    }
    const fetchOrganization = async () => {
      try {
        const response = await getBranchById(Number(branchId));
        setBranch(response);
      } catch (error: any) {
        if (error?.response?.status === 404) {
          setBranch(null);
          // Optionally, show a toast or log: "Branch not found"
        } else {
          console.error("Error fetching organization:", error);
        }
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
        <Button
          onClick={() =>
            router.push("/dashboard/organization/employees/upload")
          }
        >
          <Upload className="mr-2 h-4 w-4" />
          {/* {translate("users.bulkUpload")} */}
          Bulk Upload Employees
        </Button>
      </div>
      <EmployeeList
        organizationId={Number(orgId)}
        branchId={Number(branchId)}
      />
    </div>
  );
}
