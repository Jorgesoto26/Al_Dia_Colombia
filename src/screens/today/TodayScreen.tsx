/**
 * Pestaña 1: "Hoy" (Dashboard Principal)
 * Al Día Colombia - Principio: La información crítica se entiende en < 2 segundos
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVehicles } from '../../context/VehicleContext';
import { useTheme } from '../../context/ThemeContext';
import { AppBackground } from '../../components/AppBackground';
import { GlassCard } from '../../components/GlassCard';
import { StatusBadge } from '../../components/StatusBadge';
import { CityPickerModal } from '../../components/CityPickerModal';
import {
  CarIcon,
  MotoIcon,
  TaxiIcon,
  MapPinIcon,
  ChevronDownIcon,
  DollarIcon,
  CalendarIcon,
  PlusIcon,
  RefreshIcon,
  AlertTriangleIcon,
  FuelIcon,
} from '../../components/Icons';
import { useFuel } from '../../context/FuelContext';
import { GlassNativeAd } from '../../components/ads';
import { SpeedCamerasSection } from './SpeedCamerasSection';
import { COLORS } from '../../theme/colors';
import {
  getColombianGreeting,
  formatColombianDate,
  findNextHoliday,
  formatPlateDisplay,
} from '../../utils/formatters';

interface TodayScreenProps {
  navigation: any;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({ navigation }) => {
  const {
    favoriteVehicle,
    activeVehicle,
    vehicles,
    selectedCity,
    cities,
    evaluation,
    citySummary,
    trm,
    holidays,
    changeCity,
    setActiveVehicleId,
    syncData,
    isSyncing,
  } = useVehicles();

  const { isDark, colors } = useTheme();
  const { benchmark, formatCOP } = useFuel();

  const currentVehicle = activeVehicle || favoriteVehicle;

  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const greeting = getColombianGreeting();
  const todayFormatted = formatColombianDate(new Date());
  const nextHolidayInfo = findNextHoliday(holidays);

  const onRefresh = async () => {
    setRefreshing(true);
    await syncData();
    setRefreshing(false);
  };

  const getVehicleIcon = (type: string, color = COLORS.textPrimary) => {
    switch (type) {
      case 'moto':
        return <MotoIcon size={22} color={color} />;
      case 'taxi':
        return <TaxiIcon size={22} color={color} />;
      default:
        return <CarIcon size={22} color={color} />;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]} edges={['top', 'left', 'right']}>
      <AppBackground />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isSyncing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* ================================================================ */}
        {/* 1. HEADER: Saludo, Fecha y Selector de Ciudad */}
        {/* ================================================================ */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>{greeting} ☀️</Text>
            <Text style={[styles.date, { color: colors.textPrimary }]}>{todayFormatted}</Text>
          </View>

          {/* Selector de Ciudad */}
          <TouchableOpacity
            style={[
              styles.cityPickerBtn,
              {
                backgroundColor: isDark ? 'rgba(31, 41, 55, 0.65)' : '#FFFFFF',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.08)',
                elevation: isDark ? 0 : 2,
              },
            ]}
            onPress={() => setCityModalVisible(true)}
            activeOpacity={0.8}
          >
            <MapPinIcon size={16} color={colors.primary} />
            <Text style={[styles.cityPickerText, { color: colors.textPrimary }]} numberOfLines={1}>
              {selectedCity?.name || 'Colombia'}
            </Text>
            <ChevronDownIcon size={14} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* ================================================================ */}
        {/* 2. TARJETA PRINCIPAL: Estado de Mi Vehículo */}
        {/* ================================================================ */}
        {/* Selector rápido entre vehículos guardados si tiene más de uno */}
        {vehicles.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.vehiclePillsScroll}
            contentContainerStyle={styles.vehiclePillsContent}
          >
            {vehicles.map(v => {
              const isSelected = (currentVehicle?.id) === v.id;
              return (
                <TouchableOpacity
                  key={v.id}
                  style={[
                    styles.vehiclePill,
                    {
                      backgroundColor: isSelected
                        ? (isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(37, 99, 235, 0.12)')
                        : (isDark ? 'rgba(31, 41, 55, 0.65)' : '#FFFFFF'),
                      borderColor: isSelected
                        ? colors.primary
                        : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)'),
                    },
                  ]}
                  onPress={() => setActiveVehicleId(v.id)}
                  activeOpacity={0.8}
                >
                  {getVehicleIcon(
                    v.vehicle_type,
                    isSelected ? (isDark ? '#93C5FD' : colors.primary) : colors.textSecondary
                  )}
                  <Text
                    style={[
                      styles.vehiclePillText,
                      {
                        color: isSelected
                          ? (isDark ? '#93C5FD' : colors.primary)
                          : colors.textSecondary,
                        fontWeight: isSelected ? '800' : '600',
                      },
                    ]}
                  >
                    {v.alias} ({v.plate.slice(-3)})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {currentVehicle && evaluation ? (
          <GlassCard
            variant={
              evaluation.colorType === 'danger'
                ? 'danger'
                : evaluation.colorType === 'success'
                ? 'success'
                : evaluation.colorType === 'warning'
                ? 'warning'
                : 'default'
            }
            style={styles.mainStatusCard}
          >
            {/* Header de la Tarjeta de Vehículo */}
            <View style={styles.vehicleHeaderRow}>
              <View style={styles.vehicleInfo}>
                <View style={styles.vehicleTypeTag}>
                  {getVehicleIcon(currentVehicle.vehicle_type, isDark ? '#FFF' : colors.textPrimary)}
                  <Text style={[styles.vehicleAlias, { color: colors.textPrimary }]}>{currentVehicle.alias}</Text>
                </View>
                <Text style={[styles.vehiclePlate, { color: isDark ? '#93C5FD' : colors.primary }]}>
                  {formatPlateDisplay(currentVehicle.plate)}
                </Text>
              </View>

              <StatusBadge
                label={evaluation.badgeText}
                type={evaluation.colorType}
                size="medium"
              />
            </View>

            {/* Separador sutil */}
            <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.08)' }]} />

            {/* Estado Semafórico de Gran Impacto Visual */}
            <View style={styles.statusDetails}>
              <Text style={[styles.statusTitle, { color: colors.textPrimary }]}>{evaluation.title}</Text>
              <Text style={[styles.statusSubtitle, { color: colors.textSecondary }]}>{evaluation.subtitle}</Text>
              <Text style={[styles.statusMessage, { color: colors.textSecondary }]}>{evaluation.message}</Text>
            </View>

            {/* Barra de horario si aplica restricción */}
            {evaluation.matchedRule && (
              <View
                style={[
                  styles.scheduleBar,
                  {
                    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.55)' : 'rgba(241, 245, 249, 0.95)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(15, 23, 42, 0.08)',
                  },
                ]}
              >
                <Text style={[styles.scheduleBarLabel, { color: colors.textSecondary }]}>Horario de restricción:</Text>
                <Text style={[styles.scheduleBarTime, { color: colors.textPrimary }]}>
                  {evaluation.matchedRule.start_time.slice(0, 5)} - {evaluation.matchedRule.end_time.slice(0, 5)}
                </Text>
              </View>
            )}

            {/* Selector de otro vehículo si el usuario tiene más de uno */}
            {vehicles.length > 1 && (
              <TouchableOpacity
                style={styles.switchVehicleBtn}
                onPress={() => navigation.navigate('Vehículos')}
                activeOpacity={0.7}
              >
                <Text style={styles.switchVehicleText}>
                  Ver mis otros {vehicles.length - 1} vehículos →
                </Text>
              </TouchableOpacity>
            )}
          </GlassCard>
        ) : (
          /* Empty State: Sin Vehículo Registrado */
          <GlassCard variant="primary" style={styles.noVehicleCard}>
            <View style={styles.noVehicleContent}>
              <View style={styles.noVehicleIconWrapper}>
                <CarIcon size={32} color={COLORS.primary} />
              </View>
              <Text style={[styles.noVehicleTitle, { color: colors.textPrimary }]}>Configura tu Vehículo</Text>
              <Text style={[styles.noVehicleDesc, { color: colors.textSecondary }]}>
                Agrega la placa de tu carro o moto para que la app te avise en 2 segundos
                si tienes Pico y Placa hoy en {selectedCity.name}.
              </Text>
              <TouchableOpacity
                style={styles.addVehicleBtn}
                onPress={() => navigation.navigate('Vehículos')}
                activeOpacity={0.8}
              >
                <PlusIcon size={18} color="#FFF" />
                <Text style={styles.addVehicleBtnText}>Agregar mi vehículo</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        )}

        {/* ================================================================ */}
        {/* 3. RESUMEN GENERAL DE LA CIUDAD HOY */}
        {/* ================================================================ */}
        <View style={styles.sectionTitleRow}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Pico y Placa Hoy en {selectedCity.name}
          </Text>
        </View>

        <GlassCard style={styles.citySummaryCard}>
          {citySummary?.isHoliday ? (
            <View style={styles.holidayBanner}>
              <Text style={styles.holidayBannerTitle}>🎉 DÍA FESTIVO OFICIAL</Text>
              <Text style={styles.holidayBannerDesc}>
                {citySummary.holidayName}: No aplica medida de restricción vehicular en la ciudad.
              </Text>
            </View>
          ) : citySummary?.groups && citySummary.groups.length > 0 ? (
            <View style={styles.groupsContainer}>
              {citySummary.groups.map(group => (
                <View key={group.vehicleType} style={styles.groupRow}>
                  <View style={styles.groupHeader}>
                    <View style={styles.groupTypeWithIcon}>
                      {getVehicleIcon(group.vehicleType, colors.primary)}
                      <Text style={[styles.groupLabel, { color: colors.textPrimary }]}>{group.label}</Text>
                    </View>
                    <Text style={[styles.groupSchedule, { color: colors.textSecondary }]}>{group.schedule}</Text>
                  </View>

                  {/* Cajas con los dígitos restringidos */}
                  <View style={styles.digitsRow}>
                    {group.restrictedDigits.map(digit => (
                      <View
                        key={digit}
                        style={[
                          styles.digitBox,
                          {
                            backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(241, 245, 249, 0.95)',
                            borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.08)',
                          },
                        ]}
                      >
                        <Text style={[styles.digitText, { color: colors.textPrimary }]}>{digit}</Text>
                      </View>
                    ))}
                  </View>

                  {group.notes ? (
                    <Text style={[styles.groupNotes, { color: colors.textSecondary }]} numberOfLines={2}>
                      ℹ️ {group.notes}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noRestrictionBox}>
              <Text style={[styles.noRestrictionText, { color: colors.textSecondary }]}>
                No rige restricción de Pico y Placa el día de hoy en {selectedCity.name}.
              </Text>
            </View>
          )}
        </GlassCard>

        {/* ================================================================ */}
        {/* CÁMARAS SALVAVIDAS Y FOTODETECCIÓN ANSV EN LA CIUDAD             */}
        {/* ================================================================ */}
        <SpeedCamerasSection
          cityId={selectedCity.slug || selectedCity.id}
          cityName={selectedCity.name}
        />

        {/* ================================================================ */}
        {/* PUBLICIDAD NATIVA GLASSMORPHISM */}
        {/* ================================================================ */}
        <GlassNativeAd />

        {/* ================================================================ */}
        {/* 4. WIDGET ECONÓMICO Y FESTIVOS (BENTO GRID) */}
        {/* ================================================================ */}
        <View style={styles.sectionTitleRow}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Economía y Calendario
          </Text>
        </View>

        <View style={styles.bentoGrid}>
          {/* Tarjeta 1: Dólar TRM Hoy */}
          <GlassCard variant="primary" style={styles.bentoCard}>
            <View style={styles.bentoHeader}>
              <View style={[styles.bentoIcon, { backgroundColor: isDark ? 'rgba(56, 189, 248, 0.20)' : 'rgba(37, 99, 235, 0.12)' }]}>
                <DollarIcon size={20} color={colors.primary} />
              </View>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>OFICIAL</Text>
              </View>
            </View>

            <Text style={[styles.bentoLabel, { color: colors.textSecondary }]}>Dólar TRM Hoy</Text>
            <Text style={[styles.trmValue, { color: isDark ? '#BAE6FD' : colors.primary }]}>
              {trm?.formatted || '$4.150,00'}
            </Text>
            <Text style={[styles.bentoSubtext, { color: colors.textMuted }]}>
              {trm?.source === 'api' ? 'Superfinanciera • En vivo' : 'Vigencia oficial Datos Abiertos'}
            </Text>
          </GlassCard>

          {/* Tarjeta 2: Próximo Día Festivo */}
          <GlassCard variant="warning" style={styles.bentoCard}>
            <View style={styles.bentoHeader}>
              <View style={[styles.bentoIcon, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.20)' : 'rgba(217, 119, 6, 0.12)' }]}>
                <CalendarIcon size={20} color={colors.accent} />
              </View>
              {nextHolidayInfo?.holiday.is_bridge && (
                <View style={styles.bridgeBadge}>
                  <Text style={styles.bridgeText}>PUENTE</Text>
                </View>
              )}
            </View>

            <Text style={[styles.bentoLabel, { color: colors.textSecondary }]}>Próximo Festivo</Text>
            <Text style={[styles.holidayDays, { color: isDark ? '#FDE68A' : colors.accent }]}>
              {nextHolidayInfo
                ? nextHolidayInfo.daysRemaining === 0
                  ? '¡Es Hoy!'
                  : nextHolidayInfo.daysRemaining === 1
                  ? 'Mañana'
                  : `Faltan ${nextHolidayInfo.daysRemaining} días`
                : 'Sin festivos'}
            </Text>
            <Text style={[styles.bentoSubtext, { color: colors.textMuted }]} numberOfLines={1}>
              {nextHolidayInfo?.holiday.name || 'Calendario Colombia'}
            </Text>
          </GlassCard>
        </View>

        {/* Acceso Directo Destacado a Precios de Combustibles */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Combustibles')}
          activeOpacity={0.85}
          style={{ marginTop: 14 }}
        >
          <GlassCard style={styles.fuelBannerCard}>
            <View style={styles.fuelBannerContent}>
              <View
                style={[
                  styles.fuelBannerIcon,
                  {
                    backgroundColor: isDark
                      ? 'rgba(59, 130, 246, 0.2)'
                      : 'rgba(37, 99, 235, 0.12)',
                  },
                ]}
              >
                <FuelIcon size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={[styles.fuelBannerTitle, { color: colors.textPrimary }]}>
                  Gasolina Corriente: {formatCOP(benchmark.corriente)}
                </Text>
                <Text style={[styles.fuelBannerSubtitle, { color: colors.textSecondary }]}>
                  Referencia oficial en {selectedCity.name} • Ver estaciones y ahorro
                </Text>
              </View>
              <Text style={{ fontSize: 18, color: colors.primary, fontWeight: '800' }}>→</Text>
            </View>
          </GlassCard>
        </TouchableOpacity>

        {/* Espacio para la barra de navegación inferior */}
        <View style={{ height: 28 }} />
      </ScrollView>

      {/* Modal para cambiar de ciudad */}
      <CityPickerModal
        visible={cityModalVisible}
        cities={cities}
        selectedCityId={selectedCity?.id}
        onSelect={changeCity}
        onClose={() => setCityModalVisible(false)}
      />
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
    paddingTop: 12,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 6,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  date: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  cityPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 58, 138, 0.45)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: 'rgba(96, 165, 250, 0.45)',
    gap: 6,
  },
  cityPickerText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    maxWidth: 95,
  },
  mainStatusCard: {
    marginBottom: 20,
  },
  vehicleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vehicleAlias: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  vehiclePlate: {
    color: '#93C5FD',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 1.5,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginVertical: 14,
  },
  statusDetails: {
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#E2E8F0',
    marginTop: 4,
    fontWeight: '600',
  },
  statusMessage: {
    fontSize: 13,
    color: '#CBD5E1',
    marginTop: 8,
    lineHeight: 19,
  },
  scheduleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 6,
  },
  scheduleBarLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  scheduleBarTime: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  switchVehicleBtn: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 6,
  },
  switchVehicleText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  noVehicleCard: {
    marginBottom: 20,
    padding: 24,
  },
  noVehicleContent: {
    alignItems: 'center',
    textAlign: 'center',
  },
  noVehicleIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(59, 130, 246, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  noVehicleTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  noVehicleDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
  },
  addVehicleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 24,
    gap: 8,
  },
  addVehicleBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  citySummaryCard: {
    marginBottom: 20,
    padding: 16,
  },
  holidayBanner: {
    padding: 8,
    alignItems: 'center',
  },
  holidayBannerTitle: {
    color: COLORS.success,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  holidayBannerDesc: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
  groupsContainer: {
    gap: 16,
  },
  groupRow: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    paddingBottom: 14,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  groupTypeWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  groupLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  groupSchedule: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  digitsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  digitBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.22)',
    borderWidth: 1.2,
    borderColor: 'rgba(248, 113, 113, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.danger,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  digitText: {
    color: '#FECACA',
    fontSize: 17,
    fontWeight: '900',
  },
  groupNotes: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 8,
    lineHeight: 15,
  },
  noRestrictionBox: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  noRestrictionText: {
    color: COLORS.success,
    fontSize: 14,
    fontWeight: '600',
  },
  bentoGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  bentoCard: {
    flex: 1,
    padding: 16,
  },
  bentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bentoIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    gap: 4,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.success,
  },
  bridgeBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  bridgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.accent,
  },
  bentoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  trmValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginVertical: 4,
  },
  holidayDays: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginVertical: 4,
  },
  bentoSubtext: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  vehiclePillsScroll: {
    marginBottom: 12,
  },
  vehiclePillsContent: {
    gap: 8,
    paddingRight: 10,
  },
  vehiclePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.65)',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 6,
  },
  vehiclePillActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    borderColor: COLORS.primary,
  },
  vehiclePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  vehiclePillTextActive: {
    color: '#93C5FD',
  },
  fuelBannerCard: {
    padding: 14,
  },
  fuelBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fuelBannerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fuelBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  fuelBannerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default TodayScreen;
