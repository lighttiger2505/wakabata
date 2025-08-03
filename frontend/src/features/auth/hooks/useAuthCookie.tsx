"use client";

import { 
  getAuthState, 
  setAuthState, 
  login as authLogin, 
  logout as authLogout, 
  checkAuth as authCheckAuth,
  type AuthState 
} from "@/lib/auth-utils";
import { useCallback, useEffect, useState } from "react";

export const useAuth = () => {
  const [authState, setLocalAuthState] = useState<AuthState>(() => getAuthState());

  // Cookie changes を監視するためのポーリング
  useEffect(() => {
    const checkForChanges = () => {
      const currentState = getAuthState();
      setLocalAuthState(currentState);
    };

    const interval = setInterval(checkForChanges, 1000);
    return () => clearInterval(interval);
  }, []);

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

  return {
    ...authState,
    login,
    logout,
    checkAuth,
  };
};