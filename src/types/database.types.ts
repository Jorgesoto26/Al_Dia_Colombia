export type VehicleType = 'particular' | 'moto' | 'taxi';
export type RuleType = 'last_digit' | 'first_digit' | 'even_odd_date';

export interface City {
  id: string;
  name: string;
  slug: string;
  department?: string;
  is_active: boolean;
  created_at?: string;
}

export interface PicoYPlacaRule {
  id: string;
  city_id: string;
  vehicle_type: VehicleType;
  day_of_week: number; // 1 = Lunes, ..., 7 = Domingo
  rule_type: RuleType;
  restricted_digits: string[]; // e.g. ['1', '2']
  start_time: string; // '06:00:00'
  end_time: string; // '20:00:00'
  notes?: string | null;
  updated_at?: string;
}

export interface ColombianHoliday {
  date: string; // 'YYYY-MM-DD'
  name: string;
  is_bridge: boolean;
  created_at?: string;
}

export interface EconomicIndicator {
  key: string;
  name: string;
  value: number;
  formatted_value: string;
  unit?: string | null;
  notes?: string | null;
  updated_at?: string;
}

export interface TRMResponse {
  valor: string; // e.g. "4125.50"
  unidad: string; // "COP"
  vigenciadesde: string; // "2026-11-10T00:00:00.000"
  vigenciahasta: string; // "2026-11-10T00:00:00.000"
}

export interface TRMData {
  value: number;
  formatted: string;
  date: string;
  variation?: number;
  source: 'api' | 'cache' | 'fallback';
}

