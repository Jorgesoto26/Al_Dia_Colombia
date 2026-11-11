/**
 * Servicio de Autenticación y Sincronización en la Nube
 * Al Día Colombia
 *
 * Soporta:
 * 1. Nombre de usuario + PIN de 4 dígitos (con hash en Supabase)
 * 2. Autenticación con Google
 * 3. Sincronización bidireccional de vehículos con la nube
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserAccount, AuthResponse } from '../types/auth.types';
import { UserVehicle } from '../types/picoYPlaca.types';

const AUTH_STORAGE_KEY = '@al_dia:auth_account';

export const authService = {
  /**
   * Obtiene la cuenta actualmente guardada en la sesión local del dispositivo
   */
  async getSavedAccount(): Promise<UserAccount | null> {
    try {
      const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[AuthService] Error al leer cuenta local:', e);
      return null;
    }
  },

  /**
   * Guarda la cuenta en almacenamiento local
   */
  async saveAccountLocally(account: UserAccount): Promise<void> {
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(account));
    } catch (e) {
      console.warn('[AuthService] Error al guardar cuenta local:', e);
    }
  },

  /**
   * Cierra la sesión activa
   */
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.warn('[AuthService] Error al cerrar sesión:', e);
    }
  },

  /**
   * Inicio de sesión o Registro automático con Usuario y PIN de 4 dígitos
   */
  async loginWithUsernameAndPin(username: string, pin: string): Promise<AuthResponse> {
    const cleanUser = username.trim().toLowerCase().replace(/^@/, '');
    const cleanPin = pin.trim();

    if (cleanUser.length < 3) {
      return {
        success: false,
        message: 'El nombre de usuario debe tener mínimo 3 caracteres.',
      };
    }

    if (cleanPin.length !== 4 || !/^\d{4}$/.test(cleanPin)) {
      return {
        success: false,
        message: 'El PIN debe ser exactamente de 4 dígitos numéricos.',
      };
    }

    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message: 'No hay conexión con la nube de Supabase configurada.',
      };
    }

    try {
      const { data, error } = await supabase.rpc('login_or_register_pin_user', {
        p_username: cleanUser,
        p_pin: cleanPin,
      });

      if (error) {
        console.warn('[AuthService] Error en RPC login_or_register_pin_user:', error);
        return {
          success: false,
          message: error.message || 'Error de conexión con el servidor.',
        };
      }

      if (!data || !data.success) {
        return {
          success: false,
          message: data?.message || 'No fue posible iniciar sesión.',
        };
      }

      const account: UserAccount = {
        id: data.account_id,
        username: data.username,
        displayName: `@${data.username}`,
        provider: 'username_pin',
        createdAt: data.created_at || new Date().toISOString(),
      };

      await this.saveAccountLocally(account);

      return {
        success: true,
        isNew: data.is_new,
        account,
        message: data.is_new
          ? `¡Cuenta creada con éxito! Bienvenido, @${data.username}.`
          : `¡Sesión iniciada con éxito! Bienvenido de nuevo, @${data.username}.`,
      };
    } catch (err: any) {
      console.warn('[AuthService] Excepción en loginWithUsernameAndPin:', err);
      return {
        success: false,
        message: err.message || 'Error inesperado de red al contactar a Supabase.',
      };
    }
  },

  /**
   * Inicio de sesión o Registro con cuenta Google
   */
  async loginWithGoogle(googleUser: {
    googleId: string;
    email: string;
    name?: string;
  }): Promise<AuthResponse> {
    if (!googleUser.googleId || !googleUser.email) {
      return {
        success: false,
        message: 'Datos de cuenta Google incompletos.',
      };
    }

    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message: 'No hay conexión con la nube de Supabase configurada.',
      };
    }

    try {
      const { data, error } = await supabase.rpc('login_or_register_google_user', {
        p_google_id: googleUser.googleId,
        p_email: googleUser.email.trim().toLowerCase(),
        p_name: googleUser.name || googleUser.email.split('@')[0],
      });

      if (error) {
        console.warn('[AuthService] Error en RPC login_or_register_google_user:', error);
        return {
          success: false,
          message: error.message || 'Error de conexión con el servidor.',
        };
      }

      if (!data || !data.success) {
        return {
          success: false,
          message: data?.message || 'No fue posible iniciar sesión con Google.',
        };
      }

      const account: UserAccount = {
        id: data.account_id,
        email: data.email,
        displayName: data.display_name || data.email,
        provider: 'google',
        createdAt: data.created_at || new Date().toISOString(),
      };

      await this.saveAccountLocally(account);

      return {
        success: true,
        isNew: data.is_new,
        account,
        message: data.is_new
          ? '¡Cuenta vinculada con éxito con Google!'
          : '¡Sesión iniciada con Google!',
      };
    } catch (err: any) {
      console.warn('[AuthService] Excepción en loginWithGoogle:', err);
      return {
        success: false,
        message: err.message || 'Error inesperado de red al conectar con Google.',
      };
    }
  },

  /**
   * Sincroniza atómicamente los vehículos del usuario con la nube de Supabase
   */
  async syncVehicles(
    accountId: string,
    localVehicles: UserVehicle[]
  ): Promise<{ success: boolean; vehicles: UserVehicle[]; message?: string }> {
    if (!accountId) {
      return { success: false, vehicles: localVehicles, message: 'Usuario no autenticado' };
    }

    try {
      const { data, error } = await supabase.rpc('sync_account_vehicles', {
        p_account_id: accountId,
        p_local_vehicles: localVehicles,
      });

      if (error) {
        console.warn('[AuthService] Error al sincronizar vehículos:', error);
        return { success: false, vehicles: localVehicles, message: error.message };
      }

      if (!data || !data.success || !Array.isArray(data.vehicles)) {
        return {
          success: false,
          vehicles: localVehicles,
          message: data?.message || 'Respuesta inválida del servidor.',
        };
      }

      const cloudVehicles: UserVehicle[] = data.vehicles.map((v: any) => ({
        id: v.id,
        alias: v.alias,
        vehicle_type: v.vehicle_type,
        plate: v.plate,
        last_digit: v.last_digit,
        first_digit: v.first_digit,
        city_id: v.city_id,
        is_exempt: v.is_exempt,
        exemption_type: v.exemption_type,
        notify_previous_day: v.notify_previous_day,
        notify_same_day: v.notify_same_day,
        is_favorite: v.is_favorite,
      }));

      return {
        success: true,
        vehicles: cloudVehicles,
        message: 'Vehículos sincronizados con la nube correctamente.',
      };
    } catch (err: any) {
      console.warn('[AuthService] Excepción al sincronizar vehículos:', err);
      return { success: false, vehicles: localVehicles, message: err.message };
    }
  },

  /**
   * Elimina un vehículo en la nube cuando el usuario lo borra localmente
   */
  async deleteCloudVehicle(accountId: string, plate: string): Promise<void> {
    if (!accountId || !plate) return;

    try {
      await supabase
        .from('user_vehicles')
        .delete()
        .eq('account_id', accountId)
        .eq('plate', plate.trim().toUpperCase());
    } catch (e) {
      console.warn('[AuthService] Error al eliminar vehículo en nube:', e);
    }
  },
};

