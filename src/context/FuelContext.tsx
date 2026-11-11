/**
 * Contexto de Combustibles y Estaciones de Servicio (SICOM / MinMinas)
 * Al Día Colombia - Offline-First
 */
import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  FuelType,
  FuelStation,
  CityFuelBenchmark,
  TankCalculationResult,
} from '../types/fuel.types';
import { fuelService, EMBEDDED_BENCHMARKS } from '../services/fuelService';
import { useVehicles } from './VehicleContext';
import { VehicleType } from '../types/database.types';

interface FuelContextData {
  selectedFuelType: FuelType;
  setSelectedFuelType: (type: FuelType) => void;
  stations: FuelStation[];
  benchmark: CityFuelBenchmark;
  cheapestStation: FuelStation | null;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  refreshFuelData: () => Promise<void>;
  calculate: (amount: number, mode: 'budget' | 'gallons', vehicleType?: VehicleType) => TankCalculationResult;
  formatCOP: (val: number) => string;
}

const FuelContext = createContext<FuelContextData>({} as FuelContextData);

export const FuelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { selectedCity, vehicles } = useVehicles();
  const [selectedFuelType, setSelectedFuelType] = useState<FuelType>('corriente');
  const [stations, setStations] = useState<FuelStation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const cityId = selectedCity?.id || '11111111-1111-1111-1111-111111111111';

  const loadStations = async () => {
    setIsLoading(true);
    try {
      const data = await fuelService.getStationsByCity(cityId, selectedFuelType, 'cheapest');
      setStations(data);
    } catch {
      // Offline fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStations();
  }, [cityId, selectedFuelType]);

  const benchmark = useMemo(() => {
    return fuelService.getCityBenchmark(cityId);
  }, [cityId]);

  const cheapestStation = useMemo(() => {
    if (stations.length === 0) return null;
    return [...stations].sort(
      (a, b) => (a.prices[selectedFuelType] || 0) - (b.prices[selectedFuelType] || 0)
    )[0];
  }, [stations, selectedFuelType]);

  const filteredStations = useMemo(() => {
    if (!searchQuery.trim()) return stations;
    const q = searchQuery.toLowerCase().trim();
    return stations.filter(
      s =>
        s.name.toLowerCase().includes(q) ||
        s.brand.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
    );
  }, [stations, searchQuery]);

  const calculate = (
    amount: number,
    mode: 'budget' | 'gallons' = 'budget',
    vehicleType: VehicleType = 'particular'
  ): TankCalculationResult => {
    const activePrice = cheapestStation?.prices[selectedFuelType] || benchmark[selectedFuelType];
    return fuelService.calculateTanking(
      selectedFuelType,
      vehicleType,
      amount,
      mode,
      activePrice
    );
  };

  return (
    <FuelContext.Provider
      value={{
        selectedFuelType,
        setSelectedFuelType,
        stations: filteredStations,
        benchmark,
        cheapestStation,
        isLoading,
        searchQuery,
        setSearchQuery,
        refreshFuelData: loadStations,
        calculate,
        formatCOP: fuelService.formatCOP,
      }}
    >
      {children}
    </FuelContext.Provider>
  );
};

export const useFuel = (): FuelContextData => {
  const context = useContext(FuelContext);
  if (!context) {
    throw new Error('useFuel debe ser utilizado dentro de un FuelProvider');
  }
  return context;
};

