/**
 * Tipos de Datos para Insumos Agropecuarios y Canasta Familiar (SIPSA / DANE)
 * Al Día Colombia
 */

export type AgroCategory =
  | 'tuberculos'
  | 'verduras'
  | 'frutas'
  | 'carnes'
  | 'granos'
  | 'insumos';

export type PriceTrend = 'down' | 'up' | 'stable';

export type SupplyStatus = 'abundante' | 'normal' | 'escaso';

export interface AgroCategoryMeta {
  id: AgroCategory;
  name: string;
  icon: string;
  description: string;
}

export interface WholesaleMarket {
  id: string;
  name: string;
  cityId: string;
  cityName: string;
  department: string;
  shortName: string;
  isMainHub?: boolean;
}

export interface AgroProduct {
  id: string;
  name: string;
  category: AgroCategory;
  marketId: string;
  marketName: string;
  // Precios mayoristas (bulto, saco, canastilla, etc.)
  wholesalePrice: number;
  wholesaleUnit: string;
  // Equivalencia estimada al detal por kilo o libra para el hogar
  retailPriceEquivalent: number;
  retailUnit: string;
  previousPrice: number;
  changePercentage: number;
  trend: PriceTrend;
  supply: SupplyStatus;
  originDepartment: string;
  quality: string;
  notes?: string;
}

export interface AgroBasketItem {
  product: AgroProduct;
  quantityUnits: number; // Cantidad en unidades de detal (ej. kilos, libras)
  estimatedWholesaleCost: number;
  estimatedRetailCost: number;
  savings: number;
}

export interface AgroBasketSummary {
  items: AgroBasketItem[];
  totalWholesaleCost: number;
  totalRetailCost: number;
  totalSavings: number;
  savingsPercentage: number;
}

