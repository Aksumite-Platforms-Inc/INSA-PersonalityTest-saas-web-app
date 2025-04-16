"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Trash2, Copy, Eye, BarChart } from "lucide-react"

// Demo data
const tests = [
  {
    id: 1,
    name: "Personality Assessment",
    type: "personality",
    questions: 45,
    completions: 1245,
    status: "active",
    createdAt: "2023-01-15",
  },
  {
    id: 2,
    name: "Leadership Evaluation",
    type: "leadership",
    questions: 30,
    completions: 876,
    status: "active",
    createdAt: "2023-02-03",
  },
  {
    id: 3,
    name: "Team Compatibility",
    type: "team",
    questions: 25,
    completions: 654,
    status: "active",
    createdAt: "2023-03-21",
  },
  {
    id: 4,
    name: "Stress Management",
    type: "stress",
    questions: 20,
    completions: 432,
    status: "active",
    createdAt: "2023-04-10",
  },
  {
    id: 5,
    name: "Communication Skills",
    type: "communication",
    questions: 35,
    completions: 321,
    status: "draft",
    createdAt: "2023-05-05",
  },
  {
    id: 6,
    name: "Problem Solving Aptitude",
    type: "aptitude",
    questions: 40,
    completions: 0,
    status: "draft",
    createdAt: "2023-06-18",
  },
  {
    id: 7,
    name: "Emotional Intelligence",
    type: "emotional",
    questions: 50,
    completions: 0,
    status: "inactive",
    createdAt: "2023-07-22",
  },
]

export function TestsTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTests = tests.filter(
    (test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Function to render status badge with appropriate variant
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Active
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Draft
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Inactive
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tests..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Completions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No tests found
                </TableCell>
              </TableRow>
            ) : (
              filteredTests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.name}</TableCell>
                  <TableCell className="capitalize">{test.type}</TableCell>
                  <TableCell>{test.questions}</TableCell>
                  <TableCell>{test.completions}</TableCell>
                  <TableCell>{renderStatusBadge(test.status)}</TableCell>
                  <TableCell>{new Date(test.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Preview</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          <span>Duplicate</span>
                        </DropdownMenuItem>
                        {test.completions > 0 && (
                          <DropdownMenuItem>
                            <BarChart className="mr-2 h-4 w-4" />
                            <span>View Results</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {test.status === "active" ? (
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Deactivate</span>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600">
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Activate</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
