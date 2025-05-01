"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Simulated login — no real auth
const simulateLogin = async (role: string) => {
  await new Promise((res) => setTimeout(res, 600));
  return { success: true, role };
};

export default function DemoLoginPage() {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const handleLogin = async (role: string) => {
    setLoadingRole(role);
    await simulateLogin(role);
    router.push(`/demo/${role}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-6 flex items-center justify-center">
        <Shield className="h-12 w-12 text-secondary" />
      </div>

      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">INSA Demo Login</CardTitle>
          <CardDescription>
            Select a role to explore the demo system. No credentials required.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            className="w-full"
            onClick={() => handleLogin("org-admin")}
            disabled={!!loadingRole}
          >
            {loadingRole === "organization"
              ? "Loading..."
              : "Login as Organization Admin"}
          </Button>

          <Button
            className="w-full"
            onClick={() => handleLogin("branch-admin")}
            disabled={!!loadingRole}
          >
            {loadingRole === "branch-admin"
              ? "Loading..."
              : "Login as Branch Admin"}
          </Button>

          <Button
            className="w-full"
            onClick={() => handleLogin("employee")}
            disabled={!!loadingRole}
          >
            {loadingRole === "employee" ? "Loading..." : "Login as Employee"}
          </Button>
        </CardContent>

        <CardFooter className="text-sm text-muted-foreground text-center flex-col space-y-2">
          <p>
            This demo is read-only. All data and interactions are simulated.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
