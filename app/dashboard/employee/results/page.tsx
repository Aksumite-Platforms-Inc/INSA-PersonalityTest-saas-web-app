"use client";

import { useEffect, useState } from "react";
import { getResults } from "@/services/test.service";
import { getUserId } from "@/utils/tokenUtils";
import { TestResult } from "@/types/test"; // Assuming TestResult type exists, adjust if necessary

// TODO: Import or create result display components for each test type
import MBTIResultDisplay from "@/components/employee/results/MBTIResultDisplay";
import BigFiveResultDisplay from "@/components/employee/results/BigFiveResultDisplay";
import RIASECResultDisplay from "@/components/employee/results/RIASECResultDisplay";
import EnneagramResultDisplay from "@/components/employee/results/EnneagramResultDisplay";

const EmployeeResultsPage = () => {
  const [results, setResults] = useState<TestResult[]>([]);
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
        const data = await getResults(userId);
        if (data && data.length > 0) {
          setResults(data);
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
    return <div className="flex justify-center items-center h-screen"><p>Loading results...</p></div>; // Replace with a proper loader/spinner
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen"><p className="text-red-500">Error: {error}</p></div>; // Replace with a proper error component
  }

  if (results.length === 0) {
    return <div className="text-center mt-10"><p>No exam results found.</p></div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Exam Results</h1>
      <div className="space-y-8">
        {results.map((result) => {
          switch (result.testType) {
            case "oejts": // Identifier for MBTI tests
              return <MBTIResultDisplay key={result.id} result={result} />;
            case "big_five": // Identifier for Big Five tests from types/personality.type.ts
              return <BigFiveResultDisplay key={result.id} result={result} />;
            case "qualtrics": // Possible alternative identifier for Big Five if it's from Qualtrics source
              // Assuming Qualtrics results here are to be displayed as Big Five.
              // If Qualtrics can be other things, this needs more specific handling.
              return <BigFiveResultDisplay key={result.id} result={result} />;
            case "riasec": // Identifier for RIASEC tests from types/personality-tests.ts & types/personality.type.ts
              return <RIASECResultDisplay key={result.id} result={result} />;
            case "enneagram": // Identifier for Enneagram tests from types/personality-tests.ts & types/personality.type.ts
              return <EnneagramResultDisplay key={result.id} result={result} />;
            default:
              return (
                <div key={result.id} className="p-6 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
                  <h2 className="text-2xl font-bold mb-3 text-gray-700">
                    Test: <span className="text-indigo-600">{result.testType.toUpperCase()}</span>
                  </h2>
                  <p className="text-sm text-gray-500 mb-3">
                    Completed on: {new Date(result.completedAt).toLocaleDateString()}
                  </p>
                  <div className="mt-3 bg-gray-50 p-3 rounded-md">
                    <h3 className="text-md font-semibold text-gray-600">Scores:</h3>
                    <pre className="bg-white p-2 rounded text-xs overflow-auto shadow-inner text-gray-700">
                      {JSON.stringify(result.scores, null, 2)}
                    </pre>
                  </div>
                  {result.interpretation && (
                     <div className="mt-3 pt-3 border-t border-gray-200">
                       <h3 className="text-md font-semibold text-gray-600">Interpretation:</h3>
                       <p className="text-sm text-gray-700 whitespace-pre-line">{result.interpretation}</p>
                     </div>
                  )}
                   {result.rawAnswers && Object.keys(result.rawAnswers).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <h3 className="text-md font-semibold text-gray-600">Raw Answers:</h3>
                      <pre className="bg-white p-2 rounded text-xs overflow-auto shadow-inner text-gray-700">
                        {JSON.stringify(result.rawAnswers, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
          }
        })}
      </div>
    </div>
  );
};

export default EmployeeResultsPage;
