import { LoginRequest, TokenPair } from './generated/model'
import { usePOSTApiV1AuthLogin } from './generated/client'
import { AxiosError } from 'axios'

interface AuthError {
  message: string
}

export const useLogin = () => {
  const mutation = usePOSTApiV1AuthLogin()

  const login = async (loginRequest: LoginRequest): Promise<TokenPair> => {
    try {
      return await mutation.trigger(loginRequest)
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error
      }
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
