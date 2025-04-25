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
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface MBTIPages {
  page1: { id: number; left: string; right: string }[];
  page2: { id: number; trait: string; text: string }[];
}

const mbtiTestTyped: { pages: MBTIPages } = mbtiTest;

export default function MBTITestPage() {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const router = useRouter();
  const questionsPerGroup = currentGroup === 0 ? 32 : 28;
  const questions = currentGroup === 0 
    ? mbtiTestTyped.pages.page1 ?? [] 
    : mbtiTestTyped.pages.page2 ?? [];

  const handleNextGroup = () => {
    if (currentGroup < 1) setCurrentGroup(currentGroup + 1);
  };

  const handlePreviousGroup = () => {
    if (currentGroup > 0) setCurrentGroup(currentGroup - 1);
  };

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  return (
    <div className="container mx-auto py-6">
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
        </CardHeader>

        <CardContent>
          <div className="text-center mb-4">
            <p className="text-lg font-medium">Page {currentGroup + 1} of 2</p>
            <div className="flex items-center justify-between">
              <Progress
                value={((currentGroup + 1) / 2) * 100}
                className="h-2 rounded-lg bg-gray-500 flex-1"
              />
              <span className="ml-2 text-sm text-gray-500">
                {Math.round(((currentGroup + 1) / 2) * 100)}% Complete
              </span>
            </div>
          </div>

          {questions.map((question) => (
            <div
              key={question.id}
              className="mb-6 py-4 border rounded-lg shadow-sm"
            >
              {currentGroup === 0 ? (
                // Page 1 Layout
                <div className="grid grid-cols-7 items-center w-full text-sm sm:text-lg">
                  <span className="col-span-2 text-right font-medium">
                    {"left" in question && question.left}
                  </span>
                  
                  <div className="col-span-3 flex items-center justify-center sm:space-x-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <label key={value} className="flex flex-col items-center">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={value}
                          checked={answers[question.id] === value}
                          onChange={() => handleAnswer(question.id, value)}
                          className="form-radio h-4 w-4 text-blue-600 scale-75 sm:scale-100"
                        />
                      </label>
                    ))}
                  </div>

                  <span className="col-span-2 font-medium pl-2">
                    {"right" in question && question.right}
                  </span>
                </div>
              ) : (
                // Page 2 Layout
                <div className="sm:text-lg text-sm flex flex-col md:flex-row items-center justify-around w-full space-y-2 sm:space-y-0 md:space-x-4 px-2">
                  <span className="font-medium sm:w-1/2">
                    {"text" in question && question.text}
                  </span>
                  
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <span className="text-sm font-medium">Disagree</span>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <label key={value} className="flex flex-col items-center">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={value}
                          checked={answers[question.id] === value}
                          onChange={() => handleAnswer(question.id, value)}
                          className="form-radio h-3.5 w-3.5 text-blue-600"
                        />
                      </label>
                    ))}
                    <span className="text-sm font-medium">Agree</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button 
            onClick={handlePreviousGroup} 
            disabled={currentGroup === 0}
            variant="outline"
          >
            Previous
          </Button>
          <Button
            onClick={handleNextGroup}
            disabled={currentGroup === 1}
          >
            {currentGroup === 0 ? 'Next' : 'Submit'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}