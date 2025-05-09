"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MBTIResult } from "@/types/personality.type";
import SearchParamsWrapper from "@/components/SearchParamsWrapper";

const dimensions = [
  { code: "IE", label1: "Introversion (I)", label2: "Extroversion (E)" },
  { code: "SN", label1: "Sensing (S)", label2: "Intuition (N)" },
  { code: "FT", label1: "Feeling (F)", label2: "Thinking (T)" },
  { code: "JP", label1: "Judging (J)", label2: "Perceiving (P)" },
];

export default function MbtiResultPageWrapper() {
  return (
    <SearchParamsWrapper>
      {(searchParams) => <MbtiResultPageContent searchParams={searchParams} />}
    </SearchParamsWrapper>
  );
}

function MbtiResultPageContent({ searchParams }: { searchParams: URLSearchParams }) {
  const router = useRouter();
  const [result, setResult] = useState<MBTIResult | null>(null);

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      try {
        const decoded = JSON.parse(decodeURIComponent(data));
        setResult(decoded);
      } catch (err) {
        console.error("Failed to parse MBTI result", err);
      }
    }
  }, [searchParams]);

  if (!result) return <p className="text-center mt-10">No result available.</p>;

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">MBTI Test Result</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground text-sm mb-2">Your Personality Type:</p>
            <h2 className="text-4xl font-bold text-primary">{result.personality}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {dimensions.map(({ code, label1, label2 }) => {
              const value = result[code as keyof MBTIResult] as number;
              const percentage = ((value + 2) / 4) * 100;
              return (
                <div key={code}>
                  <div className="flex justify-between mb-1">
                    <span>{label1}</span>
                    <span>{label2}</span>
                  </div>
                  <Progress
                    value={percentage}
                    className="h-3 rounded-full bg-gray-200"
                  />
                  <div className="text-center text-xs text-muted-foreground mt-1">
                    Preference Score: <strong>{value}</strong> (Range: -2 to 2)
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold mb-2">Your Personality Summary</h3>
            {Array.isArray(result.description) ? (
              result.description.map((para, idx) => (
                <p key={idx} className="text-muted-foreground mb-2">
                  {para}
                </p>
              ))
            ) : (
              <p className="text-muted-foreground">{result.description}</p>
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => router.push("/dashboard/employee/test/select")}>Back to Tests</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
