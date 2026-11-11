/**
 * Sección de Cámaras de Fotodetección y Radares (ANSV)
 * Al Día Colombia - Pestaña "Hoy"
 * Visualización georreferenciada de cámaras salvavidas y derechos del conductor.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { GlassCard } from '../../components/GlassCard';
import {
  CameraIcon,
  SearchIcon,
  CloseIcon,
  ExternalLinkIcon,
  ShieldCheckIcon,
  GaugeIcon,
  ChevronDownIcon,
  AlertTriangleIcon,
} from '../../components/Icons';
import {
  SpeedCamera,
  CameraViolationType,
} from '../../types/camera.types';
import {
  getCamerasByCity,
  getCityCameraSummary,
  filterCameras,
  openCameraInMaps,
  VIOLATION_METADATA,
  DRIVER_LEGAL_RIGHTS,
} from '../../services/cameraService';
import { COLORS } from '../../theme/colors';

interface SpeedCamerasSectionProps {
  cityId: string;
  cityName: string;
}

const VIOLATION_FILTER_OPTIONS: { label: string; value: CameraViolationType | 'all' }[] = [
  { label: 'Todas', value: 'all' },
  { label: '🚫 Pico y Placa', value: 'C.14' },
  { label: '⚡ Velocidad', value: 'C.29' },
  { label: '🚦 Semáforo Rojo', value: 'D.04' },
  { label: '📄 SOAT / RTM', value: 'D.02' },
];

export const SpeedCamerasSection: React.FC<SpeedCamerasSectionProps> = ({
  cityId,
  cityName,
}) => {
  const { colors, isDark } = useTheme();

  // Estados de interfaz
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedViolation, setSelectedViolation] = useState<CameraViolationType | 'all'>('all');
  const [showRights, setShowRights] = useState<boolean>(false);

  // Cámaras de la ciudad seleccionada
  const cityCameras = useMemo(() => {
    return getCamerasByCity(cityId || cityName);
  }, [cityId, cityName]);

  // Resumen métrico
  const summary = useMemo(() => {
    return getCityCameraSummary(cityId || cityName);
  }, [cityId, cityName]);

  // Cámaras filtradas
  const filteredCameras = useMemo(() => {
    return filterCameras(cityCameras, searchQuery, selectedViolation);
  }, [cityCameras, searchQuery, selectedViolation]);

  // Si no está expandido, mostramos un preview de 2 cámaras
  const displayedCameras = isExpanded ? filteredCameras : filteredCameras.slice(0, 2);

  return (
    <View style={styles.container}>
      {/* ================================================================ */}
      {/* 1. TARJETA HERO: RESUMEN DE CÁMARAS SALVAVIDAS EN LA CIUDAD      */}
      {/* ================================================================ */}
      <GlassCard variant="primary" style={styles.heroCard}>
        <View style={styles.heroHeaderRow}>
          <View style={styles.heroTitleRow}>
            <View
              style={[
                styles.heroIconWrapper,
                {
                  backgroundColor: isDark
                    ? 'rgba(59, 130, 246, 0.25)'
                    : 'rgba(37, 99, 235, 0.12)',
                },
              ]}
            >
              <CameraIcon size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.heroBadgeRow}>
                <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                  Cámaras Salvavidas ANSV
                </Text>
                <View
                  style={[
                    styles.approvedBadge,
                    {
                      backgroundColor: isDark
                        ? 'rgba(16, 185, 129, 0.2)'
                        : 'rgba(5, 150, 105, 0.12)',
                    },
                  ]}
                >
                  <Text style={[styles.approvedBadgeText, { color: COLORS.success }]}>
                    Oficiales
                  </Text>
                </View>
              </View>
              <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                {cityName} • Límite legal 50 km/h (Ley 2251/2022)
              </Text>
            </View>
          </View>
        </View>

        {/* Métricas Rápidas en Cuadrícula */}
        <View style={[styles.metricsGrid, { borderTopColor: colors.glassCardBorder }]}>
          <View style={styles.metricItem}>
            <Text style={[styles.metricVal, { color: colors.textPrimary }]}>
              {summary.totalCameras}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Cámaras Activas
            </Text>
          </View>

          <View style={[styles.metricDivider, { backgroundColor: colors.glassCardBorder }]} />

          <View style={styles.metricItem}>
            <Text style={[styles.metricVal, { color: COLORS.accent }]}>
              {summary.pypCameraCount}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Detectan Pico y Placa
            </Text>
          </View>

          <View style={[styles.metricDivider, { backgroundColor: colors.glassCardBorder }]} />

          <View style={styles.metricItem}>
            <Text style={[styles.metricVal, { color: isDark ? '#93C5FD' : colors.primary }]}>
              50 km/h
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Velocidad Urbana
            </Text>
          </View>
        </View>

        {/* Botón rápido para desplegar / contraer */}
        <TouchableOpacity
          style={[
            styles.expandToggleBtn,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.06)'
                : 'rgba(15, 23, 42, 0.05)',
            },
          ]}
          onPress={() => setIsExpanded(!isExpanded)}
          activeOpacity={0.8}
        >
          <Text style={[styles.expandToggleText, { color: colors.primary }]}>
            {isExpanded
              ? 'Ocultar listado de cámaras'
              : `Ver las ${summary.totalCameras} cámaras en ${cityName}`}
          </Text>
          <View style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}>
            <ChevronDownIcon size={16} color={colors.primary} />
          </View>
        </TouchableOpacity>
      </GlassCard>

      {/* ================================================================ */}
      {/* 2. CONTENIDO EXPANDIDO: BUSCADOR, FILTROS Y LISTADO              */}
      {/* ================================================================ */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          {/* Buscador */}
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: isDark
                  ? 'rgba(15, 23, 42, 0.75)'
                  : 'rgba(255, 255, 255, 0.95)',
                borderColor: colors.glassCardBorder,
              },
            ]}
          >
            <SearchIcon size={18} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder="Buscar por avenida, calle o cruce..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <CloseIcon size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Chips de filtro por tipo de infracción */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
          >
            {VIOLATION_FILTER_OPTIONS.map(opt => {
              const isSelected = selectedViolation === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.filterChip,
                    isSelected
                      ? { backgroundColor: colors.primary, borderColor: colors.primary }
                      : {
                          backgroundColor: isDark
                            ? 'rgba(30, 41, 59, 0.6)'
                            : 'rgba(241, 245, 249, 0.9)',
                          borderColor: colors.glassCardBorder,
                        },
                  ]}
                  onPress={() => setSelectedViolation(opt.value)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: isSelected ? '#FFF' : colors.textPrimary },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* ================================================================ */}
      {/* 3. LISTADO DE CÁMARAS SALVAVIDAS                                  */}
      {/* ================================================================ */}
      {cityCameras.length === 0 ? (
        <GlassCard style={styles.emptyCard}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No hay cámaras de fotomultas fijas registradas para {cityName}.
          </Text>
        </GlassCard>
      ) : (
        <View style={styles.camerasList}>
          {displayedCameras.map(cam => {
            const hasPyp = cam.violations.includes('C.14');
            const hasSpeed = cam.violations.includes('C.29');

            return (
              <GlassCard key={cam.id} style={styles.cameraCard}>
                {/* Fila Superior: Código y Límite de Velocidad */}
                <View style={styles.camTopRow}>
                  <View style={styles.camCodeWrapper}>
                    <Text style={[styles.camCodeText, { color: colors.textSecondary }]}>
                      {cam.code}
                    </Text>
                    <View
                      style={[
                        styles.activeDotBadge,
                        {
                          backgroundColor: isDark
                            ? 'rgba(16, 185, 129, 0.2)'
                            : 'rgba(5, 150, 105, 0.12)',
                        },
                      ]}
                    >
                      <View style={styles.greenDot} />
                      <Text style={[styles.activeDotText, { color: COLORS.success }]}>
                        Operando
                      </Text>
                    </View>
                  </View>

                  {/* Señal circular de velocidad permitida */}
                  <View style={styles.speedSign}>
                    <Text style={styles.speedSignNumber}>{cam.speedLimit}</Text>
                    <Text style={styles.speedSignUnit}>km/h</Text>
                  </View>
                </View>

                {/* Ubicación y Sentido */}
                <Text style={[styles.camLocation, { color: colors.textPrimary }]}>
                  {cam.location}
                </Text>
                <Text style={[styles.camDirection, { color: colors.textSecondary }]}>
                  Sentido: {cam.direction}
                </Text>

                {/* Etiquetas de Infracciones Captadas */}
                <View style={styles.violationsRow}>
                  {cam.violations.map(vKey => {
                    const meta = VIOLATION_METADATA[vKey];
                    if (!meta) return null;

                    const isDanger = vKey === 'C.29' || vKey === 'D.04';
                    const isWarning = vKey === 'C.14';

                    return (
                      <View
                        key={vKey}
                        style={[
                          styles.violationTag,
                          {
                            backgroundColor: isDanger
                              ? isDark
                                ? 'rgba(239, 68, 68, 0.2)'
                                : 'rgba(220, 38, 38, 0.12)'
                              : isWarning
                              ? isDark
                                ? 'rgba(245, 158, 11, 0.2)'
                                : 'rgba(217, 119, 6, 0.12)'
                              : isDark
                              ? 'rgba(59, 130, 246, 0.2)'
                              : 'rgba(37, 99, 235, 0.12)',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.violationTagText,
                            {
                              color: isDanger
                                ? isDark
                                  ? '#FCA5A5'
                                  : COLORS.danger
                                : isWarning
                                ? isDark
                                  ? '#FDE68A'
                                  : '#B45309'
                                : isDark
                                ? '#93C5FD'
                                : colors.primary,
                            },
                          ]}
                        >
                          {meta.shortLabel}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                {/* Botón de Abrir en Waze / Google Maps */}
                <TouchableOpacity
                  style={[
                    styles.mapsBtn,
                    {
                      backgroundColor: isDark
                        ? 'rgba(30, 41, 59, 0.65)'
                        : 'rgba(241, 245, 249, 0.95)',
                      borderColor: colors.glassCardBorder,
                    },
                  ]}
                  onPress={() => openCameraInMaps(cam)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.mapsBtnText, { color: colors.primary }]}>
                    Abrir ubicación en Mapa
                  </Text>
                  <ExternalLinkIcon size={14} color={colors.primary} />
                </TouchableOpacity>
              </GlassCard>
            );
          })}
        </View>
      )}

      {/* ================================================================ */}
      {/* 4. DERECHOS DEL CONDUCTOR Y MARCO LEGAL                           */}
      {/* ================================================================ */}
      <GlassCard style={styles.rightsCard}>
        <TouchableOpacity
          style={styles.rightsHeader}
          onPress={() => setShowRights(!showRights)}
          activeOpacity={0.8}
        >
          <View style={styles.rightsHeaderTitleRow}>
            <ShieldCheckIcon size={18} color={COLORS.success} />
            <Text style={[styles.rightsTitle, { color: colors.textPrimary }]}>
              Tus Derechos Legales ante Fotomultas
            </Text>
          </View>
          <View style={{ transform: [{ rotate: showRights ? '180deg' : '0deg' }] }}>
            <ChevronDownIcon size={16} color={colors.textSecondary} />
          </View>
        </TouchableOpacity>

        {showRights && (
          <View style={[styles.rightsContent, { borderTopColor: colors.glassCardBorder }]}>
            {DRIVER_LEGAL_RIGHTS.map((item, index) => (
              <View key={index} style={styles.rightItem}>
                <Text style={[styles.rightItemTitle, { color: isDark ? '#93C5FD' : colors.primary }]}>
                  {item.title}
                </Text>
                <Text style={[styles.rightItemDesc, { color: colors.textSecondary }]}>
                  {item.desc}
                </Text>
              </View>
            ))}
          </View>
        )}
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  heroCard: {
    padding: 16,
  },
  heroHeaderRow: {
    marginBottom: 12,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  approvedBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  approvedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  heroSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 10,
    marginBottom: 10,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 15,
    fontWeight: '900',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  metricDivider: {
    width: 1,
    height: 24,
  },
  expandToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  expandToggleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  expandedContent: {
    marginTop: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    gap: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    paddingVertical: 0,
  },
  chipsScroll: {
    gap: 6,
    paddingBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  camerasList: {
    gap: 10,
    marginTop: 10,
  },
  cameraCard: {
    padding: 14,
  },
  camTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  camCodeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  camCodeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  activeDotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  activeDotText: {
    fontSize: 9,
    fontWeight: '800',
  },
  speedSign: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  speedSignNumber: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000000',
    lineHeight: 16,
  },
  speedSignUnit: {
    fontSize: 7,
    fontWeight: '800',
    color: '#DC2626',
    textTransform: 'uppercase',
  },
  camLocation: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  camDirection: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
  },
  violationsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 10,
  },
  violationTag: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  violationTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  mapsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  mapsBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyCard: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  emptyText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  rightsCard: {
    padding: 14,
    marginTop: 10,
  },
  rightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightsHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightsTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  rightsContent: {
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 10,
    gap: 8,
  },
  rightItem: {
    gap: 2,
  },
  rightItemTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  rightItemDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
});

