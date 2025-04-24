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

export default function MBTITestPage() {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const router = useRouter();
  const questionsPerGroup = currentGroup === 0 ? 32 : 28; // MBTI test groups 32 questions on the first page and 28 on the second
  const questions = mbtiTest.questions;

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
          <CardTitle>{mbtiTest.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <p className="text-lg font-medium">Page {currentGroup + 1} of 2</p>
            <Progress
              value={((currentGroup + 1) / 2) * 100}
              className="h-3 rounded-lg bg-gray-200"
            />
          </div>
          {currentQuestions.map((question) => (
            <div key={question.id} className="mb-4">
              <p className="font-medium mb-2">{question.text}</p>
              <div className="flex space-x-4">
                {question.options.map((option) => (
                  <div
                    key={option.value}
                    className={`border p-4 rounded-lg cursor-pointer ${
                      answers[question.id] === option.value
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleAnswer(question.id, option.value)}
                  >
                    {option.label}
                  </div>
                ))}
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
