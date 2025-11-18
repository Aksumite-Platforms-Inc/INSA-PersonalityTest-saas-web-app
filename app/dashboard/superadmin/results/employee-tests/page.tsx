"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getResults } from "@/services/test.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, FileX, AlertCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Import result components (to be reused)
// These will be loaded dynamically to avoid hydration issues
import dynamic from "next/dynamic";

const MBTIResult = dynamic(
  () =>
    import("@/app/dashboard/employee/test/result/mbti/page").then(
      (m) => m.default
    ),
  { ssr: false }
);
const BigFiveResult = dynamic(
  () =>
    import("@/app/dashboard/employee/test/result/big5/page").then(
      (m) => m.default
    ),
  { ssr: false }
);
const RIASECResult = dynamic(
  () =>
    import("@/app/dashboard/employee/test/result/riasec/page").then(
      (m) => m.default
    ),
  { ssr: false }
);
const EnneagramResult = dynamic(
  () =>
    import("@/app/dashboard/employee/test/result/enneagram/page").then(
      (m) => m.default
    ),
  { ssr: false }
);

import MBTIResultAdmin from "@/components/superadmin/MBTIResultAdmin";
import BigFiveResultAdmin from "@/components/superadmin/BigFiveResultAdmin";
import RIASECResultAdmin from "@/components/superadmin/RIASECResultAdmin";
import EnneagramResultAdmin from "@/components/superadmin/EnneagramResultAdmin";

export default function SuperadminEmployeeTestsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeId = searchParams?.get("employeeId");
  console.log("SuperadminEmployeeTestsPage employeeId:", employeeId);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any>(null);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  useEffect(() => {
    if (!employeeId) return;
    setLoading(true);
    getResults(employeeId)
      .then((res) => {
        setResults(res.data);
        // Auto-select first available test
        const available = getAvailableTests(res.data);
        setSelectedTest(available[0] || null);
      })
      .finally(() => setLoading(false));
  }, [employeeId]);

  function getAvailableTests(data: any): string[] {
    if (!data) return [];
    const tests: string[] = [];
    if (data.mbti && data.mbti.personality) tests.push("mbti");
    if (
      data.big_five &&
      (data.big_five.Raw || data.big_five.raw) &&
      Object.keys(data.big_five.Raw || data.big_five.raw).length > 0
    )
      tests.push("big5");
    if (
      (data.riasec_scores &&
        Array.isArray(data.riasec_scores) &&
        data.riasec_scores.length > 0) ||
      (data.riasec && Array.isArray(data.riasec) && data.riasec.length > 0)
    )
      tests.push("riasec");
    if (
      (data.enneagram_scores &&
        Array.isArray(data.enneagram_scores) &&
        data.enneagram_scores.length > 0) ||
      (data.enneagram &&
        Array.isArray(data.enneagram) &&
        data.enneagram.length > 0)
    )
      tests.push("enneagram");
    return tests;
  }

  if (!employeeId) {
    return (
      <Alert variant="destructive" className="mt-10">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Invalid or missing employee ID.</AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin mr-2 h-8 w-8" />
        <span className="text-muted-foreground">Loading test results...</span>
      </div>
    );
  }

  if (!results) {
    return (
      <EmptyState
        icon={FileX}
        title="No test results found"
        description="This employee hasn't completed any personality tests yet."
      />
    );
  }

  const availableTests = getAvailableTests(results);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center border-b px-8 py-4 min-w-0">
          <div className="flex-1 text-xl font-semibold truncate">
            Test Results
          </div>
          <button
            className="text-sm text-blue-600 hover:underline border border-blue-100 rounded px-3 py-1 bg-blue-50"
            onClick={() => router.back()}
            type="button"
          >
            Back
          </button>
        </div>
        <div className="flex-1 flex flex-col px-8 py-6 min-w-0 overflow-x-auto">
          {availableTests.length === 0 ? (
            <EmptyState
              icon={FileX}
              title="No test results available"
              description="This employee hasn't completed any personality tests yet."
            />
          ) : (
            <Tabs
              value={selectedTest || undefined}
              onValueChange={setSelectedTest}
              className="w-full"
            >
              <TabsList className="mb-6">
                {availableTests.includes("mbti") && (
                  <TabsTrigger value="mbti">MBTI</TabsTrigger>
                )}
                {availableTests.includes("big5") && (
                  <TabsTrigger value="big5">Big Five</TabsTrigger>
                )}
                {availableTests.includes("riasec") && (
                  <TabsTrigger value="riasec">RIASEC</TabsTrigger>
                )}
                {availableTests.includes("enneagram") && (
                  <TabsTrigger value="enneagram">Enneagram</TabsTrigger>
                )}
              </TabsList>
              <div className="flex-1 overflow-auto">
                {selectedTest === "mbti" && results.mbti && (
                  <MBTIResultAdmin result={results.mbti} />
                )}
                {selectedTest === "big5" && results.big_five && (
                  <BigFiveResultAdmin result={results.big_five} />
                )}
                {selectedTest === "riasec" &&
                  (results.riasec_scores || results.riasec) && (
                    <RIASECResultAdmin
                      result={results.riasec_scores || results.riasec}
                    />
                  )}
                {selectedTest === "enneagram" &&
                  (results.enneagram_scores || results.enneagram) && (
                    <EnneagramResultAdmin
                      result={results.enneagram_scores || results.enneagram}
                    />
                  )}
              </div>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
