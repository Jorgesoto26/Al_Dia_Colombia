/**
 * Capa de Persistencia Local y Gestión de Caché Offline-First
 * Al Día Colombia
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserVehicle } from '../types/picoYPlaca.types';
import { City, PicoYPlacaRule, ColombianHoliday, EconomicIndicator } from '../types/database.types';

const STORAGE_KEYS = {
  CITIES: '@al_dia:cities',
  RULES: '@al_dia:pico_rules',
  HOLIDAYS: '@al_dia:holidays',
  INDICATORS: '@al_dia:indicators',
  TRM: '@al_dia:trm',
  USER_VEHICLES: '@al_dia:user_vehicles',
  SELECTED_CITY: '@al_dia:selected_city_id',
  LAST_SYNC: '@al_dia:last_sync_timestamp',
};

interface CacheEnvelope<T> {
  timestamp: number;
  data: T;
}

/**
 * Guarda datos en caché con timestamp para control de caducidad
 */
export async function setCachedData<T>(key: string, data: T): Promise<void> {
  try {
    const envelope: CacheEnvelope<T> = {
      timestamp: Date.now(),
      data,
    };
    await AsyncStorage.setItem(key, JSON.stringify(envelope));
  } catch (error) {
    console.warn(`[Storage] Error al guardar caché para ${key}:`, error);
  }
}

/**
 * Obtiene datos de caché respetando el TTL (opcional)
 */
export async function getCachedData<T>(key: string, ttlMs?: number): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;

    const envelope: CacheEnvelope<T> = JSON.parse(raw);

    if (ttlMs && Date.now() - envelope.timestamp > ttlMs) {
      // El caché expiró, pero aún podemos retornarlo como fallback si no hay red
      return envelope.data;
    }

    return envelope.data;
  } catch (error) {
    console.warn(`[Storage] Error al leer caché para ${key}:`, error);
    return null;
  }
}

// ----------------------------------------------------
// Helpers de Caché de Entidades Principales
// ----------------------------------------------------

export const cacheService = {
  // Ciudades
  saveCities: (cities: City[]) => setCachedData(STORAGE_KEYS.CITIES, cities),
  getCities: (ttl?: number) => getCachedData<City[]>(STORAGE_KEYS.CITIES, ttl),

  // Reglas de Pico y Placa
  saveRules: (rules: PicoYPlacaRule[]) => setCachedData(STORAGE_KEYS.RULES, rules),
  getRules: (ttl?: number) => getCachedData<PicoYPlacaRule[]>(STORAGE_KEYS.RULES, ttl),

  // Festivos
  saveHolidays: (holidays: ColombianHoliday[]) => setCachedData(STORAGE_KEYS.HOLIDAYS, holidays),
  getHolidays: (ttl?: number) => getCachedData<ColombianHoliday[]>(STORAGE_KEYS.HOLIDAYS, ttl),

  // Indicadores
  saveIndicators: (indicators: EconomicIndicator[]) =>
    setCachedData(STORAGE_KEYS.INDICATORS, indicators),
  getIndicators: (ttl?: number) => getCachedData<EconomicIndicator[]>(STORAGE_KEYS.INDICATORS, ttl),

  // Ciudad seleccionada
  setSelectedCityId: async (cityId: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_CITY, cityId);
    } catch (e) {
      console.warn('[Storage] Error saving selected city:', e);
    }
  },
  getSelectedCityId: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_CITY);
    } catch {
      return null;
    }
  },

  // Última sincronización
  setLastSyncTime: async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());
  },
  getLastSyncTime: async (): Promise<number | null> => {
    const val = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    return val ? parseInt(val, 10) : null;
  },
};

// ----------------------------------------------------
// Gestión Local de Vehículos (Cero Fricción - Sin Login)
// ----------------------------------------------------

export const vehicleStorage = {
  async getVehicles(): Promise<UserVehicle[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER_VEHICLES);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.warn('[Storage] Error al leer vehículos locales:', error);
      return [];
    }
  },

  async saveVehicle(vehicle: UserVehicle): Promise<UserVehicle[]> {
    try {
      const current = await vehicleStorage.getVehicles();
      const existingIndex = current.findIndex(v => v.id === vehicle.id);

      let updated: UserVehicle[];
      if (existingIndex >= 0) {
        updated = [...current];
        updated[existingIndex] = vehicle;
      } else {
        // Si es el primer vehículo, marcarlo como favorito
        if (current.length === 0) {
          vehicle.is_favorite = true;
        }
        updated = [...current, vehicle];
      }

      await AsyncStorage.setItem(STORAGE_KEYS.USER_VEHICLES, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.warn('[Storage] Error al guardar vehículo:', error);
      throw error;
    }
  },

  async deleteVehicle(vehicleId: string): Promise<UserVehicle[]> {
    try {
      const current = await vehicleStorage.getVehicles();
      const filtered = current.filter(v => v.id !== vehicleId);

      // Si borramos el favorito y quedan otros, marcar el primero
      if (filtered.length > 0 && !filtered.some(v => v.is_favorite)) {
        filtered[0].is_favorite = true;
      }

      await AsyncStorage.setItem(STORAGE_KEYS.USER_VEHICLES, JSON.stringify(filtered));
      return filtered;
    } catch (error) {
      console.warn('[Storage] Error al eliminar vehículo:', error);
      throw error;
    }
  },

  async setFavoriteVehicle(vehicleId: string): Promise<UserVehicle[]> {
    try {
      const current = await vehicleStorage.getVehicles();
      const updated = current.map(v => ({
        ...v,
        is_favorite: v.id === vehicleId,
      }));
      await AsyncStorage.setItem(STORAGE_KEYS.USER_VEHICLES, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.warn('[Storage] Error al actualizar favorito:', error);
      throw error;
    }
  },
};

