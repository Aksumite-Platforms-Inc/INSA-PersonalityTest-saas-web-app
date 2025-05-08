"use client";

import { useState, useEffect } from "react";
import { PageTitle } from "@/components/page-title";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TestType } from "@/types/personality-tests";
import { Download, Eye, Search, FileText, Calendar, User } from "lucide-react";
import Link from "next/link";

interface TestPDF {
  id: string;
  testType: TestType;
  employeeName: string;
  employeeId: string;
  organizationName: string;
  organizationId: string;
  completedAt: string;
  pdfUrl: string;
}

// Mock data for test PDFs
const mockTestPDFs: TestPDF[] = [
  {
    id: "pdf-1",
    testType: "oejts",
    employeeName: "John Smith",
    employeeId: "emp-1",
    organizationName: "Acme Corp",
    organizationId: "org-1",
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    pdfUrl: "/api/test-pdfs/pdf-1",
  },
  {
    id: "pdf-2",
    testType: "enneagram",
    employeeName: "Jane Doe",
    employeeId: "emp-2",
    organizationName: "Acme Corp",
    organizationId: "org-1",
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    pdfUrl: "/api/test-pdfs/pdf-2",
  },
  {
    id: "pdf-3",
    testType: "qualtrics",
    employeeName: "Bob Johnson",
    employeeId: "emp-3",
    organizationName: "Globex Inc",
    organizationId: "org-2",
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    pdfUrl: "/api/test-pdfs/pdf-3",
  },
  {
    id: "pdf-4",
    testType: "riasec",
    employeeName: "Alice Williams",
    employeeId: "emp-4",
    organizationName: "Globex Inc",
    organizationId: "org-2",
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    pdfUrl: "/api/test-pdfs/pdf-4",
  },
  {
    id: "pdf-5",
    testType: "oejts",
    employeeName: "Charlie Brown",
    employeeId: "emp-5",
    organizationName: "Initech",
    organizationId: "org-3",
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    pdfUrl: "/api/test-pdfs/pdf-5",
  },
];

export default function TestPDFsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrganization, setSelectedOrganization] =
    useState<string>("all");
  const [selectedTestType, setSelectedTestType] = useState<string>("all");
  const [filteredPDFs, setFilteredPDFs] = useState<TestPDF[]>(mockTestPDFs);

  // Apply filters when search query or filters change
  useEffect(() => {
    let filtered = mockTestPDFs;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (pdf) =>
          pdf.employeeName.toLowerCase().includes(query) ||
          pdf.organizationName.toLowerCase().includes(query)
      );
    }

    // Apply organization filter
    if (selectedOrganization !== "all") {
      filtered = filtered.filter(
        (pdf) => pdf.organizationId === selectedOrganization
      );
    }

    // Apply test type filter
    if (selectedTestType !== "all") {
      filtered = filtered.filter((pdf) => pdf.testType === selectedTestType);
    }

    setFilteredPDFs(filtered);
  }, [searchQuery, selectedOrganization, selectedTestType]);

  // Get unique organizations for filter
  const organizations = Array.from(
    new Set(mockTestPDFs.map((pdf) => pdf.organizationId))
  ).map((id) => {
    const pdf = mockTestPDFs.find((p) => p.organizationId === id);
    return {
      id,
      name: pdf ? pdf.organizationName : id,
    };
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getTestTypeName = (type: TestType) => {
    switch (type) {
      case "oejts":
        return "OEJTS";
      case "enneagram":
        return "Enneagram";
      case "qualtrics":
        return "Qualtrics";
      case "riasec":
        return "RIASEC";
      default:
        return type;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <PageTitle
        title="Test Result"
        description="View and download employee test result PDFs"
      />

      <div className="flex flex-col md:flex-row gap-4 mt-6 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by employee or organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select
          value={selectedOrganization}
          onValueChange={setSelectedOrganization}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Organization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Organizations</SelectItem>
            {organizations.map((org) => (
              <SelectItem key={org.id} value={org.id}>
                {org.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedTestType} onValueChange={setSelectedTestType}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Test Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tests</SelectItem>
            <SelectItem value="oejts">OEJTS</SelectItem>
            <SelectItem value="enneagram">Enneagram</SelectItem>
            <SelectItem value="qualtrics">Qualtrics</SelectItem>
            <SelectItem value="riasec">RIASEC</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPDFs.map((pdf) => (
              <Card key={pdf.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-lg">
                        {getTestTypeName(pdf.testType)}
                      </CardTitle>
                    </div>
                    <div className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                      {getTestTypeName(pdf.testType)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{pdf.employeeName}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formatDate(pdf.completedAt)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/dashboard/superadmin/personality-tests/pdfs/${pdf.id}`}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <a
                      href={pdf.pdfUrl}
                      download={`${pdf.testType}_${pdf.employeeName}.pdf`}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Employee</th>
                      <th className="text-left p-4">Organization</th>
                      <th className="text-left p-4">Test Type</th>
                      <th className="text-left p-4">Date Completed</th>
                      <th className="text-right p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPDFs.map((pdf) => (
                      <tr key={pdf.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">{pdf.employeeName}</td>
                        <td className="p-4">{pdf.organizationName}</td>
                        <td className="p-4">{getTestTypeName(pdf.testType)}</td>
                        <td className="p-4">{formatDate(pdf.completedAt)}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                href={`/dashboard/superadmin/personality-tests/pdfs/${pdf.id}`}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">Preview</span>
                              </Link>
                            </Button>
                            <Button size="sm" asChild>
                              <a
                                href={pdf.pdfUrl}
                                download={`${pdf.testType}_${pdf.employeeName}.pdf`}
                              >
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download</span>
                              </a>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
