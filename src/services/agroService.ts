/**
 * Servicio de Precios Agropecuarios y Canasta Familiar (SIPSA / DANE)
 * Al Día Colombia
 * Monitoreo diario oficial de Centrales Mayoristas de Abastos e Insumos Agrícolas.
 */

import {
  AgroCategory,
  AgroCategoryMeta,
  AgroProduct,
  WholesaleMarket,
  PriceTrend,
  AgroBasketItem,
  AgroBasketSummary,
} from '../types/agro.types';

// ============================================================================
// 1. METADATOS DE CATEGORÍAS
// ============================================================================
export const AGRO_CATEGORIES: AgroCategoryMeta[] = [
  {
    id: 'tuberculos',
    name: 'Tubérculos y Plátanos',
    icon: '🥔',
    description: 'Papa pastusa, criolla, plátano hartón, yuca llanera y arracacha.',
  },
  {
    id: 'verduras',
    name: 'Verduras y Hortalizas',
    icon: '🥬',
    description: 'Tomate chonto, cebollas, zanahoria, pimentón, lechuga y cilantro.',
  },
  {
    id: 'frutas',
    name: 'Frutas Frescas',
    icon: '🍎',
    description: 'Aguacate Hass, mango, cítricos, lulo, maracuyá y banano.',
  },
  {
    id: 'carnes',
    name: 'Carnes, Pollo y Huevos',
    icon: '🥩',
    description: 'Pechuga de pollo, lomo de res, cerdo, huevos AA y tilapia.',
  },
  {
    id: 'granos',
    name: 'Granos y Víveres',
    icon: '🌾',
    description: 'Arroz de primera, fríjol cargamanto, lenteja, panela y queso costeño.',
  },
  {
    id: 'insumos',
    name: 'Insumos y Fertilizantes',
    icon: '🧪',
    description: 'Urea 46%, Fertilizante 15-15-15, DAP y concentrados pecuarios.',
  },
];

// ============================================================================
// 2. CENTRALES MAYORISTAS DE ABASTOS EN COLOMBIA
// ============================================================================
export const WHOLESALE_MARKETS: WholesaleMarket[] = [
  {
    id: 'corabastos',
    name: 'Corabastos (Bogotá D.C.)',
    shortName: 'Corabastos',
    cityId: '11111111-1111-1111-1111-111111111111',
    cityName: 'Bogotá D.C.',
    department: 'Cundinamarca',
    isMainHub: true,
  },
  {
    id: 'cma-medellin',
    name: 'Central Mayorista de Antioquia (CMA)',
    shortName: 'Mayorista Medellín',
    cityId: '22222222-2222-2222-2222-222222222222',
    cityName: 'Medellín / Itagüí',
    department: 'Antioquia',
    isMainHub: true,
  },
  {
    id: 'cavasa-cali',
    name: 'Cavasa (Central de Abastos del Valle)',
    shortName: 'Cavasa Cali',
    cityId: '33333333-3333-3333-3333-333333333333',
    cityName: 'Cali / Candelaria',
    department: 'Valle del Cauca',
    isMainHub: true,
  },
  {
    id: 'granabastos-baq',
    name: 'Granabastos (Barranquilla)',
    shortName: 'Granabastos',
    cityId: '88888888-8888-8888-8888-888888888888',
    cityName: 'Barranquilla / Soledad',
    department: 'Atlántico',
  },
  {
    id: 'centroabastos-bga',
    name: 'Centroabastos (Bucaramanga)',
    shortName: 'Centroabastos',
    cityId: '66666666-6666-6666-6666-666666666666',
    cityName: 'Bucaramanga',
    department: 'Santander',
  },
  {
    id: 'surabastos-neiva',
    name: 'Surabastos (Neiva)',
    shortName: 'Surabastos',
    cityId: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    cityName: 'Neiva',
    department: 'Huila',
  },
  {
    id: 'cenabastos-cuc',
    name: 'Cenabastos (Cúcuta)',
    shortName: 'Cenabastos',
    cityId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    cityName: 'Cúcuta',
    department: 'Norte de Santander',
  },
  {
    id: 'mayorista-manizales',
    name: 'Plaza de Mercado / Mayorista Manizales',
    shortName: 'Mayorista Manizales',
    cityId: '44444444-4444-4444-4444-444444444444',
    cityName: 'Manizales',
    department: 'Caldas',
  },
];

