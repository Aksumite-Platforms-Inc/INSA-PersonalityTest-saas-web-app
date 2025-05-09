// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  const publicPaths = ["/login", "/forgotpassword"];
  const protectedPaths = ["/dashboard", "/superadmin", "/organization"];

  const path = request.nextUrl.pathname;

  if (publicPaths.some((p) => path.startsWith(p))) {
    return NextResponse.next();
  }

  if (protectedPaths.some((p) => path.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
