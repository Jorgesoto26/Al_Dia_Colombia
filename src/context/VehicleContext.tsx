/**
 * Contexto Global de Vehículos, Ciudad Activa y Datos de Restricción
 * Al Día Colombia
 */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserVehicle, EngineResult, CityDaySummary } from '../types/picoYPlaca.types';
import { City, PicoYPlacaRule, ColombianHoliday, EconomicIndicator, TRMData } from '../types/database.types';
import { vehicleStorage, cacheService } from '../database/storage';
import { authService } from '../services/authService';
import { notificationsService } from '../services/notificationsService';
import {
  getCities,
  getPicoYPlacaRules,
  getColombianHolidays,
  getEconomicIndicators,
  syncAllRemoteData,
  EMBEDDED_CITIES,
} from '../services/supabaseService';
import { getTRMHoy } from '../services/trmService';
import { evaluatePicoYPlaca, getCityDaySummary } from '../utils/picoYPlacaEngine';

interface VehicleContextType {
  vehicles: UserVehicle[];
  favoriteVehicle: UserVehicle | null;
  activeVehicle: UserVehicle | null;
  selectedCity: City;
  cities: City[];
  rules: PicoYPlacaRule[];
  holidays: ColombianHoliday[];
  indicators: EconomicIndicator[];
  trm: TRMData | null;
  loading: boolean;
  isSyncing: boolean;
  evaluation: EngineResult | null;
  citySummary: CityDaySummary | null;

  // Acciones
  addVehicle: (vehicle: Omit<UserVehicle, 'id'>) => Promise<UserVehicle>;
  updateVehicle: (vehicle: UserVehicle) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  setFavorite: (id: string) => Promise<void>;
  setActiveVehicleId: (id: string) => void;
  changeCity: (city: City) => Promise<void>;
  syncData: () => Promise<string>;
  syncCloudVehicles: () => Promise<void>;
  sendTestNotification: () => Promise<void>;
  refreshEvaluation: () => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<UserVehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<City>(EMBEDDED_CITIES[0]); // Por defecto Bogotá D.C.
  const [cities, setCities] = useState<City[]>(EMBEDDED_CITIES);
  const [rules, setRules] = useState<PicoYPlacaRule[]>([]);
  const [holidays, setHolidays] = useState<ColombianHoliday[]>([]);
  const [indicators, setIndicators] = useState<EconomicIndicator[]>([]);
  const [trm, setTrm] = useState<TRMData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Estados derivados evaluados por el motor
  const [evaluation, setEvaluation] = useState<EngineResult | null>(null);
  const [citySummary, setCitySummary] = useState<CityDaySummary | null>(null);

  const favoriteVehicle = vehicles.find(v => v.is_favorite) || vehicles[0] || null;
  const activeVehicle =
    (selectedVehicleId ? vehicles.find(v => v.id === selectedVehicleId) : null) ||
    favoriteVehicle;

