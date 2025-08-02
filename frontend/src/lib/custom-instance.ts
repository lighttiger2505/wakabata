import Axios from "axios";
import type { AxiosError, AxiosRequestConfig } from "axios";
import { getCookieValue, removeCookieValue, setCookieValue } from "./cookie-utils";

export const AXIOS_INSTANCE = Axios.create({ baseURL: process.env.NEXT_PUBLIC_API_HOST });

// インターセプターを追加して認証トークンを設定
AXIOS_INSTANCE.interceptors.request.use((config) => {
  // auth-storageからトークンを取得
  const authStorage = getCookieValue("auth-storage");
  if (authStorage) {
    try {
      const { state } = JSON.parse(authStorage);
      if (state.token?.access_token) {
        config.headers.Authorization = `Bearer ${state.token.access_token}`;
      }
    } catch (error) {
      console.error("Failed to parse auth storage from cookie:", error);
    }
  }
  return config;
});

// レスポンスインターセプターを追加してエラーハンドリング
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401エラーの場合、トークンをリフレッシュして再試行
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const authStorage = getCookieValue("auth-storage");
        if (authStorage) {
          const { state } = JSON.parse(authStorage);
          if (state.token?.refresh_token) {
            // リフレッシュトークンを使用して新しいトークンを取得
            const response = await AXIOS_INSTANCE.post("/api/v1/auth/refresh", {
              refresh_token: state.token.refresh_token,
            });

            const { access_token, refresh_token } = response.data;

            // 新しいトークンを保存
            const newState = {
              ...state,
              token: { access_token, refresh_token },
            };
            setCookieValue("auth-storage", JSON.stringify({ state: newState }), {
              httpOnly: false, // クライアントサイドからアクセス可能にする
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 60 * 60 * 24 * 7, // 7 days
            });

            // 元のリクエストを再試行
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return AXIOS_INSTANCE(originalRequest);
          }
        }
      } catch (refreshError) {
        // リフレッシュに失敗した場合、認証情報をクリアしてログインページにリダイレクト
        // middlewareが適切なリダイレクトを処理する
        removeCookieValue("auth-storage");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export const customInstance = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
