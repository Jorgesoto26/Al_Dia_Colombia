/**
 * Sección de Calculadora de Peajes y Corredores Viales (INVIAS / ANI)
 * Al Día Colombia
 * Planeador de viaje para Puentes Festivos y fines de semana.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Linking,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useVehicles } from '../../context/VehicleContext';
import { GlassCard } from '../../components/GlassCard';
import {
  RoadIcon,
  PhoneIcon,
  CarIcon,
  MotoIcon,
  SearchIcon,
  CheckIcon,
} from '../../components/Icons';
import {
  calculateRouteTolls,
  getCorridorRoutes,
  searchTolls,
  formatTollCOP,
  EMERGENCY_CONTACTS,
  VEHICLE_CATEGORIES,
} from '../../services/tollService';
import { VehicleCategoryFilter, CorridorRoute, TollStation } from '../../types/toll.types';

export const TollCalculatorSection: React.FC = () => {
  const { isDark, colors } = useTheme();
  const { cities } = useVehicles();

  // Estados de cálculo de peajes
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('bogota-girardot-ibague');
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategoryFilter>('I');
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(true);

  // Opciones de ciudad origen parametrizadas desde Supabase (cities) + corredores existentes
  const originOptions = useMemo(() => {
    const list: Array<{ id: string; label: string }> = [{ id: 'all', label: 'Todas' }];

    // 1. Agregar ciudades activas que vienen de la base de datos de Supabase
    if (cities && cities.length > 0) {
      cities
        .filter(c => c.is_active)
        .forEach(c => {
          list.push({
            id: c.slug,
            label: c.name.replace(' D.C.', ''),
          });
        });
    }

    // 2. Incluir cualquier ciudad que tenga corredores registrados y que aún no esté en la tabla
    const allRoutes = getCorridorRoutes('all');
    allRoutes.forEach(r => {
      if (!list.some(item => item.id === r.originCityId)) {
        list.push({
          id: r.originCityId,
          label: r.originCityName.replace(' D.C.', ''),
        });
      }
    });

    return list;
  }, [cities]);

  // Estados de búsqueda general en directorio
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'calculator' | 'directory'>('calculator');

  // Filtrado de rutas según ciudad origen
  const routes = useMemo(() => getCorridorRoutes(selectedOrigin), [selectedOrigin]);

  // Si la ruta seleccionada ya no existe en el filtro, asignar la primera
  const activeRoute = useMemo(() => {
    const found = routes.find(r => r.id === selectedRouteId);
    return found || routes[0] || getCorridorRoutes()[0];
  }, [routes, selectedRouteId]);

  // Cálculo activo
  const calculation = useMemo(() => {
    return calculateRouteTolls(activeRoute.id, selectedCategory, isRoundTrip);
  }, [activeRoute.id, selectedCategory, isRoundTrip]);

  // Búsqueda en directorio de peajes
  const searchResults = useMemo(() => {
    return searchTolls(searchQuery);
  }, [searchQuery]);

  const handleCall = (phoneNumber: string) => {
    const cleanNumber = phoneNumber.replace(/\s+/g, '');
    Linking.openURL(`tel:${cleanNumber}`).catch(() => {});
  };

  return (
    <View style={styles.container}>
      {/* Selector Sub-pestana: Calculadora vs Directorio */}
      <View
        style={[
          styles.subTabRow,
          {
            backgroundColor: isDark ? 'rgba(31, 41, 55, 0.6)' : 'rgba(226, 232, 240, 0.8)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.1)',
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.subTabButton,
            activeSubTab === 'calculator' && {
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
              shadowOpacity: 0.3,
              shadowRadius: 4,
            },
          ]}
          onPress={() => setActiveSubTab('calculator')}
          activeOpacity={0.8}
        >
          <RoadIcon size={18} color={activeSubTab === 'calculator' ? '#FFF' : colors.textSecondary} />
          <Text
            style={[
              styles.subTabButtonText,
              { color: activeSubTab === 'calculator' ? '#FFF' : colors.textSecondary },
            ]}
          >
            Rutas y Calculadora
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.subTabButton,
            activeSubTab === 'directory' && {
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
              shadowOpacity: 0.3,
              shadowRadius: 4,
            },
          ]}
          onPress={() => setActiveSubTab('directory')}
          activeOpacity={0.8}
        >
          <SearchIcon size={18} color={activeSubTab === 'directory' ? '#FFF' : colors.textSecondary} />
          <Text
            style={[
              styles.subTabButtonText,
              { color: activeSubTab === 'directory' ? '#FFF' : colors.textSecondary },
            ]}
          >
            Directorio Peajes
          </Text>
        </TouchableOpacity>
      </View>

      {/* ==================================================================== */}
      {/* SUB-PESTAÑA 1: CALCULADORA DE CORREDORES VIALES                      */}
      {/* ==================================================================== */}
      {activeSubTab === 'calculator' ? (
        <>
          {/* 1. Selector de Ciudad Origen */}
          <Text style={[styles.filterTitle, { color: colors.textSecondary }]}>
            CIUDAD DE SALIDA:
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.originScroll}
          >
            {originOptions.map(origin => {
              const isSelected = selectedOrigin === origin.id;
              return (
                <TouchableOpacity
                  key={origin.id}
                  style={[
                    styles.originChip,
                    {
                      backgroundColor: isSelected
                        ? colors.primary
                        : isDark
                        ? 'rgba(31, 41, 55, 0.6)'
                        : '#F1F5F9',
                      borderColor: isSelected
                        ? colors.primary
                        : isDark
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(15, 23, 42, 0.12)',
                    },
                  ]}
                  onPress={() => setSelectedOrigin(origin.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.originChipText,
                      {
                        color: isSelected ? '#FFFFFF' : colors.textPrimary,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {origin.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* 2. Selector de Rutas / Corredores */}
          <Text style={[styles.filterTitle, { color: colors.textSecondary, marginTop: 12 }]}>
            DESTINO Y CORREDOR:
          </Text>
          {routes.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.routesScroll}
            >
              {routes.map(r => {
                const isSelected = r.id === activeRoute.id;
                return (
                  <TouchableOpacity
                    key={r.id}
                    style={[
                      styles.routeCard,
                      {
                        backgroundColor: isSelected
                          ? isDark
                            ? 'rgba(37, 99, 235, 0.25)'
                            : 'rgba(37, 99, 235, 0.12)'
                          : isDark
                          ? 'rgba(30, 41, 59, 0.7)'
                          : '#FFFFFF',
                        borderColor: isSelected ? colors.primary : isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.12)',
                      },
                    ]}
                    onPress={() => setSelectedRouteId(r.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.routeBadgeRow}>
                      <Text style={[styles.routeOriginCity, { color: colors.textMuted }]}>
                        {r.originCityName}
                      </Text>
                      <View
                        style={[
                          styles.tollCountTag,
                          { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.15)' },
                        ]}
                      >
                        <Text style={[styles.tollCountTagText, { color: isDark ? '#FBBF24' : '#B45309' }]}>
                          {r.tolls.length} peajes
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={[
                        styles.routeCardTitle,
                        { color: colors.textPrimary, fontWeight: isSelected ? '700' : '600' },
                      ]}
                      numberOfLines={2}
                    >
                      {r.destination}
                    </Text>

                    <Text style={[styles.routeCardMeta, { color: colors.textSecondary }]}>
                      🛣️ {r.distanceKm} km • ⏱️ {r.estimatedTime}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <View
              style={[
                styles.emptyRoutesBox,
                {
                  backgroundColor: isDark ? 'rgba(30, 41, 59, 0.5)' : '#F8FAFC',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
                },
              ]}
            >
              <Text style={[styles.emptyRoutesText, { color: colors.textSecondary }]}>
                Aún no hay corredores registrados saliendo desde esta ciudad.
              </Text>
              <TouchableOpacity
                style={[styles.emptyRoutesBtn, { backgroundColor: colors.primary }]}
                onPress={() => setSelectedOrigin('all')}
                activeOpacity={0.8}
              >
                <Text style={styles.emptyRoutesBtnText}>Ver todas las rutas nacionales</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 3. Selector de Categoría Vehicular */}
          <Text style={[styles.filterTitle, { color: colors.textSecondary, marginTop: 14 }]}>
            TIPO DE VEHÍCULO:
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {VEHICLE_CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat.category;
              return (
                <TouchableOpacity
                  key={cat.category}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: isSelected
                        ? colors.primary
                        : isDark
                        ? 'rgba(31, 41, 55, 0.6)'
                        : '#F1F5F9',
                      borderColor: isSelected
                        ? colors.primary
                        : isDark
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(15, 23, 42, 0.12)',
                    },
                  ]}
                  onPress={() => setSelectedCategory(cat.category)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.categoryLabel,
                      {
                        color: isSelected ? '#FFFFFF' : colors.textPrimary,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {cat.shortLabel}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* 4. Switcher: Solo Ida vs Ida y Vuelta */}
          <View style={styles.roundTripRow}>
            <TouchableOpacity
              style={[
                styles.tripTypeButton,
                !isRoundTrip && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
                {
                  backgroundColor: !isRoundTrip ? colors.primary : isDark ? 'rgba(30, 41, 59, 0.6)' : '#F1F5F9',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.1)',
                },
              ]}
              onPress={() => setIsRoundTrip(false)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tripTypeText,
                  { color: !isRoundTrip ? '#FFFFFF' : colors.textSecondary },
                ]}
              >
                Solo Ida (1 trayecto)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tripTypeButton,
                isRoundTrip && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
                {
                  backgroundColor: isRoundTrip ? colors.primary : isDark ? 'rgba(30, 41, 59, 0.6)' : '#F1F5F9',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.1)',
                },
              ]}
              onPress={() => setIsRoundTrip(true)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tripTypeText,
                  { color: isRoundTrip ? '#FFFFFF' : colors.textSecondary },
                ]}
              >
                Ida y Vuelta (x2)
              </Text>
            </TouchableOpacity>
          </View>

          {/* ================================================================ */}
          {/* 5. TARJETA HERO: RESULTADO DEL CÁLCULO                           */}
          {/* ================================================================ */}
          <View
            style={[
              styles.calculationHeroCard,
              {
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.88)' : '#FFFFFF',
                borderColor: isDark ? 'rgba(59, 130, 246, 0.45)' : 'rgba(37, 99, 235, 0.35)',
                shadowColor: colors.primary,
                shadowOpacity: isDark ? 0.3 : 0.1,
              },
            ]}
          >
            <View style={styles.heroHeader}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={[styles.heroRouteName, { color: colors.textPrimary }]}>
                  {calculation.route.name}
                </Text>
                <Text style={[styles.heroSub, { color: colors.textSecondary }]}>
                  {calculation.tollCount} peajes • {calculation.isRoundTrip ? 'Ida y Vuelta (x2)' : 'Solo Ida'}
                </Text>
              </View>

              <View
                style={[
                  styles.heroBadge,
                  {
                    backgroundColor: isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(37, 99, 235, 0.1)',
                    borderColor: isDark ? 'rgba(96, 165, 250, 0.4)' : 'rgba(37, 99, 235, 0.25)',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.heroBadgeText,
                    { color: isDark ? '#93C5FD' : '#1D4ED8' },
                  ]}
                >
                  {calculation.categoryInfo.shortLabel}
                </Text>
              </View>
            </View>

            {calculation.hasExemptionNotice ? (
              <View
                style={[
                  styles.exemptionBox,
                  {
                    backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(209, 250, 229, 0.85)',
                    borderColor: isDark ? 'rgba(16, 185, 129, 0.4)' : 'rgba(16, 185, 129, 0.4)',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.exemptionTitle,
                    { color: isDark ? '#34D399' : '#047857' },
                  ]}
                >
                  🎉 ¡MOTOS EXENTAS DE PEAJE!
                </Text>
                <Text
                  style={[
                    styles.exemptionText,
                    { color: isDark ? '#E2E8F0' : '#065F46' },
                  ]}
                >
                  De acuerdo con el Artículo 21 de la Ley 105 de 1993 y la Ley 787 de 2002, las motocicletas no pagan peaje en la red vial nacional de Colombia.
                </Text>
                <Text
                  style={[
                    styles.heroPriceZero,
                    { color: isDark ? '#34D399' : '#047857' },
                  ]}
                >
                  $ 0 COP
                </Text>
              </View>
            ) : (
              <View
                style={[
                  styles.priceContainer,
                  {
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.55)' : 'rgba(239, 246, 255, 0.85)',
                    borderColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.2)',
                  },
                ]}
              >
                <Text style={[styles.priceLabel, { color: isDark ? '#94A3B8' : '#475569' }]}>
                  TOTAL PEAJES ESTIMADO
                </Text>
                <Text
                  style={[
                    styles.priceAmount,
                    { color: isDark ? '#38BDF8' : '#1D4ED8' },
                  ]}
                >
                  {formatTollCOP(calculation.totalTrip)}
                </Text>
                {calculation.isRoundTrip && (
                  <Text style={[styles.priceSub, { color: isDark ? '#94A3B8' : '#475569' }]}>
                    (Ida: {formatTollCOP(calculation.totalOneWay)} + Regreso: {formatTollCOP(calculation.totalOneWay)})
                  </Text>
                )}
              </View>
            )}

            {/* Alertas de Puentes y Retorno */}
            {calculation.route.highlights && calculation.route.highlights.length > 0 && (
              <View
                style={[
                  styles.highlightsBox,
                  {
                    backgroundColor: isDark ? 'rgba(0, 0, 0, 0.35)' : 'rgba(254, 243, 199, 0.75)',
                    borderColor: isDark ? 'rgba(245, 158, 11, 0.25)' : 'rgba(245, 158, 11, 0.35)',
                  },
                ]}
              >
                <Text style={[styles.highlightsTitle, { color: isDark ? '#FDE68A' : '#B45309' }]}>
                  💡 Datos Clave para Puentes Festivos:
                </Text>
                {calculation.route.highlights.map((h, idx) => (
                  <Text
                    key={idx}
                    style={[
                      styles.highlightItem,
                      { color: isDark ? '#E2E8F0' : '#1E293B' },
                    ]}
                  >
                    • {h}
                  </Text>
                ))}
              </View>
            )}
          </View>

          {/* ================================================================ */}
          {/* 6. LISTA DETALLADA DE PEAJES DE LA RUTA                          */}
          {/* ================================================================ */}
          <View style={styles.breakdownHeader}>
            <Text style={[styles.breakdownTitle, { color: colors.textPrimary }]}>
              Peajes en esta ruta ({calculation.tollCount})
            </Text>
            <Text style={[styles.breakdownSub, { color: colors.textSecondary }]}>
              Tarifas oficiales INVIAS / ANI 2026
            </Text>
          </View>

          {calculation.tollsBreakdown.map((item, index) => {
            const { toll, pricePerPass, totalForTrip } = item;
            return (
              <GlassCard key={toll.id} style={styles.tollItemCard}>
                <View style={styles.tollItemRow}>
                  <View style={styles.tollOrderCircle}>
                    <Text style={styles.tollOrderNumber}>{index + 1}</Text>
                  </View>

                  <View style={styles.tollInfoCol}>
                    <View style={styles.tollNameRow}>
                      <Text style={[styles.tollName, { color: colors.textPrimary }]}>
                        {toll.name}
                      </Text>
                      {toll.hasColpass && (
                        <View style={styles.colpassBadge}>
                          <Text style={styles.colpassBadgeText}>Colpass</Text>
                        </View>
                      )}
                    </View>

                    <Text style={[styles.tollSector, { color: colors.textSecondary }]}>
                      {toll.sector} • {toll.department}
                    </Text>

                    <Text style={[styles.tollOperator, { color: colors.textMuted }]}>
                      Operador: {toll.concessionName} ({toll.operator})
                    </Text>
                  </View>

                  <View style={styles.tollPriceCol}>
                    <Text style={[styles.tollPassPrice, { color: colors.textPrimary }]}>
                      {formatTollCOP(pricePerPass)}
                    </Text>
                    {calculation.isRoundTrip && (
                      <Text style={[styles.tollRoundPrice, { color: colors.textSecondary }]}>
                        Total: {formatTollCOP(totalForTrip)}
                      </Text>
                    )}

                    <TouchableOpacity
                      style={styles.sosButton}
                      onPress={() => handleCall(toll.emergencyPhone)}
                      activeOpacity={0.7}
                    >
                      <PhoneIcon size={12} color="#EF4444" />
                      <Text style={styles.sosButtonText}>SOS Vial</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </GlassCard>
            );
          })}
        </>
      ) : (
        /* ==================================================================== */
        /* SUB-PESTAÑA 2: DIRECTORIO NACIONAL DE PEAJES                         */
        /* ==================================================================== */
        <View style={styles.directoryContainer}>
          {/* Buscador */}
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : '#FFFFFF',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.12)',
              },
            ]}
          >
            <SearchIcon size={18} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder="Buscar por peaje, departamento o sector..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <Text style={[styles.directoryCountText, { color: colors.textSecondary }]}>
            Mostrando {searchResults.length} peajes registrados
          </Text>

          {searchResults.map(toll => (
            <GlassCard key={toll.id} style={styles.directoryCard}>
              <View style={styles.directoryHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.directoryTollName, { color: colors.textPrimary }]}>
                    {toll.name}
                  </Text>
                  <Text style={[styles.directoryTollSector, { color: colors.textSecondary }]}>
                    {toll.sector} ({toll.department})
                  </Text>
                  <Text style={[styles.directoryTollConcession, { color: colors.textMuted }]}>
                    {toll.concessionName} • {toll.operator}
                  </Text>
                </View>

                <View style={styles.directoryPriceCol}>
                  <Text style={[styles.directoryCat1Label, { color: colors.textMuted }]}>Cat. I</Text>
                  <Text style={[styles.directoryCat1Price, { color: colors.textPrimary }]}>
                    {formatTollCOP(toll.prices.I)}
                  </Text>
                  {toll.hasColpass && (
                    <View style={styles.colpassBadge}>
                      <Text style={styles.colpassBadgeText}>Colpass</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.directoryFooter}>
                <TouchableOpacity
                  style={styles.directoryCallButton}
                  onPress={() => handleCall(toll.emergencyPhone)}
                  activeOpacity={0.7}
                >
                  <PhoneIcon size={14} color="#10B981" />
                  <Text style={styles.directoryCallText}>
                    Auxilio Vial: {toll.emergencyPhone}
                  </Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          ))}
        </View>
      )}

      {/* ==================================================================== */}
      {/* 7. LÍNEAS DE AUXILIO VIAL Y POLICÍA DE TRÁNSITO (#767)               */}
      {/* ==================================================================== */}
      <GlassCard variant="warning" style={styles.emergencyCard}>
        <View style={styles.emergencyHeader}>
          <PhoneIcon size={20} color="#D97706" />
          <Text style={styles.emergencyTitle}>Atención Vial Nacional (#767)</Text>
        </View>
        <Text style={styles.emergencyText}>
          En puentes festivos, marca gratis al #767 desde cualquier celular para consultar el estado de vías en tiempo real, reversibles y asistencia de la Policía de Tránsito.
        </Text>
        <TouchableOpacity
          style={styles.call767Button}
          onPress={() => handleCall('#767')}
          activeOpacity={0.8}
        >
          <PhoneIcon size={16} color="#FFFFFF" />
          <Text style={styles.call767ButtonText}>Marcar #767 (INVIAS y Tránsito)</Text>
        </TouchableOpacity>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 24,
  },
  subTabRow: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
    borderWidth: 1,
  },
  subTabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
  },
  subTabButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  filterTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  originScroll: {
    gap: 8,
    paddingRight: 16,
    marginBottom: 4,
  },
  originChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  originChipText: {
    fontSize: 13,
  },
  routesScroll: {
    gap: 10,
    paddingRight: 16,
    paddingBottom: 4,
  },
  routeCard: {
    width: 220,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
  },
  routeBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  routeOriginCity: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  tollCountTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tollCountTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  routeCardTitle: {
    fontSize: 14,
    marginBottom: 6,
  },
  routeCardMeta: {
    fontSize: 12,
  },
  categoryScroll: {
    gap: 8,
    paddingRight: 16,
    marginBottom: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: 13,
  },
  roundTripRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  tripTypeButton: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  tripTypeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  calculationHeroCard: {
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1.5,
    shadowRadius: 12,
    elevation: 3,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  heroRouteName: {
    fontSize: 16,
    fontWeight: '800',
  },
  heroSub: {
    fontSize: 12.5,
    marginTop: 3,
    fontWeight: '500',
  },
  heroBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  priceContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginVertical: 6,
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  priceAmount: {
    fontSize: 32,
    fontWeight: '900',
    marginTop: 3,
  },
  priceSub: {
    fontSize: 12,
    marginTop: 3,
    fontWeight: '500',
  },
  exemptionBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    marginVertical: 6,
  },
  exemptionTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  exemptionText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
  },
  heroPriceZero: {
    fontSize: 28,
    fontWeight: '900',
    marginTop: 6,
  },
  highlightsBox: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  highlightsTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  highlightItem: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  breakdownHeader: {
    marginTop: 6,
    marginBottom: 8,
  },
  breakdownTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  breakdownSub: {
    fontSize: 12,
    marginTop: 2,
  },
  tollItemCard: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 14,
  },
  tollItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tollOrderCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tollOrderNumber: {
    color: '#2563EB',
    fontWeight: '800',
    fontSize: 13,
  },
  tollInfoCol: {
    flex: 1,
  },
  tollNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tollName: {
    fontSize: 14,
    fontWeight: '700',
  },
  colpassBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  colpassBadgeText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '700',
  },
  tollSector: {
    fontSize: 11.5,
    marginTop: 2,
  },
  tollOperator: {
    fontSize: 10.5,
    marginTop: 1,
  },
  tollPriceCol: {
    alignItems: 'flex-end',
  },
  tollPassPrice: {
    fontSize: 14,
    fontWeight: '800',
  },
  tollRoundPrice: {
    fontSize: 11,
    marginTop: 1,
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  sosButtonText: {
    fontSize: 10,
    color: '#EF4444',
    fontWeight: '700',
  },
  directoryContainer: {
    marginTop: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    height: 44,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  directoryCountText: {
    fontSize: 12,
    marginBottom: 8,
  },
  directoryCard: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
  },
  directoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  directoryTollName: {
    fontSize: 14,
    fontWeight: '700',
  },
  directoryTollSector: {
    fontSize: 12,
    marginTop: 2,
  },
  directoryTollConcession: {
    fontSize: 11,
    marginTop: 2,
  },
  directoryPriceCol: {
    alignItems: 'flex-end',
  },
  directoryCat1Label: {
    fontSize: 10,
    fontWeight: '600',
  },
  directoryCat1Price: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  directoryFooter: {
    marginTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(156, 163, 175, 0.2)',
    paddingTop: 6,
  },
  directoryCallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  directoryCallText: {
    fontSize: 11.5,
    color: '#10B981',
    fontWeight: '600',
  },
  emergencyCard: {
    padding: 14,
    borderRadius: 14,
    marginTop: 12,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  emergencyTitle: {
    color: '#B45309',
    fontSize: 14,
    fontWeight: '700',
  },
  emergencyText: {
    color: '#78350F',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  call767Button: {
    backgroundColor: '#D97706',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
  },
  call767ButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyRoutesBox: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyRoutesText: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyRoutesBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyRoutesBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