// ============================================================================
// 3. CATÁLOGO VERIFICADO DE PRODUCTOS SIPSA / DANE
// ============================================================================
export const AGRO_PRODUCTS: AgroProduct[] = [
  // --- TUBÉRCULOS Y PLÁTANOS ---
  {
    id: 'prod-papa-pastusa',
    name: 'Papa Pastusa',
    category: 'tuberculos',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 95000,
    wholesaleUnit: 'Bulto 50 kg',
    retailPriceEquivalent: 1900,
    retailUnit: 'Kilo',
    previousPrice: 105000,
    changePercentage: -9.5,
    trend: 'down',
    supply: 'abundante',
    originDepartment: 'Cundinamarca / Boyacá',
    quality: 'Primera',
    notes: 'Mayor ingreso de cosechas desde el Altiplano Cundiboyacense.',
  },
  {
    id: 'prod-papa-criolla',
    name: 'Papa Criolla Limpia',
    category: 'tuberculos',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 130000,
    wholesaleUnit: 'Bulto 50 kg',
    retailPriceEquivalent: 2600,
    retailUnit: 'Kilo',
    previousPrice: 120000,
    changePercentage: 8.3,
    trend: 'up',
    supply: 'normal',
    originDepartment: 'Cundinamarca (Subachoque / El Rosal)',
    quality: 'Seleccionada',
    notes: 'Lluvias moderadas en zonas altas redujeron la recolección.',
  },
  {
    id: 'prod-platano-harton',
    name: 'Plátano Hartón Verde',
    category: 'tuberculos',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 55000,
    wholesaleUnit: 'Canastilla 22 kg',
    retailPriceEquivalent: 2500,
    retailUnit: 'Kilo',
    previousPrice: 60000,
    changePercentage: -8.3,
    trend: 'down',
    supply: 'abundante',
    originDepartment: 'Quindío / Antioquia (Urabá)',
    quality: 'Primera',
    notes: 'Excelente oferta de racimos provenientes del Eje Cafetero.',
  },
  {
    id: 'prod-yuca-llanera',
    name: 'Yuca Llanera Parafina',
    category: 'tuberculos',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 48000,
    wholesaleUnit: 'Bolsa 30 kg',
    retailPriceEquivalent: 1600,
    retailUnit: 'Kilo',
    previousPrice: 48000,
    changePercentage: 0,
    trend: 'stable',
    supply: 'normal',
    originDepartment: 'Meta (Granada / San Martín)',
    quality: 'Primera',
    notes: 'Flujo constante de camiones por la Vía al Llano.',
  },

  // --- VERDURAS Y HORTALIZAS ---
  {
    id: 'prod-tomate-chonto',
    name: 'Tomate Chonto Maduro',
    category: 'verduras',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 42000,
    wholesaleUnit: 'Canastilla 22 kg',
    retailPriceEquivalent: 1900,
    retailUnit: 'Kilo',
    previousPrice: 52000,
    changePercentage: -19.2,
    trend: 'down',
    supply: 'abundante',
    originDepartment: 'Boyacá / Tolima',
    quality: 'Primera',
    notes: '¡Gran ganga de la semana! Pico de cosecha en invernaderos.',
  },
  {
    id: 'prod-cebolla-cabezona',
    name: 'Cebolla Cabezona Blanca',
    category: 'verduras',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 80000,
    wholesaleUnit: 'Bulto 50 kg',
    retailPriceEquivalent: 1600,
    retailUnit: 'Kilo',
    previousPrice: 92000,
    changePercentage: -13.0,
    trend: 'down',
    supply: 'abundante',
    originDepartment: 'Boyacá (Sogamoso / Samacá)',
    quality: 'Primera',
    notes: 'Precios a la baja por alto ingreso de producto nacional.',
  },
  {
    id: 'prod-cebolla-junca',
    name: 'Cebolla Junca (Larga)',
    category: 'verduras',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 24000,
    wholesaleUnit: 'Atado 10 kg',
    retailPriceEquivalent: 2400,
    retailUnit: 'Kilo',
    previousPrice: 24000,
    changePercentage: 0,
    trend: 'stable',
    supply: 'normal',
    originDepartment: 'Boyacá (Aquitania / Lago de Tota)',
    quality: 'Primera',
  },
  {
    id: 'prod-zanahoria',
    name: 'Zanahoria Lavada',
    category: 'verduras',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 68000,
    wholesaleUnit: 'Bulto 50 kg',
    retailPriceEquivalent: 1360,
    retailUnit: 'Kilo',
    previousPrice: 75000,
    changePercentage: -9.3,
    trend: 'down',
    supply: 'abundante',
    originDepartment: 'Cundinamarca (Madrid / Mosquera)',
    quality: 'Primera',
  },
  {
    id: 'prod-pimenton',
    name: 'Pimentón Rojo',
    category: 'verduras',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 32000,
    wholesaleUnit: 'Canastilla 12 kg',
    retailPriceEquivalent: 2660,
    retailUnit: 'Kilo',
    previousPrice: 28000,
    changePercentage: 14.3,
    trend: 'up',
    supply: 'escaso',
    originDepartment: 'Valle del Cauca / Santander',
    quality: 'Primera',
    notes: 'Menor entrada de producto fresco desde El Dovio y Roldanillo.',
  },

  // --- FRUTAS FRESCAS ---
  {
    id: 'prod-aguacate-hass',
    name: 'Aguacate Hass de Exportación',
    category: 'frutas',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 6200,
    wholesaleUnit: 'Kilo mayorista',
    retailPriceEquivalent: 6200,
    retailUnit: 'Kilo',
    previousPrice: 6800,
    changePercentage: -8.8,
    trend: 'down',
    supply: 'abundante',
    originDepartment: 'Antioquia / Caldas / Tolima',
    quality: 'Extra',
    notes: 'Excelente calibre y precio favorable por cosecha principal.',
  },
  {
    id: 'prod-mango-tommy',
    name: 'Mango Tommy Atkins',
    category: 'frutas',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 38000,
    wholesaleUnit: 'Canastilla 14 kg',
    retailPriceEquivalent: 2710,
    retailUnit: 'Kilo',
    previousPrice: 42000,
    changePercentage: -9.5,
    trend: 'down',
    supply: 'abundante',
    originDepartment: 'Tolima (Espinal) / Cundinamarca',
    quality: 'Primera',
  },
  {
    id: 'prod-limon-tahiti',
    name: 'Limón Tahití',
    category: 'frutas',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 110000,
    wholesaleUnit: 'Bulto 50 kg',
    retailPriceEquivalent: 2200,
    retailUnit: 'Kilo',
    previousPrice: 120000,
    changePercentage: -8.3,
    trend: 'down',
    supply: 'normal',
    originDepartment: 'Santander (Lebrija) / Tolima',
    quality: 'Primera',
  },
  {
    id: 'prod-lulo',
    name: 'Lulo de Castilla',
    category: 'frutas',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 54000,
    wholesaleUnit: 'Canastilla 15 kg',
    retailPriceEquivalent: 3600,
    retailUnit: 'Kilo',
    previousPrice: 50000,
    changePercentage: 8.0,
    trend: 'up',
    supply: 'escaso',
    originDepartment: 'Huila (San Agustín) / Valle',
    quality: 'Primera',
  },
  {
    id: 'prod-naranja-valencia',
    name: 'Naranja Valencia',
    category: 'frutas',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 65000,
    wholesaleUnit: 'Bulto 50 kg',
    retailPriceEquivalent: 1300,
    retailUnit: 'Kilo',
    previousPrice: 65000,
    changePercentage: 0,
    trend: 'stable',
    supply: 'normal',
    originDepartment: 'Quindío / Valle del Cauca',
    quality: 'Primera',
  },

  // --- CARNES, POLLO Y HUEVOS ---
  {
    id: 'prod-pechuga-pollo',
    name: 'Pechuga de Pollo Fresca',
    category: 'carnes',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 14800,
    wholesaleUnit: 'Kilo al por mayor',
    retailPriceEquivalent: 14800,
    retailUnit: 'Kilo',
    previousPrice: 15200,
    changePercentage: -2.6,
    trend: 'down',
    supply: 'normal',
    originDepartment: 'Cundinamarca / Santander',
    quality: 'Primera',
    notes: 'Precio en supermercados ronda los $18.500/kg. Ahorro de ~20%.',
  },
  {
    id: 'prod-lomo-res',
    name: 'Lomo de Res (Carne Limpia)',
    category: 'carnes',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 36500,
    wholesaleUnit: 'Kilo al por mayor',
    retailPriceEquivalent: 36500,
    retailUnit: 'Kilo',
    previousPrice: 36500,
    changePercentage: 0,
    trend: 'stable',
    supply: 'normal',
    originDepartment: 'Córdoba / Meta / Cesar',
    quality: 'Extra',
    notes: 'Ganado en pie estable en subastas ganaderas de la costa y llanos.',
  },
  {
    id: 'prod-pernil-cerdo',
    name: 'Pernil de Cerdo',
    category: 'carnes',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 18200,
    wholesaleUnit: 'Kilo al por mayor',
    retailPriceEquivalent: 18200,
    retailUnit: 'Kilo',
    previousPrice: 18900,
    changePercentage: -3.7,
    trend: 'down',
    supply: 'abundante',
    originDepartment: 'Antioquia / Cundinamarca',
    quality: 'Primera',
  },
  {
    id: 'prod-huevo-rojo-aa',
    name: 'Huevo Rojo Tipo AA',
    category: 'carnes',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 14800,
    wholesaleUnit: 'Cubeta 30 unidades',
    retailPriceEquivalent: 493,
    retailUnit: 'Unidad',
    previousPrice: 15500,
    changePercentage: -4.5,
    trend: 'down',
    supply: 'abundante',
    originDepartment: 'Santander / Cundinamarca',
    quality: 'AA',
    notes: 'Cubeta sale a ~$493/unidad vs ~$650/unidad en tiendas de barrio.',
  },
  {
    id: 'prod-tilapia-roja',
    name: 'Mojarra Roja (Tilapia)',
    category: 'carnes',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 12500,
    wholesaleUnit: 'Kilo',
    retailPriceEquivalent: 12500,
    retailUnit: 'Kilo',
    previousPrice: 12500,
    changePercentage: 0,
    trend: 'stable',
    supply: 'normal',
    originDepartment: 'Huila (Embalse de Betania)',
    quality: 'Primera (500g c/u)',
  },

  // --- GRANOS Y VÍVERES ---
  {
    id: 'prod-arroz-primera',
    name: 'Arroz Blanco de Primera',
    category: 'granos',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 195000,
    wholesaleUnit: 'Bulto 50 kg',
    retailPriceEquivalent: 3900,
    retailUnit: 'Kilo',
    previousPrice: 195000,
    changePercentage: 0,
    trend: 'stable',
    supply: 'abundante',
    originDepartment: 'Tolima (Espinal) / Casanare / Huila',
    quality: 'Primera',
    notes: 'Suficiente inventario en molinos arroceros nacionales.',
  },
  {
    id: 'prod-frijol-cargamanto',
    name: 'Fríjol Cargamanto Rojo',
    category: 'granos',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 340000,
    wholesaleUnit: 'Bulto 50 kg',
    retailPriceEquivalent: 6800,
    retailUnit: 'Kilo',
    previousPrice: 355000,
    changePercentage: -4.2,
    trend: 'down',
    supply: 'normal',
    originDepartment: 'Antioquia / Nariño',
    quality: 'Primera',
  },
  {
    id: 'prod-lenteja',
    name: 'Lenteja de Primera',
    category: 'granos',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 210000,
    wholesaleUnit: 'Bulto 50 kg',
    retailPriceEquivalent: 4200,
    retailUnit: 'Kilo',
    previousPrice: 210000,
    changePercentage: 0,
    trend: 'stable',
    supply: 'normal',
    originDepartment: 'Importada (Canadá / EE.UU.)',
    quality: 'Primera',
  },
  {
    id: 'prod-queso-costeno',
    name: 'Queso Costeño Duro Picado',
    category: 'granos',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 18900,
    wholesaleUnit: 'Kilo al por mayor',
    retailPriceEquivalent: 18900,
    retailUnit: 'Kilo',
    previousPrice: 19800,
    changePercentage: -4.5,
    trend: 'down',
    supply: 'normal',
    originDepartment: 'Cesar / Magdalena / Córdoba',
    quality: 'Primera',
  },
  {
    id: 'prod-panela-redonda',
    name: 'Panela Redonda Corriente',
    category: 'granos',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 88000,
    wholesaleUnit: 'Caja 20 kg (40 un)',
    retailPriceEquivalent: 2200,
    retailUnit: 'Unidad 500g',
    previousPrice: 88000,
    changePercentage: 0,
    trend: 'stable',
    supply: 'abundante',
    originDepartment: 'Santander (Hoya del Río Suárez) / Cundinamarca',
    quality: 'Primera',
  },

  // --- INSUMOS Y FERTILIZANTES AGROPECUARIOS ---
  {
    id: 'prod-urea-46',
    name: 'Urea Perlada 46% N (Fertilizante)',
    category: 'insumos',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 145000,
    wholesaleUnit: 'Bulto 50 kg',
    retailPriceEquivalent: 2900,
    retailUnit: 'Kilo',
    previousPrice: 160000,
    changePercentage: -9.4,
    trend: 'down',
    supply: 'abundante',
    originDepartment: 'Terminal Marítimo Barranquilla / Importado',
    quality: 'Grado Agrícola',
    notes: '¡Alivio al productor agropecuario! Baja del dólar y fletes internacionales.',
  },
  {
    id: 'prod-triple-15',
    name: 'Fertilizante Complejo 15-15-15',
    category: 'insumos',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 168000,
    wholesaleUnit: 'Bulto 50 kg',
    retailPriceEquivalent: 3360,
    retailUnit: 'Kilo',
    previousPrice: 175000,
    changePercentage: -4.0,
    trend: 'down',
    supply: 'normal',
    originDepartment: 'Industria Química Nacional',
    quality: 'Grado Agrícola',
    notes: 'Nutrientes balanceados NPK para cultivos de papa, café y hortalizas.',
  },
  {
    id: 'prod-dap-18-46-0',
    name: 'Fosfato Diamónico (DAP 18-46-0)',
    category: 'insumos',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 198000,
    wholesaleUnit: 'Bulto 50 kg',
    retailPriceEquivalent: 3960,
    retailUnit: 'Kilo',
    previousPrice: 205000,
    changePercentage: -3.4,
    trend: 'down',
    supply: 'normal',
    originDepartment: 'Importado',
    quality: 'Grado Agrícola',
  },
  {
    id: 'prod-concentrado-aves',
    name: 'Alimento Concentrado Aves Engorde',
    category: 'insumos',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 92000,
    wholesaleUnit: 'Bulto 40 kg',
    retailPriceEquivalent: 2300,
    retailUnit: 'Kilo',
    previousPrice: 92000,
    changePercentage: 0,
    trend: 'stable',
    supply: 'normal',
    originDepartment: 'Valle del Cauca / Cundinamarca',
    quality: 'Etapa Finalizador',
  },
  {
    id: 'prod-concentrado-lechero',
    name: 'Alimento Concentrado Ganado Lechero 18%',
    category: 'insumos',
    marketId: 'corabastos',
    marketName: 'Corabastos',
    wholesalePrice: 86000,
    wholesaleUnit: 'Bulto 40 kg',
    retailPriceEquivalent: 2150,
    retailUnit: 'Kilo',
    previousPrice: 88000,
    changePercentage: -2.3,
    trend: 'down',
    supply: 'abundante',
    originDepartment: 'Sabana de Bogotá / Antioquia',
    quality: '18% Proteína',
  },
];

