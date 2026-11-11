/**
 * Tokens Visuales Oficiales - Al Día Colombia
 * Soporte Nativo Dual: Modo Oscuro Original & Modo Claro (Fondo Blanco)
 */

export const DARK_COLORS = {
  // Fondos Principales (Deep Space / Midnight Blue Original)
  background: '#0B0F19',
  backgroundSecondary: '#111827',
  backgroundElevated: '#1F2937',
  statusBar: '#0B0F19',
  navigationBar: '#0B0F19',

  // Acentos de Estado e Interacción
  primary: '#3B82F6', // Azul eléctrico
  primaryBright: '#60A5FA',
  primaryGlow: 'rgba(59, 130, 246, 0.35)',

  accent: '#F59E0B', // Ámbar/Amarillo vibrante
  accentBright: '#FBBF24',
  accentGlow: 'rgba(245, 158, 11, 0.35)',

  success: '#10B981', // Verde esmeralda (libre para circular)
  successBright: '#34D399',
  successGlow: 'rgba(16, 185, 129, 0.35)',

  danger: '#EF4444', // Rojo coral (alerta de restricción activa)
  dangerBright: '#F87171',
  dangerGlow: 'rgba(239, 68, 68, 0.35)',

  info: '#06B6D4',
  purple: '#8B5CF6',
  indigo: '#6366F1',

  // Textos
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#0B0F19',

  // Cards Glassmorphism Oscuras Originales
  glassCardBackground: 'rgba(17, 24, 39, 0.78)',
  glassCardBackgroundHover: 'rgba(24, 33, 50, 0.85)',
  glassCardBorder: 'rgba(255, 255, 255, 0.08)',
  glassCardBorderGlow: 'rgba(59, 130, 246, 0.30)',

  // Estados semafóricos de tarjetas
  glassSuccessBg: 'rgba(12, 32, 25, 0.82)',
  glassSuccessBorder: 'rgba(16, 185, 129, 0.40)',

  glassDangerBg: 'rgba(38, 16, 24, 0.82)',
  glassDangerBorder: 'rgba(239, 68, 68, 0.40)',

  glassWarningBg: 'rgba(40, 28, 12, 0.82)',
  glassWarningBorder: 'rgba(245, 158, 11, 0.40)',

  glassTrmBg: 'rgba(16, 26, 48, 0.82)',
  glassTrmBorder: 'rgba(59, 130, 246, 0.40)',

  glassHolidayBg: 'rgba(40, 28, 12, 0.82)',
  glassHolidayBorder: 'rgba(245, 158, 11, 0.40)',

  // TabBar
  tabBarBackground: 'rgba(11, 15, 25, 0.95)',
  tabBarBorder: 'rgba(255, 255, 255, 0.08)',
};

export const LIGHT_COLORS = {
  // Fondos Principales (Blanco Titanio / Perla Suave)
  background: '#F8FAFC',
  backgroundSecondary: '#FFFFFF',
  backgroundElevated: '#F1F5F9',
  statusBar: '#F8FAFC',
  navigationBar: '#FFFFFF',

  // Acentos de Estado e Interacción (Colores vivos de alta visibilidad diurna)
  primary: '#2563EB', // Azul real nítido
  primaryBright: '#3B82F6',
  primaryGlow: 'rgba(37, 99, 235, 0.20)',

  accent: '#D97706', // Ámbar dorado visible
  accentBright: '#F59E0B',
  accentGlow: 'rgba(217, 119, 6, 0.20)',

  success: '#059669', // Verde esmeralda profundo
  successBright: '#10B981',
  successGlow: 'rgba(5, 150, 105, 0.20)',

  danger: '#DC2626', // Rojo alerta intenso
  dangerBright: '#EF4444',
  dangerGlow: 'rgba(220, 38, 38, 0.20)',

  info: '#0284C7',
  purple: '#7C3AED',
  indigo: '#4F46E5',

  // Textos para Fondo Blanco (Negro Puro y Contraste Absoluto)
  textPrimary: '#000000', // Negro puro para máxima nitidez y lectura inmediata
  textSecondary: '#1E293B', // Slate 800 (Carbón oscuro para subtítulos)
  textMuted: '#334155', // Slate 700 (Gris oscuro de alta legibilidad)
  textInverse: '#FFFFFF',

  // Cards Modo Claro (Tarjetas Blancas Flotantes con Sombra Suave y Borde Sutil)
  glassCardBackground: '#FFFFFF',
  glassCardBackgroundHover: '#F8FAFC',
  glassCardBorder: 'rgba(15, 23, 42, 0.08)',
  glassCardBorderGlow: 'rgba(37, 99, 235, 0.25)',

  // Estados semafóricos de tarjetas en modo claro
  glassSuccessBg: 'rgba(240, 253, 244, 0.95)',
  glassSuccessBorder: 'rgba(16, 185, 129, 0.45)',

  glassDangerBg: 'rgba(254, 242, 242, 0.95)',
  glassDangerBorder: 'rgba(239, 68, 68, 0.45)',

  glassWarningBg: 'rgba(254, 252, 232, 0.95)',
  glassWarningBorder: 'rgba(245, 158, 11, 0.45)',

  glassTrmBg: 'rgba(239, 246, 255, 0.95)',
  glassTrmBorder: 'rgba(59, 130, 246, 0.45)',

  glassHolidayBg: 'rgba(254, 252, 232, 0.95)',
  glassHolidayBorder: 'rgba(245, 158, 11, 0.45)',

  // TabBar
  tabBarBackground: 'rgba(255, 255, 255, 0.96)',
  tabBarBorder: 'rgba(15, 23, 42, 0.08)',
};

// Exportación por defecto compatible
export const COLORS = DARK_COLORS;
export type ColorPalette = typeof DARK_COLORS;
