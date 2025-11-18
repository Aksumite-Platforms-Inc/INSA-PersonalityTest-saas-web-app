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
import { Loader2, Search as SearchIcon } from "lucide-react";
import {
  getResults,
  getTestCompletionStatus,
  TestCompletionStatus,
} from "@/services/test.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Users, FileX, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

type View = "employee_list" | "results_view";

export default function SuperadminEmployeeTestsPage() {
  const [allUsers, setAllUsers] = useState<TestCompletionStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentView, setCurrentView] = useState<View>("employee_list");
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

  // Fetch all users' completion status on component mount
  useEffect(() => {
    setLoading(true);
    setError(null);
    // Call without org_id to get all users (super admin can see all)
    getTestCompletionStatus()
      .then((res) => {
        if (res.success && res.data) {
          setAllUsers(res.data);
        } else {
          setError(res.message || "Failed to fetch test completion status.");
        }
      })
      .catch((err) => {
        setError("Failed to fetch test completion status.");
        console.error("Error fetching completion status:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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

  // Filter and paginate users
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return allUsers;
    const lowerSearch = searchTerm.toLowerCase();
    return allUsers.filter(
      (user) =>
        user.user_name?.toLowerCase().includes(lowerSearch) ||
        user.user_email?.toLowerCase().includes(lowerSearch) ||
        user.organization_name?.toLowerCase().includes(lowerSearch) ||
        user.branch_name?.toLowerCase().includes(lowerSearch) ||
        user.department?.toLowerCase().includes(lowerSearch) ||
        user.position?.toLowerCase().includes(lowerSearch)
    );
  }, [allUsers, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const renderEmployeeList = () => (
    <>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-semibold mb-1">All Organization Members</h2>
            <p className="text-sm text-muted-foreground">
              View test completion status for all users across all organizations
            </p>
          </div>
        </div>
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, email, organization, branch, department, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {loading ? (
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
          icon={searchTerm ? SearchIcon : Users}
          title={searchTerm ? "No matching users" : "No users found"}
          description={
            searchTerm
              ? "Try adjusting your search terms to find users."
              : "No users have been registered yet."
          }
        />
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
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
                    <TableCell className="font-medium">
                      {user.organization_name || "N/A"}
                    </TableCell>
                    <TableCell>{user.branch_name || "N/A"}</TableCell>
                    <TableCell>{user.user_name || "N/A"}</TableCell>
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
                      <Button
                        onClick={() => handleViewResults(user.user_id)}
                        size="sm"
                        variant="outline"
                      >
                        View Results
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{" "}
                {filteredUsers.length} users
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
            {currentView === "employee_list"
              ? "Organization Members Test Results"
              : "Test Results"}
          </div>
          {currentView === "results_view" && (
            <Button onClick={handleBackToEmployees} variant="outline">
              Back to Members List
            </Button>
          )}
        </div>
        <div className="flex-1 flex flex-col px-8 py-6 min-w-0 overflow-x-auto">
          {currentView === "employee_list"
            ? renderEmployeeList()
            : renderResultsView()}
        </div>
      </div>
    </div>
  );
}
