/**
 * Sección de Insumos Agropecuarios y Canasta Familiar (SIPSA / DANE)
 * Al Día Colombia
 * Tablero de Centrales Mayoristas de Abastos, monitoreo de precios y simulador de ahorro.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { GlassCard } from '../../components/GlassCard';
import {
  SearchIcon,
  SproutIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  PlusIcon,
  CheckIcon,
} from '../../components/Icons';
import {
  agroService,
  AGRO_CATEGORIES,
  WHOLESALE_MARKETS,
} from '../../services/agroService';
import { AgroCategory, PriceTrend, AgroProduct } from '../../types/agro.types';

export const AgroMarketSection: React.FC = () => {
  const { isDark, colors } = useTheme();

  // Estados
  const [selectedMarketId, setSelectedMarketId] = useState<string>('corabastos');
  const [selectedCategory, setSelectedCategory] = useState<AgroCategory | 'all'>('all');
  const [selectedTrend, setSelectedTrend] = useState<PriceTrend | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Carrito simulador de Canasta Familiar (productos seleccionados para ahorro)
  const [basketItems, setBasketItems] = useState<Record<string, number>>({
    'prod-papa-pastusa': 5, // 5 kilos
    'prod-tomate-chonto': 2, // 2 kilos
    'prod-huevo-rojo-aa': 30, // 30 unidades (1 cubeta)
    'prod-pechuga-pollo': 2, // 2 kilos
    'prod-arroz-primera': 5, // 5 kilos
  });

  // Mercado activo
  const activeMarket = useMemo(() => {
    return agroService.getMarketById(selectedMarketId) || WHOLESALE_MARKETS[0];
  }, [selectedMarketId]);

  // Lista de productos filtrados
  const products = useMemo(() => {
    return agroService.getProducts(
      selectedMarketId,
      selectedCategory === 'all' ? undefined : selectedCategory,
      searchQuery,
      selectedTrend === 'all' ? undefined : selectedTrend
    );
  }, [selectedMarketId, selectedCategory, searchQuery, selectedTrend]);

  // Alertas de Top Gangas y Top Alzas
  const topBargains = useMemo(() => agroService.getTopBargains(2), []);
  const topIncreases = useMemo(() => agroService.getTopIncreases(2), []);

  // Cálculo del ahorro de la Canasta Familiar
  const basketCalculation = useMemo(() => {
    const itemsList = Object.entries(basketItems).map(([productId, quantityUnits]) => ({
      productId,
      quantityUnits,
    }));
    return agroService.calculateBasketSavings(itemsList);
  }, [basketItems]);

  const toggleBasketItem = (productId: string, defaultUnits: number = 2) => {
    setBasketItems(prev => {
      const next = { ...prev };
      if (next[productId]) {
        delete next[productId];
      } else {
        next[productId] = defaultUnits;
      }
      return next;
    });
  };

  return (
    <View style={styles.container}>
      {/* ==================================================================== */}
      {/* 1. SELECTOR DE CENTRAL MAYORISTA DE ABASTOS                          */}
      {/* ==================================================================== */}
      <Text style={[styles.filterTitle, { color: colors.textSecondary }]}>
        CENTRAL MAYORISTA DE ABASTOS:
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.marketsScroll}
      >
        {WHOLESALE_MARKETS.map(market => {
          const isSelected = selectedMarketId === market.id;
          return (
            <TouchableOpacity
              key={market.id}
              style={[
                styles.marketChip,
                {
                  backgroundColor: isSelected
                    ? colors.primary
                    : isDark
                    ? 'rgba(31, 41, 55, 0.65)'
                    : '#F1F5F9',
                  borderColor: isSelected
                    ? colors.primary
                    : isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(15, 23, 42, 0.1)',
                },
              ]}
              onPress={() => setSelectedMarketId(market.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.marketChipText,
                  {
                    color: isSelected ? '#FFFFFF' : colors.textPrimary,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {market.shortName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ==================================================================== */}
      {/* 2. TARJETA HERO: BOLETÍN DIARIO SIPSA / DANE                         */}
      {/* ==================================================================== */}
      <View
        style={[
          styles.heroReportCard,
          {
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.88)' : '#FFFFFF',
            borderColor: isDark ? 'rgba(16, 185, 129, 0.35)' : 'rgba(16, 185, 129, 0.3)',
            shadowColor: '#10B981',
            shadowOpacity: isDark ? 0.25 : 0.08,
          },
        ]}
      >
        <View style={styles.heroReportHeader}>
          <View style={{ flex: 1 }}>
            <View style={styles.heroBadgeRow}>
              <View style={styles.sipsaBadge}>
                <Text style={styles.sipsaBadgeText}>DANE / SIPSA OFICIAL</Text>
              </View>
              <Text style={[styles.marketLocationText, { color: colors.textSecondary }]}>
                {activeMarket.cityName}
              </Text>
            </View>
            <Text style={[styles.heroReportTitle, { color: colors.textPrimary }]}>
              Boletín Diario de Precios
            </Text>
          </View>
          <SproutIcon size={26} color="#10B981" />
        </View>

        {/* Resumen de Gangas y Alzas */}
        <View style={styles.moversRow}>
          {/* Top Gangas */}
          <View
            style={[
              styles.moverCol,
              {
                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(209, 250, 229, 0.7)',
                borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.35)',
              },
            ]}
          >
            <View style={styles.moverTitleRow}>
              <TrendingDownIcon size={16} color="#059669" />
              <Text style={[styles.moverTitle, { color: '#047857' }]}>GANGAS (EN BAJA)</Text>
            </View>
            {topBargains.map(item => (
              <View key={item.id} style={styles.moverItemRow}>
                <Text style={[styles.moverItemName, { color: colors.textPrimary }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.moverItemPercentGreen}>
                  {item.changePercentage}%
                </Text>
              </View>
            ))}
          </View>

          {/* Top Alzas */}
          <View
            style={[
              styles.moverCol,
              {
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(254, 226, 226, 0.7)',
                borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.35)',
              },
            ]}
          >
            <View style={styles.moverTitleRow}>
              <TrendingUpIcon size={16} color="#DC2626" />
              <Text style={[styles.moverTitle, { color: '#B91C1C' }]}>ALERTA (EN ALZA)</Text>
            </View>
            {topIncreases.map(item => (
              <View key={item.id} style={styles.moverItemRow}>
                <Text style={[styles.moverItemName, { color: colors.textPrimary }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.moverItemPercentRed}>
                  +{item.changePercentage}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* ==================================================================== */}
      {/* 3. SIMULADOR DE AHORRO: CANASTA FAMILIAR                             */}
      {/* ==================================================================== */}
      <View
        style={[
          styles.basketCard,
          {
            backgroundColor: isDark ? 'rgba(30, 41, 59, 0.75)' : '#FFFFFF',
            borderColor: isDark ? 'rgba(245, 158, 11, 0.35)' : 'rgba(245, 158, 11, 0.35)',
            shadowColor: '#F59E0B',
            shadowOpacity: isDark ? 0.2 : 0.06,
          },
        ]}
      >
        <View style={styles.basketHeaderRow}>
          <View style={styles.basketTitleContainer}>
            <Text style={[styles.basketCardTitle, { color: colors.textPrimary }]}>
              🧺 Simulador de Ahorro Familiar
            </Text>
            <Text style={[styles.basketCardSub, { color: colors.textSecondary }]}>
              Comparativa: Precio Central Mayorista vs. Supermercado
            </Text>
          </View>
          <View
            style={[
              styles.savingsBadge,
              { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.15)' },
            ]}
          >
            <Text style={[styles.savingsBadgeText, { color: isDark ? '#34D399' : '#047857' }]}>
              {basketCalculation.savingsPercentage}% de Ahorro
            </Text>
          </View>
        </View>

        <View style={styles.basketComparisonRow}>
          <View style={styles.basketCol}>
            <Text style={[styles.basketColLabel, { color: colors.textSecondary }]}>
              Mayorista ({basketCalculation.items.length} productos)
            </Text>
            <Text style={[styles.basketWholesaleTotal, { color: colors.textPrimary }]}>
              {agroService.formatAgroCOP(basketCalculation.totalWholesaleCost)}
            </Text>
          </View>

          <View style={[styles.basketDivider, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)' }]} />

          <View style={styles.basketCol}>
            <Text style={[styles.basketColLabel, { color: colors.textSecondary }]}>
              En Supermercado
            </Text>
            <Text style={[styles.basketRetailTotal, { color: colors.textMuted }]}>
              {agroService.formatAgroCOP(basketCalculation.totalRetailCost)}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.savingsFooterBox,
            {
              backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(209, 250, 229, 0.85)',
              borderColor: isDark ? 'rgba(16, 185, 129, 0.4)' : 'rgba(16, 185, 129, 0.35)',
            },
          ]}
        >
          <Text style={[styles.savingsFooterText, { color: isDark ? '#34D399' : '#065F46' }]}>
            💰 ¡Ahorras aproximadamente{' '}
            <Text style={{ fontWeight: '900' }}>
              {agroService.formatAgroCOP(basketCalculation.totalSavings)}
            </Text>{' '}
            comprando a precio de plaza o mercado mayorista!
          </Text>
        </View>
      </View>

      {/* ==================================================================== */}
      {/* 4. BUSCADOR Y FILTROS DE PRODUCTOS                                   */}
      {/* ==================================================================== */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Catálogo de Productos e Insumos ({products.length})
        </Text>
      </View>

      {/* Buscador */}
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: isDark ? 'rgba(30, 41, 59, 0.65)' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.12)',
          },
        ]}
      >
        <SearchIcon size={18} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Buscar papa, tomate, urea, aguacate, carne..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filtro por Categoría */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
      >
        <TouchableOpacity
          style={[
            styles.categoryPill,
            selectedCategory === 'all' && styles.categoryPillActive,
            {
              backgroundColor:
                selectedCategory === 'all'
                  ? colors.primary
                  : isDark
                  ? 'rgba(31, 41, 55, 0.65)'
                  : '#F1F5F9',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.1)',
            },
          ]}
          onPress={() => setSelectedCategory('all')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.categoryPillText,
              { color: selectedCategory === 'all' ? '#FFF' : colors.textPrimary },
            ]}
          >
            Todos ({products.length})
          </Text>
        </TouchableOpacity>

        {AGRO_CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryPill,
                isSelected && styles.categoryPillActive,
                {
                  backgroundColor: isSelected
                    ? colors.primary
                    : isDark
                    ? 'rgba(31, 41, 55, 0.65)'
                    : '#F1F5F9',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.1)',
                },
              ]}
              onPress={() => setSelectedCategory(cat.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryPillIcon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.categoryPillText,
                  { color: isSelected ? '#FFF' : colors.textPrimary },
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Filtro por Tendencia de Precio */}
      <View style={styles.trendFilterRow}>
        {(
          [
            { id: 'all', label: 'Todas las tendencias' },
            { id: 'down', label: '📉 En Ganga (Baja)' },
            { id: 'up', label: '📈 En Alza' },
          ] as Array<{ id: PriceTrend | 'all'; label: string }>
        ).map(t => {
          const isSelected = selectedTrend === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              style={[
                styles.trendFilterBtn,
                isSelected && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
                {
                  backgroundColor: isSelected
                    ? colors.primary
                    : isDark
                    ? 'rgba(30, 41, 59, 0.55)'
                    : '#F1F5F9',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.1)',
                },
              ]}
              onPress={() => setSelectedTrend(t.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.trendFilterBtnText,
                  { color: isSelected ? '#FFF' : colors.textSecondary },
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ==================================================================== */}
      {/* 5. LISTADO DE PRODUCTOS AGROPECUARIOS                                 */}
      {/* ==================================================================== */}
      <View style={styles.productsList}>
        {products.map(product => {
          const inBasket = Boolean(basketItems[product.id]);
          const isDown = product.trend === 'down';
          const isUp = product.trend === 'up';

          return (
            <GlassCard key={product.id} style={styles.productCard}>
              <View style={styles.productCardHeader}>
                <View style={{ flex: 1 }}>
                  <View style={styles.productNameRow}>
                    <Text style={[styles.productName, { color: colors.textPrimary }]}>
                      {product.name}
                    </Text>
                    {/* Badge de Tendencia */}
                    <View
                      style={[
                        styles.trendBadge,
                        isDown && styles.trendBadgeGreen,
                        isUp && styles.trendBadgeRed,
                        !isDown && !isUp && styles.trendBadgeGray,
                      ]}
                    >
                      <Text
                        style={[
                          styles.trendBadgeText,
                          isDown && { color: '#059669' },
                          isUp && { color: '#DC2626' },
                          !isDown && !isUp && { color: colors.textMuted },
                        ]}
                      >
                        {isDown && '▼ '}
                        {isUp && '▲ +'}
                        {!isDown && !isUp && '= '}
                        {product.changePercentage}%
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.productOrigin, { color: colors.textSecondary }]}>
                    Origen: {product.originDepartment} • Calidad: {product.quality}
                  </Text>
                </View>

                {/* Abastecimiento Tag */}
                <View
                  style={[
                    styles.supplyTag,
                    product.supply === 'abundante' && { backgroundColor: 'rgba(16, 185, 129, 0.15)' },
                    product.supply === 'normal' && { backgroundColor: 'rgba(59, 130, 246, 0.15)' },
                    product.supply === 'escaso' && { backgroundColor: 'rgba(245, 158, 11, 0.15)' },
                  ]}
                >
                  <Text
                    style={[
                      styles.supplyTagText,
                      product.supply === 'abundante' && { color: '#059669' },
                      product.supply === 'normal' && { color: '#2563EB' },
                      product.supply === 'escaso' && { color: '#B45309' },
                    ]}
                  >
                    {product.supply.toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Precios: Mayorista vs Detal */}
              <View
                style={[
                  styles.pricesBox,
                  {
                    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(241, 245, 249, 0.75)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(15, 23, 42, 0.08)',
                  },
                ]}
              >
                <View style={styles.priceColItem}>
                  <Text style={[styles.priceColLabel, { color: colors.textSecondary }]}>
                    Mayorista ({product.wholesaleUnit}):
                  </Text>
                  <Text style={[styles.wholesalePriceValue, { color: colors.primary }]}>
                    {agroService.formatAgroCOP(product.wholesalePrice)}
                  </Text>
                </View>

                <View style={[styles.priceColDivider, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)' }]} />

                <View style={styles.priceColItem}>
                  <Text style={[styles.priceColLabel, { color: colors.textSecondary }]}>
                    Equivalente al detal ({product.retailUnit}):
                  </Text>
                  <Text style={[styles.retailPriceValue, { color: isDark ? '#34D399' : '#059669' }]}>
                    ~{agroService.formatAgroCOP(product.retailPriceEquivalent)}
                  </Text>
                </View>
              </View>

              {/* Notas de mercado y botón de agregar a Canasta */}
              <View style={styles.cardFooterRow}>
                {product.notes ? (
                  <Text style={[styles.productNotes, { color: colors.textMuted }]} numberOfLines={2}>
                    💡 {product.notes}
                  </Text>
                ) : (
                  <View style={{ flex: 1 }} />
                )}

                <TouchableOpacity
                  style={[
                    styles.addBasketBtn,
                    inBasket && {
                      backgroundColor: isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.15)',
                      borderColor: '#10B981',
                    },
                    {
                      backgroundColor: inBasket
                        ? isDark
                          ? 'rgba(16, 185, 129, 0.25)'
                          : 'rgba(16, 185, 129, 0.15)'
                        : isDark
                        ? 'rgba(31, 41, 55, 0.7)'
                        : '#F1F5F9',
                      borderColor: inBasket ? '#10B981' : isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.12)',
                    },
                  ]}
                  onPress={() => toggleBasketItem(product.id, 2)}
                  activeOpacity={0.7}
                >
                  {inBasket ? (
                    <>
                      <CheckIcon size={14} color="#059669" />
                      <Text style={[styles.addBasketBtnText, { color: '#059669' }]}>En Canasta</Text>
                    </>
                  ) : (
                    <>
                      <PlusIcon size={14} color={colors.textPrimary} />
                      <Text style={[styles.addBasketBtnText, { color: colors.textPrimary }]}>Simular Ahorro</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </GlassCard>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  marketsScroll: {
    gap: 8,
    paddingRight: 16,
    marginBottom: 14,
  },
  marketChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  marketChipText: {
    fontSize: 13,
  },
  heroReportCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    marginBottom: 14,
    elevation: 3,
  },
  heroReportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sipsaBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sipsaBadgeText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '800',
  },
  marketLocationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  heroReportTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  moversRow: {
    flexDirection: 'row',
    gap: 10,
  },
  moverCol: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  moverTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  moverTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  moverItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  moverItemName: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    marginRight: 4,
  },
  moverItemPercentGreen: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  moverItemPercentRed: {
    fontSize: 12,
    fontWeight: '800',
    color: '#DC2626',
  },
  basketCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    marginBottom: 16,
    elevation: 3,
  },
  basketHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  basketTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  basketCardTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  basketCardSub: {
    fontSize: 11.5,
    marginTop: 2,
    lineHeight: 16,
  },
  savingsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
  savingsBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  basketComparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(156, 163, 175, 0.25)',
  },
  basketCol: {
    flex: 1,
  },
  basketColLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  basketWholesaleTotal: {
    fontSize: 20,
    fontWeight: '900',
    marginTop: 2,
  },
  basketRetailTotal: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
    textDecorationLine: 'line-through',
  },
  basketDivider: {
    width: 1,
    height: 36,
    marginHorizontal: 12,
  },
  savingsFooterBox: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 8,
  },
  savingsFooterText: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    height: 44,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  categoriesScroll: {
    gap: 8,
    paddingRight: 16,
    marginBottom: 10,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  categoryPillActive: {},
  categoryPillIcon: {
    fontSize: 14,
  },
  categoryPillText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  trendFilterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  trendFilterBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  trendFilterBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  productsList: {
    gap: 10,
  },
  productCard: {
    padding: 14,
    borderRadius: 14,
  },
  productCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  productName: {
    fontSize: 15,
    fontWeight: '800',
  },
  trendBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  trendBadgeGreen: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  trendBadgeRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  trendBadgeGray: {
    backgroundColor: 'rgba(156, 163, 175, 0.15)',
  },
  trendBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  productOrigin: {
    fontSize: 11.5,
    marginTop: 2,
  },
  supplyTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  supplyTagText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  pricesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  priceColItem: {
    flex: 1,
  },
  priceColLabel: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  wholesalePriceValue: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  retailPriceValue: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  priceColDivider: {
    width: 1,
    height: 28,
    marginHorizontal: 8,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  productNotes: {
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
  },
  addBasketBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  addBasketBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
});

