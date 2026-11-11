/**
 * Tests Unitarios para el Servicio de Autenticación y Respaldo en la Nube
 * Al Día Colombia
 */
import { authService } from '../src/services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../src/lib/supabase';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('../src/lib/supabase', () => ({
  supabase: {
    rpc: jest.fn(),
    from: jest.fn(() => ({
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn().mockResolvedValue({ error: null }),
        })),
      })),
    })),
  },
  isSupabaseConfigured: jest.fn(() => true),
}));

describe('AuthService - Autenticación Híbrida y Sincronización', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginWithUsernameAndPin', () => {
    it('debe rechazar nombres de usuario de menos de 3 caracteres', async () => {
      const res = await authService.loginWithUsernameAndPin('ab', '1234');
      expect(res.success).toBe(false);
      expect(res.message).toContain('mínimo 3 caracteres');
    });

    it('debe rechazar PINs que no tengan exactamente 4 dígitos', async () => {
      const res1 = await authService.loginWithUsernameAndPin('carlos', '123');
      expect(res1.success).toBe(false);
      expect(res1.message).toContain('exactamente de 4 dígitos');

      const res2 = await authService.loginWithUsernameAndPin('carlos', 'abcd');
      expect(res2.success).toBe(false);
      expect(res2.message).toContain('exactamente de 4 dígitos');
    });

    it('debe iniciar sesión o registrar exitosamente con credenciales válidas', async () => {
      (supabase.rpc as jest.Mock).mockResolvedValueOnce({
        data: {
          success: true,
          is_new: false,
          account_id: 'acc-123',
          username: 'carlos',
          created_at: '2026-11-11T00:00:00Z',
        },
        error: null,
      });

      const res = await authService.loginWithUsernameAndPin('carlos', '4321');
      expect(res.success).toBe(true);
      expect(res.account?.id).toBe('acc-123');
      expect(res.account?.username).toBe('carlos');
      expect(res.account?.provider).toBe('username_pin');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@al_dia:auth_account',
        expect.stringContaining('acc-123')
      );
    });

    it('debe manejar error cuando el PIN es incorrecto en Supabase', async () => {
      (supabase.rpc as jest.Mock).mockResolvedValueOnce({
        data: {
          success: false,
          message: 'El PIN de 4 dígitos es incorrecto para el usuario @carlos.',
        },
        error: null,
      });

      const res = await authService.loginWithUsernameAndPin('carlos', '0000');
      expect(res.success).toBe(false);
      expect(res.message).toContain('incorrecto');
    });
  });

  describe('loginWithGoogle', () => {
    it('debe vincular exitosamente una cuenta de Google', async () => {
      (supabase.rpc as jest.Mock).mockResolvedValueOnce({
        data: {
          success: true,
          is_new: true,
          account_id: 'acc-google-456',
          email: 'usuario@gmail.com',
          display_name: 'Carlos Gómez',
          created_at: '2026-11-11T00:00:00Z',
        },
        error: null,
      });

      const res = await authService.loginWithGoogle({
        googleId: 'g_12345',
        email: 'usuario@gmail.com',
        name: 'Carlos Gómez',
      });

      expect(res.success).toBe(true);
      expect(res.account?.id).toBe('acc-google-456');
      expect(res.account?.provider).toBe('google');
      expect(res.account?.email).toBe('usuario@gmail.com');
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('syncVehicles', () => {
    it('debe sincronizar vehículos atómicamente con la nube', async () => {
      const mockVehicles = [
        {
          id: 'v1',
          alias: 'Mi Carro',
          vehicle_type: 'particular' as const,
          plate: 'ABC123',
          last_digit: '3',
          first_digit: '1',
          city_id: 'city-1',
          is_exempt: false,
          notify_previous_day: true,
          notify_same_day: true,
        },
      ];

      (supabase.rpc as jest.Mock).mockResolvedValueOnce({
        data: {
          success: true,
          vehicles: mockVehicles,
        },
        error: null,
      });

      const res = await authService.syncVehicles('acc-123', mockVehicles);
      expect(res.success).toBe(true);
      expect(res.vehicles.length).toBe(1);
      expect(res.vehicles[0].plate).toBe('ABC123');
    });
  });

  describe('logout y getSavedAccount', () => {
    it('debe leer y eliminar la cuenta local', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify({ id: 'acc-1', displayName: '@carlos', provider: 'username_pin' })
      );

      const saved = await authService.getSavedAccount();
      expect(saved?.id).toBe('acc-1');

      await authService.logout();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@al_dia:auth_account');
    });
  });
});

