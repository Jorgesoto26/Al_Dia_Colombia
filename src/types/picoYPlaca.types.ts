import { VehicleType, RuleType, PicoYPlacaRule, ColombianHoliday } from './database.types';

export type RestrictionStatus =
  | 'LIBRE'
  | 'ACTIVA'
  | 'PROXIMA_A_INICIAR'
  | 'FINALIZADA'
  | 'FESTIVO_SIN_RESTRICCION'
  | 'FIN_DE_SEMANA_SIN_RESTRICCION'
  | 'EXENTO';

export type ExemptionType = 'ninguno' | 'electrico_hibrido' | 'solidario';

export interface UserVehicle {
  id: string;
  alias: string;
  vehicle_type: VehicleType;
  plate: string; // Ej: "ABC123" o "XYZ45D"
  last_digit: string; // Extraído automáticamente
  first_digit: string; // Extraído para motos en ciudades como Medellín
  city_id: string;
  is_exempt?: boolean; // Híbrido, eléctrico o permiso solidario
  exemption_type?: ExemptionType;
  notify_previous_day?: boolean; // Notificación 7:00 PM
  notify_same_day?: boolean; // Notificación 6:00 AM
  is_favorite?: boolean;
}

export interface EngineResult {
  status: RestrictionStatus;
  isRestrictedNow: boolean; // Si la restricción rige en este momento
  isRestrictedToday: boolean; // Si hoy le toca restricción en cualquier horario
  title: string;
  subtitle: string;
  message: string;
  badgeText: string;
  colorType: 'success' | 'danger' | 'warning' | 'info';
  relevantDigit: string;
  startTime?: string;
  endTime?: string;
  timeRemaining?: {
    hours: number;
    minutes: number;
    formatted: string;
  };
  holidayInfo?: ColombianHoliday;
  matchedRule?: PicoYPlacaRule;
}

export interface CitySummaryVehicleGroup {
  vehicleType: VehicleType;
  label: string;
  restrictedDigits: string[];
  schedule: string;
  ruleType: RuleType;
  notes?: string | null;
}

export interface CityDaySummary {
  cityId: string;
  date: string;
  isHoliday: boolean;
  holidayName?: string;
  isWeekend: boolean;
  hasRestriction: boolean;
  groups: CitySummaryVehicleGroup[];
}

