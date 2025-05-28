import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EnneagramResultDisplay from "../EnneagramResultDisplay";
import { TestResult } from "@/types/personality-tests";

// Mock UI components
jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <h2 data-testid="card-title">{children}</h2>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div data-testid="card-content">{children}</div>,
}));
jest.mock("@/components/ui/progress", () => ({
  Progress: ({ value, indicatorClassName }: { value: number, indicatorClassName: string }) => (
    <div data-testid="progress-bar" data-value={value} data-indicator={indicatorClassName}>
      Progress: {value}%
    </div>
  ),
}));

// Scores keyed by numeric type string ("1", "2", ...)
const mockEnneagramScoresNumericKeys = {
  "1": 7,
  "2": 5,
  "3": 8, // Highest
  "4": 9, // Second highest, wing
  "5": 3,
  "6": 6,
  "7": 4,
  "8": 2,
  "9": 1,
};

// Scores keyed by letter type string ("A", "B", ...)
const mockEnneagramScoresLetterKeys = {
    "A": 7, // Type 1
    "B": 5, // Type 2
    "C": 8, // Type 3 - Highest
    "D": 9, // Type 4 - Second highest, wing
    "E": 3, // Type 5
    "F": 6, // Type 6
    "G": 4, // Type 7
    "H": 2, // Type 8
    "I": 1, // Type 9
  };

const mockEnneagramResult: TestResult = {
  id: "enn1",
  userId: "user1",
  testType: "enneagram",
  completedAt: new Date().toISOString(),
  scores: mockEnneagramScoresNumericKeys, // Primary: Type 4 (score 9), Wing: Type 3 (score 8) -> Should be 4w3
  interpretation: "You are driven and image-conscious, with a creative flair.",
  // primaryType: "4", // Let component calculate from scores first
  rawAnswers: {},
};
const mockEnneagramResultLetterKeys: TestResult = {
    ...mockEnneagramResult,
    scores: mockEnneagramScoresLetterKeys, // Primary: Type 4 (score 9), Wing: Type 3 (score 8) -> Should be 4w3
  };

const mockEnneagramResultWithPrimaryTypeProp: TestResult = {
    ...mockEnneagramResult,
    primaryType: "3", // Explicitly set primary type to 3 (Achiever)
    scores: { // Scores where 3 is highest, 2 is wing
        "1": 5, "2": 8, "3": 9, "4": 7, "5": 4, "6": 3, "7": 2, "8": 1, "9": 0
    }
  };


