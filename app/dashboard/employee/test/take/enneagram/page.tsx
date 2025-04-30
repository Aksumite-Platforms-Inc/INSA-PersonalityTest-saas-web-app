"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { enneagramTest } from "@/data/tests/enneagram";
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
import { submitEnneagramAnswers } from "@/services/testService";

export default function EnneagramPage() {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const questionsPerGroup = 9;
  const questions = enneagramTest.questions;

  const currentQuestions = questions.slice(
    currentGroup * questionsPerGroup,
    (currentGroup + 1) * questionsPerGroup
  );

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

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

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }

    const payload = {
      answers: questions.map((q) => ({
        type: q.type, // Ensure `type` field exists in your data
        answer: Number(answers[q.id]),
      })),
    };

    setLoading(true);
    setError(null);

    try {
      await submitEnneagramAnswers(payload);
      setLoading(false);
      router.push("/dashboard/employee/test/result");
    } catch (err) {
      setLoading(false);
      setError("An error occurred during submission. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>{enneagramTest.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <p className="text-lg font-medium">
              Page {currentGroup + 1} of{" "}
              {Math.ceil(questions.length / questionsPerGroup)}
            </p>
            <Progress
              value={
                ((currentGroup + 1) /
                  Math.ceil(questions.length / questionsPerGroup)) *
                100
              }
              className="h-3 rounded-lg bg-gray-500"
            />
          </div>
          <p className="text-muted-foreground mb-4">
            {enneagramTest.description}
          </p>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {currentQuestions.map((question) => (
            <div
              key={question.id}
              className="mb-4 p-4 border rounded-lg shadow-sm"
            >
              <p className="font-medium mb-2">{question.text}</p>
              <div className="flex flex-col space-y-2">
                {question.options?.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.value}
                      className="mr-2 w-6 h-6"
                      onChange={() => handleAnswer(question.id, option.value)}
                    />
                    {option.label}
                  </label>
                )) || (
                  <p className="text-sm text-muted-foreground">
                    No options available
                  </p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handlePreviousGroup} disabled={currentGroup === 0}>
            Previous
          </Button>

          {(currentGroup + 1) * questionsPerGroup < questions.length ? (
            <Button
              onClick={handleNextGroup}
              disabled={currentQuestions.some((q) => !answers[q.id])}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={currentQuestions.some((q) => !answers[q.id]) || loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          )}
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
