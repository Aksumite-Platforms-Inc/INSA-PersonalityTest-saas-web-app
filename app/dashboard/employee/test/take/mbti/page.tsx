"use client";

import { useState } from "react";
import { mbtiTest } from "@/data/tests/mbti";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MBTITestPage() {
  const [currentGroup, setCurrentGroup] = useState(0);
  const questionsPerGroup = currentGroup === 0 ? 32 : 28; // MBTI test groups 32 questions on the first page and 28 on the second
  const questions = mbtiTest.questions;

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

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>{mbtiTest.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <p className="text-lg font-medium">Page {currentGroup + 1} of 2</p>
            <p className="text-sm text-muted-foreground">
              Showing questions {currentGroup * 32 + 1} to{" "}
              {Math.min(
                (currentGroup + 1) * questionsPerGroup,
                questions.length
              )}{" "}
              of {questions.length}
            </p>
          </div>
          <p className="text-muted-foreground mb-4">{mbtiTest.description}</p>
          {currentQuestions.map((question) => (
            <div key={question.id} className="mb-4">
              <p className="font-medium mb-2">{question.text}</p>
              {question.options.map((option) => (
                <label key={option.value} className="block">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.value}
                    className="mr-2"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handlePreviousGroup} disabled={currentGroup === 0}>
            Previous
          </Button>
          <Button
            onClick={handleNextGroup}
            disabled={
              (currentGroup + 1) * questionsPerGroup >= questions.length
            }
          >
            Next
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