describe("EnneagramResultDisplay", () => {
  it("should render correctly with valid Enneagram data (numeric score keys)", () => {
    render(<EnneagramResultDisplay result={mockEnneagramResult} />);
    // Primary type is 4 (Individualist), Wing is 3 (Achiever) -> 4w3
    expect(screen.getByTestId("card-title")).toHaveTextContent("Enneagram Type: Type 4: The Individualist");
    expect(screen.getByText("Wing: 4w3")).toBeInTheDocument();

    // Check for core characteristics of Type 4
    expect(screen.getByText("Core Characteristics:")).toBeInTheDocument();
    expect(screen.getByText(/Expressive, dramatic, self-absorbed, and temperamental./)).toBeInTheDocument();
    expect(screen.getByText(/Core Fear: Having no identity or personal significance./)).toBeInTheDocument();
    expect(screen.getByText(/Core Desire: To find themselves and their significance \(to create an identity\)./)).toBeInTheDocument();
    
    // Check for all 9 types in scores list
    expect(screen.getAllByTestId("progress-bar")).toHaveLength(9);
    // Type 4 score (highest)
    const type4ScoreElement = screen.getByText("Type 4: The Individualist").parentElement?.querySelector("span:last-child");
    expect(type4ScoreElement).toHaveTextContent("9");
    // Max score is 9, so progress (9/9)*100 = 100. Type 4 is the primary type.
    const type4ProgressBar = screen.getAllByTestId("progress-bar").find(el => el.getAttribute("data-indicator")?.includes("green"));
    expect(type4ProgressBar).toHaveAttribute("data-value", "100");


    // Check interpretation
    expect(screen.getByText("Personal Insights")).toBeInTheDocument();
    expect(screen.getByText(mockEnneagramResult.interpretation!)).toBeInTheDocument();
  });

  it("should render correctly with letter score keys (A-I)", () => {
    render(<EnneagramResultDisplay result={mockEnneagramResultLetterKeys} />);
    // Scores are the same as mockEnneagramScoresNumericKeys, so results should be same
    // Primary type is 4 (Individualist from key 'D'), Wing is 3 (Achiever from key 'C') -> 4w3
    expect(screen.getByTestId("card-title")).toHaveTextContent("Enneagram Type: Type 4: The Individualist");
    expect(screen.getByText("Wing: 4w3")).toBeInTheDocument();
  });
  
  it("should prioritize result.primaryType if provided and valid", () => {
    render(<EnneagramResultDisplay result={mockEnneagramResultWithPrimaryTypeProp} />);
    // primaryType prop is "3", scores make 3 highest and 2 its wing.
    expect(screen.getByTestId("card-title")).toHaveTextContent("Enneagram Type: Type 3: The Achiever");
    expect(screen.getByText("Wing: 3w2")).toBeInTheDocument(); // Wing calc: Type 3 (9), Type 2 (8), Type 4 (7) -> 3w2
     // Check for core characteristics of Type 3
     expect(screen.getByText(/Adaptable, excelling, driven, and image-conscious./)).toBeInTheDocument();
  });

  it("should render correctly without interpretation", () => {
    const noInterpretationResult = { ...mockEnneagramResult, interpretation: undefined };
    render(<EnneagramResultDisplay result={noInterpretationResult} />);
    expect(screen.getByTestId("card-title")).toHaveTextContent("Enneagram Type: Type 4: The Individualist");
    expect(screen.queryByText("Personal Insights")).not.toBeInTheDocument();
  });

  it("should display a message if testType is not 'enneagram'", () => {
    const nonEnneagramResult = { ...mockEnneagramResult, testType: "oejts" as any };
    render(<EnneagramResultDisplay result={nonEnneagramResult} />);
    expect(screen.getByText("This component is for Enneagram results only.")).toBeInTheDocument();
  });

  it("should handle empty scores gracefully", () => {
    const emptyScoresResult = { ...mockEnneagramResult, scores: {} };
    render(<EnneagramResultDisplay result={emptyScoresResult} />);
    expect(screen.getByText("Enneagram scores are unavailable or in an unexpected format.")).toBeInTheDocument();
  });

  it("should calculate wing correctly when one wing score is higher (e.g. 4w5)", () => {
    const scoresFor4w5 = { ...mockEnneagramScoresNumericKeys, "5": 8.5, "3": 6 }; // Type 4 (9), Type 5 (8.5), Type 3 (6)
    const result4w5 = { ...mockEnneagramResult, scores: scoresFor4w5 };
    render(<EnneagramResultDisplay result={result4w5} />);
    expect(screen.getByText("Wing: 4w5")).toBeInTheDocument();
  });
  
  it("should handle balanced wings or single wing score if applicable in wing calculation", () => {
    // Type 4 (9), Type 3 (8), Type 5 (8) -> Balanced wings
    const scoresBalancedWings = { ...mockEnneagramScoresNumericKeys, "3": 8, "5": 8};
    const resultBalanced = {...mockEnneagramResult, scores: scoresBalancedWings};
    render(<EnneagramResultDisplay result={resultBalanced} />);
    expect(screen.getByText(/Wing: 4 \(Balanced Wings or check scores for 3\/5\)/)).toBeInTheDocument();

    // Type 4 (9), Type 3 (8), Type 5 (not present or lower)
    const scoresOneWing = { ...mockEnneagramScoresNumericKeys, "3": 8, "5": 2 }; // 5 is much lower
    const resultOneWing = {...mockEnneagramResult, scores: scoresOneWing};
    render(<EnneagramResultDisplay result={resultOneWing} />);
    expect(screen.getByText("Wing: 4w3")).toBeInTheDocument();
  });

  it("should correctly determine MAX_SCORE for progress bars", () => {
    const highScores = { ...mockEnneagramScoresNumericKeys, "4": 12 }; // Type 4 score is 12
    const resultWithHighScores = { ...mockEnneagramResult, scores: highScores };
    render(<EnneagramResultDisplay result={resultWithHighScores} />);
    // Type 4 score: 12. Max score is 12. Progress is (12/12)*100 = 100.
    const type4ProgressBar = screen.getAllByTestId("progress-bar").find(el => el.getAttribute("data-indicator")?.includes("green"));
    expect(type4ProgressBar).toHaveAttribute("data-value", "100");

    // Type 1 score: 7. Max score is 12. Progress is (7/12)*100.
    const type1ProgressBar = screen.getAllByTestId("progress-bar").find(el => el.previousElementSibling?.textContent?.includes("Type 1"));
    expect(type1ProgressBar).toHaveAttribute("data-value", String((7/12)*100));
  });
});
