"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mbtiTest } from "@/data/tests/mbti";
import { useToast } from "@/hooks/use-toast";
import { submitMBTIAnswers } from "@/services/test.service";
import { X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getUserId } from "@/utils/tokenUtils";

export default function MBTITestPage() {
  const userId = getUserId();
  const storageKey = userId ? `mbtiTestAnswers_${userId}` : "mbtiTestAnswers";
  const [currentGroup, setCurrentGroup] = useState(0);
  const [aAnswers, setAAnswers] = useState<Record<number, number>>({});
  const [bAnswers, setBAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // Only show the restore toast once per session
  const restoreToastShown = useRef(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  const questions =
    currentGroup === 0 ? mbtiTest.pages.page1 : mbtiTest.pages.page2;

  const handleAnswer = (questionId: number, value: number) => {
    if (currentGroup === 0) {
      setAAnswers((prev) => ({ ...prev, [questionId]: value }));
    } else {
      setBAnswers((prev) => ({ ...prev, [questionId]: value }));
    }
  };

  const handleNextGroup = async () => {
    // Prevent next or submit if not all questions in the current group are answered
    const unanswered = questions.filter((q) => !isAnswered(q.id));
    if (unanswered.length > 0) {
      toast({
        title: "Please answer all questions before continuing.",
        variant: "destructive",
      });
      return;
    }
    if (currentGroup === 0) {
      setCurrentGroup(1);
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await submitMBTIAnswers(aAnswers, bAnswers);
      if (response.success) {
        // Clear user-specific and legacy cache on success
        localStorage.removeItem(storageKey);
        localStorage.removeItem("mbtiTestAnswers");
        window.localStorage.removeItem("mbtiTestAnswers");

        const encoded = encodeURIComponent(JSON.stringify(response.data));
        router.push(`/dashboard/employee/test/result/mbti?data=${encoded}`);
      } else {
        throw new Error(response.message || "Submission failed.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAnswered = (id: number) =>
    currentGroup === 0
      ? aAnswers[id] !== undefined
      : bAnswers[id] !== undefined;

  // Load cached answers and group on mount (only once, before first render)
  useEffect(() => {
    let restored = false;
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object") {
          let validGroup = 0;
          if (
            typeof parsed.currentGroup === "number" &&
            parsed.currentGroup >= 0 &&
            parsed.currentGroup < 2
          ) {
            validGroup = parsed.currentGroup;
          }
          setCurrentGroup(validGroup);
          if (parsed.aAnswers && typeof parsed.aAnswers === "object") {
            setAAnswers(parsed.aAnswers);
          }
          if (parsed.bAnswers && typeof parsed.bAnswers === "object") {
            setBAnswers(parsed.bAnswers);
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
        window.localStorage.setItem(
          storageKey,
          JSON.stringify({ aAnswers, bAnswers, currentGroup })
        );
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 1200);
      } catch (e) {}
    }, 400); // 400ms debounce
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [aAnswers, bAnswers, currentGroup, storageKey]);

  // Reset progress handler
  const handleResetProgress = () => {
    setAAnswers({});
    setBAnswers({});
    setCurrentGroup(0);
    window.localStorage.removeItem(storageKey);
    window.localStorage.removeItem("mbtiTestAnswers");
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
            <CardTitle>{mbtiTest.title}</CardTitle>
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

        {error && <p className="text-red-600 text-center mb-2">{error}</p>}

        <CardContent>
          <div className="text-center mb-6">
            <p className="text-lg font-medium">Page {currentGroup + 1} of 2</p>
            <Progress value={(currentGroup + 1) * 50} className="h-2 mt-2" />
          </div>

          {questions.map((q) => (
            <div
              key={q.id}
              className={`mb-6 p-4 border rounded-lg shadow-sm ${
                isAnswered(q.id) ? "border-blue-400" : ""
              }`}
            >
              {currentGroup === 0 ? (
                <div className="grid grid-cols-7 items-center">
                  {"left" in q && (
                    <span className="col-span-2 text-right font-medium">
                      {q.left}
                    </span>
                  )}
                  <div className="col-span-3 flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        onClick={() => handleAnswer(q.id, val)}
                        className={`w-6 h-6 rounded-full border ${
                          aAnswers[q.id] === val ? "bg-blue-500" : "bg-gray-200"
                        } hover:bg-blue-100 focus:outline-none focus:ring`}
                      />
                    ))}
                  </div>
                  {"right" in q && (
                    <span className="col-span-2 font-medium">{q.right}</span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  {"text" in q && (
                    <p className="font-medium text-center max-w-lg">{q.text}</p>
                  )}
                  <div className="flex items-center justify-between w-full max-w-md mt-2">
                    <span className="text-sm">Disagree</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          onClick={() => handleAnswer(q.id, val)}
                          className={`w-6 h-6 rounded-full border ${
                            bAnswers[q.id] === val
                              ? "bg-blue-500"
                              : "bg-gray-200"
                          } hover:bg-blue-100 focus:outline-none focus:ring`}
                        />
                      ))}
                    </div>
                    <span className="text-sm">Agree</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            onClick={() => setCurrentGroup(0)}
            disabled={currentGroup === 0}
          >
            Previous
          </Button>
          <Button
            onClick={handleNextGroup}
            disabled={isSubmitting}
            className="flex items-center"
          >
            {currentGroup === 0 ? (
              "Next"
            ) : isSubmitting ? (
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
