"use client";

import { use, useState, useRef, useEffect } from "react";
import { riasecTest } from "@/data/tests/riasec";
import { submitRIASECAnswers } from "@/services/test.service";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { getUserId } from "@/utils/tokenUtils";

export default function RIASECPage() {
  const [answers, setAnswers] = useState<boolean[]>(Array(42).fill(undefined));
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  // Only show the restore toast once per session
  const restoreToastShown = useRef(false);
  const userId = getUserId();
  const storageKey = userId
    ? `riasecTestAnswers_${userId}`
    : "riasecTestAnswers";
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  const questions = riasecTest.questions;
  const categories = Object.keys(questions) as Array<keyof typeof questions>;
  const maxQuestions = Math.max(
    ...categories.map((cat) => questions[cat].length)
  );

  const orderedQuestions: { question: string; category: string }[] = [];
  for (let i = 0; i < maxQuestions; i++) {
    categories.forEach((category) => {
      if (questions[category][i]) {
        orderedQuestions.push({ question: questions[category][i], category });
      }
    });
  }

  const handleAnswer = (index: number, value: boolean) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const answeredCount = answers.filter((a) => typeof a === "boolean").length;

  const handleSubmit = async () => {
    if (answeredCount !== 42) {
      toast({
        title: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const result = await submitRIASECAnswers(answers as boolean[]);
      if (result.success) {
        // Clear cache on success
        localStorage.removeItem(storageKey);
        const encoded = encodeURIComponent(JSON.stringify(result.data));
        router.push(`/dashboard/employee/test/result/riasec?data=${encoded}`);
      }
    } catch (error) {
      toast({
        title: "Error submitting test",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load cached answers and group on mount (only once, before first render)
  useEffect(() => {
    let restored = false;
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object") {
          if (Array.isArray(parsed.answers) && parsed.answers.length === 42) {
            setAnswers(parsed.answers);
          }
          restored = true;
        }
      } catch (e) {
        localStorage.removeItem(storageKey);
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
  }, [storageKey]);

  // Debounced save to localStorage
  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify({ answers }));
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 1200);
      } catch (e) {}
    }, 400); // 400ms debounce
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [answers, storageKey]);

  // Reset progress handler
  const handleResetProgress = () => {
    setAnswers(Array(42).fill(undefined));
    window.localStorage.removeItem(storageKey);
    toast({
      title: "Progress Reset",
      description: "Your saved progress has been cleared.",
      variant: "destructive",
    });
  };

  return (
    <div className="container mx-auto py-6">
      {showSaved && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-100 text-green-800 px-4 py-2 rounded shadow">
          Progress saved
        </div>
      )}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{riasecTest.title}</CardTitle>
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
              {answeredCount} of 42 answered
            </p>
            <Progress value={(answeredCount / 42) * 100} className="h-2 mt-2" />
          </div>

          <p className="text-muted-foreground mb-6 text-center">
            {riasecTest.description}
          </p>

          {orderedQuestions.map((q, index) => (
            <div
              key={index}
              className={`mb-6 p-4 border rounded-lg shadow-sm ${
                typeof answers[index] === "boolean" ? "border-blue-400" : ""
              }`}
            >
              <p className="font-medium text-center mb-3">{q.question}</p>
              <div className="flex justify-center gap-4">
                <Button
                  variant={answers[index] === true ? "default" : "outline"}
                  className="w-24"
                  onClick={() => handleAnswer(index, true)}
                >
                  Yes
                </Button>
                <Button
                  variant={answers[index] === false ? "default" : "outline"}
                  className="w-24"
                  onClick={() => handleAnswer(index, false)}
                >
                  No
                </Button>
              </div>
            </div>
          ))}
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/employee/test/select")}
          >
            <X className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || answeredCount < 42}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
