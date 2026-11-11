/**
 * Tipos de Datos Oficiales - Módulo de Combustibles y Estaciones de Servicio (SICOM / MinMinas)
 * Al Día Colombia
 */

export type FuelType = 'corriente' | 'extra' | 'diesel' | 'gnv';

export interface FuelProductMeta {
  type: FuelType;
  name: string;
  shortName: string;
  badge: string;
  unit: string;
  color: string;
  description: string;
}

export interface FuelStation {
  id: string;
  name: string;
  brand: 'TERPEL' | 'TEXACO' | 'PRIMAX' | 'BIOMAX' | 'CHEVRON' | 'MOBIL' | 'PETROBRAS' | 'ZEUSS' | 'OTRO';
  city_id: string;
  city_name: string;
  department: string;
  address: string;
  prices: Record<FuelType, number>;
  services: string[];
  is_cheapest?: Partial<Record<FuelType, boolean>>;
  latitude?: number;
  longitude?: number;
  last_updated: string;
}

export interface CityFuelBenchmark {
  city_id: string;
  city_name: string;
  department: string;
  corriente: number;
  extra: number;
  diesel: number;
  gnv: number;
  effective_period: string;
  source: string;
}

export interface TankCalculationResult {
  fuelType: FuelType;
  fuelName: string;
  mode: 'budget' | 'gallons';
  inputValue: number;
  pricePerGallon: number;
  gallonsReceived: number;
  totalCost: number;
  estimatedKilometers: number;
  autonomyKmPerGallon: number;
  potentialSavings: number;
}

