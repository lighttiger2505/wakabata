import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 認証が必要なパス
const protectedPaths = ["/projects", "/settings"];
// 認証済みユーザーがアクセスできないパス
const authPaths = ["/login"];

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth-storage")?.value;
  const isAuthenticated = authToken ? JSON.parse(authToken).state.isAuthenticated : false;
  const path = request.nextUrl.pathname;

  // 認証が必要なパスへの未認証アクセス
  if (protectedPaths.some((p) => path.startsWith(p)) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", path);
    return NextResponse.redirect(loginUrl);
  }

  // 認証済みユーザーのログインページへのアクセス
  if (authPaths.includes(path) && isAuthenticated) {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
