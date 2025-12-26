"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Search as SearchIcon, Building2, ArrowLeft, Download, FileText, FolderArchive } from "lucide-react";
import {
  getResults,
  getTestCompletionStatus,
  TestCompletionStatus,
} from "@/services/test.service";
import { listOrganizations, Organization } from "@/services/organization.service";
import { getAllBranches, Branch } from "@/services/branch.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Users, FileX, AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { exportUserPdf, exportOrganizationZip, exportBranchZip } from "@/services/export.service";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dynamic from "next/dynamic";

// Dynamically import result components
const MBTIResultAdmin = dynamic(
  () => import("@/components/superadmin/MBTIResultAdmin"),
  { ssr: false }
);
const BigFiveResultAdmin = dynamic(
  () => import("@/components/superadmin/BigFiveResultAdmin"),
  { ssr: false }
);
const RIASECResultAdmin = dynamic(
  () => import("@/components/superadmin/RIASECResultAdmin"),
  { ssr: false }
);
const EnneagramResultAdmin = dynamic(
  () => import("@/components/superadmin/EnneagramResultAdmin"),
  { ssr: false }
);

type View = "organization_list" | "employee_list" | "results_view";

export default function SuperadminEmployeeTestsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [selectedOrgName, setSelectedOrgName] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<TestCompletionStatus[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [currentView, setCurrentView] = useState<View>("organization_list");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
  const [employeeResults, setEmployeeResults] = useState<any>(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [errorResults, setErrorResults] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all"); // all, completed, in_progress, not_started
  const [testFilter, setTestFilter] = useState<string>("all"); // all, mbti, big_five, riasec, enneagram
  const [branchFilter, setBranchFilter] = useState<string>("all");
  
  // Export loading states
  const [exportingOrgZip, setExportingOrgZip] = useState(false);
  const [exportingBranchZip, setExportingBranchZip] = useState<number | null>(null);
  const [exportingUserPdf, setExportingUserPdf] = useState<number | null>(null);
  
  // Branches state for mapping branch names to IDs
  const [branches, setBranches] = useState<Branch[]>([]);

  // Fetch organizations on component mount
  useEffect(() => {
    setLoadingOrgs(true);
    setError(null);
    listOrganizations()
      .then((res) => {
        setOrganizations(res);
      })
      .catch((err) => {
        setError("Failed to fetch organizations.");
        console.error("Error fetching organizations:", err);
      })
      .finally(() => {
        setLoadingOrgs(false);
      });
  }, []);

  // Fetch users and branches when organization is selected - optimized with abort controller
  useEffect(() => {
    if (!selectedOrgId) {
      setAllUsers([]);
      setBranches([]);
      return;
    }

    const abortController = new AbortController();
    setLoadingUsers(true);
    setError(null);
    
    // Fetch both users and branches in parallel
    Promise.all([
      getTestCompletionStatus(selectedOrgId),
      getAllBranches(selectedOrgId).catch(() => [] as Branch[]) // Silently fail for branches
    ])
      .then(([usersRes, branchesData]) => {
        if (abortController.signal.aborted) return;
        if (usersRes.success && usersRes.data) {
          setAllUsers(usersRes.data);
        } else {
          setError(usersRes.message || "Failed to fetch test completion status.");
        }
        setBranches(branchesData);
      })
      .catch((err) => {
        if (abortController.signal.aborted) return;
        setError("Failed to fetch test completion status.");
        console.error("Error fetching completion status:", err);
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setLoadingUsers(false);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [selectedOrgId]);

  // Fetch test results when selectedEmployeeId changes
  useEffect(() => {
    if (!selectedEmployeeId || currentView !== "results_view") {
      setEmployeeResults(null);
      return;
    }

    setLoadingResults(true);
    setErrorResults(null);
    getResults(selectedEmployeeId.toString())
      .then((res) => {
        setEmployeeResults(res.data);
        const available = getAvailableTests(res.data);
        setSelectedTest(available[0] || null);
      })
      .catch((err) => {
        setErrorResults("Failed to fetch test results.");
        console.error("Error fetching test results:", err);
      })
      .finally(() => {
        setLoadingResults(false);
      });
  }, [selectedEmployeeId, currentView]);

  function getAvailableTests(data: any): string[] {
    if (!data) return [];
    const tests: string[] = [];
    if (data.mbti && data.mbti.personality) tests.push("mbti");
    if (
      data.big_five &&
      (data.big_five.Raw || data.big_five.raw) &&
      Object.keys(data.big_five.Raw || data.big_five.raw).length > 0
    )
      tests.push("big5");
    if (
      (data.riasec_scores &&
        Array.isArray(data.riasec_scores) &&
        data.riasec_scores.length > 0) ||
      (data.riasec && Array.isArray(data.riasec) && data.riasec.length > 0)
    )
      tests.push("riasec");
    if (
      (data.enneagram_scores &&
        Array.isArray(data.enneagram_scores) &&
        data.enneagram_scores.length > 0) ||
      (data.enneagram &&
        Array.isArray(data.enneagram) &&
        data.enneagram.length > 0)
    )
      tests.push("enneagram");
    return tests;
  }

  const handleSelectOrganization = (org: Organization) => {
    setSelectedOrgId(org.id);
    setSelectedOrgName(org.name);
    setCurrentView("employee_list");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleBackToOrganizations = () => {
    setCurrentView("organization_list");
    setSelectedOrgId(null);
    setSelectedOrgName(null);
    setAllUsers([]);
    setBranches([]);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleViewResults = (employeeId: number) => {
    setSelectedEmployeeId(employeeId);
    setCurrentView("results_view");
  };

  const handleBackToEmployees = () => {
    setCurrentView("employee_list");
    setSelectedEmployeeId(null);
    setEmployeeResults(null);
    setSelectedTest(null);
    setErrorResults(null);
  };

  // Helper function to format incomplete tests list
  const formatIncompleteTests = (
    incompleteTestsList: string | null
  ): string[] => {
    if (!incompleteTestsList) return [];
    return incompleteTestsList.split(",").map((test) => test.trim());
  };

  // Helper function to get test display name
  const getTestDisplayName = (testName: string): string => {
    const testMap: Record<string, string> = {
      mbti: "MBTI",
      big_five: "Big Five",
      riasec: "RIASEC",
      enneagram: "Enneagram",
    };
    return testMap[testName.toLowerCase()] || testName;
  };

  // Helper function to render incomplete tests badge
  const renderTestStatus = (status: TestCompletionStatus) => {
    // If all tests are completed
    if (status.remaining_tests_count === 0) {
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200 text-xs"
        >
          All Completed
        </Badge>
      );
    }

    // If no tests started
    if (status.overall_status === "not_started") {
      return (
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-700 border-gray-200 text-xs"
        >
          Not Started
        </Badge>
      );
    }

    // Show incomplete tests
    const incompleteTests = formatIncompleteTests(status.incomplete_tests_list);
    if (incompleteTests.length === 0) {
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs"
        >
          In Progress
        </Badge>
      );
    }

    return (
      <div className="flex flex-wrap gap-1">
        {incompleteTests.map((test) => (
          <Badge
            key={test}
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs"
          >
            {getTestDisplayName(test)}
          </Badge>
        ))}
      </div>
    );
  };

  // Get unique branches for filter
  const uniqueBranches = useMemo(() => {
    const branches = new Set<string>();
    allUsers.forEach((user) => {
      if (user.branch_name) branches.add(user.branch_name);
    });
    return Array.from(branches).sort();
  }, [allUsers]);

  // Filter and paginate users
  const filteredUsers = useMemo(() => {
    let filtered = allUsers;

    // Search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.user_name?.toLowerCase().includes(lowerSearch) ||
          user.user_email?.toLowerCase().includes(lowerSearch) ||
          user.branch_name?.toLowerCase().includes(lowerSearch) ||
          user.department?.toLowerCase().includes(lowerSearch) ||
          user.position?.toLowerCase().includes(lowerSearch)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => {
        if (statusFilter === "completed") {
          return user.remaining_tests_count === 0;
        } else if (statusFilter === "in_progress") {
          return user.remaining_tests_count > 0 && user.remaining_tests_count < 4;
        } else if (statusFilter === "not_started") {
          return user.overall_status === "not_started";
        }
        return true;
      });
    }

    // Test filter
    if (testFilter !== "all") {
      filtered = filtered.filter((user) => {
        switch (testFilter) {
          case "mbti":
            return !user.mbti_completed;
          case "big_five":
            return !user.big_five_completed;
          case "riasec":
            return !user.riasec_completed;
          case "enneagram":
            return !user.enneagram_completed;
          default:
            return true;
        }
      });
    }

    // Branch filter
    if (branchFilter !== "all") {
      filtered = filtered.filter((user) => user.branch_name === branchFilter);
    }

    return filtered;
  }, [allUsers, searchTerm, statusFilter, testFilter, branchFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, testFilter, branchFilter]);

  const renderOrganizationList = () => (
    <>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-semibold mb-1">Select Organization</h2>
            <p className="text-sm text-muted-foreground">
              Choose an organization to view its members' test results
            </p>
          </div>
        </div>
      </div>

      {loadingOrgs ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin mr-2 h-5 w-5" /> Loading organizations...
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : organizations.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No organizations found"
          description="No organizations have been created yet."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <Card
              key={org.id}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleSelectOrganization(org)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {org.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-medium">Sector:</span> {org.sector || "N/A"}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium">Email:</span> {org.email || "N/A"}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium">Status:</span>{" "}
                    <Badge
                      variant="outline"
                      className={
                        org.status === "active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    >
                      {org.status || "N/A"}
                    </Badge>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );

  const renderEmployeeList = () => (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            onClick={handleBackToOrganizations}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Organizations
          </Button>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-1">
              {selectedOrgName} - Members
            </h2>
            <p className="text-sm text-muted-foreground">
              View test completion status for organization members
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, email, branch, department, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
              </SelectContent>
            </Select>

            <Select value={testFilter} onValueChange={setTestFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Test" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tests</SelectItem>
                <SelectItem value="mbti">Missing MBTI</SelectItem>
                <SelectItem value="big_five">Missing Big Five</SelectItem>
                <SelectItem value="riasec">Missing RIASEC</SelectItem>
                <SelectItem value="enneagram">Missing Enneagram</SelectItem>
              </SelectContent>
            </Select>

            {uniqueBranches.length > 0 && (
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {uniqueBranches.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {(statusFilter !== "all" || testFilter !== "all" || branchFilter !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStatusFilter("all");
                  setTestFilter("all");
                  setBranchFilter("all");
                }}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}

            {/* Export Organization ZIP Button */}
            {selectedOrgId && (
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  if (!selectedOrgId) return;
                  setExportingOrgZip(true);
                  try {
                    toast({
                      title: "Exporting...",
                      description: "Preparing organization export. This may take a moment.",
                    });

                    await exportOrganizationZip(selectedOrgId);

                    toast({
                      title: "Export Successful",
                      description: `Organization test results exported as ZIP.`,
                    });
                  } catch (error: any) {
                    console.error("Error exporting organization ZIP:", error);
                    toast({
                      title: "Export Failed",
                      description: error.message || "Failed to export organization ZIP. Please try again.",
                      variant: "destructive",
                    });
                  } finally {
                    setExportingOrgZip(false);
                  }
                }}
                disabled={exportingOrgZip || allUsers.length === 0}
                className="flex items-center gap-2"
              >
                {exportingOrgZip ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FolderArchive className="h-4 w-4" />
                )}
                Export Org (ZIP)
              </Button>
            )}

            {/* Export Branch ZIP Button - Only show when a specific branch is selected */}
            {branchFilter !== "all" && (() => {
              const selectedBranch = branches.find(b => b.name === branchFilter);
              if (!selectedBranch) return null;
              return (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    if (!selectedBranch) return;
                    setExportingBranchZip(selectedBranch.id);
                    try {
                      toast({
                        title: "Exporting...",
                        description: `Preparing branch "${branchFilter}" export. This may take a moment.`,
                      });

                      await exportBranchZip(selectedBranch.id);

                      toast({
                        title: "Export Successful",
                        description: `Branch test results exported as ZIP.`,
                      });
                    } catch (error: any) {
                      console.error("Error exporting branch ZIP:", error);
                      toast({
                        title: "Export Failed",
                        description: error.message || "Failed to export branch ZIP. Please try again.",
                        variant: "destructive",
                      });
                    } finally {
                      setExportingBranchZip(null);
                    }
                  }}
                  disabled={exportingBranchZip === selectedBranch.id || filteredUsers.length === 0}
                  className="flex items-center gap-2"
                >
                  {exportingBranchZip === selectedBranch.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FolderArchive className="h-4 w-4" />
                  )}
                  Export Branch (ZIP)
                </Button>
              );
            })()}
          </div>
        </div>
      </div>

      {loadingUsers ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin mr-2 h-5 w-5" /> Loading users...
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={searchTerm || statusFilter !== "all" || testFilter !== "all" || branchFilter !== "all" ? SearchIcon : Users}
          title={
            searchTerm || statusFilter !== "all" || testFilter !== "all" || branchFilter !== "all"
              ? "No matching users"
              : "No users found"
          }
          description={
            searchTerm || statusFilter !== "all" || testFilter !== "all" || branchFilter !== "all"
              ? "Try adjusting your filters or search terms to find users."
              : "This organization doesn't have any members yet."
          }
        />
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Branch</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Test Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell>{user.branch_name || "N/A"}</TableCell>
                    <TableCell className="font-medium">
                      {user.user_name || "N/A"}
                    </TableCell>
                    <TableCell>{user.user_email || "N/A"}</TableCell>
                    <TableCell>{user.department || "N/A"}</TableCell>
                    <TableCell>{user.position || "N/A"}</TableCell>
                    <TableCell>{renderTestStatus(user)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {user.completed_tests_count}/4
                        </span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all"
                            style={{
                              width: `${(user.completed_tests_count / 4) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleViewResults(user.user_id)}
                          size="sm"
                          variant="outline"
                        >
                          View Results
                        </Button>
                        <Button
                          onClick={async () => {
                            if (user.completed_tests_count === 0) {
                              toast({
                                title: "No Results",
                                description: "This user has not completed any tests yet.",
                                variant: "destructive",
                              });
                              return;
                            }
                            setExportingUserPdf(user.user_id);
                            try {
                              await exportUserPdf(user.user_id);
                              toast({
                                title: "Export Successful",
                                description: `PDF exported for ${user.user_name}.`,
                              });
                            } catch (error: any) {
                              console.error("Error exporting user PDF:", error);
                              toast({
                                title: "Export Failed",
                                description: error.message || "Failed to export PDF. Please try again.",
                                variant: "destructive",
                              });
                            } finally {
                              setExportingUserPdf(null);
                            }
                          }}
                          size="sm"
                          variant="outline"
                          disabled={exportingUserPdf === user.user_id || user.completed_tests_count === 0}
                          title={user.completed_tests_count === 0 ? "No test results to export" : "Export as PDF"}
                        >
                          {exportingUserPdf === user.user_id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
           {totalPages > 1 && (
             <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4">
               <div className="text-sm text-muted-foreground">
                 Showing {startIndex + 1} to{" "}
                 {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{" "}
                 {filteredUsers.length} users
                 {filteredUsers.length !== allUsers.length && (
                   <span className="ml-2">(filtered from {allUsers.length} total)</span>
                 )}
               </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );

  const renderResultsView = () => {
    if (loadingResults) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin mr-2" /> Loading test results...
        </div>
      );
    }

    if (errorResults) {
      return (
        <Alert variant="destructive" className="mt-10">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorResults}</AlertDescription>
        </Alert>
      );
    }

    if (!employeeResults) {
      return (
        <EmptyState
          icon={FileX}
          title="No test results found"
          description="Test results for this employee are not available or still loading."
        />
      );
    }

    const availableTests = getAvailableTests(employeeResults);

    if (availableTests.length === 0) {
      return (
        <EmptyState
          icon={FileX}
          title="No test results available"
          description="This employee hasn't completed any personality tests yet."
        />
      );
    }

    return (
      <div>
        <Tabs
          value={selectedTest || undefined}
          onValueChange={setSelectedTest}
          className="w-full"
        >
          <TabsList className="mb-6">
            {availableTests.includes("mbti") && (
              <TabsTrigger value="mbti">MBTI</TabsTrigger>
            )}
            {availableTests.includes("big5") && (
              <TabsTrigger value="big5">Big Five</TabsTrigger>
            )}
            {availableTests.includes("riasec") && (
              <TabsTrigger value="riasec">RIASEC</TabsTrigger>
            )}
            {availableTests.includes("enneagram") && (
              <TabsTrigger value="enneagram">Enneagram</TabsTrigger>
            )}
          </TabsList>
          <div className="flex-1 overflow-auto">
            {selectedTest === "mbti" && employeeResults.mbti && (
              <MBTIResultAdmin result={employeeResults.mbti} />
            )}
            {selectedTest === "big5" && employeeResults.big_five && (
              <BigFiveResultAdmin result={employeeResults.big_five} />
            )}
            {selectedTest === "riasec" &&
              (employeeResults.riasec_scores || employeeResults.riasec) && (
                <RIASECResultAdmin
                  result={
                    employeeResults.riasec_scores || employeeResults.riasec
                  }
                />
              )}
            {selectedTest === "enneagram" &&
              (employeeResults.enneagram_scores ||
                employeeResults.enneagram) && (
                <EnneagramResultAdmin
                  result={
                    employeeResults.enneagram_scores ||
                    employeeResults.enneagram
                  }
                />
              )}
          </div>
        </Tabs>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center border-b px-8 py-4 min-w-0">
          <div className="flex-1 text-xl font-semibold truncate">
            {currentView === "organization_list"
              ? "Organization Test Results"
              : currentView === "employee_list"
              ? `${selectedOrgName} - Members`
              : "Test Results"}
          </div>
          {currentView === "results_view" && (
            <Button onClick={handleBackToEmployees} variant="outline">
              Back to Members List
            </Button>
          )}
        </div>
        <div className="flex-1 flex flex-col px-8 py-6 min-w-0 overflow-x-auto">
          {currentView === "organization_list"
            ? renderOrganizationList()
            : currentView === "employee_list"
            ? renderEmployeeList()
            : renderResultsView()}
        </div>
      </div>
    </div>
  );
}