// ============================================================================
// 4. MÉTODOS DE CONSULTA Y CÁLCULO
// ============================================================================

export const agroService = {
  /**
   * Obtiene la lista de centrales mayoristas de abastos
   */
  getMarkets(): WholesaleMarket[] {
    return WHOLESALE_MARKETS;
  },

  /**
   * Obtiene una central por su ID
   */
  getMarketById(id: string): WholesaleMarket | undefined {
    return WHOLESALE_MARKETS.find(m => m.id === id);
  },

  /**
   * Filtra productos por central, categoría, búsqueda de texto y tendencia
   */
  getProducts(
    marketId: string = 'corabastos',
    category?: AgroCategory,
    search?: string,
    trend?: PriceTrend
  ): AgroProduct[] {
    return AGRO_PRODUCTS.filter(item => {
      // Si se implementan precios diferenciados por central, aquí se ajustaría
      // Por ahora se toman los productos base
      if (category && item.category !== category) {
        return false;
      }
      if (trend && item.trend !== trend) {
        return false;
      }
      if (search && search.trim()) {
        const query = search.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(query);
        const matchDept = item.originDepartment.toLowerCase().includes(query);
        if (!matchName && !matchDept) {
          return false;
        }
      }
      return true;
    });
  },

  /**
   * Obtiene los productos con mayores bajas de precio (Gangas del día)
   */
  getTopBargains(limit: number = 3): AgroProduct[] {
    return [...AGRO_PRODUCTS]
      .filter(p => p.trend === 'down' && p.changePercentage < 0)
      .sort((a, b) => a.changePercentage - b.changePercentage)
      .slice(0, limit);
  },

  /**
   * Obtiene los productos con mayores alzas (Alertas de precio alto)
   */
  getTopIncreases(limit: number = 3): AgroProduct[] {
    return [...AGRO_PRODUCTS]
      .filter(p => p.trend === 'up' && p.changePercentage > 0)
      .sort((a, b) => b.changePercentage - a.changePercentage)
      .slice(0, limit);
  },

  /**
   * Calcula el costo y ahorro en la Canasta Familiar
   * comparando precios mayoristas de central de abastos vs supermercado (+25% margen retail típico)
   */
  calculateBasketSavings(
    items: Array<{ productId: string; quantityUnits: number }>
  ): AgroBasketSummary {
    const basketItems: AgroBasketItem[] = [];
    let totalWholesaleCost = 0;
    let totalRetailCost = 0;

    items.forEach(({ productId, quantityUnits }) => {
      const product = AGRO_PRODUCTS.find(p => p.id === productId);
      if (product && quantityUnits > 0) {
        const wholesaleCost = product.retailPriceEquivalent * quantityUnits;
        // Supermercado típicamente tiene un margen del +25% al +35% sobre precio mayorista
        const estimatedRetailCost = Math.round(wholesaleCost * 1.28);
        const savings = estimatedRetailCost - wholesaleCost;

        totalWholesaleCost += wholesaleCost;
        totalRetailCost += estimatedRetailCost;

        basketItems.push({
          product,
          quantityUnits,
          estimatedWholesaleCost: wholesaleCost,
          estimatedRetailCost,
          savings,
        });
      }
    });

    const totalSavings = totalRetailCost - totalWholesaleCost;
    const savingsPercentage =
      totalRetailCost > 0 ? Math.round((totalSavings / totalRetailCost) * 100) : 0;

    return {
      items: basketItems,
      totalWholesaleCost,
      totalRetailCost,
      totalSavings,
      savingsPercentage,
    };
  },

  /**
   * Formateador de moneda colombiana COP
   */
  formatAgroCOP(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amount);
  },
};

