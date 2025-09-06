import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // List halaman yang butuh login
  const protectedPaths = ["/", "/admin", "/materials", "/exercises"];

  const isProtected = protectedPaths.includes(request.nextUrl.pathname);

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin", "/materials", "/exercises"], 
};
