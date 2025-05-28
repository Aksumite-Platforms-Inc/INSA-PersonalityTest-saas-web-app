import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RIASECResultDisplay from "../RIASECResultDisplay";
import { TestResult } from "@/types/personality-tests";

// Mock UI components
jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <h2 data-testid="card-title">{children}</h2>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div data-testid="card-content">{children}</div>,
}));
jest.mock("@/components/ui/progress", () => ({
  Progress: ({ value }: { value: number }) => <div data-testid="progress-bar" data-value={value}>Progress: {value}%</div>,
}));

const mockRiasecScores = {
  realistic: 7,
  investigative: 5,
  artistic: 8,
  social: 6,
  enterprising: 3,
  conventional: 4,
};

const mockRiasecResult: TestResult = {
  id: "riasec1",
  userId: "user1",
  testType: "riasec",
  completedAt: new Date().toISOString(),
  scores: mockRiasecScores,
  interpretation: "You have strong artistic and realistic interests.",
  rawAnswers: {},
};

const mockRiasecResultNoInterpretation: TestResult = {
  ...mockRiasecResult,
  interpretation: undefined,
};

const mockNonRiasecResult: TestResult = {
  id: "other1",
  userId: "user1",
  testType: "oejts", // Not RIASEC
  completedAt: new Date().toISOString(),
  scores: {},
  rawAnswers: {},
};

describe("RIASECResultDisplay", () => {
  it("should render correctly with valid RIASEC data", () => {
    render(<RIASECResultDisplay result={mockRiasecResult} />);

    // Top 3 codes: Artistic (8), Realistic (7), Social (6) -> ARS
    expect(screen.getByTestId("card-title")).toHaveTextContent("Your RIASEC Code: ARS");

    // Check for primary type description
    expect(screen.getByText("Your primary type is Artistic.")).toBeInTheDocument();
    expect(screen.getByText(/Values creativity, self-expression, and innovation./)).toBeInTheDocument(); // Artistic description

    // Check for all 6 types in the scores list
    expect(screen.getByText("Realistic (R)")).toBeInTheDocument();
    expect(screen.getByText("Investigative (I)")).toBeInTheDocument();
    expect(screen.getByText("Artistic (A)")).toBeInTheDocument();
    expect(screen.getByText("Social (S)")).toBeInTheDocument();
    expect(screen.getByText("Enterprising (E)")).toBeInTheDocument();
    expect(screen.getByText("Conventional (C)")).toBeInTheDocument();
    
    const progressBars = screen.getAllByTestId("progress-bar");
    expect(progressBars).toHaveLength(6);

    // Artistic score: 8. Max score is 8. Progress is (8/8)*100 = 100
    const artisticScoreElement = screen.getByText("Artistic (A)").parentElement?.querySelector("span:last-child");
    expect(artisticScoreElement).toHaveTextContent("8");
    // The progress bar value depends on the order after sorting, Artistic is first.
    expect(progressBars[0]).toHaveAttribute("data-value", "100");


    // Check for interpretation
    expect(screen.getByText("Further Insights")).toBeInTheDocument();
    expect(screen.getByText(mockRiasecResult.interpretation!)).toBeInTheDocument();
    
    // Check top 3 descriptions
    expect(screen.getByText("Focus on Your Top Types:")).toBeInTheDocument();
    // Artistic
    expect(screen.getByText((content, element) => element?.tagName.toLowerCase() === 'h4' && content.startsWith('Artistic'))).toBeInTheDocument();
    // Realistic
    expect(screen.getByText((content, element) => element?.tagName.toLowerCase() === 'h4' && content.startsWith('Realistic'))).toBeInTheDocument();
    // Social
    expect(screen.getByText((content, element) => element?.tagName.toLowerCase() === 'h4' && content.startsWith('Social'))).toBeInTheDocument();
  });

  it("should render correctly without interpretation", () => {
    render(<RIASECResultDisplay result={mockRiasecResultNoInterpretation} />);
    expect(screen.getByTestId("card-title")).toHaveTextContent("Your RIASEC Code: ARS");
    expect(screen.queryByText("Further Insights")).not.toBeInTheDocument();
  });

  it("should display a message if testType is not 'riasec'", () => {
    render(<RIASECResultDisplay result={mockNonRiasecResult} />);
    expect(screen.getByText("This component is for RIASEC results only.")).toBeInTheDocument();
    expect(screen.queryByTestId("card")).not.toBeInTheDocument();
  });

  it("should handle empty scores gracefully", () => {
    const emptyScoresResult = { ...mockRiasecResult, scores: {} };
    render(<RIASECResultDisplay result={emptyScoresResult} />);
    expect(screen.getByText("RIASEC scores are unavailable or in an unexpected format.")).toBeInTheDocument();
  });
  
  it("should handle scores with non-numeric values gracefully", () => {
    const invalidScoresResult = { ...mockRiasecResult, scores: { realistic: "high" as any, investigative: 5 } };
    render(<RIASECResultDisplay result={invalidScoresResult} />);
    // Investigative should still render
    expect(screen.getByText("Investigative (I)")).toBeInTheDocument();
    // Realistic might be filtered out or rendered as 0 depending on implementation
    // Based on current implementation: `typeof score === 'number' ? score : 0`
    const realisticScoreElement = screen.getByText("Realistic (R)").parentElement?.querySelector("span:last-child");
    expect(realisticScoreElement).toHaveTextContent("0"); 
    expect(screen.getByTestId("card-title")).toHaveTextContent(/Your RIASEC Code: I/); // Only I might be valid
  });

  it("should correctly determine MAX_SCORE for progress bars", () => {
    // Test with scores where max is > 7
    const highScores = { ...mockRiasecScores, artistic: 10 }; 
    const resultWithHighScores = { ...mockRiasecResult, scores: highScores };
    render(<RIASECResultDisplay result={resultWithHighScores} />);
    // Artistic score: 10. Max score is 10. Progress is (10/10)*100 = 100
    const artisticProgressBar = screen.getAllByTestId("progress-bar")[0]; // Artistic is highest
    expect(artisticProgressBar).toHaveAttribute("data-value", "100");

    // Realistic score: 7. Max score is 10. Progress is (7/10)*100 = 70
    const realisticProgressBar = screen.getAllByTestId("progress-bar")[1]; // Realistic is second highest
    expect(realisticProgressBar).toHaveAttribute("data-value", "70");
  });
});
