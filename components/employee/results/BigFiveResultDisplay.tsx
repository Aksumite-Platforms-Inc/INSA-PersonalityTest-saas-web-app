"use client";

import { TestResult } from "@/types/personality-tests";
// Assuming BigFiveResult structure from types/personality.type.ts is what we'll find in scores
import { BigFiveResult as BigFiveScores } from "@/types/personality.type"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BigFiveResultDisplayProps {
  result: TestResult; // This will be a Big Five result
}

const traitInfo = {
  openness: {
    name: "Openness",
    color: "#8884d8", // Example color
    description: "Reflects imagination, creativity, intellectual curiosity, and appreciation for aesthetic experiences.",
  },
  conscientiousness: {
    name: "Conscientiousness",
    color: "#82ca9d",
    description: "Measures self-discipline, organization, responsibility, and goal-oriented behavior.",
  },
  extraversion: {
    name: "Extraversion",
    color: "#ff7300",
    description: "Indicates sociability, assertiveness, talkativeness, and enthusiasm for social interaction.",
  },
  agreeableness: {
    name: "Agreeableness",
    color: "#ff6384",
    description: "Reflects kindness, empathy, cooperation, and a tendency to be trusting and helpful.",
  },
  neuroticism: {
    name: "Neuroticism",
    color: "#36a2eb",
    description: "Measures emotional instability, anxiety, moodiness, irritability, and sadness.",
  },
};

type TraitKey = keyof typeof traitInfo;

const BigFiveResultDisplay = ({ result }: BigFiveResultDisplayProps) => {
  // Assuming testType is "big_five" or "qualtrics" based on previous analysis.
  // The page.tsx will filter based on the actual testType string.
  // Here, we primarily care about the structure of result.scores.
  
  // Attempt to cast result.scores to the expected BigFiveScores structure.
  // This is a critical assumption: that result.scores directly holds this structure.
  const scores = result.scores as unknown as BigFiveScores;

  if (!scores || !scores.normalized || !scores.raw) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center text-red-600">
            Big Five Personality Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">Result data is incomplete or in an unexpected format.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-green-600">
          Big Five Personality Traits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-gray-600 mb-4 text-center">
            Your Big Five personality traits are shown below. Normalized scores (0-100%) indicate your standing relative to others.
          </p>
          {Object.keys(scores.normalized).map((traitKey) => {
            const trait = traitKey as TraitKey;
            const normalizedValue = scores.normalized[trait];
            const rawValue = scores.raw[trait]; // Assuming raw scores are also available

            if (!traitInfo[trait]) return null; // Should not happen if data is clean

            return (
              <div key={trait} className="mb-4 p-3 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-lg" style={{ color: traitInfo[trait].color }}>
                    {traitInfo[trait].name}
                  </span>
                  <span className="text-sm font-medium">
                    {normalizedValue}% 
                    {rawValue !== undefined && <span className="text-xs text-gray-500"> (Raw: {rawValue})</span>}
                  </span>
                </div>
                <Progress
                  value={normalizedValue}
                  className="h-3 rounded-lg"
                  indicatorClassName="bg-green-500" // General indicator color
                />
                <p className="text-xs text-gray-500 mt-1 italic">
                  {traitInfo[trait].description}
                </p>
              </div>
            );
          })}
        </div>
        {result.interpretation && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold mb-2 text-blue-700">
              Overall Insights
            </h3>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {result.interpretation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BigFiveResultDisplay;
