import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { ToastProvider } from "../components/toast-provider";
import { AuthProvider } from "../app/contexts/auth-context";
import { SafeRecaptchaProvider } from "@/components/safe-recaptcha-provider"; // Import the new provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "INSA Personality Testing Platform",
  description:
    "A cloud-native multi-tenant SaaS web application for psychology-based internal testing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SafeRecaptchaProvider> {/* Use SafeRecaptchaProvider */}
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <LanguageProvider>
              <AuthProvider>
                {children}
                <ToastProvider />
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </SafeRecaptchaProvider>
      </body>
    </html>
  );
}
