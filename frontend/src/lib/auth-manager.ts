import { getAuthState } from "./auth-utils";

// Axiosインターセプターで使用するためのグローバル関数
export const getAccessTokenForAxios = (): string | null => {
  const authState = getAuthState();
  return authState?.token?.access_token || null;
};

export const isTokenExpiredForAxios = (token?: string): boolean => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    // 5分のバッファを持たせて期限切れをチェック
    return payload.exp < now + 300;
  } catch {
    return true;
  }
};

export const shouldRefreshTokenForAxios = (): boolean => {
  const authState = getAuthState();
  if (!authState?.token?.access_token) {
    return false;
  }
  return isTokenExpiredForAxios(authState.token.access_token);
};

// グローバルなリフレッシュ関数の参照を保持
let globalRefreshFunction: (() => Promise<{ access_token: string; refresh_token: string }>) | null = null;

export const setGlobalRefreshFunction = (refreshFn: () => Promise<{ access_token: string; refresh_token: string }>) => {
  globalRefreshFunction = refreshFn;
};

export const getGlobalRefreshFunction = () => globalRefreshFunction;

// リフレッシュ中の状態を管理
let isRefreshingGlobally = false;

export const isRefreshingForAxios = (): boolean => {
  return isRefreshingGlobally;
};

export const setIsRefreshingForAxios = (refreshing: boolean): void => {
  isRefreshingGlobally = refreshing;
};
