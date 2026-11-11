import {
  agroService,
  AGRO_PRODUCTS,
  WHOLESALE_MARKETS,
  AGRO_CATEGORIES,
} from '../src/services/agroService';

describe('AgroService - Precios Mayoristas e Insumos Agropecuarios (SIPSA / DANE)', () => {
  it('debe tener registradas las principales centrales de abastos del país', () => {
    const markets = agroService.getMarkets();
    expect(markets.length).toBeGreaterThanOrEqual(6);
    expect(markets.some(m => m.id === 'corabastos')).toBe(true);
    expect(markets.some(m => m.id === 'cma-medellin')).toBe(true);
    expect(markets.some(m => m.id === 'cavasa-cali')).toBe(true);
    expect(markets.some(m => m.id === 'surabastos-neiva')).toBe(true);
  });

  it('debe contener catálogo de productos en todas las categorías SIPSA', () => {
    expect(AGRO_PRODUCTS.length).toBeGreaterThanOrEqual(20);
    AGRO_CATEGORIES.forEach(cat => {
      const itemsInCat = AGRO_PRODUCTS.filter(p => p.category === cat.id);
      expect(itemsInCat.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Filtros y Búsqueda', () => {
    it('debe filtrar productos por categoría', () => {
      const tuberculos = agroService.getProducts('corabastos', 'tuberculos');
      expect(tuberculos.length).toBeGreaterThanOrEqual(3);
      tuberculos.forEach(p => expect(p.category).toBe('tuberculos'));
    });

    it('debe filtrar insumos agrícolas y fertilizantes (Urea, Triple 15, DAP)', () => {
      const insumos = agroService.getProducts('corabastos', 'insumos');
      expect(insumos.length).toBeGreaterThanOrEqual(3);
      expect(insumos.some(p => p.name.includes('Urea'))).toBe(true);
      expect(insumos.some(p => p.name.includes('Fertilizante'))).toBe(true);
    });

    it('debe filtrar por búsqueda de texto (nombre o departamento)', () => {
      const papaResults = agroService.getProducts('corabastos', undefined, 'papa');
      expect(papaResults.length).toBeGreaterThanOrEqual(2);
      papaResults.forEach(p => expect(p.name.toLowerCase()).toContain('papa'));

      const boyacaResults = agroService.getProducts('corabastos', undefined, 'boyacá');
      expect(boyacaResults.length).toBeGreaterThanOrEqual(2);
    });

    it('debe filtrar por tendencia de precio (down = gangas)', () => {
      const downProducts = agroService.getProducts('corabastos', undefined, undefined, 'down');
      expect(downProducts.length).toBeGreaterThan(0);
      downProducts.forEach(p => expect(p.trend).toBe('down'));
    });
  });

  describe('Alertas de Mercado (Top Gangas y Top Alzas)', () => {
    it('debe retornar los productos con mayores bajas de precio (Gangas)', () => {
      const bargains = agroService.getTopBargains(3);
      expect(bargains.length).toBe(3);
      expect(bargains[0].changePercentage).toBeLessThan(0);
      // El primero debe tener la mayor caída porcentual (ej. Tomate Chonto)
      expect(bargains[0].changePercentage).toBeLessThanOrEqual(bargains[1].changePercentage);
    });

    it('debe retornar los productos con mayores alzas de precio', () => {
      const increases = agroService.getTopIncreases(2);
      expect(increases.length).toBe(2);
      expect(increases[0].changePercentage).toBeGreaterThan(0);
      expect(increases[0].changePercentage).toBeGreaterThanOrEqual(increases[1].changePercentage);
    });
  });

  describe('Calculadora de Ahorro en Canasta Familiar', () => {
    it('debe calcular el ahorro mayorista vs retail para una lista de compras', () => {
      const items = [
        { productId: 'prod-papa-pastusa', quantityUnits: 5 }, // 5 kg
        { productId: 'prod-tomate-chonto', quantityUnits: 2 }, // 2 kg
        { productId: 'prod-huevo-rojo-aa', quantityUnits: 30 }, // 30 unidades
      ];

      const calculation = agroService.calculateBasketSavings(items);

      expect(calculation.items.length).toBe(3);
      expect(calculation.totalWholesaleCost).toBeGreaterThan(0);
      expect(calculation.totalRetailCost).toBeGreaterThan(calculation.totalWholesaleCost);
      expect(calculation.totalSavings).toBeGreaterThan(0);
      expect(calculation.savingsPercentage).toBeGreaterThanOrEqual(20);
    });

    it('debe manejar lista vacía sin errores', () => {
      const calculation = agroService.calculateBasketSavings([]);
      expect(calculation.items.length).toBe(0);
      expect(calculation.totalWholesaleCost).toBe(0);
      expect(calculation.totalRetailCost).toBe(0);
      expect(calculation.totalSavings).toBe(0);
      expect(calculation.savingsPercentage).toBe(0);
    });
  });

  describe('Formato de Moneda', () => {
    it('debe formatear a pesos colombianos COP', () => {
      const formatted = agroService.formatAgroCOP(95000);
      expect(formatted).toContain('95');
      expect(formatted).toContain('000');
    });
  });
});

