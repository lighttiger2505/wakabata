import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 認証が必要なパス
const protectedPaths = ["/projects", "/settings"];
// 認証済みユーザーがアクセスできないパス（ログインページなど）
const authOnlyPublicPaths = ["/login", "/signup"];
// 完全に公開されているパス
const publicPaths = ["/"];

interface AuthState {
  isAuthenticated: boolean;
  token?: {
    access_token: string;
    refresh_token: string;
  };
  user?: {
    id: string;
    email: string;
  };
}

function getAuthState(request: NextRequest): AuthState | null {
  try {
    const authCookie = request.cookies.get("auth-storage")?.value;
    if (!authCookie) {
      return null;
    }

    const authData = JSON.parse(authCookie);
    const state = authData.state as AuthState;

    // 基本的な認証状態チェック
    if (!state.isAuthenticated || !state.token?.access_token || !state.user?.id) {
      return null;
    }

    return state;
  } catch (error) {
    // JSONパースエラーなどの場合はnullを返す
    return null;
  }
}

function isProtectedPath(path: string): boolean {
  return protectedPaths.some((p) => path.startsWith(p));
}

function isAuthOnlyPublicPath(path: string): boolean {
  return authOnlyPublicPaths.includes(path);
}

function isPublicPath(path: string): boolean {
  return publicPaths.includes(path);
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const authState = getAuthState(request);
  const isAuthenticated = authState !== null;

  // 保護されたパスへの未認証アクセス
  if (isProtectedPath(path) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", path);
    return NextResponse.redirect(loginUrl);
  }

  // 認証済みユーザーの認証専用ページへのアクセス（ログイン・サインアップページ）
  if (isAuthOnlyPublicPath(path) && isAuthenticated) {
    // fromパラメータがある場合はそのページへ、なければプロジェクト一覧へ
    const from = request.nextUrl.searchParams.get("from");
    const redirectUrl = from && isProtectedPath(from) ? from : "/projects";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // ルートパス (/) の処理
  if (path === "/") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/projects", request.url));
    }
    // 未認証の場合はログインページへ
    return NextResponse.redirect(new URL("/login", request.url));
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
