import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MBTIResultDisplay from "../MBTIResultDisplay";
import { TestResult } from "@/types/personality-tests";

// Mock UI components used by MBTIResultDisplay (e.g., Card, Progress)
jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <h2 data-testid="card-title">{children}</h2>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div data-testid="card-content">{children}</div>,
}));
jest.mock("@/components/ui/progress", () => ({
  Progress: ({ value }: { value: number }) => <div data-testid="progress-bar" data-value={value}>Progress: {value}%</div>,
}));

const mockMbtiResult: TestResult = {
  id: "mbti1",
  userId: "user1",
  testType: "oejts",
  completedAt: new Date().toISOString(),
  scores: {
    ei: 1.5, // Extroversion
    sn: -1.0, // Sensing
    tf: 0.5, // Feeling
    jp: -0.8, // Judging
  },
  primaryType: "ESFJ",
  interpretation: "You are an ESFJ. This means you are outgoing, friendly, and organized.",
  rawAnswers: {},
};

const mockMbtiResultNoInterpretation: TestResult = {
  ...mockMbtiResult,
  interpretation: undefined,
};

const mockNonMbtiResult: TestResult = {
  id: "other1",
  userId: "user1",
  testType: "riasec", // Not MBTI
  completedAt: new Date().toISOString(),
  scores: {},
  primaryType: "RIA",
  rawAnswers: {},
};

describe("MBTIResultDisplay", () => {
  it("should render correctly with valid MBTI data", () => {
    render(<MBTIResultDisplay result={mockMbtiResult} />);

    expect(screen.getByTestId("card-title")).toHaveTextContent("MBTI Personality Type: ESFJ");
    
    // Check for dimension labels (partial match)
    expect(screen.getByText(/Introversion \(I\)/)).toBeInTheDocument();
    expect(screen.getByText(/Extroversion \(E\)/)).toBeInTheDocument();
    expect(screen.getByText(/Sensing \(S\)/)).toBeInTheDocument();
    expect(screen.getByText(/Intuition \(N\)/)).toBeInTheDocument();
    expect(screen.getByText(/Thinking \(T\)/)).toBeInTheDocument();
    expect(screen.getByText(/Feeling \(F\)/)).toBeInTheDocument();
    expect(screen.getByText(/Judging \(J\)/)).toBeInTheDocument();
    expect(screen.getByText(/Perceiving \(P\)/)).toBeInTheDocument();

    // Check for scores and progress bars
    const progressBars = screen.getAllByTestId("progress-bar");
    expect(progressBars).toHaveLength(4);

    // EI Score: 1.5 -> ((1.5 + 2) / 4) * 100 = 87.5
    expect(screen.getByText("Your preference score:")).toBeInTheDocument(); // First score
    expect(screen.getAllByText(/Your preference score:/)[0]).toHaveTextContent("1.5");
    expect(progressBars[0]).toHaveAttribute("data-value", "87.5");

    // SN Score: -1.0 -> ((-1.0 + 2) / 4) * 100 = 25
    expect(screen.getAllByText(/Your preference score:/)[1]).toHaveTextContent("-1.0");
    expect(progressBars[1]).toHaveAttribute("data-value", "25");
    
    // TF Score: 0.5 -> ((0.5 + 2) / 4) * 100 = 62.5
    expect(screen.getAllByText(/Your preference score:/)[2]).toHaveTextContent("0.5");
    expect(progressBars[2]).toHaveAttribute("data-value", "62.5");

    // JP Score: -0.8 -> ((-0.8 + 2) / 4) * 100 = 30
    expect(screen.getAllByText(/Your preference score:/)[3]).toHaveTextContent("-0.8");
    expect(progressBars[3]).toHaveAttribute("data-value", "30");


    expect(screen.getByText("About Your Type")).toBeInTheDocument();
    expect(screen.getByText(mockMbtiResult.interpretation!)).toBeInTheDocument();
  });

  it("should render correctly without interpretation", () => {
    render(<MBTIResultDisplay result={mockMbtiResultNoInterpretation} />);
    expect(screen.getByTestId("card-title")).toHaveTextContent("MBTI Personality Type: ESFJ");
    expect(screen.queryByText("About Your Type")).not.toBeInTheDocument();
    expect(screen.queryByText(mockMbtiResult.interpretation!)).not.toBeInTheDocument();
  });

  it("should display a message if testType is not 'oejts'", () => {
    render(<MBTIResultDisplay result={mockNonMbtiResult} />);
    expect(screen.getByText("This component is for MBTI (OEJTS) results only.")).toBeInTheDocument();
    expect(screen.queryByTestId("card")).not.toBeInTheDocument(); // No card should be rendered
  });
  
  it("should handle missing primaryType gracefully", () => {
    const resultWithoutPrimaryType = { ...mockMbtiResult, primaryType: undefined };
    render(<MBTIResultDisplay result={resultWithoutPrimaryType} />);
    expect(screen.getByTestId("card-title")).toHaveTextContent("MBTI Personality Type: N/A");
  });

  it("should handle missing scores gracefully, defaulting to 0", () => {
    const resultWithoutScores = { ...mockMbtiResult, scores: {} };
    render(<MBTIResultDisplay result={resultWithoutScores} />);
    
    const progressBars = screen.getAllByTestId("progress-bar");
    expect(progressBars).toHaveLength(4);

    // All scores default to 0 -> ((0 + 2) / 4) * 100 = 50
    progressBars.forEach(bar => {
      expect(bar).toHaveAttribute("data-value", "50");
    });
    screen.getAllByText(/Your preference score:/).forEach(scoreDisplay => {
      expect(scoreDisplay).toHaveTextContent("0.0");
    });
  });
});
