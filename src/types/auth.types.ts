/**
 * Tipos de Autenticación y Sincronización en la Nube
 * Al Día Colombia
 */

export type AuthProviderType = 'username_pin' | 'google';

export interface UserAccount {
  id: string;
  username?: string;
  email?: string;
  displayName: string;
  provider: AuthProviderType;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  isNew?: boolean;
  account?: UserAccount;
}

export interface SyncVehiclesResponse {
  success: boolean;
  message?: string;
  vehicles?: any[];
}

