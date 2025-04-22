"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageTitle } from "@/components/page-title";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { TestQuestionBuilder } from "@/components/superadmin/test-question-builder";

export default function NewTestPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [timeLimit, setTimeLimit] = useState("60");
  const [instructions, setInstructions] = useState("");
  const [randomizeQuestions, setRandomizeQuestions] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Test created",
        description: `${name} has been created successfully.`,
      });
      router.push("/dashboard/superadmin/tests");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <PageTitle
        title="Create New Test"
        description="Design a new psychological assessment test"
      />

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Test Details</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="scoring">Scoring & Results</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Define the basic details of your test
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Test Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Test Type *</Label>
                  <Select value={type} onValueChange={setType} required>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select test type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personality">
                        Personality Assessment
                      </SelectItem>
                      <SelectItem value="leadership">
                        Leadership Evaluation
                      </SelectItem>
                      <SelectItem value="team">Team Compatibility</SelectItem>
                      <SelectItem value="stress">Stress Management</SelectItem>
                      <SelectItem value="communication">
                        Communication Skills
                      </SelectItem>
                      <SelectItem value="aptitude">
                        Problem Solving Aptitude
                      </SelectItem>
                      <SelectItem value="emotional">
                        Emotional Intelligence
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                  <Input
                    id="time-limit"
                    type="number"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Set to 0 for no time limit
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="randomize"
                    checked={randomizeQuestions}
                    onCheckedChange={setRandomizeQuestions}
                  />
                  <Label htmlFor="randomize">Randomize question order</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-results"
                    checked={showResults}
                    onCheckedChange={setShowResults}
                  />
                  <Label htmlFor="show-results">
                    Show results to test takers
                  </Label>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() =>
                  (
                    document.querySelector(
                      '[data-value="questions"]'
                    ) as HTMLElement
                  )?.click()
                }
              >
                Next: Questions
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            <TestQuestionBuilder />

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  (
                    document.querySelector(
                      '[data-value="details"]'
                    ) as HTMLElement
                  )?.click()
                }
              >
                Back: Details
              </Button>
              <Button
                type="button"
                onClick={() =>
                  (
                    document.querySelector(
                      '[data-value="scoring"]'
                    ) as HTMLElement
                  )?.click()
                }
              >
                Next: Scoring
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="scoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scoring Configuration</CardTitle>
                <CardDescription>
                  Define how the test will be scored and results presented
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="scoring-method">Scoring Method</Label>
                  <Select defaultValue="weighted">
                    <SelectTrigger id="scoring-method">
                      <SelectValue placeholder="Select scoring method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">
                        Simple (Equal weights)
                      </SelectItem>
                      <SelectItem value="weighted">
                        Weighted (Custom weights)
                      </SelectItem>
                      <SelectItem value="dimensional">
                        Dimensional (Multiple factors)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="result-format">Result Format</Label>
                  <Select defaultValue="detailed">
                    <SelectTrigger id="result-format">
                      <SelectValue placeholder="Select result format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple Score</SelectItem>
                      <SelectItem value="categories">Categorized</SelectItem>
                      <SelectItem value="detailed">
                        Detailed Analysis
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passing-score">Passing Score (%)</Label>
                  <Input id="passing-score" type="number" defaultValue="70" />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  (
                    document.querySelector(
                      '[data-value="questions"]'
                    ) as HTMLElement
                  )?.click()
                }
              >
                Back: Questions
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Test"}
              </Button>
            </div>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
}
