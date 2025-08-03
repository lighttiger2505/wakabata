import { gETApiV1AuthMe, pOSTApiV1AuthLogin } from "@/api/generated/client";
import { TokenPair, User } from "@/api/generated/model";
import { getCookieValue, removeCookieValue, setCookieValue } from "./cookie-utils";

export interface AuthState {
  user: User | null;
  token: TokenPair | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

const AUTH_STORAGE_KEY = "auth-storage";

const defaultAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
};

export const getAuthState = (): AuthState => {
  try {
    const value = getCookieValue(AUTH_STORAGE_KEY);
    if (!value) return defaultAuthState;

    const parsed = JSON.parse(value);
    return parsed.state || defaultAuthState;
  } catch {
    return defaultAuthState;
  }
};

export const setAuthState = (state: Partial<AuthState>): void => {
  const currentState = getAuthState();
  const newState = { ...currentState, ...state };

  setCookieValue(AUTH_STORAGE_KEY, JSON.stringify({ state: newState }), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
};

export const clearAuthState = (): void => {
  removeCookieValue(AUTH_STORAGE_KEY);
};

export const login = async (email: string, password: string): Promise<boolean> => {
  setAuthState({ isLoading: true });

  try {
    const tokenPair = await pOSTApiV1AuthLogin({ email, password });
    setAuthState({ token: tokenPair });

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

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }

    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    return false;
  } catch (error: unknown) {
    const axiosError = error as { response?: { status?: number }; config?: { url?: string } };

    if (axiosError?.response?.status === 401 && axiosError?.config?.url?.includes("/api/v1/auth/me")) {
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return false;
    }

    console.error("ログインに失敗しました:", error);
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    return false;
  }
};

export const logout = (): void => {
  setAuthState({
    user: null,
    token: null,
    isAuthenticated: false,
    isInitialized: true,
  });
};

export const checkAuth = async (): Promise<void> => {
  setAuthState({ isLoading: true });

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

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
      });
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    }
  } catch (error: unknown) {
    const axiosError = error as { response?: { status?: number } };

    if (axiosError?.response?.status === 401) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    } else {
      console.error("認証チェックに失敗しました:", error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    }
  }
};
