"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { useToast } from "@/hooks/use-toast";
import { submitBig5TestAnswers } from "@/services/test.service";

export default function Big5TestPage() {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const questionsPerGroup = 12;
  const questions = big5Test.questions;
  const totalGroups = Math.ceil(questions.length / questionsPerGroup);
  const currentQuestions = questions.slice(
    currentGroup * questionsPerGroup,
    (currentGroup + 1) * questionsPerGroup
  );

  // Only show the restore toast once per session
  const restoreToastShown = useRef(false);

  // Load cached answers and group on mount (only once, before first render)
  useEffect(() => {
    let restored = false;
    const cached = localStorage.getItem("big5TestAnswers");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object") {
          let validGroup = 0;
          if (
            typeof parsed.currentGroup === "number" &&
            parsed.currentGroup >= 0 &&
            parsed.currentGroup < totalGroups
          ) {
            validGroup = parsed.currentGroup;
          }
          setCurrentGroup(validGroup);
          if (parsed.answers && typeof parsed.answers === "object") {
            setAnswers(parsed.answers);
          }
          restored = true;
        }
      } catch (e) {
        // If cache is corrupted, clear it
        localStorage.removeItem("big5TestAnswers");
      }
    }
    if (restored && !restoreToastShown.current) {
      restoreToastShown.current = true;
      setTimeout(() => {
        toast({
          title: "Progress Restored",
          description: "Your previous answers have been loaded.",
          variant: "default",
        });
      }, 0);
    }
    // eslint-disable-next-line
  }, [totalGroups]);

  // Debounced save to localStorage
  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      try {
        window.localStorage.setItem(
          "big5TestAnswers",
          JSON.stringify({ answers, currentGroup })
        );
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 1200);
      } catch (e) {
        // Optionally handle quota exceeded or other errors
      }
    }, 400); // 400ms debounce
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [answers, currentGroup]);

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    // Prevent going next if not all current questions are answered
    if (currentQuestions.some((q) => !answers[q.id])) {
      toast({
        title: "Please answer all questions before continuing.",
        variant: "destructive",
      });
      return;
    }
    setCurrentGroup((prev) => prev + 1);
  };

  const handlePrevious = () => setCurrentGroup((prev) => prev - 1);

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast({
        title: "Please complete all questions before submitting.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      answers: Object.fromEntries(
        Object.entries(answers).map(([key, value]) => [key, Number(value)])
      ),
    };

    setIsSubmitting(true);
    try {
      const response = await submitBig5TestAnswers(payload);

      if (response.success) {
        // Clear cache on success
        localStorage.removeItem("big5TestAnswers");
        toast({
          title: "Submission successful!",
          description: "Your answers have been saved.",
        });
        const encoded = encodeURIComponent(JSON.stringify(response.data));
        router.push(`/dashboard/employee/test/result/big5?data=${encoded}`);
      } else {
        throw new Error("Submission failed.");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetProgress = () => {
    setAnswers({});
    setCurrentGroup(0);
    window.localStorage.removeItem("big5TestAnswers");
    toast({
      title: "Progress Reset",
      description: "Your saved progress has been cleared.",
      variant: "destructive",
    });
  };

  const progress = Math.round(
    (Object.keys(answers).length / questions.length) * 100
  );

  return (
    <div className="container mx-auto py-6 relative">
      {showSaved && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-100 text-green-800 px-4 py-2 rounded shadow">
          Progress saved
        </div>
      )}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{big5Test.title}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard/employee/test/select")}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={handleResetProgress}
          >
            Reset Progress
          </Button>
        </CardHeader>

        <CardContent>
          <div className="text-center mb-6">
            <p className="text-lg font-medium">
              Page {currentGroup + 1} of {totalGroups}
            </p>
            <Progress value={progress} className="h-2 rounded-lg" />
            <p className="text-sm text-gray-500 mt-2">{progress}% Complete</p>
          </div>

          <p className="text-muted-foreground mb-6 text-center">
            {big5Test.description}
          </p>

          {currentQuestions.map((question) => (
            <div
              key={question.id}
              className="mb-6 p-4 border rounded-lg shadow-sm space-y-4"
            >
              <p className="font-medium text-center">{question.text}</p>
              <div className="flex justify-center items-center space-x-4">
                <span className="text-sm">Inaccurate</span>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    className={`w-8 h-8 rounded-full border transition ${
                      answers[question.id] === value.toString()
                        ? "bg-blue-500"
                        : "bg-gray-200"
                    }`}
                    onClick={() => handleAnswer(question.id, value.toString())}
                    aria-label={`Select ${value}`}
                  />
                ))}
                <span className="text-sm">Accurate</span>
              </div>
            </div>
          ))}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button onClick={handlePrevious} disabled={currentGroup === 0}>
            Previous
          </Button>
          {currentGroup < totalGroups - 1 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
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
