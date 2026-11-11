/**
 * Inicialización del Cliente Supabase
 * Al Día Colombia - Blueprint Oficial
 */
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '../config/env';

export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storage: AsyncStorage,
  },
});

/**
 * Validador para saber si Supabase tiene credenciales reales configuradas
 */
export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(ENV.SUPABASE_URL) &&
    !ENV.SUPABASE_URL.includes('tu-proyecto') &&
    Boolean(ENV.SUPABASE_ANON_KEY) &&
    !ENV.SUPABASE_ANON_KEY.includes('tu-anon-key')
  );
};

