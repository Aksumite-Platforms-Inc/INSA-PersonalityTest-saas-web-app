import React from "react";
import Image from "next/image";
import clsx from "clsx";

// LogoLoader: Animated logo for loaders
export function LogoLoader({
  size = 64,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div className={clsx("flex items-center justify-center", className)}>
      <Image
        src="/INSAlogo.png"
        alt="Loading..."
        width={size}
        height={size}
        className="animate-spin-slow"
        priority
      />
    </div>
  );
}

// PageLoader: Fullscreen loader for page-level loading
export function PageLoader({
  loading,
  children,
}: {
  loading: boolean;
  children?: React.ReactNode;
}) {
  if (!loading) return <>{children}</>;
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-900">
      <LogoLoader size={96} />
      <span className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
        Loading...
      </span>
    </div>
  );
}

// ComponentLoader: Inline loader for tables, cards, etc.
export function ComponentLoader({
  loading,
  children,
  size = 32,
}: {
  loading: boolean;
  children?: React.ReactNode;
  size?: number;
}) {
  if (!loading) return <>{children}</>;
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <LogoLoader size={size} />
      <span className="mt-2 text-sm text-gray-500">Loading...</span>
    </div>
  );
}

// Add this to your global CSS or Tailwind config:
// .animate-spin-slow { animation: spin 1.5s linear infinite; }
