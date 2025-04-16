import { PageTitle } from "@/components/page-title"
import { UsersTable } from "@/components/superadmin/users-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="Users Management" description="Manage all users in the platform" />
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <UsersTable />
    </div>
  )
}
