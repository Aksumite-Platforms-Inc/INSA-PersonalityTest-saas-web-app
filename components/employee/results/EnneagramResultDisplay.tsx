"use client";

import { TestResult } from "@/types/personality-tests";
// Specific EnneagramResult can provide more detailed structure if available in scores
// import { EnneagramResult as EnneagramScores } from "@/types/personality-tests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface EnneagramResultDisplayProps {
  result: TestResult; // This will be an Enneagram result
}

const enneagramTypeDetails: Record<string, { name: string; description: string; coreFear: string; coreDesire: string; color: string }> = {
  "1": { name: "Type 1: The Reformer", description: "Principled, purposeful, self-controlled, and perfectionistic.", coreFear: "Being corrupt/evil, defective.", coreDesire: "To be good, to have integrity, to be balanced.", color: "#22c55e" },
  "2": { name: "Type 2: The Helper", description: "Generous, demonstrative, people-pleasing, and possessive.", coreFear: "Being unwanted, unworthy of being loved.", coreDesire: "To feel loved.", color: "#ec4899" },
  "3": { name: "Type 3: The Achiever", description: "Adaptable, excelling, driven, and image-conscious.", coreFear: "Being worthless or without inherent value.", coreDesire: "To feel valuable and worthwhile.", color: "#f59e0b" },
  "4": { name: "Type 4: The Individualist", description: "Expressive, dramatic, self-absorbed, and temperamental.", coreFear: "Having no identity or personal significance.", coreDesire: "To find themselves and their significance (to create an identity).", color: "#6366f1" },
  "5": { name: "Type 5: The Investigator", description: "Perceptive, innovative, secretive, and isolated.", coreFear: "Being helpless, useless, incapable.", coreDesire: "To be capable and competent.", color: "#0ea5e9" },
  "6": { name: "Type 6: The Loyalist", description: "Engaging, responsible, anxious, and suspicious.", coreFear: "Being without support or guidance, unable to survive on their own.", coreDesire: "To have security and support.", color: "#eab308" },
  "7": { name: "Type 7: The Enthusiast", description: "Spontaneous, versatile, distractible, and scattered.", coreFear: "Being deprived and in pain.", coreDesire: "To be satisfied and content—to have their needs fulfilled.", color: "#ef4444" },
  "8": { name: "Type 8: The Challenger", description: "Self-confident, decisive, willful, and confrontational.", coreFear: "Being harmed or controlled by others.", coreDesire: "To protect themselves (to be in control of their own life and destiny).", color: "#8b5cf6" },
  "9": { name: "Type 9: The Peacemaker", description: "Receptive, reassuring, agreeable, and complacent.", coreFear: "Loss of connection; fragmentation.", coreDesire: "To have inner stability and peace of mind.", color: "#10b981" },
};

// Mapping from score keys (e.g., "1", "2" or "A", "B") to numeric type (1-9)
const scoreKeyToNumericType = (key: string): number | null => {
  if (key >= "1" && key <= "9") return parseInt(key);
  // Admin component uses 'A' for Type 1, 'B' for Type 2, etc.
  const charCode = key.toUpperCase().charCodeAt(0);
  if (charCode >= 65 && charCode <= 73) return charCode - 64; // A=1, B=2, ..., I=9
  return null;
};

