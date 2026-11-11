/**
 * Pestaña de Combustibles y Estaciones de Servicio (SICOM / MinMinas)
 * Al Día Colombia - Offline-First
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVehicles } from '../../context/VehicleContext';
import { useTheme } from '../../context/ThemeContext';
import { useFuel } from '../../context/FuelContext';
import { AppBackground } from '../../components/AppBackground';
import { GlassCard } from '../../components/GlassCard';
import { CityPickerModal } from '../../components/CityPickerModal';
import {
  FuelIcon,
  MapPinIcon,
  ChevronDownIcon,
  SearchIcon,
  ZapIcon,
  DropletIcon,
  CheckIcon,
  StarIcon,
  CarIcon,
  MotoIcon,
  TaxiIcon,
} from '../../components/Icons';
import { FuelType, FuelStation } from '../../types/fuel.types';
import { FUEL_PRODUCTS } from '../../services/fuelService';
import { COLORS } from '../../theme/colors';
import { VehicleType } from '../../types/database.types';

export const FuelScreen: React.FC = () => {
  const { cities, selectedCity, changeCity, vehicles, activeVehicle, favoriteVehicle } = useVehicles();
  const currentVehicle = activeVehicle || favoriteVehicle;
  const { colors, isDark } = useTheme();
  const {
    selectedFuelType,
    setSelectedFuelType,
    stations,
    benchmark,
    cheapestStation,
    isLoading,
    searchQuery,
    setSearchQuery,
    refreshFuelData,
    calculate,
    formatCOP,
  } = useFuel();

  const [isCityModalVisible, setCityModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Estados de la calculadora de tanqueada
  const [calcMode, setCalcMode] = useState<'budget' | 'gallons'>('budget');
  const [calcInput, setCalcInput] = useState<number>(50000);
  const [calcVehicleType, setCalcVehicleType] = useState<VehicleType>(
    currentVehicle?.vehicle_type || 'particular'
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshFuelData();
    setRefreshing(false);
  };

  const handleOpenMaps = (station: FuelStation) => {
    const query = encodeURIComponent(`${station.name} ${station.address} ${station.city_name}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Mapa', 'No se pudo abrir la aplicación de mapas.');
    });
  };

  const calculation = calculate(calcInput, calcMode, calcVehicleType);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]} edges={['top', 'left', 'right']}>
      <AppBackground />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isLoading}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* ================================================================ */}
        {/* 1. HEADER Y SELECTOR DE CIUDAD */}
        {/* ================================================================ */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Precios de Combustibles</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Estaciones oficiales y precios SICOM / MinMinas
            </Text>
          </View>

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
        {/* 2. BANNER OFICIAL DE PRECIO DE REFERENCIA (CREG / MINMINAS) */}
        {/* ================================================================ */}
        <GlassCard variant="primary" style={styles.benchmarkCard}>
          <View style={styles.benchmarkHeader}>
            <View style={styles.benchmarkBadge}>
              <Text style={styles.benchmarkBadgeText}>CREG / MINMINAS</Text>
            </View>
            <Text style={[styles.benchmarkPeriod, { color: colors.textSecondary }]}>
              {benchmark.effective_period}
            </Text>
          </View>

          <Text style={[styles.benchmarkTitle, { color: colors.textPrimary }]}>
            Precio Oficial de Referencia en {benchmark.city_name}
          </Text>

          <View style={styles.benchmarkGrid}>
            <View
              style={[
                styles.benchmarkItem,
                {
                  backgroundColor: isDark ? 'rgba(31, 41, 55, 0.7)' : 'rgba(241, 245, 249, 0.95)',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)',
                },
              ]}
            >
              <Text style={[styles.benchmarkLabel, { color: colors.textSecondary }]}>Corriente</Text>
              <Text style={[styles.benchmarkValue, { color: colors.primary }]}>
                {formatCOP(benchmark.corriente)}
              </Text>
              <Text style={[styles.benchmarkUnit, { color: colors.textMuted }]}>/gal</Text>
            </View>

            <View
              style={[
                styles.benchmarkItem,
                {
                  backgroundColor: isDark ? 'rgba(31, 41, 55, 0.7)' : 'rgba(241, 245, 249, 0.95)',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)',
                },
              ]}
            >
              <Text style={[styles.benchmarkLabel, { color: colors.textSecondary }]}>Extra</Text>
              <Text style={[styles.benchmarkValue, { color: colors.accent }]}>
                {formatCOP(benchmark.extra)}
              </Text>
              <Text style={[styles.benchmarkUnit, { color: colors.textMuted }]}>/gal</Text>
            </View>

            <View
              style={[
                styles.benchmarkItem,
                {
                  backgroundColor: isDark ? 'rgba(31, 41, 55, 0.7)' : 'rgba(241, 245, 249, 0.95)',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)',
                },
              ]}
            >
              <Text style={[styles.benchmarkLabel, { color: colors.textSecondary }]}>ACPM</Text>
              <Text style={[styles.benchmarkValue, { color: colors.success }]}>
                {formatCOP(benchmark.diesel)}
              </Text>
              <Text style={[styles.benchmarkUnit, { color: colors.textMuted }]}>/gal</Text>
            </View>

            <View
              style={[
                styles.benchmarkItem,
                {
                  backgroundColor: isDark ? 'rgba(31, 41, 55, 0.7)' : 'rgba(241, 245, 249, 0.95)',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)',
                },
              ]}
            >
              <Text style={[styles.benchmarkLabel, { color: colors.textSecondary }]}>Gas GNV</Text>
              <Text style={[styles.benchmarkValue, { color: colors.info }]}>
                {formatCOP(benchmark.gnv)}
              </Text>
              <Text style={[styles.benchmarkUnit, { color: colors.textMuted }]}>/m³</Text>
            </View>
          </View>
        </GlassCard>

        {/* ================================================================ */}
        {/* 3. SELECTOR DE TIPO DE COMBUSTIBLE (PILLS) */}
        {/* ================================================================ */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Tipo de Combustible</Text>
        </View>

        <View style={styles.fuelTypeRow}>
          {(['corriente', 'extra', 'diesel', 'gnv'] as FuelType[]).map(type => {
            const isSelected = selectedFuelType === type;
            const meta = FUEL_PRODUCTS[type];

            return (
              <TouchableOpacity
                key={type}
                style={[
                  styles.fuelTypePill,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : isDark
                      ? 'rgba(31, 41, 55, 0.65)'
                      : '#FFFFFF',
                    borderColor: isSelected
                      ? colors.primary
                      : isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(15, 23, 42, 0.08)',
                  },
                ]}
                onPress={() => setSelectedFuelType(type)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.fuelTypePillText,
                    {
                      color: isSelected ? '#FFFFFF' : colors.textPrimary,
                      fontWeight: isSelected ? '800' : '600',
                    },
                  ]}
                >
                  {meta.shortName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ================================================================ */}
        {/* 4. CALCULADORA DE TANQUEADA Y AUTONOMÍA */}
        {/* ================================================================ */}
        <GlassCard style={styles.calcCard}>
          <View style={styles.calcHeader}>
            <View style={styles.calcIconCircle}>
              <FuelIcon size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.calcTitle, { color: colors.textPrimary }]}>Calculadora de Tanqueada</Text>
              <Text style={[styles.calcSubtitle, { color: colors.textSecondary }]}>
                ¿Cuánto te rinde tu dinero en carretera y ciudad?
              </Text>
            </View>
          </View>

          {/* Tipo de vehículo para estimar autonomía */}
          <View style={styles.vehicleTypeSelector}>
            <TouchableOpacity
              style={[
                styles.vehicleTypeBtn,
                calcVehicleType === 'particular' && styles.vehicleTypeBtnActive,
                {
                  backgroundColor:
                    calcVehicleType === 'particular'
                      ? colors.primary
                      : isDark
                      ? 'rgba(31, 41, 55, 0.6)'
                      : '#F1F5F9',
                },
              ]}
              onPress={() => setCalcVehicleType('particular')}
            >
              <CarIcon size={16} color={calcVehicleType === 'particular' ? '#FFF' : colors.textSecondary} />
              <Text
                style={[
                  styles.vehicleTypeBtnText,
                  { color: calcVehicleType === 'particular' ? '#FFF' : colors.textSecondary },
                ]}
              >
                Carro (~40 km/gal)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.vehicleTypeBtn,
                calcVehicleType === 'moto' && styles.vehicleTypeBtnActive,
                {
                  backgroundColor:
                    calcVehicleType === 'moto'
                      ? colors.primary
                      : isDark
                      ? 'rgba(31, 41, 55, 0.6)'
                      : '#F1F5F9',
                },
              ]}
              onPress={() => setCalcVehicleType('moto')}
            >
              <MotoIcon size={16} color={calcVehicleType === 'moto' ? '#FFF' : colors.textSecondary} />
              <Text
                style={[
                  styles.vehicleTypeBtnText,
                  { color: calcVehicleType === 'moto' ? '#FFF' : colors.textSecondary },
                ]}
              >
                Moto (~120 km/gal)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botones de Presupuesto Rápido */}
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Elige tu presupuesto:</Text>
          <View style={styles.budgetShortcuts}>
            {[30000, 50000, 100000, 150000].map(amount => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.budgetShortcutBtn,
                  calcInput === amount && styles.budgetShortcutBtnActive,
                  {
                    backgroundColor:
                      calcInput === amount
                        ? (isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(37, 99, 235, 0.12)')
                        : (isDark ? 'rgba(31, 41, 55, 0.7)' : '#F1F5F9'),
                    borderColor: calcInput === amount ? colors.primary : 'transparent',
                  },
                ]}
                onPress={() => {
                  setCalcMode('budget');
                  setCalcInput(amount);
                }}
              >
                <Text
                  style={[
                    styles.budgetShortcutText,
                    {
                      color: calcInput === amount ? (isDark ? '#93C5FD' : colors.primary) : colors.textPrimary,
                      fontWeight: calcInput === amount ? '800' : '600',
                    },
                  ]}
                >
                  ${amount / 1000}k
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Resultado de la Calculadora */}
          <View
            style={[
              styles.calcResultBox,
              {
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.65)' : 'rgba(241, 245, 249, 0.95)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
              },
            ]}
          >
            <View style={styles.calcResultRow}>
              <View style={styles.calcResultCol}>
                <Text style={[styles.calcResultLabel, { color: colors.textSecondary }]}>Combustible</Text>
                <Text style={[styles.calcResultValue, { color: colors.primary }]}>
                  {calculation.gallonsReceived} gal
                </Text>
              </View>

              <View style={[styles.calcResultDivider, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }]} />

              <View style={styles.calcResultCol}>
                <Text style={[styles.calcResultLabel, { color: colors.textSecondary }]}>Autonomía Estimada</Text>
                <Text style={[styles.calcResultValue, { color: colors.success }]}>
                  ~{calculation.estimatedKilometers} km
                </Text>
              </View>

              <View style={[styles.calcResultDivider, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }]} />

              <View style={styles.calcResultCol}>
                <Text style={[styles.calcResultLabel, { color: colors.textSecondary }]}>Ahorro vs Ref.</Text>
                <Text style={[styles.calcResultValue, { color: colors.accent }]}>
                  {calculation.potentialSavings > 0 ? formatCOP(calculation.potentialSavings) : '$0'}
                </Text>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* ================================================================ */}
        {/* 5. BUSCADOR Y LISTADO DE ESTACIONES DE SERVICIO (EDS) */}
        {/* ================================================================ */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Estaciones de Servicio ({stations.length})
          </Text>
        </View>

        {/* Barra de Búsqueda */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: isDark ? 'rgba(31, 41, 55, 0.65)' : '#FFFFFF',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
            },
          ]}
        >
          <SearchIcon size={18} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Buscar por marca (Terpel, Texaco, Primax) o calle..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Listado de Estaciones */}
        <View style={styles.stationList}>
          {stations.map(station => {
            const price = station.prices[selectedFuelType] || 0;
            const isLowest = cheapestStation?.id === station.id;

            return (
              <GlassCard
                key={station.id}
                variant={isLowest ? 'success' : 'default'}
                style={styles.stationCard}
              >
                <View style={styles.stationHeaderRow}>
                  <View style={styles.stationBrandBadge}>
                    <Text style={styles.stationBrandText}>{station.brand}</Text>
                  </View>

                  {isLowest && (
                    <View style={styles.cheapestBadge}>
                      <StarIcon size={12} color="#10B981" filled />
                      <Text style={styles.cheapestBadgeText}>Más económica</Text>
                    </View>
                  )}
                </View>

                <View style={styles.stationMainInfo}>
                  <Text style={[styles.stationName, { color: colors.textPrimary }]}>{station.name}</Text>
                  <Text style={[styles.stationAddress, { color: colors.textSecondary }]}>{station.address}</Text>
                </View>

                {/* Precio destacado */}
                <View
                  style={[
                    styles.priceBox,
                    {
                      backgroundColor: isDark ? 'rgba(15, 23, 42, 0.55)' : 'rgba(241, 245, 249, 0.95)',
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
                    },
                  ]}
                >
                  <View>
                    <Text style={[styles.priceBoxLabel, { color: colors.textSecondary }]}>
                      {FUEL_PRODUCTS[selectedFuelType].shortName}
                    </Text>
                    <Text style={[styles.priceReported, { color: colors.textMuted }]}>
                      Reportado: {station.last_updated}
                    </Text>
                  </View>
                  <Text style={[styles.priceValue, { color: isLowest ? colors.success : colors.primary }]}>
                    {formatCOP(price)}
                    <Text style={[styles.priceUnit, { color: colors.textSecondary }]}>/gal</Text>
                  </Text>
                </View>

                {/* Servicios y comodidades */}
                <View style={styles.servicesRow}>
                  {station.services.map(svc => (
                    <View
                      key={svc}
                      style={[
                        styles.servicePill,
                        {
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
                        },
                      ]}
                    >
                      <Text style={[styles.servicePillText, { color: colors.textSecondary }]}>{svc}</Text>
                    </View>
                  ))}
                </View>

                {/* Botón de cómo llegar */}
                <TouchableOpacity
                  style={[
                    styles.routeBtn,
                    {
                      borderColor: isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(37, 99, 235, 0.3)',
                      backgroundColor: isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(37, 99, 235, 0.06)',
                    },
                  ]}
                  onPress={() => handleOpenMaps(station)}
                  activeOpacity={0.8}
                >
                  <MapPinIcon size={14} color={colors.primary} />
                  <Text style={[styles.routeBtnText, { color: colors.primary }]}>Ver en Mapa / Cómo llegar</Text>
                </TouchableOpacity>
              </GlassCard>
            );
          })}
        </View>

        <View style={{ height: 36 }} />
      </ScrollView>

      {/* Modal Selector de Ciudad */}
      <CityPickerModal
        visible={isCityModalVisible}
        cities={cities}
        selectedCityId={selectedCity?.id || ''}
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
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 6,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  cityPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 24,
    borderWidth: 1.2,
    gap: 6,
  },
  cityPickerText: {
    fontSize: 13,
    fontWeight: '700',
    maxWidth: 95,
  },
  benchmarkCard: {
    padding: 16,
    marginBottom: 20,
  },
  benchmarkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  benchmarkBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  benchmarkBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryBright,
    letterSpacing: 0.5,
  },
  benchmarkPeriod: {
    fontSize: 11,
    fontWeight: '600',
  },
  benchmarkTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 14,
  },
  benchmarkGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  benchmarkItem: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  benchmarkLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  benchmarkValue: {
    fontSize: 12,
    fontWeight: '800',
  },
  benchmarkUnit: {
    fontSize: 9,
    fontWeight: '600',
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  fuelTypeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  fuelTypePill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  fuelTypePillText: {
    fontSize: 12,
  },
  calcCard: {
    padding: 16,
    marginBottom: 10,
  },
  calcHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  calcIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(59, 130, 246, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calcTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  calcSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  vehicleTypeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  vehicleTypeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
  },
  vehicleTypeBtnActive: {
    backgroundColor: COLORS.primary,
  },
  vehicleTypeBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  budgetShortcuts: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  budgetShortcutBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  budgetShortcutBtnActive: {
    borderColor: COLORS.primary,
  },
  budgetShortcutText: {
    fontSize: 13,
  },
  calcResultBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  calcResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calcResultCol: {
    flex: 1,
    alignItems: 'center',
  },
  calcResultLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  calcResultValue: {
    fontSize: 14,
    fontWeight: '900',
  },
  calcResultDivider: {
    width: 1,
    height: 28,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    padding: 0,
  },
  stationList: {
    gap: 12,
  },
  stationCard: {
    padding: 14,
  },
  stationHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  stationBrandBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  stationBrandText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryBright,
    letterSpacing: 0.5,
  },
  cheapestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  cheapestBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
  },
  stationMainInfo: {
    marginBottom: 10,
  },
  stationName: {
    fontSize: 15,
    fontWeight: '800',
  },
  stationAddress: {
    fontSize: 12,
    marginTop: 2,
  },
  priceBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  priceBoxLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  priceReported: {
    fontSize: 10,
    marginTop: 1,
  },
  priceValue: {
    fontSize: 17,
    fontWeight: '900',
  },
  priceUnit: {
    fontSize: 11,
    fontWeight: '600',
  },
  servicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  servicePill: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 6,
  },
  servicePillText: {
    fontSize: 10,
    fontWeight: '600',
  },
  routeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  routeBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

export default FuelScreen;
