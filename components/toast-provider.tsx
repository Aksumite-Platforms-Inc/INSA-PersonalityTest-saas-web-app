"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export function ToastProvider() {
  const { theme } = useTheme();

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: theme === "dark" ? "hsl(var(--background))" : "white",
          color: theme === "dark" ? "hsl(var(--foreground))" : "black",
          border: "1px solid hsl(var(--border))",
        },
      }}
      closeButton
    />
  );
}
