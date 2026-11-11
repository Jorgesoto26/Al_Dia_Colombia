/**
 * Tarjeta Dual Adaptativa (Modo Oscuro Original & Modo Claro)
 * Al Día Colombia
 */
import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  StyleProp,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'danger' | 'success' | 'warning' | 'primary';
  onPress?: () => void;
  activeOpacity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  variant = 'default',
  onPress,
  activeOpacity = 0.82,
}) => {
  const { isDark, colors } = useTheme();

  const getVariantStyle = (): ViewStyle => {
    if (!isDark) {
      // =======================================================================
      // MODO CLARO (FONDO BLANCO): Tarjetas blancas nítidas con bordes y tintes suaves
      // =======================================================================
      switch (variant) {
        case 'danger':
          return {
            backgroundColor: 'rgba(254, 242, 242, 0.95)',
            borderColor: 'rgba(239, 68, 68, 0.40)',
            shadowColor: colors.danger,
            shadowOpacity: 0.12,
            shadowRadius: 10,
          };
        case 'success':
          return {
            backgroundColor: 'rgba(240, 253, 244, 0.95)',
            borderColor: 'rgba(16, 185, 129, 0.40)',
            shadowColor: colors.success,
            shadowOpacity: 0.12,
            shadowRadius: 10,
          };
        case 'warning':
          return {
            backgroundColor: 'rgba(254, 252, 232, 0.95)',
            borderColor: 'rgba(245, 158, 11, 0.40)',
            shadowColor: colors.accent,
            shadowOpacity: 0.12,
            shadowRadius: 10,
          };
        case 'primary':
          return {
            backgroundColor: 'rgba(239, 246, 255, 0.95)',
            borderColor: 'rgba(37, 99, 235, 0.40)',
            shadowColor: colors.primary,
            shadowOpacity: 0.12,
            shadowRadius: 10,
          };
        default:
          return {
            backgroundColor: '#FFFFFF',
            borderColor: 'rgba(15, 23, 42, 0.08)',
            shadowColor: '#0F172A',
            shadowOpacity: 0.05,
            shadowRadius: 10,
          };
      }
    }

    // =========================================================================
    // MODO OSCURO (ORIGINAL INTACTO): Glassmorphism oscuro con profundidad
    // =========================================================================
    switch (variant) {
      case 'danger':
        return {
          backgroundColor: 'rgba(38, 16, 24, 0.82)',
          borderColor: 'rgba(239, 68, 68, 0.40)',
          shadowColor: colors.danger,
          shadowOpacity: 0.20,
          shadowRadius: 12,
        };
      case 'success':
        return {
          backgroundColor: 'rgba(12, 32, 25, 0.82)',
          borderColor: 'rgba(16, 185, 129, 0.40)',
          shadowColor: colors.success,
          shadowOpacity: 0.20,
          shadowRadius: 12,
        };
      case 'warning':
        return {
          backgroundColor: 'rgba(40, 28, 12, 0.82)',
          borderColor: 'rgba(245, 158, 11, 0.40)',
          shadowColor: colors.accent,
          shadowOpacity: 0.20,
          shadowRadius: 12,
        };
      case 'primary':
        return {
          backgroundColor: 'rgba(16, 26, 48, 0.82)',
          borderColor: 'rgba(59, 130, 246, 0.40)',
          shadowColor: colors.primary,
          shadowOpacity: 0.20,
          shadowRadius: 12,
        };
      default:
        return {
          backgroundColor: 'rgba(17, 24, 39, 0.78)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 10,
        };
    }
  };

  const cardStyle = [styles.base, getVariantStyle(), style];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={activeOpacity}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 22,
    borderWidth: 1.2,
    padding: 18,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});

export default GlassCard;
