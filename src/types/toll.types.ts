/**
 * Tipos de Datos para Peajes y Corredores Viales (INVIAS / ANI)
 * Al Día Colombia
 */

export type VehicleCategory = 'I' | 'II' | 'III' | 'IV' | 'V';

export type VehicleCategoryFilter = VehicleCategory | 'MOTO';

export type TollOperator = 'INVIAS' | 'ANI' | 'CONCESION';

export interface VehicleCategoryInfo {
  category: VehicleCategoryFilter;
  name: string;
  description: string;
  shortLabel: string;
  icon: string;
  isExempt?: boolean;
}

export interface TollStation {
  id: string;
  name: string;
  operator: TollOperator;
  concessionName: string;
  department: string;
  sector: string;
  highwayNumber?: string;
  prices: Record<VehicleCategory, number>;
  emergencyPhone: string;
  hasColpass: boolean; // Tag electrónico Colpass / Gopass / Flypass / FacilPass
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface CorridorRoute {
  id: string;
  name: string;
  originCityId: string;
  originCityName: string;
  destination: string;
  distanceKm: number;
  estimatedTime: string;
  tolls: TollStation[];
  highlights?: string[];
  tips?: string[];
}

export interface TollBreakdownItem {
  toll: TollStation;
  pricePerPass: number;
  totalForTrip: number;
}

export interface RouteCalculationResult {
  route: CorridorRoute;
  category: VehicleCategoryFilter;
  categoryInfo: VehicleCategoryInfo;
  isRoundTrip: boolean;
  tollCount: number;
  totalOneWay: number;
  totalTrip: number;
  tollsBreakdown: TollBreakdownItem[];
  hasExemptionNotice?: boolean;
}

