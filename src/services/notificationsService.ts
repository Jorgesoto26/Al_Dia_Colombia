/**
 * Servicio Central de Alertas y Notificaciones Locales (Offline)
 * Al Día Colombia
 *
 * Utiliza @notifee/react-native con alarmas exactas nativas (Android AlarmManager / iOS Trigger)
 * - 100% Offline: No depende de servidores ni de conexión a internet.
 * - Puntual: Se dispara a las 7:00 PM del día anterior y a las 6:00 AM del mismo día.
 * - Inteligente: Consulta el motor de Pico y Placa; suprime alertas en festivos y exentos.
 */
import notifee, {
  AndroidImportance,
  AndroidColor,
  TriggerType,
  TimestampTrigger,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserVehicle } from '../types/picoYPlaca.types';
import { ColombianHoliday, PicoYPlacaRule } from '../types/database.types';
import { evaluatePicoYPlaca, normalizeDate } from '../utils/picoYPlacaEngine';

const NOTIFICATIONS_PREFS_KEY = '@al_dia:notifications_prefs';
export const NOTIFICATION_CHANNEL_ID = 'pico_y_placa_channel';

export interface NotificationSettings {
  enabled: boolean;
  notifyPreviousDay: boolean; // 7:00 PM
  notifySameDay: boolean; // 6:00 AM
}

export const defaultNotificationSettings: NotificationSettings = {
  enabled: true,
  notifyPreviousDay: true,
  notifySameDay: true,
};

