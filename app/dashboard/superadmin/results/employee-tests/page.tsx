"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getResults } from "@/services/test.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

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
      data.big_five.Raw &&
      Object.keys(data.big_five.Raw).length > 0
    )
      tests.push("big5");
    if (data.riasec && Array.isArray(data.riasec) && data.riasec.length > 0)
      tests.push("riasec");
    if (
      data.enneagram &&
      Array.isArray(data.enneagram) &&
      data.enneagram.length > 0
    )
      tests.push("enneagram");
    return tests;
  }

  if (!employeeId) {
    return (
      <div className="text-center text-lg mt-10 text-red-600">
        Invalid or missing employee ID.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin mr-2" /> Loading...
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center text-lg mt-10">
        No test results found for this employee.
      </div>
    );
  }

  const availableTests = getAvailableTests(results);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Employee Test Results</CardTitle>
            <button
              className="text-sm text-blue-600 hover:underline border border-blue-100 rounded px-3 py-1 bg-blue-50"
              onClick={() => router.back()}
              type="button"
            >
              Back
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {availableTests.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No test results available.
            </div>
          ) : (
            <Tabs
              value={selectedTest || undefined}
              onValueChange={setSelectedTest}
              className="w-full"
            >
              <TabsList className="mb-4">
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
              <div className="mt-4">
                {selectedTest === "mbti" && results.mbti && (
                  <MBTIResultAdmin result={results.mbti} />
                )}
                {selectedTest === "big5" && results.big_five && (
                  <BigFiveResultAdmin result={results.big_five} />
                )}
                {selectedTest === "riasec" && results.riasec && (
                  <RIASECResultAdmin result={results.riasec} />
                )}
                {selectedTest === "enneagram" && results.enneagram && (
                  <EnneagramResultAdmin result={results.enneagram} />
                )}
              </div>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
