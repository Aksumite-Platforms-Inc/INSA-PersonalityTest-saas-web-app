import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BigFiveResultDisplay from "../BigFiveResultDisplay";
import { TestResult } from "@/types/personality-tests";
import { BigFiveResult as BigFiveScores } from "@/types/personality.type";

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

const mockBigFiveData: BigFiveScores = {
  raw: {
    openness: 25,
    conscientiousness: 30,
    extraversion: 28,
    agreeableness: 32,
    neuroticism: 15,
  },
  normalized: {
    openness: 60,
    conscientiousness: 75,
    extraversion: 70,
    agreeableness: 80,
    neuroticism: 30,
  },
};

const mockBigFiveResult: TestResult = {
  id: "bf1",
  userId: "user1",
  testType: "big_five", // or "qualtrics"
  completedAt: new Date().toISOString(),
  scores: mockBigFiveData as any, // Casting because TestResult.scores is Record<string, number>
  interpretation: "You are generally open and conscientious.",
  rawAnswers: {},
};

const mockBigFiveResultNoInterpretation: TestResult = {
  ...mockBigFiveResult,
  interpretation: undefined,
};

const mockBigFiveResultIncompleteScores: TestResult = {
  ...mockBigFiveResult,
  scores: {
    raw: { openness: 25 }, // Missing other raw scores
    normalized: { openness: 60 }, // Missing other normalized scores
  } as any,
};

const mockBigFiveResultMissingNormalized: TestResult = {
    ...mockBigFiveResult,
    scores: {
      raw: mockBigFiveData.raw,
      // normalized is missing
    } as any,
};


describe("BigFiveResultDisplay", () => {
  it("should render correctly with valid Big Five data", () => {
    render(<BigFiveResultDisplay result={mockBigFiveResult} />);

    expect(screen.getByTestId("card-title")).toHaveTextContent("Big Five Personality Traits");

    // Check for trait names
    expect(screen.getByText("Openness")).toBeInTheDocument();
    expect(screen.getByText("Conscientiousness")).toBeInTheDocument();
    expect(screen.getByText("Extraversion")).toBeInTheDocument();
    expect(screen.getByText("Agreeableness")).toBeInTheDocument();
    expect(screen.getByText("Neuroticism")).toBeInTheDocument();

    // Check for scores and progress bars (5 traits)
    const progressBars = screen.getAllByTestId("progress-bar");
    expect(progressBars).toHaveLength(5);

    // Check Openness
    expect(screen.getByText(/60%/)).toBeInTheDocument(); // Normalized score
    expect(screen.getByText(/\(Raw: 25\)/)).toBeInTheDocument();
    expect(progressBars[0]).toHaveAttribute("data-value", "60");
    expect(screen.getByText(RegExp(mockBigFiveData.raw.openness.toString()))).toBeInTheDocument();


    // Check interpretation
    expect(screen.getByText("Overall Insights")).toBeInTheDocument();
    expect(screen.getByText(mockBigFiveResult.interpretation!)).toBeInTheDocument();
  });

  it("should render correctly without interpretation", () => {
    render(<BigFiveResultDisplay result={mockBigFiveResultNoInterpretation} />);
    expect(screen.getByTestId("card-title")).toHaveTextContent("Big Five Personality Traits");
    expect(screen.queryByText("Overall Insights")).not.toBeInTheDocument();
    expect(screen.queryByText(mockBigFiveResult.interpretation!)).not.toBeInTheDocument();
  });

  it("should handle incomplete score data gracefully", () => {
    render(<BigFiveResultDisplay result={mockBigFiveResultIncompleteScores} />);
    expect(screen.getByTestId("card-title")).toHaveTextContent("Big Five Personality Traits");
    
    // Only Openness should be fully rendered
    expect(screen.getByText("Openness")).toBeInTheDocument();
    expect(screen.getByText(/60%/)).toBeInTheDocument();
    expect(screen.getByText(/\(Raw: 25\)/)).toBeInTheDocument();
    expect(screen.getAllByTestId("progress-bar")).toHaveLength(1); // Only one progress bar for Openness

    // Other traits should not cause errors, might not be rendered or rendered with defaults
    expect(screen.queryByText("Conscientiousness")).not.toBeInTheDocument(); // Because its data is missing
  });
  
  it("should display error message for missing normalized scores", () => {
    render(<BigFiveResultDisplay result={mockBigFiveResultMissingNormalized} />);
    expect(screen.getByText("Result data is incomplete or in an unexpected format.")).toBeInTheDocument();
  });
  
  it("should display error message for completely missing scores", () => {
    const corruptedResult = { ...mockBigFiveResult, scores: {} as any };
    render(<BigFiveResultDisplay result={corruptedResult} />);
    expect(screen.getByText("Result data is incomplete or in an unexpected format.")).toBeInTheDocument();
  });

   it("should display trait descriptions", () => {
    render(<BigFiveResultDisplay result={mockBigFiveResult} />);
    expect(screen.getByText(/Reflects imagination, creativity, intellectual curiosity/)).toBeInTheDocument(); // Openness description
    expect(screen.getByText(/Measures self-discipline, organization, responsibility/)).toBeInTheDocument(); // Conscientiousness description
  });
});
