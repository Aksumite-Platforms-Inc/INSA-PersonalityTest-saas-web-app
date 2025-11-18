"use client";

import { useEffect, useState, useMemo } from "react";
import { listOrganizations } from "@/services/organization.service";
import { getAllOrgMembers } from "@/services/user.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { Organization } from "@/services/organization.service";
import { User } from "@/services/user.service";
import {
  getResults,
  getTestCompletionStatus,
  TestCompletionStatus,
} from "@/services/test.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [employees, setEmployees] = useState<User[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [errorOrgs, setErrorOrgs] = useState<string | null>(null);
  const [errorEmployees, setErrorEmployees] = useState<string | null>(null);

  const [currentView, setCurrentView] = useState<View>("employee_list");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
  const [employeeResults, setEmployeeResults] = useState<any>(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [errorResults, setErrorResults] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [completionStatus, setCompletionStatus] = useState<
    Map<number, TestCompletionStatus>
  >(new Map());
  const [loadingCompletionStatus, setLoadingCompletionStatus] = useState(false);

  // Fetch organizations on component mount
  useEffect(() => {
    setLoadingOrgs(true);
    setErrorOrgs(null);
    listOrganizations()
      .then((res) => {
        setOrganizations(res);
      })
      .catch((err) => {
        setErrorOrgs("Failed to fetch organizations.");
        console.error("Error fetching organizations:", err);
      })
      .finally(() => {
        setLoadingOrgs(false);
      });
  }, []);

  // Fetch employees when selectedOrgId changes
  useEffect(() => {
    if (!selectedOrgId) {
      setEmployees([]);
      setCompletionStatus(new Map());
      return;
    }

    setLoadingEmployees(true);
    setErrorEmployees(null);
    // Ensure selectedOrgId is a number before calling the service
    const numericOrgId = parseInt(selectedOrgId, 10);
    if (isNaN(numericOrgId)) {
      setErrorEmployees("Invalid organization ID.");
      setLoadingEmployees(false);
      return;
    }

    getAllOrgMembers(numericOrgId)
      .then((res) => {
        // getAllOrgMembers returns User[] directly
        setEmployees(res);
      })
      .catch((err) => {
        setErrorEmployees("Failed to fetch employees.");
        console.error("Error fetching employees:", err);
      })
      .finally(() => {
        setLoadingEmployees(false);
      });
  }, [selectedOrgId]);

  // Fetch completion status when selectedOrgId changes
  useEffect(() => {
    if (!selectedOrgId) {
      setCompletionStatus(new Map());
      return;
    }

    setLoadingCompletionStatus(true);
    const numericOrgId = parseInt(selectedOrgId, 10);
    if (isNaN(numericOrgId)) {
      setLoadingCompletionStatus(false);
      return;
    }

    getTestCompletionStatus(numericOrgId)
      .then((res) => {
        if (res.success && res.data) {
          // Create a map of user_id -> completion status for quick lookup
          const statusMap = new Map<number, TestCompletionStatus>();
          res.data.forEach((status) => {
            statusMap.set(status.user_id, status);
          });
          setCompletionStatus(statusMap);
        }
      })
      .catch((err) => {
        console.error("Error fetching completion status:", err);
        // Don't show error to user, just log it
      })
      .finally(() => {
        setLoadingCompletionStatus(false);
      });
  }, [selectedOrgId]);

  // Fetch test results when selectedEmployeeId changes
  useEffect(() => {
    if (!selectedEmployeeId || currentView !== "results_view") {
      setEmployeeResults(null);
      return;
    }

    setLoadingResults(true);
    setErrorResults(null);
    getResults(selectedEmployeeId.toString()) // getResults expects string ID
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
  const renderIncompleteTests = (employeeId: number) => {
    const status = completionStatus.get(employeeId);
    
    // If no status found, show all tests as incomplete
    if (!status) {
      const allTests = ["mbti", "big_five", "riasec", "enneagram"];
      return (
        <div className="flex flex-wrap gap-1">
          {allTests.map((test) => (
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
    }

    // If all tests are completed, show nothing or a success indicator
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

    // Show incomplete tests
    const incompleteTests = formatIncompleteTests(status.incomplete_tests_list);
    if (incompleteTests.length === 0) {
      return null;
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

  const renderEmployeeList = () => (
    <>
      <div className="mb-4">
        <label
          htmlFor="organization-select"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Select Organization
        </label>
        {loadingOrgs ? (
          <div className="flex items-center">
            <Loader2 className="animate-spin mr-2 h-5 w-5" /> Loading
            organizations...
          </div>
        ) : errorOrgs ? (
          <div className="text-red-600">{errorOrgs}</div>
        ) : (
          <Select
            onValueChange={(value) => {
              setSelectedOrgId(value);
              // Reset employee list and search term when org changes
              setEmployees([]);
              setSelectedEmployeeId(null);
              setEmployeeResults(null);
              setSearchTerm(""); // Reset search term
            }}
            value={selectedOrgId || ""}
          >
            <SelectTrigger id="organization-select" className="w-[300px]">
              <SelectValue placeholder="Select an organization" />
            </SelectTrigger>
            <SelectContent>
              {(organizations || []).map((org) => (
                <SelectItem key={org.id} value={org.id.toString()}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedOrgId && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Employees</h2>
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          {loadingEmployees ? (
            <div className="flex items-center">
              <Loader2 className="animate-spin mr-2 h-5 w-5" /> Loading
              employees...
            </div>
          ) : errorEmployees ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorEmployees}</AlertDescription>
            </Alert>
          ) : filteredEmployees.length === 0 ? (
            <EmptyState
              icon={searchTerm ? Users : FileX}
              title={searchTerm ? "No matching employees" : "No employees found"}
              description={
                searchTerm
                  ? "Try adjusting your search terms to find employees."
                  : "This organization doesn't have any employees yet."
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Test Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.department || "N/A"}</TableCell>
                    <TableCell>{employee.position || "N/A"}</TableCell>
                    <TableCell>
                      {loadingCompletionStatus ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        renderIncompleteTests(employee.id)
                      )}
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleViewResults(employee.id)}>
                        View Results
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </>
  );

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    return employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

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
              ? "Employee Test Results"
              : "Test Results"}
          </div>
          {currentView === "results_view" && (
            <Button onClick={handleBackToEmployees} variant="outline">
              Back to Employees
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
