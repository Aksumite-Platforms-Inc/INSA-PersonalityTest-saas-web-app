"use client";

import { TestCompletionStatus } from "@/services/test.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, TrendingUp } from "lucide-react";
import { useMemo, memo } from "react";

interface TestProgressSummaryProps {
  users: TestCompletionStatus[];
}

export const TestProgressSummary = memo(function TestProgressSummary({ users }: TestProgressSummaryProps) {
  const stats = useMemo(() => {
    const total = users.length;
    const completed = users.filter((u) => u.remaining_tests_count === 0).length;
    const inProgress = users.filter(
      (u) => u.remaining_tests_count > 0 && u.remaining_tests_count < 4
    ).length;
    const notStarted = users.filter((u) => u.overall_status === "not_started").length;

    // Test-specific completion
    const testStats = {
      mbti: users.filter((u) => u.mbti_completed).length,
      bigFive: users.filter((u) => u.big_five_completed).length,
      riasec: users.filter((u) => u.riasec_completed).length,
      enneagram: users.filter((u) => u.enneagram_completed).length,
    };

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const averageProgress = total > 0
      ? Math.round(
          users.reduce((sum, u) => sum + u.completed_tests_count, 0) / total
        )
      : 0;

    return {
      total,
      completed,
      inProgress,
      notStarted,
      completionRate,
      averageProgress,
      testStats,
    };
  }, [users]);

  if (stats.total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Test Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <p>No users found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Test Progress Overview</span>
          <Badge variant="outline" className="text-sm">
            {stats.completionRate}% Complete
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Completion</span>
            <span className="font-medium">{stats.completionRate}%</span>
          </div>
          <Progress value={stats.completionRate} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Average: {stats.averageProgress}/4 tests per user</span>
            <span>{stats.completed}/{stats.total} completed all tests</span>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mb-1" />
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {stats.completed}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400 text-center">
              Completed
            </div>
          </div>
          <div className="flex flex-col items-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
            <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mb-1" />
            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
              {stats.inProgress}
            </div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400 text-center">
              In Progress
            </div>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
            <XCircle className="h-5 w-5 text-gray-600 dark:text-gray-400 mb-1" />
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              {stats.notStarted}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
              Not Started
            </div>
          </div>
        </div>

        {/* Test-Specific Completion */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="h-4 w-4" />
            <span>Test Completion Breakdown</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">MBTI</span>
                <span className="font-medium">
                  {stats.testStats.mbti}/{stats.total}
                </span>
              </div>
              <Progress
                value={(stats.testStats.mbti / stats.total) * 100}
                className="h-1.5"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Big Five</span>
                <span className="font-medium">
                  {stats.testStats.bigFive}/{stats.total}
                </span>
              </div>
              <Progress
                value={(stats.testStats.bigFive / stats.total) * 100}
                className="h-1.5"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">RIASEC</span>
                <span className="font-medium">
                  {stats.testStats.riasec}/{stats.total}
                </span>
              </div>
              <Progress
                value={(stats.testStats.riasec / stats.total) * 100}
                className="h-1.5"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Enneagram</span>
                <span className="font-medium">
                  {stats.testStats.enneagram}/{stats.total}
                </span>
              </div>
              <Progress
                value={(stats.testStats.enneagram / stats.total) * 100}
                className="h-1.5"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

