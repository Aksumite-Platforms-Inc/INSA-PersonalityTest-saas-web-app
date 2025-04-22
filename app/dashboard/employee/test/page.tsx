"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TestRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard/employee/test/select");
  }, [router]);

  return null;
}
