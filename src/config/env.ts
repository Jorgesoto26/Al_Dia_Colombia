/**
 * Configuración de Entorno y Endpoints Externos
 * Al Día Colombia
 */

declare const process: {
  env: {
    SUPABASE_URL?: string;
    SUPABASE_ANON_KEY?: string;
    [key: string]: string | undefined;
  };
};

export const ENV = {
  // Supabase (Credenciales del proyecto)
  SUPABASE_URL:
    (typeof process !== 'undefined' && process.env?.SUPABASE_URL) ||
    'https://rkalrxiislhzwjukzyvb.supabase.co',
  SUPABASE_ANON_KEY:
    (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrYWxyeGlpc2xoendqdWt6eXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQzMzMzOTUsImV4cCI6MjEwOTkwOTM5NX0.noAslBTLxFD0nfBrKjYiUHX5p2VWy9kWGpJEpkAa-jc',

  // API Oficial Datos Abiertos Colombia - TRM (Tasa Representativa del Mercado)
  TRM_API_URL:
    'https://www.datos.gov.co/resource/32sa-8pi3.json?$limit=1&$order=vigenciadesde%20DESC',

  // Configuración de Caché Offline (en milisegundos)
  CACHE_TTL: {
    CITIES: 7 * 24 * 60 * 60 * 1000, // 7 días
    RULES: 24 * 60 * 60 * 1000, // 24 horas
    HOLIDAYS: 30 * 24 * 60 * 60 * 1000, // 30 días
    INDICATORS: 12 * 60 * 60 * 1000, // 12 horas
    TRM: 60 * 60 * 1000, // 1 hora
  },

  APP_VERSION: '1.0.0',
};
