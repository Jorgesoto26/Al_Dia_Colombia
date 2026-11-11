/**
 * Contexto Global de Autenticación y Cuentas de Usuario
 * Al Día Colombia
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserAccount, AuthResponse } from '../types/auth.types';
import { authService } from '../services/authService';

interface AuthContextType {
  account: UserAccount | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithUsernameAndPin: (username: string, pin: string) => Promise<AuthResponse>;
  loginWithGoogle: (googleUser: { googleId: string; email: string; name?: string }) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshAccount = useCallback(async () => {
    try {
      setIsLoading(true);
      const saved = await authService.getSavedAccount();
      setAccount(saved);
    } catch (e) {
      console.warn('[AuthContext] Error cargando cuenta:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAccount();
  }, [refreshAccount]);

  const loginWithUsernameAndPin = async (username: string, pin: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await authService.loginWithUsernameAndPin(username, pin);
      if (res.success && res.account) {
        setAccount(res.account);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (googleUser: {
    googleId: string;
    email: string;
    name?: string;
  }): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await authService.loginWithGoogle(googleUser);
      if (res.success && res.account) {
        setAccount(res.account);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setAccount(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        account,
        isAuthenticated: !!account,
        isLoading,
        loginWithUsernameAndPin,
        loginWithGoogle,
        logout,
        refreshAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

