import { gETApiV1AuthMe, pOSTApiV1AuthLogin } from "@/api/generated/client";
import { TokenPair, User } from "@/api/generated/model";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStore = {
  user: User | null;
  token: TokenPair | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
};

export const useAuth = create<AuthStore>()(
  persist(
    (set) => {
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: false,
        login: async (email: string, password: string) => {
          set({ isLoading: true });
          try {
            // ログインAPIを呼び出してトークンを取得
            const tokenPair = await pOSTApiV1AuthLogin({ email, password });

            // トークンを保存
            set({ token: tokenPair });

            // ユーザー情報を取得
            const userInfo = await gETApiV1AuthMe();
            if (userInfo.id && userInfo.email) {
              const user: User = {
                id: userInfo.id,
                email: userInfo.email,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                password_hash: "",
                is_email_verified: true,
                totp_secret: "",
              };
              set({
                user,
                isAuthenticated: true,
                isLoading: false,
              });
              return true;
            }

            // ユーザー情報の取得に失敗した場合
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
            return false;
          } catch (error: unknown) {
            const axiosError = error as { response?: { status?: number }; config?: { url?: string } };

            // ログインAPIそのものが失敗した場合はログ出力（認証エラーなど）
            // ユーザー情報取得でのみ401が発生した場合は処理を分ける
            if (axiosError?.response?.status === 401 && axiosError?.config?.url?.includes("/api/v1/auth/me")) {
              // ユーザー情報取得での401エラーは想定内の動作（トークンが無効など）
              set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
              });
              return false;
            }

            // その他のエラーはログ出力
            console.error("ログインに失敗しました:", error);
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
            return false;
          }
        },
        logout: () => {
          set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
        },
        checkAuth: async () => {
          set({ isLoading: true });
          try {
            const userInfo = await gETApiV1AuthMe();
            if (userInfo.id && userInfo.email) {
              const user: User = {
                id: userInfo.id,
                email: userInfo.email,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                password_hash: "",
                is_email_verified: true,
                totp_secret: "",
              };
              set({ user, isAuthenticated: true, isLoading: false, isInitialized: true });
            } else {
              set({ user: null, isAuthenticated: false, isLoading: false, isInitialized: true });
            }
          } catch (error: unknown) {
            const axiosError = error as { response?: { status?: number } };

            // 401エラーは認証されていない状態を示す想定内のレスポンスなので、エラーログは出力しない
            if (axiosError?.response?.status === 401) {
              set({ user: null, isAuthenticated: false, isLoading: false, isInitialized: true });
            } else {
              // 401以外のエラーは予期しないエラーなのでログ出力
              console.error("認証チェックに失敗しました:", error);
              set({ user: null, isAuthenticated: false, isLoading: false, isInitialized: true });
            }
          }
        },
      };
    },
    {
      name: "auth-storage",
      // ローカルストレージを使用（custom-instanceとの整合性を保つため）
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);
