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
import { X, Loader2 } from "lucide-react";
import { submitEnneagramAnswers } from "@/services/test.service";
import toast from "react-hot-toast";

export default function EnneagramPage() {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const questionsPerGroup = 9;
  const questions = enneagramTest.questions;
  const totalPages = Math.ceil(questions.length / questionsPerGroup);

  const currentQuestions = questions.slice(
    currentGroup * questionsPerGroup,
    (currentGroup + 1) * questionsPerGroup
  );

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestions.some((q) => !answers[q.id])) {
      toast.error("Please answer all questions before continuing.");
      return;
    }
    setCurrentGroup(currentGroup + 1);
  };

  const handlePrevious = () => {
    if (currentGroup > 0) setCurrentGroup(currentGroup - 1);
  };

  const handleSubmit = async () => {
    const unanswered = questions.filter((q) => !answers[q.id]);
    if (unanswered.length) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    const payload = {
      answers: questions.map((q) => ({
        type: q.type,
        answer: Number(answers[q.id]),
      })),
    };

    try {
      setLoading(true);
      const response = await submitEnneagramAnswers(payload);
      if (response.success) {
        toast.success("Submission successful!");
        const encoded = encodeURIComponent(JSON.stringify(response.data));
        router.push(`/dashboard/employee/test/result/enneagram?data=${encoded}`);
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const progress = Math.round(
    (Object.keys(answers).length / questions.length) * 100
  );

  return (
    <div className="container mx-auto py-6 relative">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{enneagramTest.title}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard/employee/test/select")}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="text-center mb-6">
            <p className="text-lg font-medium">
              Page {currentGroup + 1} of {totalPages}
            </p>
            <Progress
              value={progress}
              className="h-2 rounded-lg"
            />
          </div>

          <p className="text-muted-foreground mb-6 text-center">
            {enneagramTest.description}
          </p>

          {currentQuestions.map((question) => (
            <div
              key={question.id}
              className="mb-6 p-4 border rounded-lg shadow-sm space-y-3"
            >
              <p className="font-medium text-center">{question.text}</p>
              <div className="flex flex-wrap justify-center gap-4">
                {question.options.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      answers[question.id] === option.value
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleAnswer(question.id, option.value)}
                    className="min-w-[100px]"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button onClick={handlePrevious} disabled={currentGroup === 0}>
            Previous
          </Button>

          {currentGroup < totalPages - 1 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
