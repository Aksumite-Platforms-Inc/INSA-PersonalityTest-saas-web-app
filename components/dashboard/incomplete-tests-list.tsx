"use client";

import { TestCompletionStatus } from "@/services/test.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface IncompleteTestsListProps {
  users: TestCompletionStatus[];
  maxItems?: number;
}

export function IncompleteTestsList({ users, maxItems = 10 }: IncompleteTestsListProps) {
  const incompleteUsers = users
    .filter((user) => user.remaining_tests_count > 0)
    .slice(0, maxItems);

  if (incompleteUsers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users with Incomplete Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p>All users have completed their tests!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatIncompleteTests = (incompleteTestsList: string | null): string[] => {
    if (!incompleteTestsList) return [];
    return incompleteTestsList.split(",").map((test) => test.trim());
  };

  const getTestDisplayName = (testName: string): string => {
    const testMap: Record<string, string> = {
      mbti: "MBTI",
      big_five: "Big Five",
      riasec: "RIASEC",
      enneagram: "Enneagram",
    };
    return testMap[testName.toLowerCase()] || testName;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users with Incomplete Tests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {incompleteUsers.map((user) => {
            const incompleteTests = formatIncompleteTests(user.incomplete_tests_list);
            return (
              <div
                key={user.user_id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">{user.user_name}</p>
                  <p className="text-sm text-muted-foreground">{user.user_email}</p>
                  {user.organization_name && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {user.organization_name}
                      {user.branch_name && ` • ${user.branch_name}`}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex flex-wrap gap-1 justify-end">
                    {incompleteTests.map((test) => (
                      <Badge
                        key={test}
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs"
                      >
                        {getTestDisplayName(test)}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {user.completed_tests_count}/4 completed
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

