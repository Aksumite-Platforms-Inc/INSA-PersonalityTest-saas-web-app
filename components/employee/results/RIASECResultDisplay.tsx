"use client";

import { TestResult } from "@/types/personality-tests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface RIASECResultDisplayProps {
  result: TestResult; // This will be a RIASEC result
}

const typeDetails: Record<string, { name: string; description: string; color: string }> = {
  R: { name: "Realistic", description: "Prefers hands-on activities, working with tools, machines, plants, or animals. Values practical tasks and tangible outcomes.", color: "#6366f1" },
  I: { name: "Investigative", description: "Enjoys solving complex problems through observation, research, and analysis. Values knowledge and independent work.", color: "#22c55e" },
  A: { name: "Artistic", description: "Values creativity, self-expression, and innovation. Prefers unstructured environments and working with ideas and materials.", color: "#f59e0b" },
  S: { name: "Social", description: "Enjoys helping, teaching, and interacting with others. Values empathy, cooperation, and social justice.", color: "#ec4899" },
  E: { name: "Enterprising", description: "Likes to lead, persuade, and motivate others. Values ambition, success, and taking initiative in business or organizational settings.", color: "#0ea5e9" },
  C: { name: "Conventional", description: "Prefers organized, structured tasks with clear rules and procedures. Values accuracy, efficiency, and data management.", color: "#e11d48" },
};

// Mapping from full names (likely keys in result.scores) to codes
const scoreKeyToCode: Record<string, string> = {
  realistic: "R",
  investigative: "I",
  artistic: "A",
  social: "S",
  enterprising: "E",
  conventional: "C",
};

const RIASECResultDisplay = ({ result }: RIASECResultDisplayProps) => {
  if (result.testType !== "riasec") {
    return <p>This component is for RIASEC results only.</p>;
  }

  // Transform scores from Record<string, number> to an array of { code, name, score, description, color }
  const scoresArray = Object.entries(result.scores)
    .map(([key, score]) => {
      const code = scoreKeyToCode[key.toLowerCase()];
      if (!code || !typeDetails[code]) return null;
      return {
        code,
        name: typeDetails[code].name,
        score: typeof score === 'number' ? score : 0,
        description: typeDetails[code].description,
        color: typeDetails[code].color,
      };
    })
    .filter(item => item !== null) as { code: string; name: string; score: number; description: string; color: string }[];

  if (!scoresArray || scoresArray.length === 0) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader><CardTitle className="text-xl font-bold text-center text-red-600">RIASEC Holland Codes</CardTitle></CardHeader>
        <CardContent><p className="text-center">RIASEC scores are unavailable or in an unexpected format.</p></CardContent>
      </Card>
    );
  }

  const sortedScores = [...scoresArray].sort((a, b) => b.score - a.score);
  const top3 = sortedScores.slice(0, 3);
  const top3Codes = top3.map(s => s.code).join("");

  // Max score for RIASEC is typically 40 (if 10 questions per type, each yes=1, no=0, and there are 4 options per question - this needs to be verified from test design)
  // Or based on admin component, it seems max score is 7. Let's use a sensible max for progress bar, e.g. 10 or check from data.
  // The admin component uses (item.score / 7) * 100. Assuming max score is 7 for now for progress bar.
  const MAX_SCORE = Math.max(...scoresArray.map(s => s.score), 7); // Use 7 as a minimum max, or actual max if higher

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center" style={{ color: top3.length > 0 ? top3[0].color : '#333' }}>
          Your RIASEC Code: {top3Codes}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {top3.length > 0 && (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-md font-semibold">Your primary type is {top3[0].name}.</p>
            <p className="text-sm text-gray-600 mt-1">{top3[0].description}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Scores:</h3>
          {sortedScores.map((item) => (
            <div key={item.code} className="p-3 border rounded-md bg-white">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-md" style={{ color: item.color }}>
                  {item.name} ({item.code})
                </span>
                <span className="font-semibold" style={{ color: item.color }}>{item.score}</span>
              </div>
              <Progress value={(item.score / MAX_SCORE) * 100} className="h-2.5 rounded" indicatorClassName="bg-gradient-to-r from-blue-400 to-purple-500" />
            </div>
          ))}
        </div>

        {top3.length > 1 && (
           <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Focus on Your Top Types:</h3>
            <div className="space-y-3">
            {top3.map((item) => (
                <div key={`desc-${item.code}`}>
                    <h4 className="font-semibold text-md" style={{color: item.color}}>{item.name} ({item.code})</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                </div>
            ))}
            </div>
           </div>
        )}

        {result.interpretation && (
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold mb-2 text-indigo-700">
              Further Insights
            </h3>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {result.interpretation}
            </p>
          </div>
        )}
        {/* Consider adding career suggestions if available in result.careerSuggestions */}
      </CardContent>
    </Card>
  );
};

export default RIASECResultDisplay;
