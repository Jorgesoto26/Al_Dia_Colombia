/**
 * Pestaña 4: "Indicadores y Ajustes"
 * Al Día Colombia - Tablero de consulta económica y preferencias del sistema
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVehicles } from '../../context/VehicleContext';
import { useTheme } from '../../context/ThemeContext';
import { AppBackground } from '../../components/AppBackground';
import { GlassCard } from '../../components/GlassCard';
import {
  DollarIcon,
  RefreshIcon,
  CheckIcon,
  AlertTriangleIcon,
  SettingsIcon,
  BellIcon,
  SproutIcon,
  FuelIcon,
  BriefcaseIcon,
} from '../../components/Icons';
import { AgroMarketSection } from './AgroMarketSection';
import { SecopSection } from './SecopSection';
import { COLORS } from '../../theme/colors';

export const IndicatorsScreen: React.FC = () => {
  const { indicators, trm, syncData, isSyncing } = useVehicles();
  const { themeMode, setThemeMode, isDark, colors } = useTheme();
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sipsa' | 'secop' | 'settings'>('sipsa');

  const handleSync = async () => {
    try {
      const msg = await syncData();
      setSyncMessage(msg);
      setTimeout(() => setSyncMessage(null), 4000);
    } catch (e: any) {
      Alert.alert('Sincronización', e?.message || 'Error al conectar con el servidor.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <AppBackground />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {activeTab === 'sipsa'
              ? 'Canasta e Insumos (SIPSA)'
              : activeTab === 'secop'
              ? 'Licitaciones y SECOP II'
              : 'Indicadores y Ajustes'}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {activeTab === 'sipsa'
              ? 'Monitoreo diario DANE en Centrales Mayoristas de Abastos'
              : activeTab === 'secop'
              ? 'Convocatorias y contratos públicos oficiales en Colombia'
              : 'Valores económicos oficiales (TRM, UVT, Salario 2026) y preferencias'}
          </Text>
        </View>

        {/* ================================================================ */}
        {/* SELECTOR SEGMENTADO: SIPSA vs SECOP II vs INDICADORES             */}
        {/* ================================================================ */}
        <View
          style={[
            styles.segmentContainer,
            {
              backgroundColor: isDark ? 'rgba(31, 41, 55, 0.6)' : 'rgba(226, 232, 240, 0.8)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.1)',
            },
          ]}
        >
          {/* Tab 1: SIPSA */}
          <TouchableOpacity
            style={[
              styles.segmentButton,
              activeTab === 'sipsa' && {
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
                shadowOpacity: 0.3,
                shadowRadius: 4,
              },
            ]}
            onPress={() => setActiveTab('sipsa')}
            activeOpacity={0.8}
          >
            <SproutIcon size={16} color={activeTab === 'sipsa' ? '#FFFFFF' : colors.textSecondary} />
            <Text
              style={[
                styles.segmentButtonText,
                {
                  color: activeTab === 'sipsa' ? '#FFFFFF' : colors.textSecondary,
                  fontWeight: activeTab === 'sipsa' ? '700' : '500',
                },
              ]}
              numberOfLines={1}
            >
              SIPSA Agro
            </Text>
          </TouchableOpacity>

          {/* Tab 2: SECOP II */}
          <TouchableOpacity
            style={[
              styles.segmentButton,
              activeTab === 'secop' && {
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
                shadowOpacity: 0.3,
                shadowRadius: 4,
              },
            ]}
            onPress={() => setActiveTab('secop')}
            activeOpacity={0.8}
          >
            <BriefcaseIcon size={16} color={activeTab === 'secop' ? '#FFFFFF' : colors.textSecondary} />
            <Text
              style={[
                styles.segmentButtonText,
                {
                  color: activeTab === 'secop' ? '#FFFFFF' : colors.textSecondary,
                  fontWeight: activeTab === 'secop' ? '700' : '500',
                },
              ]}
              numberOfLines={1}
            >
              SECOP II
            </Text>
          </TouchableOpacity>

          {/* Tab 3: Indicadores y Ajustes */}
          <TouchableOpacity
            style={[
              styles.segmentButton,
              activeTab === 'settings' && {
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
                shadowOpacity: 0.3,
                shadowRadius: 4,
              },
            ]}
            onPress={() => setActiveTab('settings')}
            activeOpacity={0.8}
          >
            <SettingsIcon size={16} color={activeTab === 'settings' ? '#FFFFFF' : colors.textSecondary} />
            <Text
              style={[
                styles.segmentButtonText,
                {
                  color: activeTab === 'settings' ? '#FFFFFF' : colors.textSecondary,
                  fontWeight: activeTab === 'settings' ? '700' : '500',
                },
              ]}
              numberOfLines={1}
            >
              Indicadores
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'sipsa' ? (
          <AgroMarketSection />
        ) : activeTab === 'secop' ? (
          <SecopSection />
        ) : (
          <>
            {/* ================================================================ */}
            {/* 1. BOTÓN DE SINCRONIZACIÓN CON SUPABASE */}
            {/* ================================================================ */}
            <GlassCard variant="primary" style={styles.syncCard}>
          <View style={styles.syncHeader}>
            <View style={styles.syncInfo}>
              <Text style={[styles.syncTitle, { color: colors.textPrimary }]}>Sincronización Cloud</Text>
              <Text style={[styles.syncDesc, { color: colors.textSecondary }]}>
                Descarga las reglas de Pico y Placa más recientes, festivos e indicadores
                actualizados desde Supabase.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.syncBtn}
              onPress={handleSync}
              disabled={isSyncing}
              activeOpacity={0.8}
            >
              {isSyncing ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <RefreshIcon size={16} color="#FFF" />
                  <Text style={styles.syncBtnText}>Actualizar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {syncMessage && (
            <View style={styles.syncFeedback}>
              <CheckIcon size={16} color={colors.success} />
              <Text style={[styles.syncFeedbackText, { color: colors.textSecondary }]}>{syncMessage}</Text>
            </View>
          )}
        </GlassCard>

        {/* ================================================================ */}
        {/* 2. TABLERO DE INDICADORES ECONÓMICOS DE COLOMBIA */}
        {/* ================================================================ */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Indicadores Económicos Vigentes</Text>
        </View>

        {/* Tarjeta Destacada del Dólar TRM */}
        <GlassCard variant="success" style={styles.indicatorCard}>
          <View style={styles.indicatorHeaderRow}>
            <View style={styles.indicatorTitleRow}>
              <View style={[styles.indicatorIconWrapper, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(5, 150, 105, 0.15)' }]}>
                <DollarIcon size={20} color={colors.success} />
              </View>
              <View>
                <Text style={[styles.indicatorName, { color: colors.textPrimary }]}>Dólar Oficial (TRM)</Text>
                <Text style={[styles.indicatorUnit, { color: colors.textSecondary }]}>Tasa Representativa del Mercado</Text>
              </View>
            </View>
            <Text style={[styles.indicatorValue, { color: isDark ? '#6EE7B7' : colors.success }]}>
              {trm?.formatted || '$4.150,00'}
            </Text>
          </View>
          <Text style={[styles.indicatorNotes, { color: colors.textSecondary }]}>
            Fuente: Banco de la República y Superintendencia Financiera vía Datos Abiertos.
          </Text>
        </GlassCard>

        {/* Tarjeta Informativa: Normatividad y Comparativa Salarial Oficial */}
        <GlassCard style={styles.salaryExplainerCard}>
          <View style={styles.explainerHeader}>
            <View style={[styles.explainerBadge, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.12)' }]}>
              <Text style={[styles.explainerBadgeText, { color: isDark ? '#93C5FD' : colors.primary }]}>Normativa Oficial Vigente 2026</Text>
            </View>
            <Text style={[styles.explainerSubtitle, { color: colors.textSecondary }]}>
              Decretos 1469 y 1470 de finales de 2025
            </Text>
          </View>

          <Text style={[styles.explainerDesc, { color: colors.textSecondary }]}>
            Valores oficiales de Colombia vigentes para el año 2026 expedidos por el Ministerio del Trabajo y ratificados legalmente. El ingreso total mensual de los trabajadores que devengan el salario mínimo alcanza los $2.000.000 COP:
          </Text>

          <View style={[styles.explainerTable, { borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)', backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(248, 250, 252, 0.9)' }]}>
            <View style={styles.tableRowHeader}>
              <Text style={[styles.tableColLabel, { color: colors.textSecondary }]}>Concepto</Text>
              <Text style={[styles.tableColVal, { color: colors.textSecondary }]}>2025 (Anterior)</Text>
              <Text style={[styles.tableColVal, { color: colors.primary, fontWeight: '800' }]}>2026 (Vigente)</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableColLabel, { color: colors.textPrimary }]}>Salario Mínimo</Text>
              <Text style={[styles.tableColVal, { color: colors.textSecondary }]}>$1.423.500</Text>
              <Text style={[styles.tableColVal, { color: colors.textPrimary, fontWeight: '700' }]}>$1.750.905</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableColLabel, { color: colors.textPrimary }]}>Aux. Transporte</Text>
              <Text style={[styles.tableColVal, { color: colors.textSecondary }]}>$200.000</Text>
              <Text style={[styles.tableColVal, { color: colors.textPrimary, fontWeight: '700' }]}>$249.095</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowTotal, { borderTopColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)' }]}>
              <Text style={[styles.tableColLabel, { color: isDark ? '#93C5FD' : colors.primary, fontWeight: '800' }]}>Total Devengado</Text>
              <Text style={[styles.tableColVal, { color: colors.textSecondary }]}>$1.623.500</Text>
              <Text style={[styles.tableColVal, { color: colors.success, fontWeight: '900' }]}>$2.000.000</Text>
            </View>
          </View>
        </GlassCard>

        {/* Lista de Indicadores de Supabase */}
        <View style={styles.indicatorsList}>
          {indicators.map(ind => {
            const isFine = ind.key === 'multa_pico_y_placa';
            const isFuel = ind.key === 'gasolina_promedio';
            const isTotal = ind.key === 'total_minimo_con_auxilio';

            const cardVariant = isFine ? 'danger' : isTotal ? 'primary' : 'default';

            return (
              <GlassCard
                key={ind.key}
                variant={cardVariant}
                style={styles.indicatorCard}
              >
                <View style={styles.indicatorHeaderRow}>
                  <View style={styles.indicatorTitleRow}>
                    <View
                      style={[
                        styles.indicatorIconWrapper,
                        isFine
                          ? { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(220, 38, 38, 0.15)' }
                          : isFuel
                          ? { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(217, 119, 6, 0.15)' }
                          : isTotal
                          ? { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(5, 150, 105, 0.15)' }
                          : { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.15)' },
                      ]}
                    >
                      {isFine ? (
                        <AlertTriangleIcon size={18} color={colors.danger} />
                      ) : isFuel ? (
                        <FuelIcon size={18} color={isDark ? '#FBBF24' : '#D97706'} />
                      ) : (
                        <DollarIcon size={18} color={isTotal ? colors.success : colors.primary} />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.indicatorName, { color: colors.textPrimary }]}>{ind.name}</Text>
                      {ind.unit && <Text style={[styles.indicatorUnit, { color: colors.textSecondary }]}>{ind.unit}</Text>}
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.indicatorValue,
                      {
                        color: isFine
                          ? isDark
                            ? '#FCA5A5'
                            : colors.danger
                          : isTotal
                          ? isDark
                            ? '#6EE7B7'
                            : colors.success
                          : colors.textPrimary,
                      },
                    ]}
                  >
                    {ind.formatted_value}
                  </Text>
                </View>

                {ind.notes ? (
                  <Text style={[styles.indicatorNotes, { color: colors.textSecondary }]}>{ind.notes}</Text>
                ) : null}
              </GlassCard>
            );
          })}
        </View>

        {/* ================================================================ */}
        {/* 3. APARIENCIA / TEMA DE LA APLICACIÓN */}
        {/* ================================================================ */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Apariencia de la App
          </Text>
        </View>

        <GlassCard style={styles.themeCard}>
          <Text style={[styles.themeTitle, { color: colors.textPrimary }]}>
            Tema de Interfaz
          </Text>
          <Text style={[styles.themeDesc, { color: colors.textSecondary }]}>
            Adapta la interfaz según tu dispositivo o fija el modo que prefieras.
          </Text>

          <View style={styles.themeSelectorRow}>
            <TouchableOpacity
              style={[
                styles.themeBtn,
                themeMode === 'system' && styles.themeBtnActive,
                {
                  backgroundColor:
                    themeMode === 'system'
                      ? colors.primary
                      : isDark
                      ? 'rgba(31, 41, 55, 0.6)'
                      : 'rgba(241, 245, 249, 0.95)',
                },
              ]}
              onPress={() => setThemeMode('system')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.themeBtnText,
                  themeMode === 'system'
                    ? styles.themeBtnTextActive
                    : { color: colors.textSecondary },
                ]}
              >
                📱 Sistema
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeBtn,
                themeMode === 'dark' && styles.themeBtnActive,
                {
                  backgroundColor:
                    themeMode === 'dark'
                      ? colors.primary
                      : isDark
                      ? 'rgba(31, 41, 55, 0.6)'
                      : 'rgba(241, 245, 249, 0.95)',
                },
              ]}
              onPress={() => setThemeMode('dark')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.themeBtnText,
                  themeMode === 'dark'
                    ? styles.themeBtnTextActive
                    : { color: colors.textSecondary },
                ]}
              >
                🌙 Oscuro
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeBtn,
                themeMode === 'light' && styles.themeBtnActive,
                {
                  backgroundColor:
                    themeMode === 'light'
                      ? colors.primary
                      : isDark
                      ? 'rgba(31, 41, 55, 0.6)'
                      : 'rgba(241, 245, 249, 0.95)',
                },
              ]}
              onPress={() => setThemeMode('light')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.themeBtnText,
                  themeMode === 'light'
                    ? styles.themeBtnTextActive
                    : { color: colors.textSecondary },
                ]}
              >
                ☀️ Claro
              </Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* ================================================================ */}
        {/* 4. INFORMACIÓN DEL SISTEMA Y OFFLINE-FIRST */}
        {/* ================================================================ */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Acerca de Al Día Colombia
          </Text>
        </View>

        <GlassCard style={styles.aboutCard}>
          <View style={styles.aboutRow}>
            <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Modo Offline-First</Text>
            <View style={styles.activePill}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>ACTIVO</Text>
            </View>
          </View>
          <Text style={[styles.aboutDesc, { color: colors.textMuted }]}>
            Esta aplicación guarda las normas en tu teléfono. No necesitas internet
            para saber si tienes Pico y Placa.
          </Text>

          <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)' }]} />

          <View style={styles.aboutRow}>
            <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Versión de la App</Text>
            <Text style={[styles.aboutVal, { color: colors.textPrimary }]}>v1.0.0 (MVP)</Text>
          </View>

          <View style={styles.aboutRow}>
            <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Cobertura</Text>
            <Text style={[styles.aboutVal, { color: colors.textPrimary }]}>15 Ciudades Principales</Text>
          </View>

          <View style={styles.aboutRow}>
            <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Privacidad</Text>
            <Text style={[styles.aboutVal, { color: colors.textPrimary }]}>100% Local (Sin Login)</Text>
          </View>
        </GlassCard>
        </>
      )}

        <View style={{ height: 36 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  header: {
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    paddingHorizontal: 4,
    borderRadius: 10,
  },
  segmentButtonText: {
    fontSize: 12,
  },
  syncCard: {
    marginBottom: 20,
    padding: 16,
  },
  syncHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  syncInfo: {
    flex: 1,
  },
  syncTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  syncDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 6,
  },
  syncBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  syncFeedback: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    gap: 6,
  },
  syncFeedbackText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  indicatorsList: {
    gap: 10,
    marginBottom: 20,
  },
  indicatorCard: {
    padding: 16,
    marginBottom: 10,
  },
  indicatorHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  indicatorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  indicatorIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  indicatorUnit: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  indicatorValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#93C5FD',
    marginLeft: 8,
  },
  indicatorNotes: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 10,
    lineHeight: 16,
  },
  salaryExplainerCard: {
    padding: 16,
    marginBottom: 14,
  },
  explainerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 6,
  },
  explainerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  explainerBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  explainerSubtitle: {
    fontSize: 11,
    fontWeight: '600',
  },
  explainerDesc: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  explainerTable: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tableRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.15)',
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  tableRowTotal: {
    borderTopWidth: 1,
    marginTop: 4,
    paddingTop: 6,
  },
  tableColLabel: {
    flex: 1.2,
    fontSize: 12,
    fontWeight: '600',
  },
  tableColVal: {
    flex: 1,
    fontSize: 12,
    textAlign: 'right',
  },
  aboutCard: {
    padding: 18,
    marginBottom: 20,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aboutLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  aboutVal: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    gap: 5,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  activeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.success,
  },
  aboutDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 10,
  },
  themeCard: {
    padding: 16,
    marginBottom: 20,
  },
  themeTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  themeDesc: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 14,
  },
  themeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  themeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeBtnActive: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  themeBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  themeBtnTextActive: {
    color: '#FFF',
    fontWeight: '800',
  },
});

export default IndicatorsScreen;