export const notificationsService = {
  /**
   * Inicializa el canal de notificaciones nativo de Android (requerido desde Android 8.0 Oreo)
   */
  async initNotificationChannel(): Promise<void> {
    try {
      await notifee.createChannel({
        id: NOTIFICATION_CHANNEL_ID,
        name: 'Alertas de Pico y Placa',
        description: 'Notificaciones preventivas a las 7:00 PM (víspera) y 6:00 AM (mismo día).',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
        vibrationPattern: [300, 500, 300, 500],
        lights: true,
        lightColor: AndroidColor.BLUE,
      });
    } catch (e) {
      console.warn('[NotificationService] Error al inicializar canal de notificaciones:', e);
    }
  },

  /**
   * Solicita permisos de notificación al usuario (Android 13+ y iOS)
   */
  async requestPermission(): Promise<boolean> {
    try {
      const settings = await notifee.requestPermission();
      return settings.authorizationStatus >= 1; // 1 = Authorized, 2 = Provisional
    } catch (e) {
      console.warn('[NotificationService] Error al solicitar permisos:', e);
      return false;
    }
  },

  /**
   * Obtiene la configuración de notificaciones guardada
   */
  async getSettings(): Promise<NotificationSettings> {
    try {
      const raw = await AsyncStorage.getItem(NOTIFICATIONS_PREFS_KEY);
      return raw ? JSON.parse(raw) : defaultNotificationSettings;
    } catch {
      return defaultNotificationSettings;
    }
  },

  /**
   * Guarda las preferencias de notificación
   */
  async saveSettings(settings: NotificationSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_PREFS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('[NotificationService] Error al guardar configuración:', e);
    }
  },

  /**
   * Construye los textos de recordatorio para un vehículo
   */
  buildMessage(
    vehicle: UserVehicle,
    timing: 'previous_day' | 'same_day'
  ): { title: string; body: string } {
    const vType = vehicle.vehicle_type === 'moto' ? 'tu moto' : 'tu carro';
    const plateRef = vehicle.last_digit ? `placa terminada en ${vehicle.last_digit}` : vehicle.plate;

    if (timing === 'previous_day') {
      return {
        title: `⚠️ Mañana tienes Pico y Placa`,
        body: `Recuerda: ${vType} "${vehicle.alias}" (${plateRef}) tiene restricción mañana. ¡Planifica tu ruta!`,
      };
    }

    return {
      title: `🚫 Hoy rige Pico y Placa: ${vehicle.alias}`,
      body: `Atención: ${vType} "${vehicle.alias}" (${plateRef}) no puede circular hoy en su horario de restricción. Evita multas e inmovilización.`,
    };
  },

  /**
   * Cancela todas las alarmas programadas de un vehículo específico
   */
  async cancelVehicleReminders(vehicleId: string): Promise<void> {
    try {
      const triggers = await notifee.getTriggerNotificationIds();
      const prefix = `pyp_${vehicleId}_`;
      const toCancel = triggers.filter(id => id.startsWith(prefix));
      for (const id of toCancel) {
        await notifee.cancelNotification(id);
      }
    } catch (e) {
      console.warn('[NotificationService] Error al cancelar notificaciones:', e);
    }
  },

  /**
   * Programa las alarmas preventivas para un vehículo en los próximos 7 días
   */
  async scheduleVehicleReminders(
    vehicle: UserVehicle,
    holidays: ColombianHoliday[],
    rules: PicoYPlacaRule[]
  ): Promise<number> {
    // Si el vehículo está exento o tiene Pico y Placa Solidario, no genera alertas
    if (vehicle.is_exempt || (vehicle.exemption_type && vehicle.exemption_type !== 'ninguno')) {
      await this.cancelVehicleReminders(vehicle.id);
      return 0;
    }

    await this.initNotificationChannel();
    await this.cancelVehicleReminders(vehicle.id);

    const notifyPrev = vehicle.notify_previous_day ?? true;
    const notifySame = vehicle.notify_same_day ?? true;

    if (!notifyPrev && !notifySame) {
      return 0;
    }

    let scheduledCount = 0;
    const now = new Date();

    // Evaluar los próximos 7 días a partir de hoy
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset);
      const { dateStr } = normalizeDate(targetDate);

      // Evaluar si el vehículo tiene restricción en esa fecha
      const evaluation = evaluatePicoYPlaca({
        date: targetDate,
        cityId: vehicle.city_id,
        vehicleType: vehicle.vehicle_type,
        plateNumberOrDigit: vehicle.plate,
        holidays,
        rules,
        isExempt: vehicle.is_exempt,
        exemptionType: vehicle.exemption_type,
      });

      // Si tiene restricción en esa fecha, programar los recordatorios
      if (evaluation.isRestrictedToday) {
        // 1. Alerta día anterior (7:00 PM)
        if (notifyPrev) {
          const prevDayDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() - 1);
          prevDayDate.setHours(19, 0, 0, 0); // 7:00 PM

          if (prevDayDate.getTime() > Date.now()) {
            const msg = this.buildMessage(vehicle, 'previous_day');
            const trigger: TimestampTrigger = {
              type: TriggerType.TIMESTAMP,
              timestamp: prevDayDate.getTime(),
              alarmManager: {
                allowWhileIdle: true,
              },
            };

            await notifee.createTriggerNotification(
              {
                id: `pyp_${vehicle.id}_prev_${dateStr}`,
                title: msg.title,
                body: msg.body,
                android: {
                  channelId: NOTIFICATION_CHANNEL_ID,
                  importance: AndroidImportance.HIGH,
                  color: '#3B82F6',
                  pressAction: {
                    id: 'default',
                  },
                },
              },
              trigger
            );
            scheduledCount++;
          }
        }

        // 2. Alerta mismo día (6:00 AM)
        if (notifySame) {
          const sameDayDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
          sameDayDate.setHours(6, 0, 0, 0); // 6:00 AM

          if (sameDayDate.getTime() > Date.now()) {
            const msg = this.buildMessage(vehicle, 'same_day');
            const trigger: TimestampTrigger = {
              type: TriggerType.TIMESTAMP,
              timestamp: sameDayDate.getTime(),
              alarmManager: {
                allowWhileIdle: true,
              },
            };

            await notifee.createTriggerNotification(
              {
                id: `pyp_${vehicle.id}_same_${dateStr}`,
                title: msg.title,
                body: msg.body,
                android: {
                  channelId: NOTIFICATION_CHANNEL_ID,
                  importance: AndroidImportance.HIGH,
                  color: '#EF4444',
                  pressAction: {
                    id: 'default',
                  },
                },
              },
              trigger
            );
            scheduledCount++;
          }
        }
      }
    }

    return scheduledCount;
  },

  /**
   * Reprograma las alertas para todos los vehículos del usuario
   */
  async rescheduleAllVehicles(
    vehicles: UserVehicle[],
    holidays: ColombianHoliday[],
    rules: PicoYPlacaRule[]
  ): Promise<number> {
    let totalScheduled = 0;
    for (const vehicle of vehicles) {
      const count = await this.scheduleVehicleReminders(vehicle, holidays, rules);
      totalScheduled += count;
    }
    return totalScheduled;
  },

  /**
   * Envía una notificación de prueba inmediata para validar que sonido, vibración y display funcionen
   */
  async sendTestNotification(vehicle?: UserVehicle): Promise<void> {
    await this.initNotificationChannel();
    await this.requestPermission();

    const vName = vehicle ? `"${vehicle.alias}" (${vehicle.plate})` : 'tus vehículos';

    await notifee.displayNotification({
      title: '🔔 Al Día Colombia - Alerta de Prueba',
      body: `El sistema de alertas automáticas para ${vName} está activo. Te avisaremos a las 7:00 PM y 6:00 AM.`,
      android: {
        channelId: NOTIFICATION_CHANNEL_ID,
        importance: AndroidImportance.HIGH,
        color: '#3B82F6',
        pressAction: {
          id: 'default',
        },
      },
    });
  },
};

// Compatibilidad con imports antiguos
export const buildReminderMessage = notificationsService.buildMessage;
export const getNotificationSettings = notificationsService.getSettings;
export const saveNotificationSettings = notificationsService.saveSettings;
