"use client";

import { useState, useEffect, useRef } from "react";
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
import { useToast } from "@/hooks/use-toast";

export default function EnneagramPage() {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const router = useRouter();

  const { toast } = useToast();
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
      toast({
        title: "Please answer all questions before continuing.",
        variant: "destructive",
      });
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
      toast({
        title: "Please answer all questions before submitting.",
        variant: "destructive",
      });
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
        toast({
          title: "Submitted successfully!",
          variant: "destructive",
        });
        const encoded = encodeURIComponent(JSON.stringify(response.data));
        router.push(
          `/dashboard/employee/test/result/enneagram?data=${encoded}`
        );
      } else {
        toast({
          title: "Error",
          description: "Failed to submit answers. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while submitting your answers.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetProgress = () => {
    setAnswers({});
    setCurrentGroup(0);
    window.localStorage.removeItem("enneagramTestAnswers");
    toast({
      title: "Progress Reset",
      description: "Your saved progress has been cleared.",
      variant: "destructive",
    });
  };

  // Only show the restore toast once per session
  const restoreToastShown = useRef(false);

  // Load cached answers and group on mount (only once, before first render)
  useEffect(() => {
    let restored = false;
    const cached = localStorage.getItem("enneagramTestAnswers");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object") {
          let validGroup = 0;
          if (
            typeof parsed.currentGroup === "number" &&
            parsed.currentGroup >= 0 &&
            parsed.currentGroup < totalPages
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
        localStorage.removeItem("enneagramTestAnswers");
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
  }, [totalPages]);

  // Debounced save to localStorage
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      try {
        window.localStorage.setItem(
          "enneagramTestAnswers",
          JSON.stringify({ answers, currentGroup })
        );
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 1200);
      } catch (e) {}
    }, 400); // 400ms debounce
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [answers, currentGroup]);

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
            <CardTitle>{enneagramTest.title}</CardTitle>
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
              Page {currentGroup + 1} of {totalPages}
            </p>
            <Progress value={progress} className="h-2 rounded-lg" />
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
