"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { performPasswordReset } from "@/services/auth.service";
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
import SearchParamsWrapper from "@/components/SearchParamsWrapper";

const PasswordResetPageContent = ({
  searchParams,
}: {
  searchParams: URLSearchParams;
}) => {
  const router = useRouter();
  const email = searchParams.get("email");
  const code = searchParams.get("code");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      await performPasswordReset(email as string, code as string, password);
      setSuccess(true);
    } catch {
      setError("Password reset failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  if (!email || !code) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="border-none shadow-lg w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Invalid Reset Link
            </CardTitle>
            <CardDescription className="text-center">
              The reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <p className="text-gray-600">
              Please request a new password reset link.
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button onClick={() => router.push("/forgotpassword")}>
              Request New Link
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your new password below.
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
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <p className="text-gray-700 font-medium">
                Password reset successful.
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

const PasswordResetPage = () => (
  <SearchParamsWrapper>
    {(searchParams) => <PasswordResetPageContent searchParams={searchParams} />}
  </SearchParamsWrapper>
);

export default PasswordResetPage;
