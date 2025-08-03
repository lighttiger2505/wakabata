"use client";

import { setGlobalRefreshFunction, setIsRefreshingForAxios } from "@/lib/auth-manager";
import {
  type AuthState,
  checkAuth as authCheckAuth,
  login as authLogin,
  logout as authLogout,
  getAuthState,
  setAuthState,
} from "@/lib/auth-utils";
import { removeCookieValue } from "@/lib/cookie-utils";
import Axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

interface TokenRefreshResult {
  access_token: string;
  refresh_token: string;
}

export const useAuth = () => {
  const [authState, setLocalAuthState] = useState<AuthState>(() => getAuthState());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  // 並行リフレッシュを防ぐためのRef
  const refreshPromiseRef = useRef<Promise<TokenRefreshResult> | null>(null);

  // リフレッシュ専用のAxiosインスタンス（無限ループを防ぐため）
  const refreshAxiosInstanceRef = useRef(
    Axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_HOST,
      timeout: 10000, // 10秒のタイムアウト
    }),
  );

  // JWTトークンの期限をチェック
  const isTokenExpired = useCallback((token?: string): boolean => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      // 5分のバッファを持たせて期限切れをチェック
      return payload.exp < now + 300;
    } catch {
      return true;
    }
  }, []);

  // トークンのリフレッシュが必要かチェック
  const shouldRefreshToken = useCallback((): boolean => {
    const currentState = getAuthState();
    if (!currentState?.token?.access_token) {
      return false;
    }
    return isTokenExpired(currentState.token.access_token);
  }, [isTokenExpired]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const result = await authLogin(email, password);
    setLocalAuthState(getAuthState());
    return result;
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setLocalAuthState(getAuthState());
  }, []);

  const checkAuth = useCallback(async () => {
    await authCheckAuth();
    setLocalAuthState(getAuthState());
  }, []);

  // トークンリフレッシュ機能
  const refreshToken = useCallback(async (): Promise<TokenRefreshResult> => {
    // 既にリフレッシュ処理が進行中の場合、同じPromiseを返す
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const performRefresh = async (): Promise<TokenRefreshResult> => {
      const currentState = getAuthState();

      if (!currentState?.token?.refresh_token) {
        throw new Error("No refresh token available");
      }

      try {
        const response = await refreshAxiosInstanceRef.current.post<TokenRefreshResult>("/api/v1/auth/refresh", {
          refresh_token: currentState.token.refresh_token,
        });

        const { access_token, refresh_token } = response.data;

        // 新しいトークンで状態を更新
        setAuthState({
          token: { access_token, refresh_token },
        });

        return { access_token, refresh_token };
      } catch (error) {
        // リフレッシュに失敗した場合、認証情報をクリア
        removeCookieValue("auth-storage");
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isInitialized: true,
        });
        throw error;
      }
    };

    refreshPromiseRef.current = performRefresh();
    setIsRefreshing(true);
    setIsRefreshingForAxios(true);
    setRefreshError(null);

    try {
      const result = await refreshPromiseRef.current;
      setLocalAuthState(getAuthState());
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "トークンの更新に失敗しました";
      setRefreshError(errorMessage);
      throw error;
    } finally {
      refreshPromiseRef.current = null;
      setIsRefreshing(false);
      setIsRefreshingForAxios(false);
    }
  }, []);

  const clearRefreshError = useCallback(() => {
    setRefreshError(null);
  }, []);

  // グローバルリフレッシュ関数を設定
  useEffect(() => {
    setGlobalRefreshFunction(refreshToken);
  }, [refreshToken]);

  // Cookie changes を監視するためのポーリング
  useEffect(() => {
    const checkForChanges = () => {
      const currentState = getAuthState();
      setLocalAuthState(currentState);

      // リフレッシュ状態を同期
      setIsRefreshing(refreshPromiseRef.current !== null);
    };

    const interval = setInterval(checkForChanges, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    ...authState,
    login,
    logout,
    checkAuth,
    refreshToken,
    isRefreshing,
    refreshError,
    clearRefreshError,
    // トークン管理ユーティリティ
    isTokenExpired,
    shouldRefreshToken,
    getAccessToken: useCallback(() => authState.token?.access_token || null, [authState.token?.access_token]),
  };
};
