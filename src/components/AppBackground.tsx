/**
 * Fondo Institucional Dual (Oscuro Original & Claro Fondo Blanco)
 * Al Día Colombia - Se adapta automáticamente al modo del dispositivo
 */
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Defs, RadialGradient, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export const AppBackground: React.FC = () => {
  const { isDark } = useTheme();

  if (!isDark) {
    // =========================================================================
    // MODO CLARO (FONDO BLANCO / TITANIO SUAVE)
    // =========================================================================
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="lightCanvas" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="40%" stopColor="#F8FAFC" />
              <Stop offset="100%" stopColor="#F1F5F9" />
            </LinearGradient>

            {/* Suave luz cenital diurna azul cielo */}
            <RadialGradient
              id="lightSkyGlow"
              cx="50%"
              cy="0%"
              rx="75%"
              ry="30%"
              fx="50%"
              fy="0%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#38BDF8" stopOpacity="0.08" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          <Rect width="100%" height="100%" fill="url(#lightCanvas)" />
          <Rect width="100%" height="100%" fill="url(#lightSkyGlow)" />
        </Svg>
      </View>
    );
  }

  // ===========================================================================
  // MODO OSCURO (ORIGINAL DEEP SPACE & GLASS AMBIENT)
  // ===========================================================================
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
        <Defs>
          {/* Base oscura */}
          <RadialGradient
            id="bgGlow1"
            cx="20%"
            cy="15%"
            rx="60%"
            ry="45%"
            fx="20%"
            fy="15%"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#1E293B" stopOpacity="0.45" />
            <Stop offset="100%" stopColor="#0B0F19" stopOpacity="0" />
          </RadialGradient>

          {/* Resplandor superior azul eléctrico */}
          <RadialGradient
            id="blueAccent"
            cx="85%"
            cy="10%"
            rx="50%"
            ry="40%"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.18" />
            <Stop offset="100%" stopColor="#0B0F19" stopOpacity="0" />
          </RadialGradient>

          {/* Resplandor inferior ámbar tenue */}
          <RadialGradient
            id="amberAccent"
            cx="50%"
            cy="90%"
            rx="70%"
            ry="40%"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#D97706" stopOpacity="0.12" />
            <Stop offset="100%" stopColor="#0B0F19" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Rect width="100%" height="100%" fill="#0B0F19" />
        <Rect width="100%" height="100%" fill="url(#bgGlow1)" />
        <Rect width="100%" height="100%" fill="url(#blueAccent)" />
        <Rect width="100%" height="100%" fill="url(#amberAccent)" />
      </Svg>
    </View>
  );
};

export default AppBackground;
