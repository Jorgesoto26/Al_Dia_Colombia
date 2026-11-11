/**
 * Pestaña 3: "Calendario y Festivos"
 * Al Día Colombia - Calendario oficial Ley Emiliani y Buscador predictivo de Pico y Placa
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVehicles } from '../../context/VehicleContext';
import { useTheme } from '../../context/ThemeContext';
import { AppBackground } from '../../components/AppBackground';
import { GlassCard } from '../../components/GlassCard';
import { StatusBadge } from '../../components/StatusBadge';
import {
  CalendarIcon,
  CarIcon,
  CheckIcon,
  RoadIcon,
} from '../../components/Icons';
import { TollCalculatorSection } from './TollCalculatorSection';
import { COLORS } from '../../theme/colors';
import {
  findNextBridge,
  formatShortDate,
  formatPlateDisplay,
} from '../../utils/formatters';
import { evaluatePicoYPlaca } from '../../utils/picoYPlacaEngine';

export const CalendarScreen: React.FC = () => {
  const { holidays, favoriteVehicle, rules, selectedCity } = useVehicles();
  const { isDark, colors } = useTheme();

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [testDateOffset, setTestDateOffset] = useState<number>(0); // 0 = hoy, 1 = mañana, etc.
  const [mainTab, setMainTab] = useState<'calendar' | 'tolls'>('calendar');

  const nextBridgeInfo = findNextBridge(holidays);

  // Filtrar festivos por el año seleccionado
  const filteredHolidays = holidays.filter(h =>
    h.date.startsWith(selectedYear.toString())
  );

  // Simulación predictiva para los próximos 14 días
  const upcomingDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;
    return { date: d, dateStr, offset: i };
  });

  const selectedUpcoming = upcomingDays[testDateOffset] || upcomingDays[0];

  // Evaluar restricción para el día seleccionado en el buscador predictivo
  const predictionResult = favoriteVehicle
    ? evaluatePicoYPlaca({
        date: selectedUpcoming.date,
        cityId: favoriteVehicle.city_id || selectedCity.id,
        vehicleType: favoriteVehicle.vehicle_type,
        plateNumberOrDigit: favoriteVehicle.plate,
        holidays,
        rules,
        currentTime: '10:00:00', // franja activa típica
      })
    : null;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]} edges={['top', 'left', 'right']}>
      <AppBackground />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {mainTab === 'calendar' ? 'Calendario de Festivos' : 'Peajes y Rutas (INVIAS/ANI)'}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {mainTab === 'calendar'
              ? 'Festivos oficiales en Colombia y planeador de movilidad'
              : 'Tarifas 2026, cálculo de viaje y auxilio vial #767'}
          </Text>
        </View>

        {/* ================================================================ */}
        {/* SELECTOR PRINCIPAL: FESTIVOS vs PEAJES Y RUTAS                   */}
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
          <TouchableOpacity
            style={[
              styles.segmentButton,
              mainTab === 'calendar' && {
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
                shadowOpacity: 0.3,
                shadowRadius: 4,
              },
            ]}
            onPress={() => setMainTab('calendar')}
            activeOpacity={0.8}
          >
            <CalendarIcon size={16} color={mainTab === 'calendar' ? '#FFFFFF' : colors.textSecondary} />
            <Text
              style={[
                styles.segmentButtonText,
                {
                  color: mainTab === 'calendar' ? '#FFFFFF' : colors.textSecondary,
                  fontWeight: mainTab === 'calendar' ? '700' : '500',
                },
              ]}
            >
              Festivos y Puentes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentButton,
              mainTab === 'tolls' && {
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
                shadowOpacity: 0.3,
                shadowRadius: 4,
              },
            ]}
            onPress={() => setMainTab('tolls')}
            activeOpacity={0.8}
          >
            <RoadIcon size={16} color={mainTab === 'tolls' ? '#FFFFFF' : colors.textSecondary} />
            <Text
              style={[
                styles.segmentButtonText,
                {
                  color: mainTab === 'tolls' ? '#FFFFFF' : colors.textSecondary,
                  fontWeight: mainTab === 'tolls' ? '700' : '500',
                },
              ]}
            >
              Peajes y Rutas
            </Text>
          </TouchableOpacity>
        </View>

        {mainTab === 'calendar' ? (
          <>
            {/* ================================================================ */}
            {/* 1. BANNER: PRÓXIMO PUENTE FESTIVO DESTACADO */}
            {/* ================================================================ */}
            {nextBridgeInfo && (
              <GlassCard variant="warning" style={styles.bridgeCard}>
                <View style={styles.bridgeHeader}>
                  <View style={styles.bridgeTag}>
                    <Text style={styles.bridgeTagText}>🏖️ PRÓXIMO PUENTE FESTIVO</Text>
                  </View>
                  <Text style={[styles.bridgeCountdown, { color: isDark ? '#FDE68A' : colors.accent }]}>
                    {nextBridgeInfo.daysRemaining === 0
                      ? '¡Es hoy!'
                      : nextBridgeInfo.daysRemaining === 1
                      ? 'Mañana'
                      : `En ${nextBridgeInfo.daysRemaining} días`}
                  </Text>
                </View>

                <Text style={[styles.bridgeName, { color: colors.textPrimary }]}>{nextBridgeInfo.holiday.name}</Text>
                <Text style={[styles.bridgeDate, { color: colors.textSecondary }]}>
                  Lunes festivo • {nextBridgeInfo.formattedDate}
                </Text>
                <Text style={[styles.bridgeTip, { color: colors.textSecondary }]}>
                  Recuerda: Los lunes festivos no rige Pico y Placa ordinario en las ciudades.
                </Text>
              </GlassCard>
            )}

        {/* ================================================================ */}
        {/* 2. BUSCADOR PREDICTIVO POR FECHA (Pico y Placa a Futuro) */}
        {/* ================================================================ */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Consulta de Pico y Placa Futuro</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Toca un día para saber si tu vehículo podrá circular
          </Text>
        </View>

        <GlassCard style={styles.predictorCard}>
          {/* Selector de días horizontales */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daysScroll}
          >
            {upcomingDays.map((item, idx) => {
              const isSelected = item.offset === testDateOffset;
              const dayNum = item.date.getDate();
              const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
              const dayName = dayNames[item.date.getDay()];
              const isHoliday = holidays.some(h => h.date === item.dateStr);

              return (
                <TouchableOpacity
                  key={item.dateStr}
                  style={[
                    styles.dayChip,
                    {
                      backgroundColor: isSelected
                        ? colors.primary
                        : isDark
                        ? 'rgba(31, 41, 55, 0.6)'
                        : '#F1F5F9',
                      borderColor: isSelected
                        ? colors.primary
                        : isDark
                        ? 'rgba(255, 255, 255, 0.06)'
                        : 'rgba(15, 23, 42, 0.08)',
                    },
                    isHoliday && !isSelected && styles.dayChipHoliday,
                  ]}
                  onPress={() => setTestDateOffset(idx)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dayChipName,
                      { color: isSelected ? '#FFF' : colors.textSecondary },
                    ]}
                  >
                    {idx === 0 ? 'Hoy' : idx === 1 ? 'Mañ' : dayName}
                  </Text>
                  <Text
                    style={[
                      styles.dayChipNum,
                      { color: isSelected ? '#FFF' : colors.textPrimary },
                    ]}
                  >
                    {dayNum}
                  </Text>
                  {isHoliday && <View style={styles.holidayDot} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Resultado de la predicción */}
          {favoriteVehicle && predictionResult ? (
            <View
              style={[
                styles.predictionBox,
                {
                  backgroundColor: isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(241, 245, 249, 0.7)',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.08)',
                },
              ]}
            >
              <View style={styles.predictionVehicleRow}>
                <View style={styles.predictionVehicleBadge}>
                  <CarIcon size={16} color={isDark ? '#FFF' : colors.textPrimary} />
                  <Text style={[styles.predictionVehicleName, { color: colors.textPrimary }]}>
                    {favoriteVehicle.alias} ({formatPlateDisplay(favoriteVehicle.plate)})
                  </Text>
                </View>
                <StatusBadge
                  label={predictionResult.badgeText}
                  type={predictionResult.colorType}
                  size="small"
                />
              </View>

              <Text style={[styles.predictionTitle, { color: colors.textPrimary }]}>{predictionResult.title}</Text>
              <Text style={[styles.predictionMessage, { color: colors.textSecondary }]}>{predictionResult.message}</Text>
            </View>
          ) : (
            <View style={styles.predictionEmpty}>
              <Text style={[styles.predictionEmptyText, { color: colors.textSecondary }]}>
                Registra tu vehículo en la pestaña "Vehículos" para calcular si tendrás
                Pico y Placa en la fecha elegida.
              </Text>
            </View>
          )}
        </GlassCard>

        {/* ================================================================ */}
        {/* 3. LISTADO COMPLETO DE FESTIVOS DEL AÑO */}
        {/* ================================================================ */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Festivos de Colombia</Text>

          {/* Selector de Año */}
          <View
            style={[
              styles.yearToggle,
              {
                backgroundColor: isDark ? 'rgba(31, 41, 55, 0.7)' : 'rgba(241, 245, 249, 0.95)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.yearBtn,
                selectedYear === 2025 && styles.yearBtnActive,
              ]}
              onPress={() => setSelectedYear(2025)}
            >
              <Text
                style={[
                  styles.yearBtnText,
                  selectedYear === 2025 ? styles.yearBtnTextActive : { color: colors.textSecondary },
                ]}
              >
                2025
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.yearBtn,
                selectedYear === 2026 && styles.yearBtnActive,
              ]}
              onPress={() => setSelectedYear(2026)}
            >
              <Text
                style={[
                  styles.yearBtnText,
                  selectedYear === 2026 ? styles.yearBtnTextActive : { color: colors.textSecondary },
                ]}
              >
                2026
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.holidaysList}>
          {filteredHolidays.map(item => {
            const isBridge = item.is_bridge;
            const shortDate = formatShortDate(item.date);

            return (
              <GlassCard key={item.date} style={styles.holidayItem}>
                <View
                  style={[
                    styles.holidayDateBox,
                    {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(241, 245, 249, 0.95)',
                      borderColor: isDark ? 'transparent' : 'rgba(15, 23, 42, 0.06)',
                      borderWidth: isDark ? 0 : 1,
                    },
                  ]}
                >
                  <Text style={[styles.holidayDateShort, { color: colors.textPrimary }]}>{shortDate}</Text>
                  <Text style={[styles.holidayYear, { color: colors.textSecondary }]}>{item.date.slice(0, 4)}</Text>
                </View>

                <View style={styles.holidayContent}>
                  <Text style={[styles.holidayNameText, { color: colors.textPrimary }]}>{item.name}</Text>
                  <Text style={[styles.holidayTypeDesc, { color: colors.textSecondary }]}>
                    {isBridge ? 'Puente Festivo (Ley Emiliani)' : 'Festivo oficial'}
                  </Text>
                </View>

                {isBridge && (
                  <View style={styles.bridgeMiniBadge}>
                    <Text style={styles.bridgeMiniBadgeText}>Puente</Text>
                  </View>
                )}
              </GlassCard>
            );
          })}
        </View>
          </>
        ) : (
          <TollCalculatorSection />
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
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
  },
  segmentButtonText: {
    fontSize: 13,
  },
  bridgeCard: {
    marginBottom: 20,
    padding: 18,
  },
  bridgeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bridgeTag: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  bridgeTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.accent,
  },
  bridgeCountdown: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.accent,
  },
  bridgeName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  bridgeDate: {
    fontSize: 14,
    color: '#FDE68A',
    fontWeight: '600',
    marginBottom: 8,
  },
  bridgeTip: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  predictorCard: {
    marginBottom: 20,
    padding: 16,
  },
  daysScroll: {
    gap: 8,
    paddingBottom: 14,
  },
  dayChip: {
    width: 52,
    height: 64,
    borderRadius: 14,
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  dayChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dayChipHoliday: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  dayChipName: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  dayChipNum: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '800',
  },
  dayChipTextSelected: {
    color: '#FFF',
  },
  holidayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.accent,
    marginTop: 3,
  },
  predictionBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  predictionVehicleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  predictionVehicleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  predictionVehicleName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  predictionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  predictionMessage: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  predictionEmpty: {
    padding: 14,
    alignItems: 'center',
  },
  predictionEmptyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  yearToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    borderRadius: 16,
    padding: 3,
  },
  yearBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  yearBtnActive: {
    backgroundColor: COLORS.primary,
  },
  yearBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  yearBtnTextActive: {
    color: '#FFF',
  },
  holidaysList: {
    gap: 10,
  },
  holidayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  holidayDateBox: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 14,
  },
  holidayDateShort: {
    fontSize: 13,
    fontWeight: '800',
    color: '#93C5FD',
  },
  holidayYear: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  holidayContent: {
    flex: 1,
  },
  holidayNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  holidayTypeDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  bridgeMiniBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  bridgeMiniBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.accent,
  },
});

export default CalendarScreen;

