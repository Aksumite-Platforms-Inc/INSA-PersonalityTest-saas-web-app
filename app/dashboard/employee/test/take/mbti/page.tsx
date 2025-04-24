"use client";

import { useState } from "react";
import { mbtiTest } from "@/data/tests/mbti";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

// Define the type for the pages in mbtiTest
interface MBTIPages {
  page1: { id: number; left: string; right: string }[];
  page2: { id: number; trait: string; text: string }[];
}

const mbtiTestTyped: { pages: MBTIPages } = mbtiTest;

export default function MBTITestPage() {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const router = useRouter();
  const questionsPerGroup = currentGroup === 0 ? 32 : 28; // MBTI test groups 32 questions on the first page and 28 on the second
  const questions =
    currentGroup === 0
      ? mbtiTestTyped.pages.page1 ?? []
      : mbtiTestTyped.pages.page2 ?? [];

  const handleNextGroup = () => {
    if (currentGroup < 1) {
      setCurrentGroup(currentGroup + 1);
    }
  };

  const handlePreviousGroup = () => {
    if (currentGroup > 0) {
      setCurrentGroup(currentGroup - 1);
    }
  };

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>{mbtiTest.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <p className="text-lg font-medium">Page {currentGroup + 1} of 2</p>
            <div className="flex items-center justify-between">
              <Progress
                value={((currentGroup + 1) / 2) * 100}
                className="h-2 rounded-lg bg-gray-500 flex-1"
              />
              <span className="ml-2 text-sm text-gray-500">
                {Math.round(((currentGroup + 1) / 2) * 100)}% Complete
              </span>
            </div>
          </div>
          {questions.map((question) => (
            <div
              key={question.id}
              className="mb-6 p-4 border rounded-lg shadow-sm flex items-center justify-between"
            >
              {currentGroup === 0 ? (
                // Layout for the first group
                <>
                  <span className="text-sm font-medium ">
                    {"left" in question ? question.left : ""}
                  </span>
                  <div className="flex items-center justify-center space-x-2 w-full">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <label key={value} className="flex flex-col items-center">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={value}
                          checked={answers[question.id] === value}
                          onChange={() => handleAnswer(question.id, value)}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                      </label>
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {"right" in question ? question.right : ""}
                  </span>
                </>
              ) : (
                // Layout for the second group
                <>
                  <span className="text-sm font-medium flex-1">
                    {"text" in question ? question.text : ""}
                  </span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">Disagree</span>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <label key={value} className="flex flex-col items-center">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={value}
                          checked={answers[question.id] === value}
                          onChange={() => handleAnswer(question.id, value)}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                      </label>
                    ))}
                    <span className="text-sm font-medium">Agree</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handlePreviousGroup} disabled={currentGroup === 0}>
            Previous
          </Button>
          <Button
            onClick={handleNextGroup}
            // disabled={Object.keys(answers).length < questions.length}
          >
            Next
          </Button>
        </CardFooter>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={() => router.push("/dashboard/employee/test/select")}
        >
          <X className="h-5 w-5" />
        </Button>
      </Card>
    </div>
  );
}
