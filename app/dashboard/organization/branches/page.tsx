"use client";
import { PageTitle } from "@/components/page-title";
import { BranchesTable } from "@/components/organization/branches-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BranchesPage() {
  const router = useRouter();

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

      <BranchesTable />
    </div>
  );
}
