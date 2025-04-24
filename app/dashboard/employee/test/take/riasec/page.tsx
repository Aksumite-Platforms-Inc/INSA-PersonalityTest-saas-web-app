"use client";

import { useState } from "react";
import { riasecTest } from "@/data/tests/riasec";
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

export default function RIASECPage() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const questions = riasecTest.questions;
  const router = useRouter();

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>{riasecTest.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <p className="text-lg font-medium">
              {answeredCount} of {questions.length} questions answered
            </p>
            <Progress
              value={(answeredCount / questions.length) * 100}
              className="h-3 rounded-lg bg-gray-500"
            />
          </div>
          <p className="text-muted-foreground mb-4">{riasecTest.description}</p>
          {questions.map((question) => (
            <div
              key={question.id}
              className="flex justify-between items-center mb-6 p-4 border rounded-lg shadow-sm"
            >
              <p className="font-medium mb-2">{question.text}</p>
              <input
                type="checkbox"
                className="mr-2 w-6 h-6"
                onChange={(e) =>
                  handleAnswer(question.id, e.target.checked ? "yes" : "no")
                }
              />
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={() => router.push("/dashboard/employee/test/select")}
          >
            <X className="h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
