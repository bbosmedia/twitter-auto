import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password", "/"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/api/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Full session validation for protected routes
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const signInUrl = new URL("/login", request.url);
    signInUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
