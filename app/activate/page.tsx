// app/password-reset/page.tsx (Next.js 13+ with app directory)

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { activateAccount } from "@/services/user.service";
import SearchParamsWrapper from '@/components/SearchParamsWrapper';

const ActivatePageContent = ({ searchParams }: { searchParams: URLSearchParams }) => {
  const router = useRouter();
  const email = searchParams.get("email");
  const code = searchParams.get("code");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await activateAccount(email as string, code as string, password);
      setSuccess(true);
    } catch {
      setError("Password reset failed. Please try again.");
    }
  };

  useEffect(() => {
    if (success) {
      router.push("/");
    }
  }, [success, router]);

  if (!email || !code) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-lg text-gray-700">Invalid password reset link.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md space-y-4 w-96"
      >
        <h1 className="text-xl font-semibold">Reset Your Password</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Reset Password
        </button>
      </form>
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
