import { PageTitle } from "@/components/page-title"
import { OrganizationsTable } from "@/components/superadmin/organizations-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function OrganizationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="Organizations Management" description="Manage all organizations in the platform" />
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Organization
        </Button>
      </div>

      <OrganizationsTable />
    </div>
  )
}
