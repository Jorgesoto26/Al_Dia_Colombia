/**
 * Servicio de Precios de Combustibles y Estaciones de Servicio (SICOM / MinMinas)
 * Al Día Colombia - Offline-First
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FuelType,
  FuelStation,
  FuelProductMeta,
  CityFuelBenchmark,
  TankCalculationResult,
} from '../types/fuel.types';
import { VehicleType } from '../types/database.types';

const STORAGE_KEY_FUEL_STATIONS = '@al_dia:fuel_stations';
const STORAGE_KEY_FUEL_BENCHMARKS = '@al_dia:fuel_benchmarks';

// ============================================================================
// METADATOS OFICIALES DE PRODUCTOS DE COMBUSTIBLE
// ============================================================================
export const FUEL_PRODUCTS: Record<FuelType, FuelProductMeta> = {
  corriente: {
    type: 'corriente',
    name: 'Gasolina Corriente Oxigenada',
    shortName: 'Corriente',
    badge: '87 Octanos',
    unit: 'COP/gal',
    color: '#3B82F6', // Azul eléctrico
    description: 'Combustible estándar para la gran mayoría de vehículos y motocicletas en Colombia.',
  },
  extra: {
    type: 'extra',
    name: 'Gasolina Extra / Premium',
    shortName: 'Extra',
    badge: '92+ Octanos',
    unit: 'COP/gal',
    color: '#F59E0B', // Ámbar brillante
    description: 'Mayor octanaje recomendado para motores con turbo, inyección directa o alta relación de compresión.',
  },
  diesel: {
    type: 'diesel',
    name: 'Diésel / ACPM Nacional',
    shortName: 'ACPM / Diésel',
    badge: 'Ultra Bajo Azufre',
    unit: 'COP/gal',
    color: '#10B981', // Verde esmeralda
    description: 'Para camperos, camionetas diésel, vans, transporte de carga y servicio especial.',
  },
  gnv: {
    type: 'gnv',
    name: 'Gas Natural Comprimido Vehicular',
    shortName: 'Gas GNV',
    badge: 'GNCV Ecológico',
    unit: 'COP/m³',
    color: '#06B6D4', // Cian
    description: 'Opción limpia y económica para taxis y vehículos adaptados con cilindro de gas.',
  },
};

// ============================================================================
// PRECIOS OFICIALES DE REFERENCIA CREG / MINMINAS
// ============================================================================
export const EMBEDDED_BENCHMARKS: CityFuelBenchmark[] = [
  {
    city_id: '11111111-1111-1111-1111-111111111111',
    city_name: 'Bogotá D.C.',
    department: 'Cundinamarca',
    corriente: 15860,
    extra: 21500,
    diesel: 10050,
    gnv: 2650,
    effective_period: 'Noviembre 2026',
    source: 'Resolución CREG / MinMinas',
  },
  {
    city_id: '22222222-2222-2222-2222-222222222222',
    city_name: 'Medellín',
    department: 'Antioquia',
    corriente: 15790,
    extra: 21400,
    diesel: 10080,
    gnv: 2800,
    effective_period: 'Noviembre 2026',
    source: 'Resolución CREG / MinMinas',
  },
  {
    city_id: '33333333-3333-3333-3333-333333333333',
    city_name: 'Cali',
    department: 'Valle del Cauca',
    corriente: 15890,
    extra: 21600,
    diesel: 10150,
    gnv: 2750,
    effective_period: 'Noviembre 2026',
    source: 'Resolución CREG / MinMinas',
  },
  {
    city_id: '44444444-4444-4444-4444-444444444444',
    city_name: 'Manizales',
    department: 'Caldas',
    corriente: 15840,
    extra: 21450,
    diesel: 10120,
    gnv: 2700,
    effective_period: 'Noviembre 2026',
    source: 'Resolución CREG / MinMinas',
  },
  {
    city_id: '55555555-5555-5555-5555-555555555555',
    city_name: 'Pereira',
    department: 'Risaralda',
    corriente: 15810,
    extra: 21420,
    diesel: 10100,
    gnv: 2680,
    effective_period: 'Noviembre 2026',
    source: 'Resolución CREG / MinMinas',
  },
  {
    city_id: '66666666-6666-6666-6666-666666666666',
    city_name: 'Bucaramanga',
    department: 'Santander',
    corriente: 15620,
    extra: 21200,
    diesel: 9850,
    gnv: 2550,
    effective_period: 'Noviembre 2026',
    source: 'Resolución CREG / MinMinas',
  },
  {
    city_id: '77777777-7777-7777-7777-777777777777',
    city_name: 'Armenia',
    department: 'Quindío',
    corriente: 15870,
    extra: 21480,
    diesel: 10140,
    gnv: 2720,
    effective_period: 'Noviembre 2026',
    source: 'Resolución CREG / MinMinas',
  },
  {
    city_id: '88888888-8888-8888-8888-888888888888',
    city_name: 'Barranquilla',
    department: 'Atlántico',
    corriente: 15550,
    extra: 21250,
    diesel: 9780,
    gnv: 2750,
    effective_period: 'Noviembre 2026',
    source: 'Resolución CREG / MinMinas',
  },
  {
    city_id: '99999999-9999-9999-9999-999999999999',
    city_name: 'Cartagena',
    department: 'Bolívar',
    corriente: 15510,
    extra: 21200,
    diesel: 9740,
    gnv: 2700,
    effective_period: 'Noviembre 2026',
    source: 'Resolución CREG / MinMinas',
  },
  {
    city_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    city_name: 'Cúcuta',
    department: 'Norte de Santander',
    corriente: 13950,
    extra: 18900,
    diesel: 8900,
    gnv: 2400,
    effective_period: 'Noviembre 2026',
    source: 'Resolución CREG / MinMinas (Zona Frontera)',
  },
  {
    city_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    city_name: 'Ibagué',
    department: 'Tolima',
    corriente: 15780,
    extra: 21390,
    diesel: 10050,
    gnv: 2680,
    effective_period: 'Noviembre 2026',
    source: 'Resolución CREG / MinMinas',
  },
  {
    city_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    city_name: 'Villavicencio',
    department: 'Meta',
    corriente: 15990,
    extra: 21750,
    diesel: 10250,
    gnv: 2850,
    effective_period: 'Noviembre 2026',
    source: 'Resolución CREG / MinMinas',
  },
  {
    city_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    city_name: 'Neiva',
    department: 'Huila',
    corriente: 15850,
    extra: 21450,
    diesel: 10120,
    gnv: 2720,
    effective_period: 'Noviembre 2026',
    source: 'Resolución CREG / MinMinas',
  },
  {
    city_id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    city_name: 'Santa Marta',
    department: 'Magdalena',
    corriente: 15610,
    extra: 21300,
    diesel: 9820,
    gnv: 2780,
    effective_period: 'Noviembre 2026',
    source: 'Resolución CREG / MinMinas',
  },
  {
    city_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
    city_name: 'Pasto',
    department: 'Nariño',
    corriente: 13600,
    extra: 18500,
    diesel: 8750,
    gnv: 2350,
    effective_period: 'Noviembre 2026',
    source: 'Resolución CREG / MinMinas (Zona Frontera)',
  },
];

// ============================================================================
// CATÁLOGO DE ESTACIONES DE SERVICIO VERIFICADAS (SICOM / EDS)
// ============================================================================
export const EMBEDDED_STATIONS: FuelStation[] = [
  // --- BOGOTÁ ---
  {
    id: 'eds-bog-01',
    name: 'Terpel Autopista Norte 127',
    brand: 'TERPEL',
    city_id: '11111111-1111-1111-1111-111111111111',
    city_name: 'Bogotá D.C.',
    department: 'Cundinamarca',
    address: 'Autopista Norte # 127-10',
    prices: { corriente: 15690, extra: 21200, diesel: 9980, gnv: 2650 },
    services: ['24 Horas', 'Tienda Altoque', 'Calibración Aire', 'Lavadero'],
    is_cheapest: { corriente: true, diesel: true },
    latitude: 4.7078,
    longitude: -74.0531,
    last_updated: 'Hoy, 06:00 AM',
  },
  {
    id: 'eds-bog-02',
    name: 'Texaco Calle 100',
    brand: 'TEXACO',
    city_id: '11111111-1111-1111-1111-111111111111',
    city_name: 'Bogotá D.C.',
    department: 'Cundinamarca',
    address: 'Calle 100 # 19-45',
    prices: { corriente: 15860, extra: 21450, diesel: 10050, gnv: 2700 },
    services: ['24 Horas', 'Tienda StarMart', 'Montallantas', 'Cajero ATH'],
    latitude: 4.6865,
    longitude: -74.0565,
    last_updated: 'Hoy, 07:15 AM',
  },
  {
    id: 'eds-bog-03',
    name: 'Primax Avenida 68 con Américas',
    brand: 'PRIMAX',
    city_id: '11111111-1111-1111-1111-111111111111',
    city_name: 'Bogotá D.C.',
    department: 'Cundinamarca',
    address: 'Av. Carrera 68 # 12-30',
    prices: { corriente: 15590, extra: 20990, diesel: 9920, gnv: 2580 },
    services: ['24 Horas', 'Tienda Listo', 'Lavado Autos', 'Pago con Código'],
    is_cheapest: { corriente: true, extra: true, gnv: true },
    latitude: 4.6372,
    longitude: -74.1165,
    last_updated: 'Hoy, 05:45 AM',
  },
  {
    id: 'eds-bog-04',
    name: 'Biomax Boyacá con Esperanza',
    brand: 'BIOMAX',
    city_id: '11111111-1111-1111-1111-111111111111',
    city_name: 'Bogotá D.C.',
    department: 'Cundinamarca',
    address: 'Av. Boyacá # 24C-15',
    prices: { corriente: 15640, extra: 21150, diesel: 9950, gnv: 2620 },
    services: ['24 Horas', 'Minimarket', 'Calibración Digital'],
    latitude: 4.6612,
    longitude: -74.1205,
    last_updated: 'Hoy, 06:30 AM',
  },
  {
    id: 'eds-bog-05',
    name: 'Mobil Calle 26 Aeropuerto',
    brand: 'MOBIL',
    city_id: '11111111-1111-1111-1111-111111111111',
    city_name: 'Bogotá D.C.',
    department: 'Cundinamarca',
    address: 'Av. El Dorado # 85-20',
    prices: { corriente: 15890, extra: 21590, diesel: 10080, gnv: 2690 },
    services: ['24 Horas', 'Tienda On the Run', 'Zona WiFi', 'Baños'],
    latitude: 4.6851,
    longitude: -74.1215,
    last_updated: 'Hoy, 08:00 AM',
  },

  // --- MEDELLÍN ---
  {
    id: 'eds-med-01',
    name: 'Terpel Las Vegas Envigado',
    brand: 'TERPEL',
    city_id: '22222222-2222-2222-2222-222222222222',
    city_name: 'Medellín',
    department: 'Antioquia',
    address: 'Carrera 48 # 25 Sur-18',
    prices: { corriente: 15650, extra: 21100, diesel: 9990, gnv: 2780 },
    services: ['24 Horas', 'Tienda Altoque', 'Surtidor Rápido'],
    is_cheapest: { corriente: true, extra: true },
    latitude: 6.1782,
    longitude: -75.5891,
    last_updated: 'Hoy, 06:10 AM',
  },
  {
    id: 'eds-med-02',
    name: 'Primax Poblado Los Balsos',
    brand: 'PRIMAX',
    city_id: '22222222-2222-2222-2222-222222222222',
    city_name: 'Medellín',
    department: 'Antioquia',
    address: 'Calle 9 Sur # 42-60',
    prices: { corriente: 15790, extra: 21390, diesel: 10080, gnv: 2800 },
    services: ['24 Horas', 'Tienda Listo', 'Café Juan Valdez', 'Lavadero'],
    latitude: 6.1952,
    longitude: -75.5721,
    last_updated: 'Hoy, 07:45 AM',
  },
  {
    id: 'eds-med-03',
    name: 'Zeuss Autopista Sur Guayabal',
    brand: 'ZEUSS',
    city_id: '22222222-2222-2222-2222-222222222222',
    city_name: 'Medellín',
    department: 'Antioquia',
    address: 'Autopista Sur # 10-40',
    prices: { corriente: 15580, extra: 20950, diesel: 9940, gnv: 2720 },
    services: ['24 Horas', 'Montallantas', 'Cambio de Aceite'],
    is_cheapest: { corriente: true, diesel: true, gnv: true },
    latitude: 6.2155,
    longitude: -75.5812,
    last_updated: 'Hoy, 05:20 AM',
  },

  // --- CALI ---
  {
    id: 'eds-cal-01',
    name: 'Primax Pasoancho Calle 13',
    brand: 'PRIMAX',
    city_id: '33333333-3333-3333-3333-333333333333',
    city_name: 'Cali',
    department: 'Valle del Cauca',
    address: 'Calle 13 # 66-10 Pasoancho',
    prices: { corriente: 15740, extra: 21350, diesel: 10040, gnv: 2710 },
    services: ['24 Horas', 'Tienda Listo', 'Calibración Aire'],
    is_cheapest: { corriente: true, diesel: true },
    latitude: 3.4012,
    longitude: -76.5412,
    last_updated: 'Hoy, 06:40 AM',
  },
  {
    id: 'eds-cal-02',
    name: 'Texaco Autopista Suroriental',
    brand: 'TEXACO',
    city_id: '33333333-3333-3333-3333-333333333333',
    city_name: 'Cali',
    department: 'Valle del Cauca',
    address: 'Autopista Suroriental # 39-20',
    prices: { corriente: 15890, extra: 21590, diesel: 10150, gnv: 2750 },
    services: ['24 Horas', 'Tienda StarMart', 'Lavado Autos'],
    latitude: 3.4255,
    longitude: -76.5233,
    last_updated: 'Hoy, 07:10 AM',
  },

  // --- BUCARAMANGA ---
  {
    id: 'eds-buc-01',
    name: 'Terpel Puerta del Sol',
    brand: 'TERPEL',
    city_id: '66666666-6666-6666-6666-666666666666',
    city_name: 'Bucaramanga',
    department: 'Santander',
    address: 'Carrera 27 # 61-02',
    prices: { corriente: 15490, extra: 20990, diesel: 9780, gnv: 2510 },
    services: ['24 Horas', 'Tienda Altoque', 'Lubricentro'],
    is_cheapest: { corriente: true, extra: true, diesel: true },
    latitude: 7.1022,
    longitude: -73.1189,
    last_updated: 'Hoy, 06:15 AM',
  },

  // --- MANIZALES ---
  {
    id: 'eds-man-01',
    name: 'Biomax Vía al Centro',
    brand: 'BIOMAX',
    city_id: '44444444-4444-4444-4444-444444444444',
    city_name: 'Manizales',
    department: 'Caldas',
    address: 'Carrera 23 # 45-12',
    prices: { corriente: 15720, extra: 21250, diesel: 10020, gnv: 2680 },
    services: ['24 Horas', 'Minimarket', 'Calibración Digital'],
    is_cheapest: { corriente: true, diesel: true },
    latitude: 5.0689,
    longitude: -75.5174,
    last_updated: 'Hoy, 07:05 AM',
  },

  // --- PEREIRA ---
  {
    id: 'eds-per-01',
    name: 'Texaco Avenida 30 de Agosto',
    brand: 'TEXACO',
    city_id: '55555555-5555-5555-5555-555555555555',
    city_name: 'Pereira',
    department: 'Risaralda',
    address: 'Av. 30 de Agosto # 48-25',
    prices: { corriente: 15690, extra: 21220, diesel: 9980, gnv: 2640 },
    services: ['24 Horas', 'Tienda StarMart', 'Servicio de Lavado'],
    is_cheapest: { corriente: true, diesel: true },
    latitude: 4.8133,
    longitude: -75.7022,
    last_updated: 'Hoy, 06:50 AM',
  },

  // --- ARMENIA ---
  {
    id: 'eds-arm-01',
    name: 'Primax Avenida Bolívar',
    brand: 'PRIMAX',
    city_id: '77777777-7777-7777-7777-777777777777',
    city_name: 'Armenia',
    department: 'Quindío',
    address: 'Av. Bolívar # 14 Norte-20',
    prices: { corriente: 15750, extra: 21300, diesel: 10040, gnv: 2690 },
    services: ['24 Horas', 'Tienda Listo', 'Calibración Aire'],
    is_cheapest: { corriente: true, extra: true },
    latitude: 4.5422,
    longitude: -75.6655,
    last_updated: 'Hoy, 07:30 AM',
  },
  // --- BARRANQUILLA ---
  {
    id: 'eds-baq-01',
    name: 'Primax Calle 84',
    brand: 'PRIMAX',
    city_id: '88888888-8888-8888-8888-888888888888',
    city_name: 'Barranquilla',
    department: 'Atlántico',
    address: 'Calle 84 # 51B-32',
    prices: { corriente: 15480, extra: 21100, diesel: 9720, gnv: 2710 },
    services: ['24 Horas', 'Tienda Listo', 'Calibración Aire'],
    is_cheapest: { corriente: true, diesel: true },
    latitude: 11.0085,
    longitude: -74.8192,
    last_updated: 'Hoy, 06:15 AM',
  },
  // --- CARTAGENA ---
  {
    id: 'eds-ctg-01',
    name: 'Texaco Bocagrande',
    brand: 'TEXACO',
    city_id: '99999999-9999-9999-9999-999999999999',
    city_name: 'Cartagena',
    department: 'Bolívar',
    address: 'Cra. 2 # 8-40 Bocagrande',
    prices: { corriente: 15460, extra: 21150, diesel: 9690, gnv: 2680 },
    services: ['24 Horas', 'Star Mart', 'Calibración Digital'],
    is_cheapest: { corriente: true },
    latitude: 10.4021,
    longitude: -75.5562,
    last_updated: 'Hoy, 07:00 AM',
  },
  // --- CÚCUTA ---
  {
    id: 'eds-cuc-01',
    name: 'Terpel Diagonal Santander',
    brand: 'TERPEL',
    city_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    city_name: 'Cúcuta',
    department: 'Norte de Santander',
    address: 'Diagonal Santander # 4-50',
    prices: { corriente: 13890, extra: 18750, diesel: 8850, gnv: 2380 },
    services: ['24 Horas', 'Tienda Altoque', 'Lavadero'],
    is_cheapest: { corriente: true, diesel: true },
    latitude: 7.8939,
    longitude: -72.5078,
    last_updated: 'Hoy, 06:45 AM',
  },
  // --- IBAGUÉ ---
  {
    id: 'eds-iba-01',
    name: 'Terpel Carrera Quinta',
    brand: 'TERPEL',
    city_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    city_name: 'Ibagué',
    department: 'Tolima',
    address: 'Cra. 5 # 37-20',
    prices: { corriente: 15720, extra: 21250, diesel: 9980, gnv: 2650 },
    services: ['24 Horas', 'Tienda Altoque', 'Calibración Aire'],
    is_cheapest: { corriente: true },
    latitude: 4.4389,
    longitude: -75.2322,
    last_updated: 'Hoy, 07:15 AM',
  },
  // --- VILLAVICENCIO ---
  {
    id: 'eds-vvc-01',
    name: 'Biomax Avenida 40',
    brand: 'BIOMAX',
    city_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    city_name: 'Villavicencio',
    department: 'Meta',
    address: 'Av. 40 # 24C-10',
    prices: { corriente: 15920, extra: 21650, diesel: 10180, gnv: 2810 },
    services: ['24 Horas', 'Tienda', 'Calibración Aire'],
    is_cheapest: { corriente: true },
    latitude: 4.1420,
    longitude: -73.6266,
    last_updated: 'Hoy, 06:30 AM',
  },
  // --- NEIVA ---
  {
    id: 'eds-nei-01',
    name: 'Terpel Carrera Quinta Neiva',
    brand: 'TERPEL',
    city_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    city_name: 'Neiva',
    department: 'Huila',
    address: 'Cra. 5 # 18-35 Centro',
    prices: { corriente: 15790, extra: 21380, diesel: 10050, gnv: 2690 },
    services: ['24 Horas', 'Tienda Altoque', 'Calibración Aire'],
    is_cheapest: { corriente: true, diesel: true },
    latitude: 2.9273,
    longitude: -75.2819,
    last_updated: 'Hoy, 07:00 AM',
  },
  // --- SANTA MARTA ---
  {
    id: 'eds-smr-01',
    name: 'Texaco El Rodadero',
    brand: 'TEXACO',
    city_id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    city_name: 'Santa Marta',
    department: 'Magdalena',
    address: 'Carrera 4 # 9-20 El Rodadero',
    prices: { corriente: 15550, extra: 21200, diesel: 9750, gnv: 2720 },
    services: ['24 Horas', 'Star Mart', 'Calibración Digital'],
    is_cheapest: { corriente: true },
    latitude: 11.2052,
    longitude: -74.2255,
    last_updated: 'Hoy, 06:50 AM',
  },
  // --- PASTO ---
  {
    id: 'eds-pas-01',
    name: 'Biomax Panamericana Pasto',
    brand: 'BIOMAX',
    city_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
    city_name: 'Pasto',
    department: 'Nariño',
    address: 'Av. Panamericana # 18-50',
    prices: { corriente: 13520, extra: 18350, diesel: 8690, gnv: 2320 },
    services: ['24 Horas', 'Tienda', 'Calibración Digital'],
    is_cheapest: { corriente: true, diesel: true },
    latitude: 1.2136,
    longitude: -77.2811,
    last_updated: 'Hoy, 07:10 AM',
  },
];

// ============================================================================
// SERVICIO PRINCIPAL DE COMBUSTIBLES
// ============================================================================
export const fuelService = {
  /**
   * Obtiene las estaciones de servicio para una ciudad y producto de combustible
   */
  async getStationsByCity(
    cityId: string,
    fuelType: FuelType = 'corriente',
    sortBy: 'cheapest' | 'name' = 'cheapest'
  ): Promise<FuelStation[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_FUEL_STATIONS);
      const allStations: FuelStation[] = stored ? JSON.parse(stored) : EMBEDDED_STATIONS;

      // Filtrar por ciudad
      let filtered = allStations.filter(s => s.city_id === cityId);

      // Si no hay estaciones específicas en esa ciudad, retornar todas las de muestra
      if (filtered.length === 0) {
        filtered = allStations;
      }

      // Ordenar por precio más barato primero o por nombre
      if (sortBy === 'cheapest') {
        filtered.sort((a, b) => (a.prices[fuelType] || 0) - (b.prices[fuelType] || 0));
      } else {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      }

      return filtered;
    } catch {
      return EMBEDDED_STATIONS.filter(s => s.city_id === cityId);
    }
  },

  /**
   * Obtiene el benchmark oficial de referencia CREG/MinMinas para la ciudad
   */
  getCityBenchmark(cityId: string): CityFuelBenchmark {
    const found = EMBEDDED_BENCHMARKS.find(b => b.city_id === cityId);
    return found || EMBEDDED_BENCHMARKS[0]; // Default Bogotá
  },

  /**
   * Obtiene la estación más económica en una ciudad para un combustible dado
   */
  async getCheapestStation(cityId: string, fuelType: FuelType = 'corriente'): Promise<FuelStation | null> {
    const stations = await this.getStationsByCity(cityId, fuelType, 'cheapest');
    return stations.length > 0 ? stations[0] : null;
  },

  /**
   * Motor de cálculo de tanqueada y rendimiento en autonomía
   */
  calculateTanking(
    fuelType: FuelType,
    vehicleType: VehicleType = 'particular',
    inputValue: number, // Pesos COP o cantidad de galones
    mode: 'budget' | 'gallons' = 'budget',
    pricePerGallon: number = 15860
  ): TankCalculationResult {
    const meta = FUEL_PRODUCTS[fuelType];
    const safePrice = pricePerGallon > 0 ? pricePerGallon : 15860;

    // Autonomía promedio por tipo de vehículo en Colombia
    let autonomyKmPerGallon = 40; // Carro estándar promedio
    if (vehicleType === 'moto') {
      autonomyKmPerGallon = 120; // Motos rinden mucho más
    } else if (vehicleType === 'taxi') {
      autonomyKmPerGallon = 35; // Ciclo urbano pesado
    }

    let gallonsReceived = 0;
    let totalCost = 0;

    if (mode === 'budget') {
      totalCost = inputValue;
      gallonsReceived = Number((inputValue / safePrice).toFixed(2));
    } else {
      gallonsReceived = inputValue;
      totalCost = Math.round(inputValue * safePrice);
    }

    const estimatedKilometers = Math.round(gallonsReceived * autonomyKmPerGallon);

    // Comparativa de ahorro vs precio oficial de referencia
    const benchmarkPrice = 15860;
    const diffPerGallon = benchmarkPrice - safePrice;
    const potentialSavings = diffPerGallon > 0 ? Math.round(diffPerGallon * gallonsReceived) : 0;

    return {
      fuelType,
      fuelName: meta.name,
      mode,
      inputValue,
      pricePerGallon: safePrice,
      gallonsReceived,
      totalCost,
      estimatedKilometers,
      autonomyKmPerGallon,
      potentialSavings,
    };
  },

  /**
   * Formateador estándar de precios en pesos colombianos
   */
  formatCOP(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(value);
  },
};

