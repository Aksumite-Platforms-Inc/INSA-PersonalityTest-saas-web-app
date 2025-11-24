import * as XLSX from "xlsx";
import { TestCompletionStatus } from "@/services/test.service";

interface ExportEmployee {
  id: number;
  name: string;
  email: string;
  department?: string;
  position?: string;
  status?: string;
  created_at?: string;
  branch_name?: string;
  organization_name?: string;
  // Test completion fields
  mbti_completed?: boolean;
  big_five_completed?: boolean;
  riasec_completed?: boolean;
  enneagram_completed?: boolean;
  overall_status?: string;
  completed_tests_count?: number;
  remaining_tests_count?: number;
  incomplete_tests_list?: string;
  test_started_at?: string | null;
  completed_at?: string | null;
}

/**
 * Formats incomplete tests list for display
 */
const formatIncompleteTests = (incompleteTestsList: string | null): string => {
  if (!incompleteTestsList) return "All Completed";
  const tests = incompleteTestsList.split(",").map((test) => test.trim());
  const testMap: Record<string, string> = {
    mbti: "MBTI",
    big_five: "Big Five",
    riasec: "RIASEC",
    enneagram: "Enneagram",
  };
  return tests.map((test) => testMap[test.toLowerCase()] || test).join(", ");
};

/**
 * Gets overall test status description
 */
const getOverallStatusDescription = (status: ExportEmployee): string => {
  if (status.remaining_tests_count === 0) {
    return "All Completed";
  }
  if (status.overall_status === "not_started") {
    return "Not Started";
  }
  if (status.overall_status === "in_progress") {
    return "In Progress";
  }
  if (status.incomplete_tests_list) {
    return formatIncompleteTests(status.incomplete_tests_list);
  }
  return "Unknown";
};

/**
 * Exports employee data to Excel format
 * @param employees - Array of employee data
 * @param completionStatusMap - Map of user_id to TestCompletionStatus
 * @param fileName - Name of the exported file
 * @param filters - Optional object describing applied filters
 */
export function exportEmployeesToExcel(
  employees: ExportEmployee[],
  completionStatusMap: Map<number, TestCompletionStatus>,
  fileName: string = "employee_report",
  filters?: {
    searchTerm?: string;
    statusFilter?: string;
    testFilter?: string;
    branchFilter?: string;
  }
) {
  // Prepare data for export
  const exportData = employees.map((employee) => {
    const status = completionStatusMap.get(employee.id);
    
    return {
      "Employee ID": employee.id,
      "Name": employee.name || "N/A",
      "Email": employee.email || "N/A",
      "Department": employee.department || "N/A",
      "Position": employee.position || "N/A",
      "Status": employee.status || "N/A",
      "Organization": employee.organization_name || "N/A",
      "Branch": employee.branch_name || "N/A",
      "Registered Date": employee.created_at
        ? new Date(employee.created_at).toLocaleDateString()
        : "N/A",
      // Test completion status
      "MBTI Completed": status?.mbti_completed ? "Yes" : "No",
      "Big Five Completed": status?.big_five_completed ? "Yes" : "No",
      "RIASEC Completed": status?.riasec_completed ? "Yes" : "No",
      "Enneagram Completed": status?.enneagram_completed ? "Yes" : "No",
      "Completed Tests Count": status?.completed_tests_count || 0,
      "Remaining Tests Count": status?.remaining_tests_count || 4,
      "Overall Status": status
        ? getOverallStatusDescription({
            ...employee,
            ...status,
          })
        : "Not Started",
      "Incomplete Tests": status?.incomplete_tests_list
        ? formatIncompleteTests(status.incomplete_tests_list)
        : status?.remaining_tests_count === 0
        ? "All Completed"
        : "All Tests",
      "Test Started At": status?.test_started_at
        ? new Date(status.test_started_at).toLocaleString()
        : "N/A",
      "Completed At": status?.completed_at
        ? new Date(status.completed_at).toLocaleString()
        : "N/A",
    };
  });

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  const colWidths = [
    { wch: 12 }, // Employee ID
    { wch: 25 }, // Name
    { wch: 30 }, // Email
    { wch: 20 }, // Department
    { wch: 20 }, // Position
    { wch: 12 }, // Status
    { wch: 25 }, // Organization
    { wch: 20 }, // Branch
    { wch: 15 }, // Registered Date
    { wch: 18 }, // MBTI Completed
    { wch: 18 }, // Big Five Completed
    { wch: 18 }, // RIASEC Completed
    { wch: 20 }, // Enneagram Completed
    { wch: 20 }, // Completed Tests Count
    { wch: 22 }, // Remaining Tests Count
    { wch: 18 }, // Overall Status
    { wch: 25 }, // Incomplete Tests
    { wch: 20 }, // Test Started At
    { wch: 20 }, // Completed At
  ];
  ws["!cols"] = colWidths;

  // Add summary sheet if filters are applied
  if (filters && Object.keys(filters).length > 0) {
    const summaryData = [
      { "Report Information": "Value" },
      { "Report Information": "Generated Date", "Value": new Date().toLocaleString() },
      { "Report Information": "Total Employees", "Value": employees.length },
      { "Report Information": "" },
    ];

    if (filters.searchTerm) {
      summaryData.push({
        "Report Information": "Search Term",
        "Value": filters.searchTerm,
      });
    }
    if (filters.statusFilter && filters.statusFilter !== "all") {
      summaryData.push({
        "Report Information": "Status Filter",
        "Value": filters.statusFilter,
      });
    }
    if (filters.testFilter && filters.testFilter !== "all") {
      summaryData.push({
        "Report Information": "Test Filter",
        "Value": filters.testFilter,
      });
    }
    if (filters.branchFilter && filters.branchFilter !== "all") {
      summaryData.push({
        "Report Information": "Branch Filter",
        "Value": filters.branchFilter,
      });
    }

    // Add statistics
    const completedCount = employees.filter(
      (emp) => completionStatusMap.get(emp.id)?.remaining_tests_count === 0
    ).length;
    const inProgressCount = employees.filter(
      (emp) => {
        const status = completionStatusMap.get(emp.id);
        return (
          status &&
          status.remaining_tests_count > 0 &&
          status.remaining_tests_count < 4
        );
      }
    ).length;
    const notStartedCount = employees.filter(
      (emp) =>
        completionStatusMap.get(emp.id)?.overall_status === "not_started"
    ).length;

    summaryData.push(
      { "Report Information": "" },
      { "Report Information": "Statistics", "Value": "" },
      { "Report Information": "All Tests Completed", "Value": completedCount },
      { "Report Information": "In Progress", "Value": inProgressCount },
      { "Report Information": "Not Started", "Value": notStartedCount }
    );

    const summaryWs = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, "Report Summary");
  }

  // Add main data sheet
  XLSX.utils.book_append_sheet(wb, ws, "Employee Data");

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split("T")[0];
  const finalFileName = `${fileName}_${timestamp}.xlsx`;

  // Write file
  XLSX.writeFile(wb, finalFileName);
}

