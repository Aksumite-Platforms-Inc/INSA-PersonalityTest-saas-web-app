"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import SearchParamsWrapper from "@/components/SearchParamsWrapper";

const traitInfo = {
  openness: {
    name: "Openness",
    color: "#8884d8",
    description: "Openness reflects imagination, creativity, and curiosity.",
  },
  conscientiousness: {
    name: "Conscientiousness",
    color: "#82ca9d",
    description: "Conscientiousness measures self-discipline and organization.",
  },
  extraversion: {
    name: "Extraversion",
    color: "#ff7300",
    description: "Extraversion indicates sociability and enthusiasm.",
  },
  agreeableness: {
    name: "Agreeableness",
    color: "#ff6384",
    description: "Agreeableness reflects kindness, empathy, and cooperation.",
  },
  neuroticism: {
    name: "Neuroticism",
    color: "#36a2eb",
    description: "Neuroticism measures emotional instability and anxiety.",
  },
};

export default function BigFiveResultPageWrapper() {
  return (
    <SearchParamsWrapper>
      {(searchParams) => <BigFiveResultPageContent searchParams={searchParams} />}
    </SearchParamsWrapper>
  );
}

function BigFiveResultPageContent({ searchParams }: { searchParams: URLSearchParams }) {
  const router = useRouter();
  const dataParam = searchParams.get("data");
  const [resultData, setResultData] = useState<any>(null);

  useEffect(() => {
    if (dataParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(dataParam));
        setResultData(decoded);
      } catch (err) {
        console.error("Failed to decode Big Five data", err);
        setResultData(null);
      }
    }
  }, [dataParam]);

  const hasData =
    resultData &&
    typeof resultData === "object" &&
    resultData.Raw &&
    typeof resultData.Raw === "object" &&
    Object.keys(resultData.Raw).length > 0 &&
    resultData.Normalized &&
    typeof resultData.Normalized === "object" &&
    Object.keys(resultData.Normalized).length > 0;

  if (!hasData) {
    return (
      <div className="text-center text-lg mt-6 text-gray-600">
        No result data available.
        {resultData && (
          <pre className="text-xs text-gray-400 mt-2">
            {JSON.stringify(resultData, null, 2)}
          </pre>
        )}
      </div>
    );
  }

  const chartData = Object.keys(resultData.Normalized).map((trait) => {
    const typedTrait = trait as keyof typeof traitInfo;
    return {
      name: traitInfo[typedTrait].name,
      value: resultData.Normalized[trait],
      color: traitInfo[typedTrait].color,
    };
  });

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Big Five Personality Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-6">
            Here’s an overview of your Big Five personality profile.
          </p>

          {/* Chart */}
          <div className="mb-6">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Scores */}
          <div className="space-y-4 mb-6">
            {Object.entries(resultData.Raw).map(([trait, rawScore]) => (
              <div key={trait}>
                <div className="flex justify-between mb-1">
                  <span
                    className="font-medium"
                    style={{
                      color: traitInfo[trait as keyof typeof traitInfo].color,
                    }}
                  >
                    {traitInfo[trait as keyof typeof traitInfo].name}
                  </span>
                  <span>
                    {rawScore} (Raw) / {resultData.Normalized[trait]}%
                  </span>
                </div>
                <Progress
                  value={resultData.Normalized[trait]}
                  className="h-3 rounded-lg"
                />
              </div>
            ))}
          </div>

          {/* Trait Descriptions */}
          <div className="space-y-6">
            {Object.keys(traitInfo).map((trait) => (
              <div key={trait} className="border-t pt-4">
                <h3
                  className="text-lg font-semibold"
                  style={{
                    color: traitInfo[trait as keyof typeof traitInfo].color,
                  }}
                >
                  {traitInfo[trait as keyof typeof traitInfo].name}
                </h3>
                <p className="text-gray-700">
                  {traitInfo[trait as keyof typeof traitInfo].description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <Button
              onClick={() => router.push("/dashboard/employee/test/select")}
            >
              Back to Tests
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
