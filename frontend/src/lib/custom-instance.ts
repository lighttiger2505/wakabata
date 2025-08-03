import Axios from "axios";
import type { AxiosError, AxiosRequestConfig } from "axios";
import {
  getAccessTokenForAxios,
  getGlobalRefreshFunction,
  isRefreshingForAxios,
  shouldRefreshTokenForAxios,
} from "./auth-manager";

export const AXIOS_INSTANCE = Axios.create({ baseURL: process.env.NEXT_PUBLIC_API_HOST });

// インターセプターを追加して認証トークンを設定
AXIOS_INSTANCE.interceptors.request.use(async (config) => {
  const refreshFunction = getGlobalRefreshFunction();

  // リフレッシュ処理中の場合は待機
  if (isRefreshingForAxios() && refreshFunction) {
    try {
      const { access_token } = await refreshFunction();
      config.headers.Authorization = `Bearer ${access_token}`;
      return config;
    } catch {
      // リフレッシュ失敗時はトークンなしで続行
      return config;
    }
  }

  // トークンの期限をチェックし、必要に応じてリフレッシュ
  if (shouldRefreshTokenForAxios() && refreshFunction) {
    try {
      const { access_token } = await refreshFunction();
      config.headers.Authorization = `Bearer ${access_token}`;
      return config;
    } catch {
      // リフレッシュ失敗時はトークンなしで続行
      return config;
    }
  }

  // 通常のトークン設定
  const accessToken = getAccessTokenForAxios();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// レスポンスインターセプターを追加してエラーハンドリング
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshFunction = getGlobalRefreshFunction();

    // 401エラーの場合、トークンをリフレッシュして再試行
    if (error.response?.status === 401 && !originalRequest._retry && refreshFunction) {
      originalRequest._retry = true;

      try {
        // グローバルリフレッシュ関数を使用してリフレッシュ
        const { access_token } = await refreshFunction();

        // 元のリクエストを再試行
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return AXIOS_INSTANCE(originalRequest);
      } catch (refreshError) {
        // リフレッシュに失敗した場合、ログインページにリダイレクト
        // middlewareが適切なリダイレクトを処理する
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
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
