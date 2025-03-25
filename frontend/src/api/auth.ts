import { LoginRequest, TokenPair } from './generated/model'
import { usePOSTApiV1AuthLogin } from './generated/client'
import { AxiosError } from 'axios'

interface AuthError {
  message: string
}

// 開発環境用のモックハンドラー
const mockLoginHandler = async (loginRequest: LoginRequest): Promise<TokenPair> => {
  await new Promise((resolve) => setTimeout(resolve, 1000)) // 1秒の遅延

  if (loginRequest.email === 'test@example.com' && loginRequest.password === 'password') {
    return {
      access_token: 'mock_access_token',
      refresh_token: 'mock_refresh_token',
    }
  }

  const error = new Error('メールアドレスまたはパスワードが正しくありません') as AxiosError<AuthError>
  error.response = {
    data: { message: 'メールアドレスまたはパスワードが正しくありません' },
    status: 401,
    statusText: 'Unauthorized',
    headers: {},
    config: {} as any,
  }
  throw error
}

// SWRのmutationフックを使用してログイン処理を行う
export const useLogin = () => {
  const mutation = usePOSTApiV1AuthLogin()

  const login = async (loginRequest: LoginRequest): Promise<TokenPair> => {
    try {
      if (process.env.NODE_ENV === 'development') {
        return await mockLoginHandler(loginRequest)
      }
      return await mutation.trigger(loginRequest)
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error
      }
      // その他のエラーをAxiosErrorに変換
      const axiosError = new Error('ログインに失敗しました') as AxiosError<AuthError>
      axiosError.response = {
        data: { message: 'ログインに失敗しました' },
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as any,
      }
      throw axiosError
    }
  }

  return {
    login,
    isLoading: mutation.isMutating,
  }
}