  // 1. Carga inicial de datos locales y sincronización silenciosa
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);

      // Cargar vehículos locales
      const localVehicles = await vehicleStorage.getVehicles();
      setVehicles(localVehicles);

      // Si hay una cuenta activa, sincronizar silenciosamente en segundo plano
      authService.getSavedAccount().then(acc => {
        if (acc) {
          authService.syncVehicles(acc.id, localVehicles).then(res => {
            if (res.success && res.vehicles && res.vehicles.length > 0) {
              setVehicles(res.vehicles);
            }
          }).catch(() => {});
        }
      });

      // Cargar ciudades de caché/Supabase
      const loadedCities = await getCities();
      setCities(loadedCities);

      // Determinar ciudad seleccionada
      const savedCityId = await cacheService.getSelectedCityId();
      let activeCity = loadedCities[0];
      if (savedCityId) {
        const found = loadedCities.find(c => c.id === savedCityId);
        if (found) activeCity = found;
      } else if (localVehicles.length > 0 && localVehicles[0].city_id) {
        const found = loadedCities.find(c => c.id === localVehicles[0].city_id);
        if (found) activeCity = found;
      }
      setSelectedCity(activeCity);

      // Cargar reglas, festivos e indicadores
      const [loadedRules, loadedHolidays, loadedIndicators, trmData] = await Promise.all([
        getPicoYPlacaRules(),
        getColombianHolidays(),
        getEconomicIndicators(),
        getTRMHoy(),
      ]);

      setRules(loadedRules);
      setHolidays(loadedHolidays);
      setIndicators(loadedIndicators);
      setTrm(trmData);

      // Inicializar canal de notificaciones y programar alarmas locales para los vehículos
      notificationsService.initNotificationChannel().catch(() => {});
      notificationsService.rescheduleAllVehicles(localVehicles, loadedHolidays, loadedRules).catch(() => {});
    } catch (e) {
      console.warn('[VehicleContext] Error en carga inicial:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // 2. Re-evaluar motor lógico cuando cambie el vehículo activo, ciudad o reglas
  const refreshEvaluation = useCallback(() => {
    const today = new Date();

    // Evaluar estado para el vehículo seleccionado/favorito
    if (activeVehicle) {
      const vehicleCityId = activeVehicle.city_id || selectedCity.id;
      const result = evaluatePicoYPlaca({
        date: today,
        cityId: vehicleCityId,
        vehicleType: activeVehicle.vehicle_type,
        plateNumberOrDigit: activeVehicle.plate,
        holidays,
        rules,
        isExempt: activeVehicle.is_exempt,
        exemptionType: activeVehicle.exemption_type,
      });
      setEvaluation(result);
    } else {
      setEvaluation(null);
    }

    // Generar resumen general de la ciudad activa
    if (selectedCity) {
      const summary = getCityDaySummary(today, selectedCity.id, holidays, rules);
      setCitySummary(summary);
    }
  }, [activeVehicle, selectedCity, holidays, rules]);

  useEffect(() => {
    refreshEvaluation();

    // Actualizador periódico cada 60 segundos para mantener el semáforo y cuenta regresiva al día
    const interval = setInterval(() => {
      refreshEvaluation();
    }, 60000);

    return () => clearInterval(interval);
  }, [refreshEvaluation]);

  // 3. Manejo de Ciudad
  const changeCity = async (city: City) => {
    setSelectedCity(city);
    await cacheService.setSelectedCityId(city.id);
  };

  // 4. Manejo de Vehículos (Cero fricción local + Sincronización Nube)
  const syncCloudVehicles = useCallback(async () => {
    try {
      const account = await authService.getSavedAccount();
      if (!account) return;
      const currentLocals = await vehicleStorage.getVehicles();
      const res = await authService.syncVehicles(account.id, currentLocals);
      if (res.success && res.vehicles && res.vehicles.length > 0) {
        for (const v of res.vehicles) {
          await vehicleStorage.saveVehicle(v);
        }
        setVehicles(res.vehicles);
      }
    } catch (e) {
      console.warn('[VehicleContext] Error al sincronizar con nube:', e);
    }
  }, []);

  const addVehicle = async (vehicleData: Omit<UserVehicle, 'id'>): Promise<UserVehicle> => {
    const cleanPlate = vehicleData.plate.trim().toUpperCase();
    const numericDigits = cleanPlate.match(/\d/g) || [];
    const lastDigit = numericDigits[numericDigits.length - 1] || '';
    const firstDigit = numericDigits[0] || '';

    const newVehicle: UserVehicle = {
      ...vehicleData,
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      plate: cleanPlate,
      last_digit: lastDigit,
      first_digit: firstDigit,
      city_id: vehicleData.city_id || selectedCity.id,
      is_favorite: vehicles.length === 0,
      notify_previous_day: vehicleData.notify_previous_day ?? true,
      notify_same_day: vehicleData.notify_same_day ?? true,
    };

    const updated = await vehicleStorage.saveVehicle(newVehicle);
    setVehicles(updated);

    // Programar alarmas locales para el nuevo vehículo
    notificationsService.scheduleVehicleReminders(newVehicle, holidays, rules).catch(() => {});

    // Respaldo en la nube en segundo plano si hay cuenta
    authService.getSavedAccount().then(acc => {
      if (acc) authService.syncVehicles(acc.id, updated).catch(() => {});
    });

    return newVehicle;
  };

  const updateVehicle = async (vehicle: UserVehicle) => {
    const cleanPlate = vehicle.plate.trim().toUpperCase();
    const numericDigits = cleanPlate.match(/\d/g) || [];
    vehicle.last_digit = numericDigits[numericDigits.length - 1] || '';
    vehicle.first_digit = numericDigits[0] || '';

    const updated = await vehicleStorage.saveVehicle(vehicle);
    setVehicles(updated);

    // Reprogramar alarmas locales para el vehículo actualizado
    notificationsService.scheduleVehicleReminders(vehicle, holidays, rules).catch(() => {});

    authService.getSavedAccount().then(acc => {
      if (acc) authService.syncVehicles(acc.id, updated).catch(() => {});
    });
  };

  const deleteVehicle = async (id: string) => {
    const target = vehicles.find(v => v.id === id);
    const updated = await vehicleStorage.deleteVehicle(id);
    setVehicles(updated);

    // Cancelar alarmas locales del vehículo eliminado
    notificationsService.cancelVehicleReminders(id).catch(() => {});

    if (target) {
      authService.getSavedAccount().then(acc => {
        if (acc) authService.deleteCloudVehicle(acc.id, target.plate).catch(() => {});
      });
    }
  };

  const setFavorite = async (id: string) => {
    const updated = await vehicleStorage.setFavoriteVehicle(id);
    setVehicles(updated);

    authService.getSavedAccount().then(acc => {
      if (acc) authService.syncVehicles(acc.id, updated).catch(() => {});
    });
  };

  // 5. Sincronización Forzada
  const syncData = async (): Promise<string> => {
    try {
      setIsSyncing(true);
      const res = await syncAllRemoteData();
      const freshTRM = await getTRMHoy(true);
      setTrm(freshTRM);

      // Recargar estados en memoria
      const [loadedRules, loadedHolidays, loadedIndicators] = await Promise.all([
        getPicoYPlacaRules(undefined, true),
        getColombianHolidays(true),
        getEconomicIndicators(true),
      ]);
      setRules(loadedRules);
      setHolidays(loadedHolidays);
      setIndicators(loadedIndicators);

      return res.message;
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        favoriteVehicle,
        activeVehicle,
        selectedCity,
        cities,
        rules,
        holidays,
        indicators,
        trm,
        loading,
        isSyncing,
        evaluation,
        citySummary,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        setFavorite,
        setActiveVehicleId: setSelectedVehicleId,
        changeCity,
        syncData,
        syncCloudVehicles,
        sendTestNotification: async () => {
          await notificationsService.sendTestNotification(activeVehicle || favoriteVehicle || undefined);
        },
        refreshEvaluation,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicles = (): VehicleContextType => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicles debe utilizarse dentro de un VehicleProvider');
  }
  return context;
};

