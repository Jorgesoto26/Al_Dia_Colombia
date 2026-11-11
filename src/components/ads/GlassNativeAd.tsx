/**
 * Componente: GlassNativeAd
 * Al Día Colombia - Mockup funcional de Anuncio Nativo Glassmorphism
 *
 * Características:
 * - Se integra de forma orgánica con la estética de la app (Dark Mode & Light Mode).
 * - Distintivo oficial de "Publicidad" en la esquina superior derecha (exigido por políticas de Google AdMob).
 * - Botón de Call To Action (CTA) en color Ámbar o Azul eléctrico.
 * - Listo para intercalar entre las tarjetas de Pico y Placa e Indicadores Económicos.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { GlassCard } from '../GlassCard';
import { StarIcon } from '../Icons';

interface GlassNativeAdProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaColor?: 'primary' | 'accent';
  onPress?: () => void;
  url?: string;
  style?: object;
}

export const GlassNativeAd: React.FC<GlassNativeAdProps> = ({
  title = 'Seguros de Vehículos y Asistencia 24/7',
  description = 'Protege tu carro o moto con coberturas contra todo riesgo y grúa nacional inmediata.',
  ctaText = 'Ver más',
  ctaColor = 'accent',
  onPress,
  url = 'https://www.google.com',
  style,
}) => {
  const { isDark, colors } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (url) {
      Linking.openURL(url).catch(() => {});
    }
  };

  const buttonBg = ctaColor === 'accent' ? colors.accent : colors.primary;

  return (
    <GlassCard style={[styles.card, style]}>
      {/* Encabezado: Marca / Ícono y Distintivo de Publicidad */}
      <View style={styles.headerRow}>
        <View style={styles.sponsorBadge}>
          <View style={[styles.sponsorIconCircle, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(217, 119, 6, 0.12)' }]}>
            <StarIcon size={14} color={colors.accent} filled />
          </View>
          <Text style={[styles.sponsorName, { color: colors.textSecondary }]}>Patrocinado</Text>
        </View>

        {/* Badge obligatorio "Publicidad" */}
        <View
          style={[
            styles.adBadge,
            {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.12)',
            },
          ]}
        >
          <Text style={[styles.adBadgeText, { color: colors.textSecondary }]}>Publicidad</Text>
        </View>
      </View>

      {/* Contenido Principal */}
      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
          {title}
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={3}>
          {description}
        </Text>
      </View>

      {/* Botón de Acción Call-To-Action (CTA) */}
      <View style={styles.footerRow}>
        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: buttonBg }]}
          onPress={handlePress}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaButtonText}>{ctaText}</Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sponsorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sponsorIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sponsorName: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  adBadge: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 6,
    borderWidth: 1,
  },
  adBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  body: {
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
    lineHeight: 20,
  },
  description: {
    fontSize: 12,
    lineHeight: 17,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  ctaButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

export default GlassNativeAd;

