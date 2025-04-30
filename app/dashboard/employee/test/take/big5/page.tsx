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
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";

//based on the test page
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { submitBig5TestAnswers } from "@/services/testService";

export default function Big5TestPage() {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questionsPerGroup = 12; // Updated grouping logic
  const questions = big5Test.questions;
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

  const handleSubmit = async () => {
    // Check if all questions are answered
    if (Object.keys(answers).length < questions.length) {
      toast({
        title: t("test.incompleteTitle"),
        description: t("test.incompleteDescription"),
        variant: "destructive",
      });
      return;
    }

    //paylaod for big5 test answers
    const adjustedAnswers = {
      answers: Object.fromEntries(
        Object.entries(answers).map(([key, value]) => [key, Number(value)])
      ),
    };
    const payload = JSON.stringify(adjustedAnswers);

    setIsSubmitting(true);

    try {
      const response = await submitBig5TestAnswers(payload);

      if (response.success) {
        toast({
          title: t("test.submitSuccess"),
          description: t("test.submitDescription"),
        });
      }
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }

      router.push("/dashboard/employee/results");
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                className="h-2 rounded-lg  flex-1"
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
              className="mb-6 p-4 border rounded-lg shadow-sm"
            >
              <p className="font-medium mb-8 text-center">{question.text}</p>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  IN ACCURATE
                </span>
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
                <span className="text-sm text-gray-500">ACCURATE</span>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handlePreviousGroup} disabled={currentGroup === 0}>
            Previous
          </Button>
          {currentGroup ===
          Math.ceil(questions.length / questionsPerGroup) - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={
                currentQuestions.some((q) => !answers[q.id]) || isSubmitting
              }
              className="flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  {t("test.submitting")}
                </>
              ) : (
                t("test.submit")
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNextGroup}
              disabled={currentQuestions.some((q) => !answers[q.id])}
            >
              Next
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
