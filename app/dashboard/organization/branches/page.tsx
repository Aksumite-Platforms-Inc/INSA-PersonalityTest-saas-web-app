import { PageTitle } from "@/components/page-title"
import { BranchesTable } from "@/components/organization/branches-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function BranchesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="Branches Management" description="Manage all branches in your organization" />
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Branch
        </Button>
      </div>

      <BranchesTable />
    </div>
  )
}
