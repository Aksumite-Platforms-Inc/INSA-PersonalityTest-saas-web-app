import { PageTitle } from "@/components/page-title"
import { TestsTable } from "@/components/superadmin/tests-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function TestsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="Tests Management" description="Manage all tests in the platform" />
        <Button asChild>
          <Link href="/dashboard/superadmin/tests/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Test
          </Link>
        </Button>
      </div>

      <TestsTable />
    </div>
  )
}
