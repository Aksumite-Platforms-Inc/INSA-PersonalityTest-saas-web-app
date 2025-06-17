// app/password-reset/page.tsx (Next.js 13+ with app directory)

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { activateAccount } from "@/services/user.service";
import SearchParamsWrapper from "@/components/SearchParamsWrapper";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";

const ActivatePageContent = ({
  searchParams,
}: {
  searchParams: URLSearchParams;
}) => {
  const router = useRouter();
  const email = searchParams.get("email");
  const code = searchParams.get("code");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  // Password policy validation
  const isPasswordValid = (pwd: string) => {
    return (
      pwd.length >= 8 &&
      /[A-Z]/.test(pwd) &&
      /[a-z]/.test(pwd) &&
      /[0-9]/.test(pwd) &&
      /[^A-Za-z0-9]/.test(pwd)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!isPasswordValid(password)) {
      setError(
        "Password must be at least 8 characters, include uppercase, lowercase, a digit, and a special character."
      );
      return;
    }
    setIsLoading(true);
    try {
      await activateAccount(email as string, code as string, password);
      setSuccess(true);
      toast({
        title: "Success",
        description: "Account activated successfully.",
      });
    } catch (err: any) {
      let errorMessage = "Something went wrong. Please check your internet.";
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as any).response === "object" &&
        (err as any).response !== null &&
        "data" in (err as any).response &&
        typeof (err as any).response.data === "object" &&
        (err as any).response.data !== null &&
        "message" in (err as any).response.data
      ) {
        errorMessage = (err as any).response.data.message;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Activate Your Account
          </CardTitle>
          <CardDescription className="text-center">
            Please set a new password to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {error && (
                <div className="flex items-center text-sm text-red-500">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Setting Password..." : "Set Password"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <p className="text-gray-700 font-medium">
                Your password has been set successfully. Your account is now
                secured.
              </p>
              <p className="text-gray-500 text-sm">Redirecting to login...</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="link" onClick={() => router.push("/login")}>
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default function ActivatePage() {
  return (
    <SearchParamsWrapper>
      {(searchParams) => <ActivatePageContent searchParams={searchParams} />}
    </SearchParamsWrapper>
  );
}
