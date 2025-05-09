"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import SearchParamsWrapper from "@/components/SearchParamsWrapper";

const enneagramTypeNames: Record<string, string> = {
  A: "Type 1: The Reformer",
  B: "Type 2: The Helper",
  C: "Type 3: The Achiever",
  D: "Type 4: The Individualist",
  E: "Type 5: The Investigator",
  F: "Type 6: The Loyalist",
  G: "Type 7: The Enthusiast",
  H: "Type 8: The Challenger",
  I: "Type 9: The Peacemaker",
};

export default function EnneagramResultPageWrapper() {
  return (
    <SearchParamsWrapper>
      {(searchParams) => <EnneagramResultPage searchParams={searchParams} />}
    </SearchParamsWrapper>
  );
}

function EnneagramResultPage({ searchParams }: { searchParams: URLSearchParams }) {
  const router = useRouter();
  const dataParam = searchParams.get("data");
  const [resultData, setResultData] = useState<{ type: string; type_name: string; score: number }[]>([]);

  useEffect(() => {
    if (dataParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(dataParam));
        setResultData(decoded);
      } catch (err) {
        console.error("Failed to decode Enneagram data", err);
      }
    }
  }, [dataParam]);

  if (!resultData || resultData.length === 0) {
    return <p className="text-center text-lg">No result data available.</p>;
  }

  const topType = resultData[0];
  const topTypeLabel = enneagramTypeNames[topType.type] || topType.type_name;

  const getWingType = () => {
    const adjacentTypesMap: Record<number, number[]> = {
      1: [9, 2],
      2: [1, 3],
      3: [2, 4],
      4: [3, 5],
      5: [4, 6],
      6: [5, 7],
      7: [6, 8],
      8: [7, 9],
      9: [8, 1],
    };
    const mainNumber = topType.type.charCodeAt(0) - 64; // A → 1, B → 2, etc.
    const wings = adjacentTypesMap[mainNumber];

    const wing = resultData.find((item) =>
      wings.includes(item.type.charCodeAt(0) - 64)
    );
    return wing ? `${mainNumber}w${wing.type.charCodeAt(0) - 64}` : `${mainNumber}`;
  };

  const wingType = getWingType();

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Enneagram Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4 text-center">
            Your Primary Type
          </h2>
          <p className="text-3xl font-bold text-center mb-2">
            {topTypeLabel}
          </p>
          <p className="text-center mb-6">
            Wing Type: <strong>{wingType}</strong>
          </p>

          <div className="grid gap-4">
            {resultData.map((item) => (
              <div key={item.type}>
                <div className="flex justify-between mb-1">
                  <span>
                    {enneagramTypeNames[item.type] || item.type_name}
                  </span>
                  <span className="font-medium">{item.score}</span>
                </div>
                <Progress
                  value={(item.score / 10) * 100}
                  className="h-3 rounded-lg"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 italic">
              Note: Your results highlight tendencies, not absolute definitions. Explore the top types to understand yourself better.
            </p>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={() => router.push("/dashboard/employee/test/select")}>Back to Tests</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
