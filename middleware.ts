import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  const isLoginPage = request.nextUrl.pathname === "/login";
  const isCallbackPath = request.nextUrl.pathname.startsWith("/callback");
  const isPublicPath =
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api/public");

  if (isPublicPath) return NextResponse.next();
  if (isCallbackPath) return NextResponse.next();

  if (!accessToken && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (accessToken && isLoginPage) {
    return NextResponse.redirect(new URL("/organizations", request.url));
  }

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/organizations", request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}
export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - static files (_next/static)
     * - public API
     * - favicon
     */
    "/((?!_next/static|_next/image|favicon.ico|api/public).*)",
  ],
};
