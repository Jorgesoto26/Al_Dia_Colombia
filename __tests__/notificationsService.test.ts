/**
 * Tests Unitarios para el Servicio de Notificaciones y Alarmas de Pico y Placa
 * Al Día Colombia
 */
import { notificationsService } from '../src/services/notificationsService';
import notifee from '@notifee/react-native';
import { UserVehicle } from '../src/types/picoYPlaca.types';
import { ColombianHoliday, PicoYPlacaRule } from '../src/types/database.types';

jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    createChannel: jest.fn().mockResolvedValue(undefined),
    requestPermission: jest.fn().mockResolvedValue({ authorizationStatus: 1 }),
    getTriggerNotificationIds: jest.fn().mockResolvedValue([]),
    createTriggerNotification: jest.fn().mockResolvedValue('notif-id'),
    cancelNotification: jest.fn().mockResolvedValue(undefined),
    displayNotification: jest.fn().mockResolvedValue('display-id'),
  },
  AndroidImportance: {
    HIGH: 4,
    DEFAULT: 3,
  },
  AndroidColor: {
    BLUE: '#0000FF',
  },
  TriggerType: {
    TIMESTAMP: 0,
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('NotificationsService - Alarmas y Recordatorios', () => {
  const mockVehicle: UserVehicle = {
    id: 'veh-1',
    alias: 'Mi Spark',
    vehicle_type: 'particular',
    plate: 'ABC123',
    last_digit: '3',
    first_digit: '1',
    city_id: '11111111-1111-1111-1111-111111111111', // Bogotá
    notify_previous_day: true,
    notify_same_day: true,
  };

  const mockHolidays: ColombianHoliday[] = [];
  const mockRules: PicoYPlacaRule[] = [
    {
      id: 'rule-1',
      city_id: '11111111-1111-1111-1111-111111111111',
      vehicle_type: 'particular',
      day_of_week: 1, // Lunes
      rule_type: 'last_digit',
      restricted_digits: ['1', '2', '3', '4', '5'],
      start_time: '06:00:00',
      end_time: '21:00:00',
      updated_at: '2026-01-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buildMessage', () => {
    it('debe construir el mensaje correcto para la víspera (7:00 PM)', () => {
      const msg = notificationsService.buildMessage(mockVehicle, 'previous_day');
      expect(msg.title).toContain('Mañana tienes Pico y Placa');
      expect(msg.body).toContain('Mi Spark');
      expect(msg.body).toContain('3');
    });

    it('debe construir el mensaje correcto para el mismo día (6:00 AM)', () => {
      const msg = notificationsService.buildMessage(mockVehicle, 'same_day');
      expect(msg.title).toContain('Hoy rige Pico y Placa');
      expect(msg.body).toContain('Mi Spark');
    });
  });

  describe('scheduleVehicleReminders', () => {
    it('no debe programar alarmas si el vehículo está exento', async () => {
      const exemptVehicle: UserVehicle = {
        ...mockVehicle,
        is_exempt: true,
        exemption_type: 'electrico_hibrido',
      };

      const count = await notificationsService.scheduleVehicleReminders(
        exemptVehicle,
        mockHolidays,
        mockRules
      );

      expect(count).toBe(0);
      expect(notifee.createTriggerNotification).not.toHaveBeenCalled();
    });

    it('debe inicializar el canal y programar alarmas para vehículos restringidos', async () => {
      await notificationsService.scheduleVehicleReminders(
        mockVehicle,
        mockHolidays,
        mockRules
      );

      expect(notifee.createChannel).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'pico_y_placa_channel',
          importance: 4,
        })
      );
    });
  });

  describe('cancelVehicleReminders', () => {
    it('debe cancelar notificaciones con el prefijo del vehículo', async () => {
      (notifee.getTriggerNotificationIds as jest.Mock).mockResolvedValueOnce([
        'pyp_veh-1_prev_2026-11-12',
        'pyp_veh-1_same_2026-11-12',
        'pyp_veh-2_prev_2026-11-12',
      ]);

      await notificationsService.cancelVehicleReminders('veh-1');

      expect(notifee.cancelNotification).toHaveBeenCalledWith('pyp_veh-1_prev_2026-11-12');
      expect(notifee.cancelNotification).toHaveBeenCalledWith('pyp_veh-1_same_2026-11-12');
      expect(notifee.cancelNotification).not.toHaveBeenCalledWith('pyp_veh-2_prev_2026-11-12');
    });
  });

  describe('sendTestNotification', () => {
    it('debe mostrar una notificación inmediata de prueba con Notifee', async () => {
      await notificationsService.sendTestNotification(mockVehicle);

      expect(notifee.displayNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining('Alerta de Prueba'),
          body: expect.stringContaining('Mi Spark'),
        })
      );
    });
  });
});

