import * as XLSX from "xlsx";
import { TestCompletionStatus } from "@/services/test.service";
import { PersonalityTestScores } from "@/types/personality.type";
import { getResults } from "@/services/test.service";

interface UserTestResult {
  user_id: number;
  user_name: string;
  user_email: string;
  department?: string;
  position?: string;
  branch_name?: string;
  organization_name?: string;
  results?: PersonalityTestScores;
}

/**
 * Gets top 3 RIASEC types from scores
 * RIASEC types are stored as single letters: R, I, A, S, E, C
 */
const getTop3RIASEC = (riasecScores: any[]): string => {
  if (!riasecScores || riasecScores.length === 0) return "N/A";
  
  // Sort by score descending and take top 3
  const sorted = [...riasecScores]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 3);
  
  // Extract type letter (could be in 'type' field or first letter of 'type_name')
  const types = sorted.map((s) => {
    if (s.type) return s.type.toUpperCase();
    if (s.type_name) {
      // Extract first letter from type name (e.g., "Realistic" -> "R")
      const firstLetter = s.type_name.charAt(0).toUpperCase();
      return firstLetter;
    }
    return "";
  }).filter(t => t.length > 0);
  
  return types.join("") || "N/A";
};

/**
 * Gets Enneagram type with wing
 * Enneagram types are stored as letters A-I (A=1, B=2, ..., I=9)
 */
const getEnneagramType = (enneagramScores: any[]): string => {
  if (!enneagramScores || enneagramScores.length === 0) return "N/A";
  
  // Sort by score descending
  const sorted = [...enneagramScores].sort((a, b) => (b.score || 0) - (a.score || 0));
  
  if (sorted.length === 0) return "N/A";
  
  const primary = sorted[0];
  // Convert letter to number (A=1, B=2, ..., I=9)
  const primaryTypeLetter = primary.type || "";
  const primaryNum = primaryTypeLetter.charCodeAt(0) - 64; // A → 1, B → 2, etc.
  
  if (isNaN(primaryNum) || primaryNum < 1 || primaryNum > 9) {
    // Try to extract number from type_name if available
    const numFromName = primary.type_name?.match(/\d+/)?.[0];
    if (numFromName) {
      const num = parseInt(numFromName);
      if (num >= 1 && num <= 9) {
        // Find wing
        const wing1 = num === 1 ? 9 : num - 1;
        const wing2 = num === 9 ? 1 : num + 1;
        
        const wing1Score = sorted.find((s) => {
          const letter = s.type?.charCodeAt(0) - 64;
          const nameNum = parseInt(s.type_name?.match(/\d+/)?.[0] || "0");
          return letter === wing1 || nameNum === wing1;
        })?.score || 0;
        
        const wing2Score = sorted.find((s) => {
          const letter = s.type?.charCodeAt(0) - 64;
          const nameNum = parseInt(s.type_name?.match(/\d+/)?.[0] || "0");
          return letter === wing2 || nameNum === wing2;
        })?.score || 0;
        
        const wing = wing1Score > wing2Score ? wing1 : wing2;
        return `${num}w${wing}`;
      }
    }
    return "N/A";
  }
  
  // Find wing (adjacent type with highest score)
  const wing1 = primaryNum === 1 ? 9 : primaryNum - 1;
  const wing2 = primaryNum === 9 ? 1 : primaryNum + 1;
  
  const wing1Score = sorted.find((s) => {
    const letter = s.type?.charCodeAt(0) - 64;
    return letter === wing1;
  })?.score || 0;
  
  const wing2Score = sorted.find((s) => {
    const letter = s.type?.charCodeAt(0) - 64;
    return letter === wing2;
  })?.score || 0;
  
  const wing = wing1Score > wing2Score ? wing1 : wing2;
  
  return `${primaryNum}w${wing}`;
};

/**
 * Exports test results to Excel in the specified format
 * @param users - Array of users with test completion status
 * @param fileName - Name of the exported file
 * @param filters - Optional object describing applied filters
 */
