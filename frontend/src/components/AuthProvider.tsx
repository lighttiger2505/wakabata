"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type React from "react";
import { useEffect } from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { isLoading, isInitialized, checkAuth } = useAuth();

  // アプリケーション初期化時に認証状態をチェック
  useEffect(() => {
    if (!isInitialized) {
      checkAuth();
    }
  }, [isInitialized, checkAuth]);

  // 初期化中はローディング表示
  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="mb-4 size-8 animate-spin rounded-full border-4 border-green-400 border-t-transparent" />
          <p className="text-gray-400">認証状態を確認しています...</p>
        </div>
      </div>
    );
  }

  // middlewareがルーティング制御を行うため、ここでは単純にchildrenを返す
  return <>{children}</>;
}
