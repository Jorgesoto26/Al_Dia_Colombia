/**
 * Servicio Central de Sincronización y Acceso a Supabase
 * Al Día Colombia - Blueprint Oficial
 *
 * Implementa el principio Offline-First:
 * 1. Lee de la caché local instantáneamente.
 * 2. Consulta Supabase en segundo plano y actualiza la caché local.
 * 3. Si no hay conexión o no hay internet, la app sigue funcionando al 100%.
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { cacheService } from '../database/storage';
import {
  City,
  PicoYPlacaRule,
  ColombianHoliday,
  EconomicIndicator,
} from '../types/database.types';

// ============================================================================
// SEMILLAS DE SEGURIDAD EMBEBIDAS (Para funcionamiento offline inmediato)
// ============================================================================
export const EMBEDDED_CITIES: City[] = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Bogotá D.C.', slug: 'bogota', department: 'Cundinamarca', is_active: true },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Medellín', slug: 'medellin', department: 'Antioquia', is_active: true },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Cali', slug: 'cali', department: 'Valle del Cauca', is_active: true },
  { id: '44444444-4444-4444-4444-444444444444', name: 'Manizales', slug: 'manizales', department: 'Caldas', is_active: true },
  { id: '55555555-5555-5555-5555-555555555555', name: 'Pereira', slug: 'pereira', department: 'Risaralda', is_active: true },
  { id: '66666666-6666-6666-6666-666666666666', name: 'Bucaramanga', slug: 'bucaramanga', department: 'Santander', is_active: true },
  { id: '77777777-7777-7777-7777-777777777777', name: 'Armenia', slug: 'armenia', department: 'Quindío', is_active: true },
  { id: '88888888-8888-8888-8888-888888888888', name: 'Barranquilla', slug: 'barranquilla', department: 'Atlántico', is_active: true },
  { id: '99999999-9999-9999-9999-999999999999', name: 'Cartagena', slug: 'cartagena', department: 'Bolívar', is_active: true },
  { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Cúcuta', slug: 'cucuta', department: 'Norte de Santander', is_active: true },
  { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Ibagué', slug: 'ibague', department: 'Tolima', is_active: true },
  { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', name: 'Villavicencio', slug: 'villavicencio', department: 'Meta', is_active: true },
  { id: 'dddddddd-dddd-dddd-dddd-dddddddddddd', name: 'Neiva', slug: 'neiva', department: 'Huila', is_active: true },
  { id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', name: 'Santa Marta', slug: 'santa-marta', department: 'Magdalena', is_active: true },
  { id: 'ffffffff-ffff-ffff-ffff-ffffffffffff', name: 'Pasto', slug: 'pasto', department: 'Nariño', is_active: true },
];

export const EMBEDDED_HOLIDAYS: ColombianHoliday[] = [
  { date: '2026-01-01', name: 'Año Nuevo', is_bridge: false },
  { date: '2026-01-12', name: 'Día de los Reyes Magos', is_bridge: true },
  { date: '2026-03-23', name: 'Día de San José', is_bridge: true },
  { date: '2026-04-02', name: 'Jueves Santo', is_bridge: false },
  { date: '2026-04-03', name: 'Viernes Santo', is_bridge: false },
  { date: '2026-05-01', name: 'Día del Trabajo', is_bridge: false },
  { date: '2026-05-18', name: 'Día de la Ascensión', is_bridge: true },
  { date: '2026-06-08', name: 'Corpus Christi', is_bridge: true },
  { date: '2026-06-15', name: 'Sagrado Corazón de Jesús', is_bridge: true },
  { date: '2026-06-29', name: 'San Pedro y San Pablo', is_bridge: true },
  { date: '2026-07-20', name: 'Día de la Independencia', is_bridge: false },
  { date: '2026-08-07', name: 'Batalla de Boyacá', is_bridge: false },
  { date: '2026-08-17', name: 'La Asunción de la Virgen', is_bridge: true },
  { date: '2026-10-12', name: 'Día de la Raza', is_bridge: true },
  { date: '2026-11-02', name: 'Día de Todos los Santos', is_bridge: true },
  { date: '2026-11-16', name: 'Independencia de Cartagena', is_bridge: true },
  { date: '2026-12-08', name: 'Inmaculada Concepción', is_bridge: false },
  { date: '2026-12-25', name: 'Navidad', is_bridge: false },
];

export const EMBEDDED_INDICATORS: EconomicIndicator[] = [
  {
    key: 'smmlv',
    name: 'Salario Mínimo Legal Vigente (2026)',
    value: 1750905,
    formatted_value: '$1.750.905 COP',
    unit: 'COP/mes',
    notes: 'Decreto 1469 de finales de 2025 (+23%). En 2025 fue de $1.423.500 COP.',
  },
  {
    key: 'auxilio_transporte',
    name: 'Auxilio de Transporte (2026)',
    value: 249095,
    formatted_value: '$249.095 COP',
    unit: 'COP/mes',
    notes: 'Decreto 1470 de finales de 2025 (+24.5%). En 2025 fue de $200.000 COP. Aplica hasta 2 SMMLV.',
  },
  {
    key: 'total_minimo_con_auxilio',
    name: 'Ingreso Total Mínimo (2026)',
    value: 2000000,
    formatted_value: '$2.000.000 COP',
    unit: 'COP/mes',
    notes: 'Total devengado mensual ($1.750.905 + $249.095). Alcanza la meta oficial de $2.000.000.',
  },
  {
    key: 'uvt',
    name: 'Unidad de Valor Tributario (UVT 2026)',
    value: 52374,
    formatted_value: '$52.374 COP',
    unit: 'COP',
    notes: 'Resolución DIAN 000238 del 15-dic-2025 (+5.17% IPC). En 2025 fue de $49.799 COP.',
  },
  {
    key: 'multa_pico_y_placa',
    name: 'Comparendo C.14 Pico y Placa (2026)',
    value: 875453,
    formatted_value: '$875.453 COP',
    unit: 'COP',
    notes: '15 SMLDV vigentes 2026 ($58.364/día). En 2025 fue de $711.750 COP. Más costos de grúa y patios.',
  },
  {
    key: 'gasolina_promedio',
    name: 'Gasolina Corriente (Promedio CREG)',
    value: 15860,
    formatted_value: '$15.860 COP',
    unit: 'COP/galón',
    notes: 'Precio promedio de referencia nacional CREG en ciudades principales.',
  },
];

// ============================================================================
// FUNCIONES DE CONSULTA CON ESTRATEGIA OFFLINE-FIRST
// ============================================================================

/**
 * Obtiene el listado de ciudades disponibles
 */
