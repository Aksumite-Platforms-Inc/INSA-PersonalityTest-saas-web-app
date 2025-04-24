"use client";

import { useState } from "react";
import { big5Test } from "@/data/tests/big5";
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

export default function Big5TestPage() {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const questionsPerGroup = 12; // Updated grouping logic
  const questions = big5Test.questions;
  const router = useRouter();

  const currentQuestions = questions.slice(
    currentGroup * questionsPerGroup,
    (currentGroup + 1) * questionsPerGroup
  );

  const handleNextGroup = () => {
    if ((currentGroup + 1) * questionsPerGroup < questions.length) {
      setCurrentGroup(currentGroup + 1);
    }
  };

  const handlePreviousGroup = () => {
    if (currentGroup > 0) {
      setCurrentGroup(currentGroup - 1);
    }
  };

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>{big5Test.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <p className="text-lg font-medium">
              Page {currentGroup + 1} of{" "}
              {Math.ceil(questions.length / questionsPerGroup)}
            </p>
            <div className="flex items-center justify-between">
              <Progress
                value={
                  ((currentGroup + 1) /
                    Math.ceil(questions.length / questionsPerGroup)) *
                  100
                }
                className="h-2 rounded-lg bg-gray-200 flex-1"
              />
              <span className="ml-2 text-sm text-gray-500">
                {Math.round(
                  ((currentGroup + 1) /
                    Math.ceil(questions.length / questionsPerGroup)) *
                    100
                )}
                % Complete
              </span>
            </div>
          </div>
          <p className="text-muted-foreground mb-4">{big5Test.description}</p>
          {currentQuestions.map((question) => (
            <div
              key={question.id}
              className="mb-6 p-4 border rounded-lg bg-white shadow-sm"
            >
              <p className="font-medium mb-8 text-center">{question.text}</p>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Strongly Disagree</span>
                <div className="flex justify-between w-full">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div
                      key={value}
                      className={`w-8 h-8 rounded-full border-2 cursor-pointer flex items-center justify-center mx-1 ${
                        answers[question.id] === value.toString()
                          ? "border-blue-500 bg-blue-100"
                          : "border-gray-300"
                      }`}
                      onClick={() =>
                        handleAnswer(question.id, value.toString())
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">Strongly Agree</span>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handlePreviousGroup} disabled={currentGroup === 0}>
            Previous
          </Button>
          <Button
            onClick={handleNextGroup}
            disabled={currentQuestions.some((q) => !answers[q.id])}
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
