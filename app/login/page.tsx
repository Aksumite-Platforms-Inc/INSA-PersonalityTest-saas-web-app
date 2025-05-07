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
      { opacity: 1, y: 0, duration: 0.5 }
    );
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5 }
    );
    tl.fromTo(
      descriptionRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5 },
      "-=0.3"
    );

    formFieldsRef.current.forEach((field, index) => {
      tl.fromTo(
        field,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3 },
        "-=0.1"
      );
    });

    tl.fromTo(
      buttonRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 }
    );
    tl.fromTo(
      footerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      "-=0.3"
    );

    return () => {
      tl.kill();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { token } = await loginUser(email, password);
      localStorage.setItem("authToken", token);

      const user = decodeToken();
      const role = user?.role;

      if (!role) throw new Error("Invalid token. No role found.");

      const allowedRoles = [
        "org_member",
        "branch_admin",
        "org_admin",
        "super_admin",
      ];
      if (!allowedRoles.includes(role)) throw new Error("Unauthorized role.");

      const redirectPath = {
        org_member: "employee/test",
        branch_admin: "branch",
        org_admin: "organization",
        super_admin: "superadmin",
      }[role];

      router.push(`/dashboard/${redirectPath}`);
      toast({
        title: "Success!",
        description: "You have logged in successfully.",
      });
    } catch (error: any) {
      setError(error.message || "Invalid credentials. Please try again.");
      toast({
        title: "Error!",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });

      gsap.fromTo(
        formRef.current,
        { x: -10 },
        { x: 0, duration: 0.1, repeat: 5, yoyo: true }
      );
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex min-h-screen flex-col items-center justify-center bg-background p-4"
    >
      <div className="absolute top-4 left-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back to home</span>
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
            <a
              href="#"
              className="text-primary underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account? Contact your administrator
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

/* eslint-disable jsx-a11y/label-has-associated-control */
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { jwtDecode } from 'jwt-decode';
// import Illustration from '../../assets/Images/logo/undraw_online_test_re_kyfx (1).svg';
// import Logo from '../../assets/Images/logo/INSA_ICON_LOGO.png';
// import 'react-toastify/dist/ReactToastify.css';
// import LoginResponse from '../../types/auth.type';

// interface DecodedToken {
//   role: string;
// }

// function LoginForm() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   useEffect(() => {
//     if (window.electron && window.electron.ipcRenderer) {
//       const handleLoginSuccess = (_event: any, response: LoginResponse) => {
//         if (response.success && response.token) {
//           localStorage.setItem('authToken', response.token);

//           try {
//             const decoded: DecodedToken = jwtDecode(response.token);
//             const userRole = decoded.role;

//             if (userRole === 'org_admin' || userRole === 'branch_admin') {
//               navigate('/dashboard');
//             } else if (userRole === 'org_member') {
//               navigate('/tests');
//             } else {
//               toast.error('Unknown role. Contact support.');
//             }

//             toast.success('Login successful!');
//           } catch (err) {
//             toast.error('Failed to process user role. Contact support.');
//           }
//         } else {
//           setError(response.message || 'Login failed.');
//           toast.error(response.message || 'Login failed.');
//         }
//       };

//       window.electron.ipcRenderer.on('user-login-success', handleLoginSuccess);

//       return () => {
//         window.electron.ipcRenderer.removeListener(
//           'user-login-success',
//           handleLoginSuccess,
//         );
//       };
//     }
//     return undefined;
//   }, [navigate]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     if (window.electron && window.electron.ipcRenderer) {
//       window.electron.ipcRenderer.sendMessage('user-login', email, password);
//     } else {
//       setError('Electron IPC is not available');
//       toast.error('Electron IPC is not available.');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-gray-800">
//       <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl flex flex-col md:flex-row w-full">
//         {/* Watermark */}
//         <div className="absolute inset-0 flex items-center justify-center opacity-5 z-0">
//           <img src={Logo} alt="Watermark Logo" className="max-w-sm" />
//         </div>

//         {/* Left Section - Illustration */}
//         <div className="relative z-10 flex items-center justify-center w-full md:w-1/2 p-8 bg-gray-100">
//           <img src={Illustration} alt="Illustration" className="max-w-xs" />
//         </div>

//         {/* Right Section - Form */}
//         <div className="relative z-10 w-full md:w-1/2 p-8">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-gray-800 mb-2">
//               INSA | Personality Test Platform
//             </h1>
//             <p className="text-sm text-gray-600">
//               Welcome back! Please log in.
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Email Address
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Password
//               </label>
//               <input
//                 id="password"
//                 type="password"
//                 placeholder="8+ Characters, 1 Capital letter"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             {error && <p className="text-sm text-red-500">{error}</p>}

//             <button
//               type="submit"
//               className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
//             >
//               Sign In
//             </button>
//           </form>

//           <div className="mt-6 flex justify-between items-center text-sm">
//             <Link
//               to="/forgotpassword"
//               className="text-gray-800 hover:underline"
//             >
//               Forgot Password?
//             </Link>
//             <Link to="/help" className="text-gray-800 hover:underline">
//               Need Help?
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginForm;
