"use client";

import React, { useRef, useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";

var SITE_KEY: string;

if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
  SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
}
SITE_KEY = "6LcdsV0rAAAAADqv49UKncRxPs_0debWYdcGtGYm";

// Optional: Show an error if the site key is missing (for dev/debug)
if (!SITE_KEY) {
  // eslint-disable-next-line no-console
  console.error(
    "reCAPTCHA site key is missing! Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in your .env file.",
  );
}

export default function LoginPage() {
  // All hooks must be called unconditionally at the top
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const recaptchaWidgetRef = useRef<HTMLDivElement | null>(null);

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

  // Prevent login page flash for authenticated users
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const role = payload.role;
        let redirect = "/dashboard";
        if (role === "super_admin") redirect = "/dashboard/superadmin";
        else if (role === "org_admin") redirect = "/dashboard/organization";
        else if (role === "branch_admin") redirect = "/dashboard/branch";
        else if (role === "org_member") redirect = "/dashboard/employee/test";
        toast;
        router.replace(redirect);
        return;
      } catch {
        // Invalid token, allow login
      }
    }
    setCheckingAuth(false);
  }, [router]);

  // Animate on mount (always call this hook, even if not rendering yet)
  useEffect(() => {
    if (checkingAuth) return;
    const tl = gsap.timeline();
    tl.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
    );
    tl.fromTo(
      logoRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.01 },
    );
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.01 },
    );
    tl.fromTo(
      descriptionRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.01 },
      "-=0.6",
    );
    formFieldsRef.current.forEach((field, index) => {
      tl.fromTo(
        field,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.05 },
        "-=0.2",
      );
    });
    tl.fromTo(
      buttonRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.01 },
    );
    tl.fromTo(
      footerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.01 },
      "-=0.6",
    );
    return () => {
      tl.kill();
    };
  }, [checkingAuth]);

  // Load reCAPTCHA script on mount
  useEffect(() => {
    if (!(window as any).grecaptcha) {
      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  // Callback for reCAPTCHA
  // This will be called by the widget when the user completes the challenge
  // We must attach this function to window so reCAPTCHA can call it
  useEffect(() => {
    (window as any).onRecaptchaSuccess = (token: string) => {
      setRecaptchaToken(token);
    };
  }, []);

  if (checkingAuth) return null;

  // On submit, check for reCAPTCHA token and handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      if (!recaptchaToken) {
        setError("Please complete the reCAPTCHA challenge.");
        setIsLoading(false);
        return;
      }
      const response = await loginUser(email, password, recaptchaToken);
      const { role } = response;
      let redirect = "/dashboard";
      if (role === "super_admin") redirect = "/dashboard/superadmin";
      else if (role === "org_admin") redirect = "/dashboard/organization";
      else if (role === "branch_admin") redirect = "/dashboard/branch";
      else if (role === "org_member") redirect = "/dashboard/employee/test";
      toast({
        title: "Login successful",
        description: ` Logged in as ${role.replace("_", " ")}`,
      });

      window.location.href = redirect;
      setRecaptchaToken(""); // reset for next login attempt
      // Optionally reset the widget
      if ((window as any).grecaptcha && recaptchaWidgetRef.current) {
        (window as any).grecaptcha.reset();
      }
    } catch (error: any) {
      let errorMessage = "Something went wrong. Please check your internet.";
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response === "object" &&
        (error as any).response !== null &&
        "data" in (error as any).response &&
        typeof (error as any).response.data === "object" &&
        (error as any).response.data !== null &&
        "message" in (error as any).response.data
      ) {
        errorMessage = (error as any).response.data.message;
      }
      setError(errorMessage || "Login failed.");
    } finally {
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
        <form ref={formRef} onSubmit={handleLogin}>
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
            <div className="flex justify-center">
              <div
                ref={recaptchaWidgetRef}
                className="g-recaptcha"
                data-sitekey={SITE_KEY || ""}
                data-callback="onRecaptchaSuccess"
                data-theme="light"
                data-size="normal"
              />
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

// Add this to global.d.ts or at the top of the file if you get TS errors:
// declare global { interface Window { grecaptcha: any } }
