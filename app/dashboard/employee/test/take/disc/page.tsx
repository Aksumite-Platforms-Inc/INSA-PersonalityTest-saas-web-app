"use client";

import { useState } from "react";
import { riasecTest } from "@/data/tests/riasec";
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

export default function DISCPage() {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const questionsPerGroup = 6; // DISC test groups one question per page
  const questions = riasecTest.questions;
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
          <CardTitle>{riasecTest.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <p className="text-lg font-medium">
              Page {currentGroup + 1} of{" "}
              {Math.ceil(questions.length / questionsPerGroup)}
            </p>
            <Progress
              value={((currentGroup + 1) / questions.length) * 100}
              className="h-3 rounded-lg bg-gray-500"
            />
          </div>
          <p className="text-muted-foreground mb-4">{riasecTest.description}</p>
          {currentQuestions.map((question) => (
            <div
              key={question.id}
              className=" flex justify-between items-center mb-6 p-4 border rounded-lg shadow-sm"
            >
              <p className="font-medium mb-2">{question.text}</p>
              <input type="checkbox" />
              {/* <div className="flex space-x-4">
                {question.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.value}
                      className="mr-2"
                      onChange={() => handleAnswer(question.id, option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div> */}
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handlePreviousGroup} disabled={currentGroup === 0}>
            Previous
          </Button>
          <Button
            onClick={handleNextGroup}
            // disabled={currentQuestions.some((q) => !answers[q.id])}
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
