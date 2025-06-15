"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { useState, useEffect, ReactNode } from "react";

interface SafeRecaptchaProviderProps {
  children: ReactNode;
}

export function SafeRecaptchaProvider({
  children,
}: SafeRecaptchaProviderProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Render children directly during SSR or before client-side mount
    // This avoids GoogleReCaptchaProvider attempting to run in a non-browser environment
    // or before it's fully ready.
    return <>{children}</>;
  }

  // Get the site key from the environment variable
  const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  if (!SITE_KEY) {
    // eslint-disable-next-line no-console
    console.error(
      "GoogleReCaptchaProvider site key is missing! Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in your .env file.",
    );
  }

  // On the client side, after mount, render the actual GoogleReCaptchaProvider
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={SITE_KEY}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
        nonce: undefined, // Ensure nonce is undefined if not used, or manage it appropriately
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
