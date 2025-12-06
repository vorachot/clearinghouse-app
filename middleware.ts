import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isPublicPath =
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api/public");

  // ถ้า path ที่ไม่ต้องป้องกัน ก็ให้ผ่านไปเลย
  if (isPublicPath) return NextResponse.next();

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
