"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { gsap } from "gsap";
import { ArrowLeft, Shield } from "lucide-react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { loginUser } from "@/services/auth.service";
import { decodeToken } from "@/utils/tokenUtils";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSystemAdmin, setIsSystemAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { toast } = useToast();
  const router = useRouter();

  const containerRef = useRef(null);
  const formRef = useRef(null);
  const formFieldsRef = useRef<(HTMLDivElement | null)[]>([]);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    );
    tl.fromTo(
      logoRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.01 }
    );
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.01 }
    );
    tl.fromTo(
      descriptionRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.01 },
      "-=0.6"
    );

    formFieldsRef.current.forEach((field, index) => {
      tl.fromTo(
        field,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.05 },
        "-=0.2"
      );
    });

    tl.fromTo(
      buttonRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.01 }
    );
    tl.fromTo(
      footerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.01 },
      "-=0.6"
    );

    return () => {
      tl.kill();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { role } = await loginUser(email, password);

      let redirect = "/dashboard";
      if (role === "super_admin") redirect = "/dashboard/superadmin";
      else if (role === "org_admin") redirect = "/dashboard/organization";
      else if (role === "branch_admin") redirect = "/dashboard/branch";
      else if (role === "org_member") redirect = "/dashboard/employee/test";

      window.location.href = redirect;
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.message || "Invalid credentials",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex min-h-screen flex-col items-center justify-center bg-background p-4"
    >
      <div className="absolute top-4 left-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div ref={logoRef} className="mb-8 flex items-center justify-center">
        <Shield className="h-12 w-12 text-secondary" />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle ref={titleRef} className="text-center text-2xl">
            Login to Your Account
          </CardTitle>
          <CardDescription ref={descriptionRef} className="text-center">
            Enter your credentials to access the personality testing platform
          </CardDescription>
        </CardHeader>

        <form ref={formRef} onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-center py-2 px-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div
              className="space-y-2"
              ref={(el) => {
                formFieldsRef.current[0] = el;
              }}
            >
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                placeholder="name@example.com"
              />
            </div>

            <div
              className="space-y-2"
              ref={(el) => {
                formFieldsRef.current[1] = el;
              }}
            >
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                placeholder="********"
              />
            </div>

            <div
              className="space-y-2"
              ref={(el) => {
                formFieldsRef.current[2] = el;
              }}
            >
              {/* <label htmlFor="isSystemAdmin" className="text-sm font-medium">
                <input
                  id="isSystemAdmin"
                  type="checkbox"
                  checked={isSystemAdmin}
                  onChange={(e) => setIsSystemAdmin(e.target.checked)}
                  className="mr-2"
                />
                Login as System Admin
              </label> */}
            </div>

            <Button
              ref={buttonRef}
              type="submit"
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardContent>
        </form>

        <CardFooter ref={footerRef} className="flex flex-col space-y-2">
          <div className="text-center text-sm">
            <Link
              href="/forgotpassword"
              className="text-primary underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account? Contact your administrator
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
