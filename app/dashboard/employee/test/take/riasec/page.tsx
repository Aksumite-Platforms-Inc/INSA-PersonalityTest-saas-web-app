"use client";

import { useState } from "react";
import { riasecTest } from "@/data/tests/riasec";
import { submitRIASECAnswers } from "@/services/testService";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RIASECPage() {
  const [answers, setAnswers] = useState<boolean[]>(Array(42).fill(false));
  const [loading, setLoading] = useState(false);
  const questions = riasecTest.questions;
  const categories = Object.keys(questions);
  const maxQuestions = Math.max(
    ...categories.map((cat) => questions[cat].length)
  );
  const router = useRouter();

  // Interleave questions: R1, I1, A1, S1, E1, C1, then R2...
  const orderedQuestions = [];
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

  const answeredCount = answers.filter((a) => a).length;

  const handleSubmit = async () => {
    if (answers.length !== 42) {
      toast.error("Please answer all 42 questions.");
      return;
    }

    try {
      setLoading(true);

      const result = await submitRIASECAnswers(answers);

      if (result.success) {
        toast.success("Assessment submitted successfully!");
      } else {
        toast.error("Failed to submit answers. Please try again.");
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
          <CardTitle>{riasecTest.title}</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="text-center mb-4">
            <p className="text-lg font-medium">
              {answeredCount} of 42 questions selected
            </p>
          </div>

          <p className="text-muted-foreground mb-6">{riasecTest.description}</p>

          {orderedQuestions.map((q, index) => (
            <div
              key={index}
              className="flex justify-between items-center mb-4 p-4 border rounded-lg shadow-sm"
            >
              <p className="font-medium">{q.question}</p>
              <input
                type="checkbox"
                className="w-6 h-6"
                checked={answers[index]}
                onChange={(e) => handleAnswer(index, e.target.checked)}
              />
            </div>
          ))}
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/employee/test/select")}
          >
            {/* <X className="h-5 w-5" /> */}
          </Button>

          {answeredCount > 0 && (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