export async function exportTestResultsToExcel(
  users: TestCompletionStatus[],
  fileName: string = "test_results_report",
  filters?: {
    searchTerm?: string;
    statusFilter?: string;
    testFilter?: string;
    branchFilter?: string;
  }
) {
  // Fetch results for all users who have completed at least one test
  const usersWithResults: UserTestResult[] = [];
  
  for (const user of users) {
    // Only fetch results if user has at least one completed test
    if (user.completed_tests_count > 0 && user.test_record_id) {
      try {
        const resultsResponse = await getResults(String(user.user_id));
        if (resultsResponse.success && resultsResponse.data) {
          usersWithResults.push({
            user_id: user.user_id,
            user_name: user.user_name,
            user_email: user.user_email,
            department: user.department,
            position: user.position,
            branch_name: user.branch_name,
            organization_name: user.organization_name,
            results: resultsResponse.data,
          });
        }
      } catch (error) {
        console.error(`Error fetching results for user ${user.user_id}:`, error);
        // Continue with other users even if one fails
      }
    }
  }

  // Prepare data for export in the specified format
  const exportData = usersWithResults.map((user, index) => {
    const results = user.results;
    
    // MBTI
    const mbti = results?.mbti?.personality || "N/A";
    
    // RIASEC - Top 3 types
    const riasec = results?.riasec_scores 
      ? getTop3RIASEC(results.riasec_scores)
      : "N/A";
    
    // Enneagram - Type with wing
    const enneagram = results?.enneagram_scores
      ? getEnneagramType(results.enneagram_scores)
      : "N/A";
    
    // Big Five - Raw scores (O, C, E, A, N)
    const bigFive = results?.big_five?.raw || results?.big_five?.Raw;
    const openness = bigFive?.openness || bigFive?.Openness || "N/A";
    const conscientiousness = bigFive?.conscientiousness || bigFive?.Conscientiousness || "N/A";
    const extraversion = bigFive?.extraversion || bigFive?.Extraversion || "N/A";
    const agreeableness = bigFive?.agreeableness || bigFive?.Agreeableness || "N/A";
    const neuroticism = bigFive?.neuroticism || bigFive?.Neuroticism || "N/A";
    
    // Person - Using branch name or department as identifier
    const person = user.branch_name || user.department || "N/A";
    
    return {
      "S/N": index + 1,
      "Full Name": user.user_name || "N/A",
      "MBTI": mbti,
      "RIASEC": riasec,
      "Enn": enneagram,
      "O": openness,
      "C": conscientiousness,
      "E": extraversion,
      "A": agreeableness,
      "N": neuroticism,
      "Person": person,
      "Email": user.user_email || "N/A",
      "Department": user.department || "N/A",
      "Position": user.position || "N/A",
      "Organization": user.organization_name || "N/A",
      "Branch": user.branch_name || "N/A",
    };
  });

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  const colWidths = [
    { wch: 6 },  // S/N
    { wch: 35 }, // Full Name
    { wch: 8 },  // MBTI
    { wch: 8 },  // RIASEC
    { wch: 8 },  // Enn
    { wch: 6 },  // O
    { wch: 6 },  // C
    { wch: 6 },  // E
    { wch: 6 },  // A
    { wch: 6 },  // N
    { wch: 15 }, // Person
    { wch: 30 }, // Email
    { wch: 20 }, // Department
    { wch: 20 }, // Position
    { wch: 25 }, // Organization
    { wch: 20 }, // Branch
  ];
  ws["!cols"] = colWidths;

  // Add summary sheet if filters are applied
  if (filters && Object.keys(filters).length > 0) {
    const summaryData = [
      { "Report Information": "Value" },
      { "Report Information": "Generated Date", "Value": new Date().toLocaleString() },
      { "Report Information": "Total Users", "Value": users.length },
      { "Report Information": "Users with Results", "Value": usersWithResults.length },
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
    const completedCount = users.filter(
      (u) => u.remaining_tests_count === 0
    ).length;
    const inProgressCount = users.filter(
      (u) => u.remaining_tests_count > 0 && u.remaining_tests_count < 4
    ).length;
    const notStartedCount = users.filter(
      (u) => u.overall_status === "not_started"
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
  XLSX.utils.book_append_sheet(wb, ws, "Test Results");

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split("T")[0];
  const finalFileName = `${fileName}_${timestamp}.xlsx`;

  // Write file
  XLSX.writeFile(wb, finalFileName);
}