export async function getCities(forceNetwork = false): Promise<City[]> {
  // 1. Intentar leer de caché local si no se fuerza la red
  if (!forceNetwork) {
    const cached = await cacheService.getCities();
    if (cached && cached.length > 0) {
      return cached;
    }
  }

  // 2. Si hay conexión configurada a Supabase, consultar en la nube
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (!error && data && data.length > 0) {
        await cacheService.saveCities(data);
        return data as City[];
      }
    } catch (e) {
      console.warn('[SupabaseService] Error obteniendo ciudades:', e);
    }
  }

  // 3. Fallback: Datos locales embebidos
  await cacheService.saveCities(EMBEDDED_CITIES);
  return EMBEDDED_CITIES;
}

/**
 * Obtiene las reglas de Pico y Placa de una o todas las ciudades
 */
export async function getPicoYPlacaRules(cityId?: string, forceNetwork = false): Promise<PicoYPlacaRule[]> {
  // 1. Revisar caché local
  if (!forceNetwork) {
    const cached = await cacheService.getRules();
    if (cached && cached.length > 0) {
      return cityId ? cached.filter(r => r.city_id === cityId) : cached;
    }
  }

  // 2. Consultar Supabase
  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from('pico_y_placa_rules').select('*');
      if (cityId) {
        query = query.eq('city_id', cityId);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const typedRules = data as PicoYPlacaRule[];
        // Guardar en caché consolidada
        const currentRules = (await cacheService.getRules()) || [];
        const merged = mergeRules(currentRules, typedRules);
        await cacheService.saveRules(merged);
        return typedRules;
      }
    } catch (e) {
      console.warn('[SupabaseService] Error obteniendo reglas:', e);
    }
  }

  // 3. Fallback: Intentar leer cualquier caché previa
  const cached = await cacheService.getRules();
  if (cached && cached.length > 0) {
    return cityId ? cached.filter(r => r.city_id === cityId) : cached;
  }

  return [];
}

/**
 * Obtiene el calendario de festivos colombianos
 */
export async function getColombianHolidays(forceNetwork = false): Promise<ColombianHoliday[]> {
  if (!forceNetwork) {
    const cached = await cacheService.getHolidays();
    if (cached && cached.length > 0) {
      return cached;
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('colombian_holidays')
        .select('*')
        .order('date');

      if (!error && data && data.length > 0) {
        await cacheService.saveHolidays(data);
        return data as ColombianHoliday[];
      }
    } catch (e) {
      console.warn('[SupabaseService] Error obteniendo festivos:', e);
    }
  }

  // Fallback con festivos oficiales pre-cargados
  await cacheService.saveHolidays(EMBEDDED_HOLIDAYS);
  return EMBEDDED_HOLIDAYS;
}

/**
 * Obtiene los indicadores económicos
 */
export async function getEconomicIndicators(forceNetwork = false): Promise<EconomicIndicator[]> {
  if (!forceNetwork) {
    const cached = await cacheService.getIndicators();
    // Validar que la caché contenga la estructura actualizada con decretos vigentes 2026
    const isUpToDate =
      cached &&
      cached.length >= EMBEDDED_INDICATORS.length &&
      cached.some(i => i.notes?.includes('2026'));

    if (isUpToDate) {
      return cached;
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('economic_indicators')
        .select('*');

      if (!error && data && data.length > 0) {
        await cacheService.saveIndicators(data);
        return data as EconomicIndicator[];
      }
    } catch (e) {
      console.warn('[SupabaseService] Error obteniendo indicadores:', e);
    }
  }

  // Fallback seguro
  await cacheService.saveIndicators(EMBEDDED_INDICATORS);
  return EMBEDDED_INDICATORS;
}

/**
 * Forzar sincronización completa de toda la información (Botón en Ajustes)
 */
export async function syncAllRemoteData(): Promise<{ success: boolean; message: string }> {
  try {
    const [cities, rules, holidays, indicators] = await Promise.all([
      getCities(true),
      getPicoYPlacaRules(undefined, true),
      getColombianHolidays(true),
      getEconomicIndicators(true),
    ]);

    await cacheService.setLastSyncTime();

    return {
      success: true,
      message: `Sincronizados: ${cities.length} ciudades, ${rules.length} reglas, ${holidays.length} festivos y ${indicators.length} indicadores.`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'No fue posible completar la sincronización.',
    };
  }
}

// Helper para fusionar reglas sin duplicados
function mergeRules(existing: PicoYPlacaRule[], incoming: PicoYPlacaRule[]): PicoYPlacaRule[] {
  const map = new Map<string, PicoYPlacaRule>();
  existing.forEach(r => map.set(r.id, r));
  incoming.forEach(r => map.set(r.id, r));
  return Array.from(map.values());
}

