/**
 * Servicio TRM (Tasa Representativa del Mercado - Dólar en Colombia)
 * Al Día Colombia
 *
 * Consume el endpoint oficial del Portal de Datos Abiertos de Colombia:
 * https://www.datos.gov.co/resource/32sa-8pi3.json
 * Incluye tolerancia a fallos, soporte offline y almacenamiento en caché local.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '../config/env';
import { TRMData, TRMResponse } from '../types/database.types';

const TRM_CACHE_KEY = '@al_dia:trm_cache';

// Valor de reserva de emergencia por si la app se abre por primera vez 100% offline
const FALLBACK_TRM: TRMData = {
  value: 4150.0,
  formatted: '$4.150,00',
  date: new Date().toISOString().split('T')[0],
  variation: 0,
  source: 'fallback',
};

/**
 * Formatea un número a moneda colombiana (COP) estándar
 */
export function formatCOP(val: number): string {
  try {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  } catch {
    return `$${val.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`;
  }
}

/**
 * Obtiene la TRM vigente del día:
 * 1. Intenta consultar el endpoint de Datos Abiertos Colombia.
 * 2. Si tiene éxito, actualiza la caché local y retorna el valor en vivo.
 * 3. Si falla (sin internet), recupera la última TRM guardada en caché.
 * 4. Si no hay caché, retorna el fallback de seguridad.
 */
export async function getTRMHoy(forceRefresh = false): Promise<TRMData> {
  // 1. Si no forzamos refresco, revisar si la caché aún está vigente
  if (!forceRefresh) {
    try {
      const cachedRaw = await AsyncStorage.getItem(TRM_CACHE_KEY);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        const age = Date.now() - (cached.cachedAt || 0);
        if (age < ENV.CACHE_TTL.TRM) {
          return {
            ...cached.data,
            source: 'cache',
          };
        }
      }
    } catch (e) {
      console.warn('[TRMService] Error leyendo caché:', e);
    }
  }

  // 2. Intentar llamada de red a Datos Abiertos Colombia
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(ENV.TRM_API_URL, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const json: TRMResponse[] = await response.json();
      if (Array.isArray(json) && json.length > 0) {
        const item = json[0];
        const numValue = parseFloat(item.valor);
        const dateStr = item.vigenciadesde ? item.vigenciadesde.split('T')[0] : '';

        const trmData: TRMData = {
          value: numValue,
          formatted: formatCOP(numValue),
          date: dateStr,
          source: 'api',
        };

        // Guardar en caché persistente
        await AsyncStorage.setItem(
          TRM_CACHE_KEY,
          JSON.stringify({
            cachedAt: Date.now(),
            data: trmData,
          })
        );

        return trmData;
      }
    }
  } catch (error) {
    console.warn('[TRMService] Error en petición de red TRM:', error);
  }

  // 3. Fallback: Si falló la red, leer de la caché existente aunque esté vencida
  try {
    const cachedRaw = await AsyncStorage.getItem(TRM_CACHE_KEY);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      return {
        ...cached.data,
        source: 'cache',
      };
    }
  } catch (e) {
    console.warn('[TRMService] Error en fallback de caché:', e);
  }

  // 4. Último recurso offline
  return FALLBACK_TRM;
}

