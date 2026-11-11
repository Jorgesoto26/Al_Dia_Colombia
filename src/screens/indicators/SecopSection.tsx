/**
 * Sección de Licitaciones y Contratación Pública (SECOP II)
 * Al Día Colombia - Módulo 4
 * Visualización, búsqueda, filtrado y seguimiento de convocatorias estatales.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Linking,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { GlassCard } from '../../components/GlassCard';
import {
  BriefcaseIcon,
  SearchIcon,
  RefreshIcon,
  ExternalLinkIcon,
  BookmarkIcon,
  BuildingIcon,
  MapPinIcon,
  CloseIcon,
  CheckIcon,
} from '../../components/Icons';
import {
  SecopProcess,
  SecopFilterParams,
  SecopModality,
  SecopContractType,
  SecopBudgetTier,
} from '../../types/secop.types';
import {
  getSecopProcesses,
  filterSecopProcesses,
  calculateSecopSummary,
  toggleBookmarkProcess,
} from '../../services/secopService';
import { COLORS } from '../../theme/colors';

const CITY_OPTIONS = [
  'Todas',
  'Bogotá',
  'Medellín',
  'Cali',
  'Barranquilla',
  'Bucaramanga',
  'Manizales',
  'Cartagena',
  'Pereira',
  'Cúcuta',
  'Ibagué',
  'Villavicencio',
  'Neiva',
  'Santa Marta',
  'Pasto',
];

const MODALITY_OPTIONS: { label: string; value: SecopModality | 'all' }[] = [
  { label: 'Todas las modalidades', value: 'all' },
  { label: 'Mínima cuantía (Pymes/Indep.)', value: 'Mínima cuantía' },
  { label: 'Selección abreviada', value: 'Selección abreviada' },
  { label: 'Licitación pública', value: 'Licitación pública' },
  { label: 'Concurso de méritos', value: 'Concurso de méritos' },
];

const CONTRACT_TYPE_OPTIONS: { label: string; value: SecopContractType | 'all' }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Obras Civiles', value: 'Obra' },
  { label: 'Servicios', value: 'Servicios' },
  { label: 'Suministros', value: 'Suministro' },
  { label: 'Tecnología', value: 'Tecnología' },
  { label: 'Consultoría', value: 'Consultoría' },
];

const BUDGET_TIERS: { label: string; value: SecopBudgetTier }[] = [
  { label: 'Cualquier monto', value: 'all' },
  { label: 'Hasta $50M', value: 'under_50m' },
  { label: '$50M - $200M', value: '50m_200m' },
  { label: '$200M - $1.000M', value: '200m_1000m' },
  { label: 'Más de $1.000M', value: 'over_1000m' },
];

export const SecopSection: React.FC = () => {
  const { colors, isDark } = useTheme();

  // Estados de datos
  const [allProcesses, setAllProcesses] = useState<SecopProcess[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(false);

  // Estados de filtros
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('Todas');
  const [selectedModality, setSelectedModality] = useState<SecopModality | 'all'>('all');
  const [selectedContractType, setSelectedContractType] = useState<SecopContractType | 'all'>('all');
  const [selectedBudgetTier, setSelectedBudgetTier] = useState<SecopBudgetTier>('all');
  const [onlyBookmarks, setOnlyBookmarks] = useState<boolean>(false);

  // Carga inicial
  useEffect(() => {
    loadProcesses(false);
  }, []);

  const loadProcesses = async (forceLive = false) => {
    try {
      if (forceLive) setRefreshing(true);
      else setLoading(true);

      const result = await getSecopProcesses(forceLive);
      setAllProcesses(result.processes);
      setIsLive(result.isLive);
    } catch (e) {
      console.warn('[SecopSection] Error cargando procesos:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filtrado reactivo en memoria
  const filteredProcesses = useMemo(() => {
    const filters: SecopFilterParams = {
      searchQuery,
      city: selectedCity,
      modality: selectedModality,
      contractType: selectedContractType,
      budgetTier: selectedBudgetTier,
      onlyBookmarked: onlyBookmarks,
    };
    return filterSecopProcesses(allProcesses, filters);
  }, [allProcesses, searchQuery, selectedCity, selectedModality, selectedContractType, selectedBudgetTier, onlyBookmarks]);

  // Resumen global y filtrado
  const summary = useMemo(() => calculateSecopSummary(filteredProcesses), [filteredProcesses]);

  // Toggle de favorito
  const handleToggleBookmark = async (id: string) => {
    const isNowBookmarked = await toggleBookmarkProcess(id);
    setAllProcesses(prev =>
      prev.map(item => (item.id === id ? { ...item, isBookmarked: isNowBookmarked } : item))
    );
  };

  // Abrir enlace oficial a SECOP II
  const handleOpenSecop = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch {
      // Manejar error silenciosamente
    }
  };

  // Limpiar todos los filtros
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('Todas');
    setSelectedModality('all');
    setSelectedContractType('all');
    setSelectedBudgetTier('all');
    setOnlyBookmarks(false);
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCity !== 'Todas' ||
    selectedModality !== 'all' ||
    selectedContractType !== 'all' ||
    selectedBudgetTier !== 'all' ||
    onlyBookmarks;

  return (
    <View style={styles.container}>
      {/* ================================================================ */}
      {/* 1. ENCABEZADO Y ESTADO DE CONEXIÓN */}
      {/* ================================================================ */}
      <GlassCard style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroTitleRow}>
            <View style={[styles.heroIconWrapper, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.12)' }]}>
              <BriefcaseIcon size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                Licitaciones y Contratación
              </Text>
              <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                SECOP II / Datos Abiertos Colombia
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.refreshBtn, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)' }]}
            onPress={() => loadProcesses(true)}
            disabled={refreshing}
            activeOpacity={0.7}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <RefreshIcon size={16} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        {/* Badge de fuente */}
        <View style={styles.sourceRow}>
          <View style={[styles.sourceBadge, { backgroundColor: isLive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)' }]}>
            <View style={[styles.statusDot, { backgroundColor: isLive ? COLORS.success : colors.primary }]} />
            <Text style={[styles.sourceBadgeText, { color: isLive ? COLORS.success : colors.primary }]}>
              {isLive ? 'Conectado a Datos.gov.co' : 'Base Embebida 2026 (Offline)'}
            </Text>
          </View>
          <Text style={[styles.sourceNote, { color: colors.textSecondary }]}>
            Colombia Compra Eficiente
          </Text>
        </View>

        {/* Resumen Métricas */}
        <View style={[styles.metricsGrid, { borderTopColor: colors.glassCardBorder }]}>
          <View style={styles.metricItem}>
            <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
              {summary.totalProcesses}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Convocatorias
            </Text>
          </View>

          <View style={[styles.metricDivider, { backgroundColor: colors.glassCardBorder }]} />

          <View style={[styles.metricItem, { flex: 1.5 }]}>
            <Text style={[styles.metricValue, { color: isDark ? '#93C5FD' : colors.primary }]}>
              {summary.formattedTotalBudget}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Monto Presupuestado
            </Text>
          </View>
        </View>
      </GlassCard>

      {/* ================================================================ */}
      {/* 2. BARRA DE BÚSQUEDA Y BOTÓN DE FAVORITOS */}
      {/* ================================================================ */}
      <View style={styles.searchRow}>
        <View style={[styles.searchBox, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.95)', borderColor: colors.glassCardBorder }]}>
          <SearchIcon size={18} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Buscar por objeto, entidad o código..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <CloseIcon size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.bookmarkFilterBtn,
            onlyBookmarks
              ? { backgroundColor: COLORS.accent, borderColor: COLORS.accent }
              : { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.95)', borderColor: colors.glassCardBorder },
          ]}
          onPress={() => setOnlyBookmarks(!onlyBookmarks)}
          activeOpacity={0.8}
        >
          <BookmarkIcon size={18} color={onlyBookmarks ? '#000' : colors.textPrimary} filled={onlyBookmarks} />
        </TouchableOpacity>
      </View>

      {/* ================================================================ */}
      {/* 3. FILTROS HORIZONTALES: CIUDAD */}
      {/* ================================================================ */}
      <View style={styles.filterSection}>
        <Text style={[styles.filterSectionLabel, { color: colors.textSecondary }]}>
          Ciudad / Departamento:
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {CITY_OPTIONS.map(city => {
            const isSelected = selectedCity === city;
            return (
              <TouchableOpacity
                key={city}
                style={[
                  styles.filterChip,
                  isSelected
                    ? { backgroundColor: colors.primary, borderColor: colors.primary }
                    : { backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.9)', borderColor: colors.glassCardBorder },
                ]}
                onPress={() => setSelectedCity(city)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, { color: isSelected ? '#FFF' : colors.textPrimary }]}>
                  {city}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* FILTROS HORIZONTALES: MODALIDAD */}
      <View style={styles.filterSection}>
        <Text style={[styles.filterSectionLabel, { color: colors.textSecondary }]}>
          Modalidad de Contratación:
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {MODALITY_OPTIONS.map(mod => {
            const isSelected = selectedModality === mod.value;
            return (
              <TouchableOpacity
                key={mod.value}
                style={[
                  styles.filterChip,
                  isSelected
                    ? { backgroundColor: isDark ? '#3B82F6' : '#1D4ED8', borderColor: colors.primary }
                    : { backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.9)', borderColor: colors.glassCardBorder },
                ]}
                onPress={() => setSelectedModality(mod.value)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, { color: isSelected ? '#FFF' : colors.textPrimary }]}>
                  {mod.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* FILTROS HORIZONTALES: TIPO DE CONTRATO Y MONTO */}
      <View style={styles.filterSection}>
        <Text style={[styles.filterSectionLabel, { color: colors.textSecondary }]}>
          Tipo de Objeto / Cuantía:
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {CONTRACT_TYPE_OPTIONS.map(type => {
            const isSelected = selectedContractType === type.value;
            return (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.filterChip,
                  isSelected
                    ? { backgroundColor: isDark ? '#10B981' : '#059669', borderColor: COLORS.success }
                    : { backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.9)', borderColor: colors.glassCardBorder },
                ]}
                onPress={() => setSelectedContractType(type.value)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, { color: isSelected ? '#FFF' : colors.textPrimary }]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Rango de Presupuesto */}
          {BUDGET_TIERS.map(tier => {
            if (tier.value === 'all') return null;
            const isSelected = selectedBudgetTier === tier.value;
            return (
              <TouchableOpacity
                key={tier.value}
                style={[
                  styles.filterChip,
                  isSelected
                    ? { backgroundColor: isDark ? '#D97706' : '#B45309', borderColor: COLORS.accent }
                    : { backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.9)', borderColor: colors.glassCardBorder },
                ]}
                onPress={() => setSelectedBudgetTier(isSelected ? 'all' : tier.value)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, { color: isSelected ? '#FFF' : colors.textPrimary }]}>
                  💰 {tier.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Barra de estado de filtros activos */}
      {hasActiveFilters && (
        <View style={styles.activeFiltersRow}>
          <Text style={[styles.activeFiltersCount, { color: colors.textSecondary }]}>
            Mostrando {filteredProcesses.length} procesos filtrados
          </Text>
          <TouchableOpacity onPress={handleResetFilters} style={styles.resetBtn}>
            <Text style={[styles.resetBtnText, { color: colors.primary }]}>Limpiar filtros</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ================================================================ */}
      {/* 4. LISTADO DE PROCESOS / CONVOCATORIAS */}
      {/* ================================================================ */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Consultando convocatorias vigentes en SECOP II...
          </Text>
        </View>
      ) : filteredProcesses.length === 0 ? (
        <GlassCard style={styles.emptyCard}>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
            No se encontraron licitaciones
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            No hay procesos que coincidan con los criterios o filtros seleccionados.
          </Text>
          <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: colors.primary }]} onPress={handleResetFilters}>
            <Text style={styles.emptyBtnText}>Restablecer filtros</Text>
          </TouchableOpacity>
        </GlassCard>
      ) : (
        <View style={styles.processesList}>
          {filteredProcesses.map(proc => {
            const isBookmarked = proc.isBookmarked;

            return (
              <GlassCard key={proc.id} style={styles.procCard}>
                {/* Header de la tarjeta */}
                <View style={styles.procTopRow}>
                  <View style={styles.badgesWrapper}>
                    <View style={[styles.modalityBadge, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.12)' }]}>
                      <Text style={[styles.modalityBadgeText, { color: isDark ? '#93C5FD' : colors.primary }]}>
                        {proc.modality}
                      </Text>
                    </View>

                    <View style={[styles.typeBadge, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)' }]}>
                      <Text style={[styles.typeBadgeText, { color: colors.textSecondary }]}>
                        {proc.contractType}
                      </Text>
                    </View>
                  </View>

                  {/* Botón de favorito */}
                  <TouchableOpacity
                    style={styles.bookmarkBtn}
                    onPress={() => handleToggleBookmark(proc.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <BookmarkIcon
                      size={20}
                      color={isBookmarked ? COLORS.accent : colors.textSecondary}
                      filled={isBookmarked}
                    />
                  </TouchableOpacity>
                </View>

                {/* Código de referencia y entidad */}
                <View style={styles.entityRow}>
                  <BuildingIcon size={14} color={colors.textSecondary} />
                  <Text style={[styles.refText, { color: colors.textSecondary }]} numberOfLines={1}>
                    Ref: {proc.reference}
                  </Text>
                </View>

                <Text style={[styles.entityName, { color: colors.textPrimary }]} numberOfLines={2}>
                  {proc.entity}
                </Text>

                {/* Título / Objeto del proceso */}
                <Text style={[styles.procTitle, { color: colors.textPrimary }]}>
                  {proc.title}
                </Text>

                {/* Ubicación */}
                <View style={styles.locationRow}>
                  <MapPinIcon size={13} color={colors.primary} />
                  <Text style={[styles.locationText, { color: colors.textSecondary }]}>
                    {proc.city} • {proc.department}
                  </Text>
                </View>

                {/* Bloque Destacado de Presupuesto */}
                <View style={[styles.budgetBox, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(241, 245, 249, 0.8)', borderColor: colors.glassCardBorder }]}>
                  <View>
                    <Text style={[styles.budgetLabel, { color: colors.textSecondary }]}>
                      Presupuesto Oficial Estimado
                    </Text>
                    <Text style={[styles.budgetValue, { color: isDark ? '#93C5FD' : '#1D4ED8' }]}>
                      {proc.formattedPrice}
                    </Text>
                  </View>

                  <View style={styles.datesBox}>
                    <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                      📅 Cierre: {proc.closingDate || 'Según pliegos'}
                    </Text>
                    <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                      ⏳ {proc.duration}
                    </Text>
                  </View>
                </View>

                {/* Botón de acción: Ver en SECOP II */}
                <TouchableOpacity
                  style={[styles.openSecopBtn, { backgroundColor: colors.primary }]}
                  onPress={() => handleOpenSecop(proc.url)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.openSecopBtnText}>Ver Pliegos en SECOP II</Text>
                  <ExternalLinkIcon size={15} color="#FFF" />
                </TouchableOpacity>
              </GlassCard>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  heroCard: {
    padding: 16,
    marginBottom: 14,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  heroIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  heroSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  refreshBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  sourceBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sourceNote: {
    fontSize: 11,
  },
  metricsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 10,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '900',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  bookmarkFilterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterSection: {
    marginBottom: 10,
  },
  filterSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 5,
    paddingHorizontal: 2,
  },
  chipsScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  activeFiltersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  activeFiltersCount: {
    fontSize: 11,
    fontWeight: '600',
  },
  resetBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  emptyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  emptyBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  processesList: {
    gap: 12,
  },
  procCard: {
    padding: 16,
  },
  procTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgesWrapper: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    flex: 1,
  },
  modalityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  modalityBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  typeBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  bookmarkBtn: {
    padding: 4,
  },
  entityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  refText: {
    fontSize: 11,
    fontWeight: '700',
  },
  entityName: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 6,
    lineHeight: 17,
  },
  procTitle: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '600',
  },
  budgetBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  budgetLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  budgetValue: {
    fontSize: 15,
    fontWeight: '900',
    marginTop: 2,
  },
  datesBox: {
    alignItems: 'flex-end',
    gap: 2,
  },
  dateText: {
    fontSize: 10,
    fontWeight: '600',
  },
  openSecopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  openSecopBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
