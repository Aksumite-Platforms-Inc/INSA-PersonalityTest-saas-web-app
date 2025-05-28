import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EmployeeResultsPage from "../page";
import { getResults } from "@/services/test.service";
import { getUserId } from "@/utils/tokenUtils";
import { TestResult } from "@/types/test";

// Mock services
jest.mock("@/services/test.service");
jest.mock("@/utils/tokenUtils");

// Mock child components
jest.mock("@/components/employee/results/MBTIResultDisplay", () => ({
  __esModule: true,
  default: ({ result }: { result: TestResult }) => <div data-testid="mbti-result-display">{result.testType}</div>,
}));
jest.mock("@/components/employee/results/BigFiveResultDisplay", () => ({
  __esModule: true,
  default: ({ result }: { result: TestResult }) => <div data-testid="bigfive-result-display">{result.testType}</div>,
}));
jest.mock("@/components/employee/results/RIASECResultDisplay", () => ({
  __esModule: true,
  default: ({ result }: { result: TestResult }) => <div data-testid="riasec-result-display">{result.testType}</div>,
}));
jest.mock("@/components/employee/results/EnneagramResultDisplay", () => ({
  __esModule: true,
  default: ({ result }: { result: TestResult }) => <div data-testid="enneagram-result-display">{result.testType}</div>,
}));

const mockGetUserId = getUserId as jest.Mock;
const mockGetResults = getResults as jest.Mock;

describe("EmployeeResultsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUserId.mockReturnValue("test-user-id"); // Default mock for getUserId
  });

  it("should display loading state initially", () => {
    mockGetResults.mockReturnValue(new Promise(() => {})); // Simulate pending promise
    render(<EmployeeResultsPage />);
    expect(screen.getByText("Loading results...")).toBeInTheDocument();
  });

  it("should display error message if getUserId returns null", async () => {
    mockGetUserId.mockReturnValue(null);
    render(<EmployeeResultsPage />);
    await waitFor(() => {
      expect(screen.getByText("Error: User ID not found. Please ensure you are logged in.")).toBeInTheDocument();
    });
  });

  it("should display error message if getResults throws an error", async () => {
    mockGetResults.mockRejectedValue(new Error("Failed to fetch"));
    render(<EmployeeResultsPage />);
    await waitFor(() => {
      expect(screen.getByText("Error: Failed to fetch results. Please try again later.")).toBeInTheDocument();
    });
  });

  it('should display "No exam results found." if getResults returns empty array', async () => {
    mockGetResults.mockResolvedValue([]);
    render(<EmployeeResultsPage />);
    await waitFor(() => {
      expect(screen.getByText("No exam results found.")).toBeInTheDocument();
    });
  });
  
  it('should display "No exam results found." if getResults returns null', async () => {
    mockGetResults.mockResolvedValue(null); // Service might return null
    render(<EmployeeResultsPage />);
    await waitFor(() => {
      expect(screen.getByText("No exam results found.")).toBeInTheDocument();
    });
  });

  const mockTestResults: TestResult[] = [
    { id: "1", userId: "user1", testType: "oejts", completedAt: new Date().toISOString(), scores: {}, rawAnswers: {} },
    { id: "2", userId: "user1", testType: "big_five", completedAt: new Date().toISOString(), scores: {}, rawAnswers: {} },
    { id: "3", userId: "user1", testType: "qualtrics", completedAt: new Date().toISOString(), scores: {}, rawAnswers: {} }, // Assuming qualtrics maps to BigFive
    { id: "4", userId: "user1", testType: "riasec", completedAt: new Date().toISOString(), scores: {}, rawAnswers: {} },
    { id: "5", userId: "user1", testType: "enneagram", completedAt: new Date().toISOString(), scores: {}, rawAnswers: {} },
    { id: "6", userId: "user1", testType: "unknown_test" as any, completedAt: new Date().toISOString(), scores: {}, rawAnswers: {} },
  ];

  it("should render MBTIResultDisplay for 'oejts' test type", async () => {
    mockGetResults.mockResolvedValue([mockTestResults[0]]);
    render(<EmployeeResultsPage />);
    await waitFor(() => {
      expect(screen.getByTestId("mbti-result-display")).toHaveTextContent("oejts");
    });
  });

  it("should render BigFiveResultDisplay for 'big_five' test type", async () => {
    mockGetResults.mockResolvedValue([mockTestResults[1]]);
    render(<EmployeeResultsPage />);
    await waitFor(() => {
      expect(screen.getByTestId("bigfive-result-display")).toHaveTextContent("big_five");
    });
  });
  
  it("should render BigFiveResultDisplay for 'qualtrics' test type", async () => {
    mockGetResults.mockResolvedValue([mockTestResults[2]]);
    render(<EmployeeResultsPage />);
    await waitFor(() => {
      expect(screen.getByTestId("bigfive-result-display")).toHaveTextContent("qualtrics");
    });
  });

  it("should render RIASECResultDisplay for 'riasec' test type", async () => {
    mockGetResults.mockResolvedValue([mockTestResults[3]]);
    render(<EmployeeResultsPage />);
    await waitFor(() => {
      expect(screen.getByTestId("riasec-result-display")).toHaveTextContent("riasec");
    });
  });

  it("should render EnneagramResultDisplay for 'enneagram' test type", async () => {
    mockGetResults.mockResolvedValue([mockTestResults[4]]);
    render(<EmployeeResultsPage />);
    await waitFor(() => {
      expect(screen.getByTestId("enneagram-result-display")).toHaveTextContent("enneagram");
    });
  });
  
  it("should render default display for an unknown test type", async () => {
    mockGetResults.mockResolvedValue([mockTestResults[5]]);
    render(<EmployeeResultsPage />);
    await waitFor(() => {
      expect(screen.getByText("Test: UNKNOWN_TEST")).toBeInTheDocument(); // Based on default fallback
      expect(screen.getByText(/Completed on:/)).toBeInTheDocument();
      expect(screen.getByText("Scores:")).toBeInTheDocument();
    });
  });

  it("should render all types of results when multiple are returned", async () => {
    mockGetResults.mockResolvedValue(mockTestResults);
    render(<EmployeeResultsPage />);
    await waitFor(() => {
      expect(screen.getByTestId("mbti-result-display")).toHaveTextContent("oejts");
      // Check for both big_five and qualtrics as they map to the same component
      const bigFiveDisplays = screen.getAllByTestId("bigfive-result-display");
      expect(bigFiveDisplays[0]).toHaveTextContent("big_five");
      expect(bigFiveDisplays[1]).toHaveTextContent("qualtrics");
      expect(screen.getByTestId("riasec-result-display")).toHaveTextContent("riasec");
      expect(screen.getByTestId("enneagram-result-display")).toHaveTextContent("enneagram");
      expect(screen.getByText("Test: UNKNOWN_TEST")).toBeInTheDocument();
    });
  });
});
