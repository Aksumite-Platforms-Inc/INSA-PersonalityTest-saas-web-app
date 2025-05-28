"use client";

import { useEffect, useState } from "react";
import { getResults } from "@/services/test.service";
import { getUserId } from "@/utils/tokenUtils";
import { PersonalityTestScores } from "@/types/personality.type";
import MBTIResultDisplay from "@/components/employee/results/MBTIResultDisplay";
import BigFiveResultDisplay from "@/components/employee/results/BigFiveResultDisplay";
import RIASECResultDisplay from "@/components/employee/results/RIASECResultDisplay";
import EnneagramResultDisplay from "@/components/employee/results/EnneagramResultDisplay";

const EmployeeResultsPage = () => {
  const [results, setResults] = useState<PersonalityTestScores[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = getUserId(); // Assumes getUserId() returns string | null
        if (!userId) {
          setError("User ID not found. Please ensure you are logged in.");
          setLoading(false);
          return;
        }
        const apiResponse = await getResults(String(userId));
        console.log("Fetched results from API:", apiResponse); // <-- Added console log
        let resultsArray = [];
        if (apiResponse && apiResponse.data) {
          if (Array.isArray(apiResponse.data)) {
            resultsArray = apiResponse.data;
          } else if (typeof apiResponse.data === "object") {
            resultsArray = Object.values(apiResponse.data);
          }
        }
        if (resultsArray.length > 0) {
          setResults(resultsArray);
        } else {
          setResults([]); // Set to empty array if no results or undefined response
        }
      } catch (err) {
        console.error("Error fetching results:", err);
        setError("Failed to fetch results. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading results...</p>
      </div>
    ); // Replace with a proper loader/spinner
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    ); // Replace with a proper error component
  }

  if (results.length === 0) {
    return (
      <div className="text-center mt-10">
        <p>No exam results found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Exam Results</h1>
      <div className="space-y-8">
        {results.map((result) => {
          // Map PersonalityTestScores to TestResult shape expected by display components
          // Convert 'big_five' to 'qualtrics' for compatibility with TestType
          let testType: import("@/types/personality-tests").TestType =
            result.test_type === "big_five"
              ? "qualtrics"
              : (result.test_type as import("@/types/personality-tests").TestType);
          const mappedResult = {
            id: String(result.id),
            userId: String(result.user_id),
            testType,
            completedAt: result.completed_at || result.updated_at || "",
            scores:
              result.mbti ||
              result.big_five ||
              result.riasec_scores ||
              result.enneagram_scores ||
              {},
            interpretation: (result as any).interpretation, // if present
            rawAnswers: (result as any).rawAnswers || {},
          };

          switch (testType) {
            case "oejts":
              return (
                <MBTIResultDisplay key={result.id} result={mappedResult} />
              );
            case "qualtrics":
              return (
                <BigFiveResultDisplay key={result.id} result={mappedResult} />
              );
            case "riasec":
              return (
                <RIASECResultDisplay key={result.id} result={mappedResult} />
              );
            case "enneagram":
              return (
                <EnneagramResultDisplay key={result.id} result={mappedResult} />
              );
            default:
              return (
                <div
                  key={result.id}
                  className="p-6 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out"
                >
                  <h2 className="text-2xl font-bold mb-3 text-gray-700">
                    Test:{" "}
                    <span className="text-indigo-600">
                      {String(result.test_type).toUpperCase()}
                    </span>
                  </h2>
                  <p className="text-sm text-gray-500 mb-3">
                    Completed on:{" "}
                    {new Date(
                      result.completed_at || result.updated_at || ""
                    ).toLocaleDateString()}
                  </p>
                  <div className="mt-3 bg-gray-50 p-3 rounded-md">
                    <h3 className="text-md font-semibold text-gray-600">
                      Scores:
                    </h3>
                    <pre className="bg-white p-2 rounded text-xs overflow-auto shadow-inner text-gray-700">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </div>
              );
          }
        })}
      </div>
    </div>
  );
};

export default EmployeeResultsPage;
