"use client"

import { useState } from "react"
import { PageTitle } from "@/components/page-title"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, FileText, Download, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for documents
const documents = [
  {
    id: "1",
    title: "Annual Personality Assessment Report",
    type: "report",
    sender: "INSA Super Admin",
    receivedAt: "2023-05-15",
    status: "unread",
  },
  {
    id: "2",
    title: "Employee Onboarding Guidelines",
    type: "guide",
    sender: "INSA Super Admin",
    receivedAt: "2023-06-22",
    status: "read",
  },
  {
    id: "3",
    title: "Personality Test Interpretation Manual",
    type: "guide",
    sender: "INSA Super Admin",
    receivedAt: "2023-07-10",
    status: "read",
  },
  {
    id: "4",
    title: "Quarterly Performance Analysis",
    type: "report",
    sender: "INSA Super Admin",
    receivedAt: "2023-08-05",
    status: "unread",
  },
]

export default function OrganizationDocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredDocuments = documents.filter(
    (doc) =>
      (activeTab === "all" ||
        (activeTab === "unread" && doc.status === "unread") ||
        (activeTab === "read" && doc.status === "read")) &&
      (doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case "report":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "assessment":
        return <FileText className="h-4 w-4 text-green-500" />
      case "guide":
        return <FileText className="h-4 w-4 text-purple-500" />
      case "policy":
        return <FileText className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const renderDocumentTypeBadge = (type: string) => {
    switch (type) {
      case "report":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Report
          </Badge>
        )
      case "assessment":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Assessment
          </Badge>
        )
      case "guide":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Guide
          </Badge>
        )
      case "policy":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Policy
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Documents" description="View and manage documents shared with your organization" />

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          <DocumentsTable documents={filteredDocuments} />
        </TabsContent>
        <TabsContent value="unread" className="mt-6">
          <DocumentsTable documents={filteredDocuments} />
        </TabsContent>
        <TabsContent value="read" className="mt-6">
          <DocumentsTable documents={filteredDocuments} />
        </TabsContent>
      </Tabs>
    </div>
  )

  function DocumentsTable({ documents }: { documents: typeof documents }) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="p-0">
                  <EmptyState
                    icon={FileText}
                    title="No documents found"
                    description="No documents have been received yet."
                  />
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => (
                <TableRow key={doc.id} className={doc.status === "unread" ? "bg-blue-50/30" : ""}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      {getDocumentTypeIcon(doc.type)}
                      <span>{doc.title}</span>
                      {doc.status === "unread" && (
                        <Badge variant="default" className="ml-2">
                          New
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{renderDocumentTypeBadge(doc.type)}</TableCell>
                  <TableCell>{doc.sender}</TableCell>
                  <TableCell>{new Date(doc.receivedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        doc.status === "unread"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-green-50 text-green-700 border-green-200"
                      }
                    >
                      {doc.status === "unread" ? "Unread" : "Read"}
                    </Badge>
                  </TableCell>
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
                        <DropdownMenuItem
                          onClick={() => (window.location.href = `/dashboard/organization/documents/${doc.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download</span>
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
    )
  }
}
