"use client";

import { useState } from "react";
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
import toast from "react-hot-toast";
import { Progress } from "@/components/ui/progress";

export default function RIASECPage() {
  const [answers, setAnswers] = useState<boolean[]>(Array(42).fill(undefined));
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const questions = riasecTest.questions;
  const categories = Object.keys(questions) as Array<keyof typeof questions>;
  const maxQuestions = Math.max(...categories.map((cat) => questions[cat].length));

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
      toast.error("Please answer all 42 questions.");
      return;
    }

    try {
      setLoading(true);
      const result = await submitRIASECAnswers(answers as boolean[]);
      if (result.success) {
        const encoded = encodeURIComponent(JSON.stringify(result.data));
        router.push(`/dashboard/employee/test/result/riasec?data=${encoded}`);
      }
    } catch (error) {
      toast.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
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
        </CardHeader>

        <CardContent>
          <div className="text-center mb-6">
            <p className="text-lg font-medium">{answeredCount} of 42 answered</p>
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
          <Button onClick={handleSubmit} disabled={loading || answeredCount < 42}>
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