const EnneagramResultDisplay = ({ result }: EnneagramResultDisplayProps) => {
  if (result.testType !== "enneagram") {
    return <p>This component is for Enneagram results only.</p>;
  }

  const transformedScores: { typeNumber: number; score: number; details: typeof enneagramTypeDetails[string] }[] = [];
  for (const [key, value] of Object.entries(result.scores)) {
    const typeNumber = scoreKeyToNumericType(key);
    if (typeNumber && typeof value === 'number' && enneagramTypeDetails[String(typeNumber)]) {
      transformedScores.push({
        typeNumber: typeNumber,
        score: value,
        details: enneagramTypeDetails[String(typeNumber)],
      });
    }
  }

  if (transformedScores.length === 0) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader><CardTitle className="text-xl font-bold text-center text-red-600">Enneagram Personality</CardTitle></CardHeader>
        <CardContent><p className="text-center">Enneagram scores are unavailable or in an unexpected format.</p></CardContent>
      </Card>
    );
  }

  transformedScores.sort((a, b) => b.score - a.score);

  const primaryTypeObj = transformedScores[0];
  const primaryTypeNum = primaryTypeObj.typeNumber;
  
  let wingType = "";
  if (primaryTypeNum) {
    const wingCandidates = [
      primaryTypeNum === 1 ? 9 : primaryTypeNum - 1,
      primaryTypeNum === 9 ? 1 : primaryTypeNum + 1,
    ];
    
    let wingScore1 = -1;
    let wingScore2 = -1;

    const wing1Data = transformedScores.find(s => s.typeNumber === wingCandidates[0]);
    if (wing1Data) wingScore1 = wing1Data.score;

    const wing2Data = transformedScores.find(s => s.typeNumber === wingCandidates[1]);
    if (wing2Data) wingScore2 = wing2Data.score;

    if (wingScore1 > wingScore2) {
      wingType = `${primaryTypeNum}w${wingCandidates[0]}`;
    } else if (wingScore2 > wingScore1) {
      wingType = `${primaryTypeNum}w${wingCandidates[1]}`;
    } else if (wingScore1 !== -1) { // Equal scores, or only one wing has a score
        wingType = `${primaryTypeNum} (Balanced Wings or check scores for ${wingCandidates[0]}/${wingCandidates[1]})`;
    } else {
        wingType = `${primaryTypeNum} (Wing undetermined)`;
    }
  }
  
  // Use primaryType from TestResult if available and valid, otherwise use highest score
  const displayPrimaryTypeNum = result.primaryType && enneagramTypeDetails[result.primaryType] ? parseInt(result.primaryType) : primaryTypeNum;
  const displayPrimaryTypeDetails = enneagramTypeDetails[String(displayPrimaryTypeNum)];


  // Max score for progress bar, e.g. sum of all questions for a type or a fixed high number.
  // Admin component uses (item.score / 10) * 100. Assuming max score is 10.
  const MAX_SCORE = Math.max(...transformedScores.map(s => s.score), 10);


  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold" style={{color: displayPrimaryTypeDetails.color}}>
          Enneagram Type: {displayPrimaryTypeDetails.name}
        </CardTitle>
        {wingType && <p className="text-lg text-gray-700">Wing: {wingType}</p>}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
            <h3 className="font-semibold text-md mb-1" style={{color: displayPrimaryTypeDetails.color}}>Core Characteristics:</h3>
            <p className="text-sm text-gray-600">{displayPrimaryTypeDetails.description}</p>
            <p className="text-sm text-gray-600 mt-2"><strong style={{color: displayPrimaryTypeDetails.color}}>Core Fear:</strong> {displayPrimaryTypeDetails.coreFear}</p>
            <p className="text-sm text-gray-600"><strong style={{color: displayPrimaryTypeDetails.color}}>Core Desire:</strong> {displayPrimaryTypeDetails.coreDesire}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Your Enneagram Scores:</h3>
          <div className="space-y-3">
            {transformedScores.map((item) => (
              <div key={item.typeNumber} className="p-2 border rounded-md">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium" style={{color: item.details.color}}>{item.details.name}</span>
                  <span className="font-semibold" style={{color: item.details.color}}>{item.score}</span>
                </div>
                <Progress value={(item.score / MAX_SCORE) * 100} className="h-2" indicatorClassName={item.typeNumber === displayPrimaryTypeNum ? "bg-green-500" : "bg-gray-300"} />
              </div>
            ))}
          </div>
        </div>
        
        {result.interpretation && (
          <div className="mt-6 p-4 bg-purple-50 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold mb-2 text-purple-700">
              Personal Insights
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

export default EnneagramResultDisplay;
