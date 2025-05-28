"use client";

import { TestResult } from "@/types/personality-tests"; // Using the generic TestResult
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MBTIResultDisplayProps {
  result: TestResult; // This will be an OEJTS/MBTI result
}

// Mapping from the dimension keys in OEJTSResult to display labels
const dimensionDetails = [
  { key: "ei", label1: "Introversion (I)", label2: "Extroversion (E)", scoreKey: "ei" },
  { key: "sn", label1: "Sensing (S)", label2: "Intuition (N)", scoreKey: "sn" },
  { key: "tf", label1: "Thinking (T)", label2: "Feeling (F)", scoreKey: "tf" }, // Note: Admin component had F/T, OEJTSResult has tf
  { key: "jp", label1: "Judging (J)", label2: "Perceiving (P)", scoreKey: "jp" },
];

const MBTIResultDisplay = ({ result }: MBTIResultDisplayProps) => {
  if (result.testType !== "oejts") {
    return <p>This component is for MBTI (OEJTS) results only.</p>;
  }

  // Extracting MBTI specific data.
  // The personality type (e.g., "INTJ")
  const personalityType = result.primaryType || "N/A";
  
  // Scores for dimensions. OEJTSResult stores them in result.scores.ei, result.scores.sn etc.
  // The scores are typically between -2 and 2 for OEJTS.
  // We need to normalize them to a 0-100 scale for the progress bar.
  // A score of -2 (max introversion, sensing, thinking, judging) maps to 0%.
  // A score of +2 (max extroversion, intuition, feeling, perceiving) maps to 100%.
  // Midpoint 0 maps to 50%.
  // Formula: ((score + 2) / 4) * 100
  
  const getDimensionScore = (scoreKey: string): number => {
    return result.scores[scoreKey] as number || 0; // Default to 0 if not found
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-blue-600">
          MBTI Personality Type: {personalityType}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {dimensionDetails.map(({ key, label1, label2, scoreKey }) => {
          const score = getDimensionScore(scoreKey);
          const percentage = ((score + 2) / 4) * 100; // Normalize score from -2 to +2 range to 0-100
          
          return (
            <div key={key}>
              <div className="flex justify-between mb-1 font-medium">
                <span>{label1}</span>
                <span>{label2}</span>
              </div>
              <Progress
                value={percentage}
                className="h-4 rounded-full bg-gray-200"
                indicatorClassName={percentage < 50 ? "bg-blue-400" : "bg-orange-400"}
              />
              <div className="text-center text-sm text-gray-700 mt-1">
                Your preference score: <strong>{score.toFixed(1)}</strong>
                <span className="text-xs text-gray-500"> (Range: -2 to +2)</span>
              </div>
            </div>
          );
        })}
        {result.interpretation && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              About Your Type
            </h3>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {result.interpretation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MBTIResultDisplay;
