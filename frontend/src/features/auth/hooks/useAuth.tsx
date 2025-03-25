import { TokenPair, User } from "@/api/generated/model";
import { AxiosError } from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStore = {
  user: User | null;
  token: TokenPair | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

interface AuthError {
  message: string;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => {
      // カスタムフックはコンポーネント内でのみ使用可能なため、
      // ここではログイン処理の実装のみを定義し、
      // 実際のAPIコールはコンポーネント側で行う
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        login: async (email: string, _password: string) => {
          set({ isLoading: true });
          try {
            // この部分はコンポーネント側で実装される
            // ここではステート更新のロジックのみを提供
            const mockUser: User = {
              id: "1",
              email: email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              password_hash: "",
              is_email_verified: true,
              totp_secret: "",
            };
            set({ user: mockUser, isAuthenticated: true, isLoading: false });
            return true;
          } catch (error) {
            if (error instanceof AxiosError) {
              const errorData = error.response?.data as AuthError | undefined;
              if (errorData?.message) {
                console.error("Error message:", errorData.message);
              }
            } else {
              console.error("Login failed:", error);
            }
            set({ isLoading: false });
            return false;
          }
        },
        logout: () => {
          set({ user: null, token: null, isAuthenticated: false });
        },
      };
    },
    {
      name: "auth-storage",
      // セッションストレージを使用
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    },
  ),
);
