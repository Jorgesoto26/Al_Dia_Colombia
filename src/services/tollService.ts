/**
 * Servicio de Tarifas de Peajes y Rutas Viales de Colombia (INVIAS / ANI)
 * Al Día Colombia
 * Tarifas oficiales vigentes para corredores turísticos y de festivos.
 */

import {
  VehicleCategory,
  VehicleCategoryFilter,
  VehicleCategoryInfo,
  TollStation,
  CorridorRoute,
  RouteCalculationResult,
} from '../types/toll.types';

// ============================================================================
// 1. INFORMACIÓN DE CATEGORÍAS VEHICULARES
// ============================================================================
export const VEHICLE_CATEGORIES: VehicleCategoryInfo[] = [
  {
    category: 'I',
    name: 'Categoría I (Automóviles y Camionetas)',
    shortLabel: 'Cat. I - Autos',
    description: 'Automóviles, camperos, camionetas y microbuses de un solo eje trasero.',
    icon: '🚗',
  },
  {
    category: 'MOTO',
    name: 'Motocicletas (Exentas)',
    shortLabel: 'Motos ($0)',
    description: 'Exentas de pago en peajes nacionales según Ley 787 de 2002.',
    icon: '🏍️',
    isExempt: true,
  },
  {
    category: 'II',
    name: 'Categoría II (Buses y Busetas)',
    shortLabel: 'Cat. II - Buses',
    description: 'Buses, busetas con eje trasero de doble llanta y camiones de 2 ejes pequeños.',
    icon: '🚌',
  },
  {
    category: 'III',
    name: 'Categoría III (Camiones 2 ejes grandes)',
    shortLabel: 'Cat. III - Carga',
    description: 'Camiones de dos ejes grandes y transporte mediano.',
    icon: '🚚',
  },
  {
    category: 'IV',
    name: 'Categoría IV (Camiones 3 y 4 ejes)',
    shortLabel: 'Cat. IV - Carga pesada',
    description: 'Camiones de 3 y 4 ejes.',
    icon: '🚛',
  },
  {
    category: 'V',
    name: 'Categoría V (Tractomulas 5+ ejes)',
    shortLabel: 'Cat. V - Tractomula',
    description: 'Tractocamiones y vehículos de carga pesada de 5 o más ejes.',
    icon: '🚛',
  },
];

// ============================================================================
// 2. CATÁLOGO VERIFICADO DE ESTACIONES DE PEAJE (INVIAS / ANI)
// ============================================================================
export const TOLL_STATIONS: TollStation[] = [
  // Corredor Bogotá - Girardot / Tolima (Vía 40 Express / APP GICA)
  {
    id: 'peaje-chusaca',
    name: 'Peaje Chusacá',
    operator: 'ANI',
    concessionName: 'Vía 40 Express',
    department: 'Cundinamarca',
    sector: 'Autopista Sur (Soacha - Sibaté)',
    highwayNumber: 'Ruta 40',
    prices: { I: 13900, II: 18200, III: 30400, IV: 40600, V: 49200 },
    emergencyPhone: '018000180301',
    hasColpass: true,
    coordinates: { latitude: 4.5122, longitude: -74.2581 },
  },
  {
    id: 'peaje-chinauta',
    name: 'Peaje Chinauta',
    operator: 'ANI',
    concessionName: 'Vía 40 Express',
    department: 'Cundinamarca',
    sector: 'Silvania - Fusagasugá',
    highwayNumber: 'Ruta 40',
    prices: { I: 13900, II: 18200, III: 30400, IV: 40600, V: 49200 },
    emergencyPhone: '018000180301',
    hasColpass: true,
    coordinates: { latitude: 4.3015, longitude: -74.4518 },
  },
  {
    id: 'peaje-chicoral',
    name: 'Peaje Chicoral',
    operator: 'ANI',
    concessionName: 'Autovía Neiva Girardot / San Rafael',
    department: 'Tolima',
    sector: 'Flandes - Espinal - Chicoral',
    highwayNumber: 'Ruta 40',
    prices: { I: 14800, II: 20600, III: 33100, IV: 44000, V: 54500 },
    emergencyPhone: '018000180340',
    hasColpass: true,
    coordinates: { latitude: 4.2185, longitude: -74.9812 },
  },
  {
    id: 'peaje-gualanday',
    name: 'Peaje Gualanday',
    operator: 'ANI',
    concessionName: 'APP GICA (Girardot - Ibagué - Cajamarca)',
    department: 'Tolima',
    sector: 'Coello - Gualanday - Ibagué',
    highwayNumber: 'Ruta 40',
    prices: { I: 13300, II: 18700, III: 30800, IV: 41200, V: 50900 },
    emergencyPhone: '3173678788',
    hasColpass: true,
    coordinates: { latitude: 4.2981, longitude: -75.0315 },
  },

  // Corredor Bogotá - Villavicencio (Vía al Llano - Coviandina)
  {
    id: 'peaje-boqueron',
    name: 'Peaje Boquerón I y II',
    operator: 'ANI',
    concessionName: 'Coviandina',
    department: 'Cundinamarca',
    sector: 'Chipaque - Cáqueza',
    highwayNumber: 'Ruta 40',
    prices: { I: 17500, II: 45800, III: 35200, IV: 58700, V: 73500 },
    emergencyPhone: '018000910110',
    hasColpass: true,
    coordinates: { latitude: 4.4418, longitude: -74.0412 },
  },
  {
    id: 'peaje-naranjal',
    name: 'Peaje Naranjal',
    operator: 'ANI',
    concessionName: 'Coviandina',
    department: 'Cundinamarca',
    sector: 'Cáqueza - Quetame',
    highwayNumber: 'Ruta 40',
    prices: { I: 15400, II: 36700, III: 29800, IV: 48600, V: 62100 },
    emergencyPhone: '018000910110',
    hasColpass: true,
    coordinates: { latitude: 4.3218, longitude: -73.8615 },
  },
  {
    id: 'peaje-pipiral',
    name: 'Peaje Pipiral',
    operator: 'ANI',
    concessionName: 'Coviandina',
    department: 'Meta',
    sector: 'Guayabetal - Villavicencio (Túnel Buenavista)',
    highwayNumber: 'Ruta 40',
    prices: { I: 24800, II: 49600, III: 42000, IV: 68900, V: 88400 },
    emergencyPhone: '018000910110',
    hasColpass: true,
    coordinates: { latitude: 4.1985, longitude: -73.7012 },
  },

  // Corredor Bogotá - Tunja / Villa de Leyva (Autopista Norte / Briceño - Tunja - Sogamoso)
  {
    id: 'peaje-andes',
    name: 'Peaje Andes',
    operator: 'ANI',
    concessionName: 'Accenorte',
    department: 'Bogotá D.C. / Cundinamarca',
    sector: 'Autopista Norte (Salida Bogotá - Chía)',
    highwayNumber: 'Ruta 55',
    prices: { I: 11600, II: 19500, III: 23800, IV: 33400, V: 43200 },
    emergencyPhone: '018000180340',
    hasColpass: true,
    coordinates: { latitude: 4.8215, longitude: -74.0321 },
  },
  {
    id: 'peaje-roble',
    name: 'Peaje El Roble',
    operator: 'ANI',
    concessionName: 'BTS (Briceño - Tunja - Sogamoso)',
    department: 'Cundinamarca',
    sector: 'Gachancipá - Sesquilé',
    highwayNumber: 'Ruta 55',
    prices: { I: 11200, II: 18700, III: 22800, IV: 32000, V: 41500 },
    emergencyPhone: '018000911550',
    hasColpass: true,
    coordinates: { latitude: 5.0215, longitude: -73.8115 },
  },
  {
    id: 'peaje-albarracin',
    name: 'Peaje Albarracín',
    operator: 'ANI',
    concessionName: 'BTS (Briceño - Tunja - Sogamoso)',
    department: 'Boyacá',
    sector: 'Villapinzón - Ventaquemada',
    highwayNumber: 'Ruta 55',
    prices: { I: 11200, II: 18700, III: 22800, IV: 32000, V: 41500 },
    emergencyPhone: '018000911550',
    hasColpass: true,
    coordinates: { latitude: 5.2915, longitude: -73.5312 },
  },

  // Corredor Bogotá - Medellín (Autopista Medellín - Bogotá)
  {
    id: 'peaje-siberia',
    name: 'Peaje Siberia',
    operator: 'ANI',
    concessionName: 'Devisab',
    department: 'Cundinamarca',
    sector: 'Cota - Funza - Calle 80',
    highwayNumber: 'Ruta 50',
    prices: { I: 14400, II: 22100, III: 29500, IV: 43200, V: 52100 },
    emergencyPhone: '018000911000',
    hasColpass: true,
    coordinates: { latitude: 4.7412, longitude: -74.1956 },
  },
  {
    id: 'peaje-caiquero',
    name: 'Peaje Caiquero',
    operator: 'ANI',
    concessionName: 'Concesión Panamericana',
    department: 'Cundinamarca',
    sector: 'La Vega - Villeta',
    highwayNumber: 'Ruta 50',
    prices: { I: 13500, II: 21300, III: 28400, IV: 41500, V: 49800 },
    emergencyPhone: '3104523091',
    hasColpass: true,
    coordinates: { latitude: 5.0123, longitude: -74.4712 },
  },
  {
    id: 'peaje-el-koran',
    name: 'Peaje El Korán',
    operator: 'INVIAS',
    concessionName: 'INVIAS',
    department: 'Cundinamarca',
    sector: 'Guaduas - Puerto Salgar (Magdalena Medio)',
    highwayNumber: 'Ruta 45',
    prices: { I: 16300, II: 24200, III: 32500, IV: 46800, V: 56200 },
    emergencyPhone: '#767',
    hasColpass: false,
    coordinates: { latitude: 5.4612, longitude: -74.6512 },
  },
  {
    id: 'peaje-cocorna',
    name: 'Peaje Cocorná',
    operator: 'INVIAS',
    concessionName: 'INVIAS',
    department: 'Antioquia',
    sector: 'Puerto Triunfo - Cocorná - Santuario',
    highwayNumber: 'Ruta 60',
    prices: { I: 15800, II: 23500, III: 31200, IV: 44800, V: 54100 },
    emergencyPhone: '#767',
    hasColpass: false,
    coordinates: { latitude: 6.0612, longitude: -75.1852 },
  },
  {
    id: 'peaje-guarne',
    name: 'Peaje Guarne',
    operator: 'ANI',
    concessionName: 'Devimed',
    department: 'Antioquia',
    sector: 'Marinilla - Guarne - Medellín',
    highwayNumber: 'Ruta 60',
    prices: { I: 16500, II: 24700, III: 32800, IV: 47200, V: 56900 },
    emergencyPhone: '018000518420',
    hasColpass: true,
    coordinates: { latitude: 6.2751, longitude: -75.4412 },
  },

  // Corredor Medellín - Eje Cafetero (Covipacífico / Pacífico 3 / Autopistas del Café)
  {
    id: 'peaje-primavera',
    name: 'Peaje Primavera',
    operator: 'ANI',
    concessionName: 'Covipacífico',
    department: 'Antioquia',
    sector: 'Caldas - Amagá',
    highwayNumber: 'Ruta 25',
    prices: { I: 11900, II: 16800, III: 24200, IV: 34500, V: 42100 },
    emergencyPhone: '3202110752',
    hasColpass: true,
    coordinates: { latitude: 6.0912, longitude: -75.6312 },
  },
  {
    id: 'peaje-amaga',
    name: 'Peaje Amagá',
    operator: 'ANI',
    concessionName: 'Covipacífico',
    department: 'Antioquia',
    sector: 'Amagá - Bolombolo',
    highwayNumber: 'Ruta 25',
    prices: { I: 12600, II: 17900, III: 25800, IV: 36800, V: 44900 },
    emergencyPhone: '3202110752',
    hasColpass: true,
    coordinates: { latitude: 6.0312, longitude: -75.7115 },
  },
  {
    id: 'peaje-supia',
    name: 'Peaje Supía',
    operator: 'ANI',
    concessionName: 'Pacífico Tres',
    department: 'Caldas',
    sector: 'La Pintada - Supía - Marmato',
    highwayNumber: 'Ruta 25',
    prices: { I: 10500, II: 15200, III: 22100, IV: 31200, V: 38200 },
    emergencyPhone: '018000423780',
    hasColpass: true,
    coordinates: { latitude: 5.4512, longitude: -75.6512 },
  },
  {
    id: 'peaje-tarapaca-1',
    name: 'Peaje Tarapacá I',
    operator: 'ANI',
    concessionName: 'Autopistas del Café',
    department: 'Risaralda',
    sector: 'Santa Rosa de Cabal - Chinchiná',
    highwayNumber: 'Ruta 29',
    prices: { I: 15700, II: 21500, III: 31200, IV: 43500, V: 52800 },
    emergencyPhone: '018000517766',
    hasColpass: true,
    coordinates: { latitude: 4.8715, longitude: -75.6215 },
  },
  {
    id: 'peaje-tarapaca-2',
    name: 'Peaje Tarapacá II',
    operator: 'ANI',
    concessionName: 'Autopistas del Café',
    department: 'Caldas',
    sector: 'Chinchiná - Manizales',
    highwayNumber: 'Ruta 29',
    prices: { I: 15700, II: 21500, III: 31200, IV: 43500, V: 52800 },
    emergencyPhone: '018000517766',
    hasColpass: true,
    coordinates: { latitude: 4.9812, longitude: -75.5912 },
  },
  {
    id: 'peaje-la-esperanza',
    name: 'Peaje La Esperanza',
    operator: 'INVIAS',
    concessionName: 'INVIAS',
    department: 'Caldas',
    sector: 'Manizales - Alto de Letras - Fresno',
    highwayNumber: 'Ruta 50',
    prices: { I: 15400, II: 22100, III: 29800, IV: 42500, V: 51900 },
    emergencyPhone: '#767',
    hasColpass: false,
    coordinates: { latitude: 5.0112, longitude: -75.3512 },
  },
  {
    id: 'peaje-circasia',
    name: 'Peaje Circasia',
    operator: 'ANI',
    concessionName: 'Autopistas del Café',
    department: 'Quindío',
    sector: 'Pereira - Autopista del Café - Armenia',
    highwayNumber: 'Ruta 29',
    prices: { I: 16800, II: 22900, III: 32600, IV: 45200, V: 54900 },
    emergencyPhone: '018000517766',
    hasColpass: true,
    coordinates: { latitude: 4.6125, longitude: -75.6312 },
  },

  // Corredor Medellín - Guatapé / Oriente / Rionegro
  {
    id: 'peaje-tunel-oriente',
    name: 'Peaje Túnel de Oriente',
    operator: 'CONCESION',
    concessionName: 'Concesión Túnel de Oriente',
    department: 'Antioquia',
    sector: 'Medellín - Rionegro (Aeropuerto JMC)',
    highwayNumber: 'Variante Palmas',
    prices: { I: 24600, II: 31200, III: 45800, IV: 62500, V: 76800 },
    emergencyPhone: '(4) 4038100',
    hasColpass: true,
    coordinates: { latitude: 6.2215, longitude: -75.5123 },
  },
  {
    id: 'peaje-copacabana',
    name: 'Peaje Copacabana',
    operator: 'ANI',
    concessionName: 'Devimed',
    department: 'Antioquia',
    sector: 'Bello - Copacabana',
    highwayNumber: 'Ruta 60',
    prices: { I: 16500, II: 24700, III: 32800, IV: 47200, V: 56900 },
    emergencyPhone: '018000518420',
    hasColpass: true,
    coordinates: { latitude: 6.3451, longitude: -75.5123 },
  },
  {
    id: 'peaje-las-palmas',
    name: 'Peaje Las Palmas',
    operator: 'CONCESION',
    concessionName: 'Gobernación de Antioquia',
    department: 'Antioquia',
    sector: 'Envigado - El Retiro',
    highwayNumber: 'Vía Las Palmas',
    prices: { I: 12200, II: 16800, III: 24100, IV: 34200, V: 41500 },
    emergencyPhone: '(4) 3855555',
    hasColpass: true,
    coordinates: { latitude: 6.1512, longitude: -75.5312 },
  },

  // Corredor Cali - Pereira / Eje Cafetero (Rutas del Valle / Autopistas del Café)
  {
    id: 'peaje-rozo',
    name: 'Peaje Rozo (Cencar - Aeropuerto)',
    operator: 'ANI',
    concessionName: 'Rutas del Valle',
    department: 'Valle del Cauca',
    sector: 'Cali - Palmira / Yumbo',
    highwayNumber: 'Ruta 25',
    prices: { I: 11500, II: 16200, III: 23100, IV: 32800, V: 40200 },
    emergencyPhone: '018000180320',
    hasColpass: true,
    coordinates: { latitude: 3.5512, longitude: -76.4812 },
  },
  {
    id: 'peaje-betania',
    name: 'Peaje Betania',
    operator: 'ANI',
    concessionName: 'Rutas del Valle',
    department: 'Valle del Cauca',
    sector: 'Buga - San Pedro - Tuluá',
    highwayNumber: 'Ruta 25',
    prices: { I: 12800, II: 17900, III: 25400, IV: 36100, V: 44200 },
    emergencyPhone: '018000180320',
    hasColpass: true,
    coordinates: { latitude: 4.0125, longitude: -76.2512 },
  },
  {
    id: 'peaje-corozal',
    name: 'Peaje Corozal',
    operator: 'ANI',
    concessionName: 'Autopistas del Café',
    department: 'Valle del Cauca / Quindío',
    sector: 'Zarzal - La Tebaida - Armenia',
    highwayNumber: 'Ruta 40',
    prices: { I: 15300, II: 21100, III: 30400, IV: 42800, V: 51900 },
    emergencyPhone: '018000517766',
    hasColpass: true,
    coordinates: { latitude: 4.4125, longitude: -75.8123 },
  },
  {
    id: 'peaje-cerritos-2',
    name: 'Peaje Cerritos II',
    operator: 'INVIAS',
    concessionName: 'INVIAS',
    department: 'Risaralda',
    sector: 'Pereira - Cartago',
    highwayNumber: 'Ruta 25',
    prices: { I: 16100, II: 22800, III: 32400, IV: 45600, V: 55200 },
    emergencyPhone: '#767',
    hasColpass: false,
    coordinates: { latitude: 4.7912, longitude: -75.8123 },
  },

  // Corredor Cali - Buenaventura (Vía al Mar / Malla Vial del Valle)
  {
    id: 'peaje-loboguerrero',
    name: 'Peaje Loboguerrero',
    operator: 'ANI',
    concessionName: 'Unión Vial Camino del Pacífico',
    department: 'Valle del Cauca',
    sector: 'Dagua - Loboguerrero - Buenaventura',
    highwayNumber: 'Ruta 40',
    prices: { I: 11700, II: 16500, III: 23800, IV: 33700, V: 41200 },
    emergencyPhone: '018000180360',
    hasColpass: true,
    coordinates: { latitude: 3.7812, longitude: -76.7123 },
  },

  // Corredor Bucaramanga - San Gil / Barichara (Cañón del Chicamocha)
  {
    id: 'peaje-pescadero',
    name: 'Peaje Pescadero',
    operator: 'INVIAS',
    concessionName: 'INVIAS',
    department: 'Santander',
    sector: 'Piedecuesta - Cañón del Chicamocha',
    highwayNumber: 'Ruta 45A',
    prices: { I: 11100, II: 15800, III: 22500, IV: 31900, V: 39100 },
    emergencyPhone: '#767',
    hasColpass: false,
    coordinates: { latitude: 6.8512, longitude: -73.0512 },
  },
  {
    id: 'peaje-curiti',
    name: 'Peaje Curití',
    operator: 'INVIAS',
    concessionName: 'INVIAS',
    department: 'Santander',
    sector: 'Aratoca - San Gil',
    highwayNumber: 'Ruta 45A',
    prices: { I: 10800, II: 15400, III: 21900, IV: 31100, V: 38200 },
    emergencyPhone: '#767',
    hasColpass: false,
    coordinates: { latitude: 6.5912, longitude: -73.1312 },
  },

  // Corredor Barranquilla - Cartagena (Vía al Mar)
  {
    id: 'peaje-puerto-colombia',
    name: 'Peaje Puerto Colombia',
    operator: 'ANI',
    concessionName: 'Concesión Costera Cartagena - Barranquilla',
    department: 'Atlántico',
    sector: 'Barranquilla - Puerto Colombia',
    highwayNumber: 'Ruta 90A',
    prices: { I: 17100, II: 23800, III: 34100, IV: 47800, V: 58200 },
    emergencyPhone: '018000977330',
    hasColpass: true,
    coordinates: { latitude: 11.0112, longitude: -74.9123 },
  },
  {
    id: 'peaje-marahuaco',
    name: 'Peaje Marahuaco',
    operator: 'ANI',
    concessionName: 'Concesión Costera Cartagena - Barranquilla',
    department: 'Bolívar',
    sector: 'Galerazamba - Cartagena (Zona Norte)',
    highwayNumber: 'Ruta 90A',
    prices: { I: 17100, II: 23800, III: 34100, IV: 47800, V: 58200 },
    emergencyPhone: '018000977330',
    hasColpass: true,
    coordinates: { latitude: 10.5912, longitude: -75.3812 },
  },

  // Corredor Bogotá - La Mesa / Anapoima / Girardot (Ruta del Tequendama)
  {
    id: 'peaje-mondonedo',
    name: 'Peaje Mondoñedo',
    operator: 'CONCESION',
    concessionName: 'Devisab',
    department: 'Cundinamarca',
    sector: 'Mosquera - La Mesa',
    highwayNumber: 'Vía Mosquera - La Mesa',
    prices: { I: 15100, II: 22400, III: 30100, IV: 43800, V: 53200 },
    emergencyPhone: '018000911000',
    hasColpass: true,
    coordinates: { latitude: 4.6512, longitude: -74.2912 },
  },
  {
    id: 'peaje-san-pedro',
    name: 'Peaje San Pedro',
    operator: 'CONCESION',
    concessionName: 'Devisab',
    department: 'Cundinamarca',
    sector: 'La Mesa - Anapoima',
    highwayNumber: 'Vía La Mesa - Girardot',
    prices: { I: 14300, II: 21200, III: 28900, IV: 42100, V: 51200 },
    emergencyPhone: '018000911000',
    hasColpass: true,
    coordinates: { latitude: 4.5912, longitude: -74.4912 },
  },
];

// Helper para buscar peaje por ID
const findToll = (id: string): TollStation => {
  const t = TOLL_STATIONS.find(item => item.id === id);
  if (!t) {
    throw new Error(`Peaje con id "${id}" no encontrado en el catálogo.`);
  }
  return t;
};

// ============================================================================
// 3. CORREDORES VIALES Y RUTAS DE VIAJE TURÍSTICAS
// ============================================================================
export const CORRIDOR_ROUTES: CorridorRoute[] = [
  {
    id: 'bogota-girardot-ibague',
    name: 'Bogotá → Melgar / Girardot / Ibagué',
    originCityId: 'bogota',
    originCityName: 'Bogotá D.C.',
    destination: 'Melgar / Girardot / Ibagué',
    distanceKm: 198,
    estimatedTime: '3h 30m',
    tolls: [
      findToll('peaje-chusaca'),
      findToll('peaje-chinauta'),
      findToll('peaje-chicoral'),
      findToll('peaje-gualanday'),
    ],
    highlights: [
      'Corredor más concurrido de Colombia en puentes festivos.',
      'Reversible activo en Plan Retorno: Fusagasugá → Soacha.',
      'Cuenta con telepeaje Colpass en todos los puntos.',
    ],
    tips: [
      'Sal antes de las 6:00 a.m. para evitar la congestión en Soacha.',
      'En plan retorno, el reversible suele habilitarse desde el mediodía los lunes festivos.',
    ],
  },
  {
    id: 'bogota-villavicencio',
    name: 'Bogotá → Villavicencio (Vía al Llano)',
    originCityId: 'bogota',
    originCityName: 'Bogotá D.C.',
    destination: 'Villavicencio (Llanos Orientales)',
    distanceKm: 122,
    estimatedTime: '2h 15m',
    tolls: [
      findToll('peaje-boqueron'),
      findToll('peaje-naranjal'),
      findToll('peaje-pipiral'),
    ],
    highlights: [
      'Atraviesa los macro túneles de Boquerón y Buenavista.',
      'Línea de atención de Coviandina disponible 24 horas.',
    ],
    tips: [
      'Revisa el estado de la vía antes de salir con #767 por posibles deslizamientos.',
      'El peaje de Pipiral incluye el paso por el túnel Buenavista.',
    ],
  },
  {
    id: 'bogota-tunja-boyaca',
    name: 'Bogotá → Tunja / Paipa / Villa de Leyva',
    originCityId: 'bogota',
    originCityName: 'Bogotá D.C.',
    destination: 'Tunja / Villa de Leyva',
    distanceKm: 165,
    estimatedTime: '2h 45m',
    tolls: [
      findToll('peaje-andes'),
      findToll('peaje-roble'),
      findToll('peaje-albarracin'),
    ],
    highlights: [
      'Doble calzada completa en todo el trayecto (Autopista Norte).',
      'Paso por el histórico Puente de Boyacá.',
    ],
    tips: [
      'El reversible de la Carrera Séptima suele operar hacia Bogotá en domingos y festivos.',
      'Excelente opción para turismo gastronómico y colonial.',
    ],
  },
  {
    id: 'bogota-anapoima-girardot',
    name: 'Bogotá → La Mesa / Anapoima / Girardot',
    originCityId: 'bogota',
    originCityName: 'Bogotá D.C.',
    destination: 'Anapoima / Girardot por La Mesa',
    distanceKm: 125,
    estimatedTime: '3h 10m',
    tolls: [
      findToll('peaje-mondonedo'),
      findToll('peaje-san-pedro'),
    ],
    highlights: [
      'Vía alterna al sur, salida por Mosquera y Calle 13.',
      'Clima cálido ideal para fin de semana.',
    ],
    tips: [
      'Menor número de peajes que por la Autopista Sur, pero con curvas montañosas.',
    ],
  },
  {
    id: 'bogota-medellin',
    name: 'Bogotá → Medellín (Autopista Medellín - Bogotá)',
    originCityId: 'bogota',
    originCityName: 'Bogotá D.C.',
    destination: 'Medellín (Antioquia)',
    distanceKm: 420,
    estimatedTime: '8h 30m',
    tolls: [
      findToll('peaje-siberia'),
      findToll('peaje-caiquero'),
      findToll('peaje-el-koran'),
      findToll('peaje-cocorna'),
      findToll('peaje-guarne'),
    ],
    highlights: [
      'Conecta las dos ciudades más grandes del país.',
      'Paso por el valle del Magdalena Medio.',
    ],
    tips: [
      'Lleva efectivo de reserva: los peajes de INVIAS (El Korán y Cocorná) pueden no tener Colpass.',
    ],
  },
  {
    id: 'medellin-eje-cafetero',
    name: 'Medellín → Eje Cafetero (Manizales / Pereira)',
    originCityId: 'medellin',
    originCityName: 'Medellín',
    destination: 'Manizales / Pereira / Armenia',
    distanceKm: 215,
    estimatedTime: '4h 15m',
    tolls: [
      findToll('peaje-primavera'),
      findToll('peaje-amaga'),
      findToll('peaje-supia'),
      findToll('peaje-tarapaca-1'),
      findToll('peaje-tarapaca-2'),
    ],
    highlights: [
      'Corredor de las Autopistas Pacífico 1, 2 y 3.',
      'Paisaje Cultural Cafetero declarado Patrimonio Mundial.',
    ],
    tips: [
      'El Túnel de Amagá y las nuevas variantes han reducido el tiempo de viaje notablemente.',
    ],
  },
  {
    id: 'medellin-guatape-rionegro',
    name: 'Medellín → Oriente Antioqueño / Rionegro / Guatapé',
    originCityId: 'medellin',
    originCityName: 'Medellín',
    destination: 'Rionegro / Guatapé / El Peñol',
    distanceKm: 78,
    estimatedTime: '1h 40m',
    tolls: [
      findToll('peaje-tunel-oriente'),
      findToll('peaje-guarne'),
    ],
    highlights: [
      'Túnel de Oriente conecta con el Aeropuerto JMC en solo 18 minutos.',
      'Acceso a la represa y Piedra del Peñol.',
    ],
    tips: [
      'En fines de semana festivos, la vía Marinilla - El Peñol presenta alto flujo vehicular.',
    ],
  },
  {
    id: 'cali-pereira-armenia',
    name: 'Cali → Pereira / Armenia (Vía Panorama y Café)',
    originCityId: 'cali',
    originCityName: 'Cali',
    destination: 'Pereira / Armenia (Eje Cafetero)',
    distanceKm: 210,
    estimatedTime: '3h 20m',
    tolls: [
      findToll('peaje-rozo'),
      findToll('peaje-betania'),
      findToll('peaje-corozal'),
      findToll('peaje-cerritos-2'),
    ],
    highlights: [
      'Excelente topografía plana por el Valle del Río Cauca.',
      'Conexión rápida con el Parque del Café y Panaca.',
    ],
    tips: [
      'Vía de alta velocidad con múltiples radares de fotomulta en Buga y Tuluá.',
    ],
  },
  {
    id: 'cali-buenaventura',
    name: 'Cali → Buenaventura (Vía al Mar Pacífico)',
    originCityId: 'cali',
    originCityName: 'Cali',
    destination: 'Buenaventura (Pacífico)',
    distanceKm: 118,
    estimatedTime: '2h 45m',
    tolls: [
      findToll('peaje-loboguerrero'),
    ],
    highlights: [
      'Salida al Pacífico colombiano y muelles turísticos hacia Juanchaco y Ladrilleros.',
    ],
    tips: [
      'Consulte restricción de carga pesada durante puentes festivos.',
    ],
  },
  {
    id: 'bucaramanga-san-gil',
    name: 'Bucaramanga → San Gil / Barichara (Chicamocha)',
    originCityId: 'bucaramanga',
    originCityName: 'Bucaramanga',
    destination: 'San Gil / Barichara / Cañón Chicamocha',
    distanceKm: 110,
    estimatedTime: '2h 50m',
    tolls: [
      findToll('peaje-pescadero'),
      findToll('peaje-curiti'),
    ],
    highlights: [
      'Cruza el majestuoso Cañón del Chicamocha y Panachi.',
      'Capital de los deportes de aventura y pueblos patrimonio.',
    ],
    tips: [
      'Vía de montaña con descenso pronunciado en Pescadero. Revise los frenos antes de salir.',
    ],
  },
  {
    id: 'barranquilla-cartagena',
    name: 'Barranquilla → Cartagena (Vía al Mar)',
    originCityId: 'barranquilla',
    originCityName: 'Barranquilla',
    destination: 'Cartagena de Indias',
    distanceKm: 115,
    estimatedTime: '1h 30m',
    tolls: [
      findToll('peaje-puerto-colombia'),
      findToll('peaje-marahuaco'),
    ],
    highlights: [
      'Doble calzada costera bordeando el Mar Caribe y el Viaducto Gran Manglar.',
      'Rápida y con excelente señalización.',
    ],
    tips: [
      'Ambos peajes cuentan con carril exclusivo de pago electrónico Colpass.',
    ],
  },
  {
    id: 'manizales-medellin',
    name: 'Manizales → Medellín (Pacífico 3 y 2)',
    originCityId: 'manizales',
    originCityName: 'Manizales',
    destination: 'Medellín (Antioquia)',
    distanceKm: 210,
    estimatedTime: '4h 15m',
    tolls: [
      findToll('peaje-tarapaca-2'),
      findToll('peaje-supia'),
      findToll('peaje-amaga'),
      findToll('peaje-primavera'),
    ],
    highlights: [
      'Corredor de las Autopistas Pacífico 2 y 3.',
      'Cruce por el Cañón del Río Cauca y el Túnel de Amagá.',
    ],
    tips: [
      'Vía moderna en doble calzada que conecta Caldas y Antioquia.',
    ],
  },
  {
    id: 'manizales-pereira-armenia',
    name: 'Manizales → Pereira / Armenia (Autopistas del Café)',
    originCityId: 'manizales',
    originCityName: 'Manizales',
    destination: 'Pereira / Armenia (Eje Cafetero)',
    distanceKm: 98,
    estimatedTime: '1h 30m',
    tolls: [
      findToll('peaje-tarapaca-2'),
      findToll('peaje-tarapaca-1'),
      findToll('peaje-circasia'),
    ],
    highlights: [
      'Doble calzada panorámica que une las tres capitales cafeteras.',
      'Conexión turística con Salento, Valle de Cocora y Filandia.',
    ],
    tips: [
      'Corredor 100% habilitado con telepeaje Colpass.',
    ],
  },
  {
    id: 'manizales-bogota-letras',
    name: 'Manizales → Bogotá (Por el Páramo de Letras)',
    originCityId: 'manizales',
    originCityName: 'Manizales',
    destination: 'Bogotá D.C. por Letras y Calle 80',
    distanceKm: 290,
    estimatedTime: '6h 30m',
    tolls: [
      findToll('peaje-la-esperanza'),
      findToll('peaje-caiquero'),
      findToll('peaje-siberia'),
    ],
    highlights: [
      'Mítico ascenso al Páramo de Letras a 3.677 msnm.',
      'Descenso por Mariquita y Honda hacia Villeta y Bogotá.',
    ],
    tips: [
      'Revisar frenos y sistema de refrigeración debido a la altitud y curvas de montaña.',
    ],
  },
  {
    id: 'manizales-cali',
    name: 'Manizales → Cali (Vía Panorama)',
    originCityId: 'manizales',
    originCityName: 'Manizales',
    destination: 'Cali (Valle del Cauca)',
    distanceKm: 260,
    estimatedTime: '4h 30m',
    tolls: [
      findToll('peaje-tarapaca-2'),
      findToll('peaje-tarapaca-1'),
      findToll('peaje-cerritos-2'),
      findToll('peaje-betania'),
      findToll('peaje-rozo'),
    ],
    highlights: [
      'Descenso a la troncal plana del Valle del Río Cauca.',
      'Excelente velocidad de desplazamiento pasando Cartago y Buga.',
    ],
    tips: [
      'Atención a radares de fotomulta en el paso por San Pedro y Buga.',
    ],
  },
];

// ============================================================================
// 4. FUNCIONES DE CÁLCULO Y CONSULTA
// ============================================================================

/**
 * Obtiene la lista de corredores viales, opcionalmente filtrada por ciudad de origen
 */
export const getCorridorRoutes = (originCityId?: string): CorridorRoute[] => {
  if (!originCityId || originCityId === 'all') {
    return CORRIDOR_ROUTES;
  }
  return CORRIDOR_ROUTES.filter(r => r.originCityId === originCityId);
};

/**
 * Obtiene un corredor vial específico por su identificador
 */
export const getRouteById = (routeId: string): CorridorRoute | undefined => {
  return CORRIDOR_ROUTES.find(r => r.id === routeId);
};

/**
 * Obtiene la información descriptiva de una categoría vehicular
 */
export const getVehicleCategoryInfo = (category: VehicleCategoryFilter): VehicleCategoryInfo => {
  const info = VEHICLE_CATEGORIES.find(c => c.category === category);
  return info || VEHICLE_CATEGORIES[0];
};

/**
 * Calcula el costo total de peajes para una ruta seleccionada,
 * categoría de vehículo y modalidad de viaje (solo ida o ida y vuelta).
 */
export const calculateRouteTolls = (
  routeId: string,
  category: VehicleCategoryFilter = 'I',
  isRoundTrip: boolean = false
): RouteCalculationResult => {
  const route = getRouteById(routeId) || CORRIDOR_ROUTES[0];
  const catInfo = getVehicleCategoryInfo(category);
  const isExempt = category === 'MOTO';
  const multiplier = isRoundTrip ? 2 : 1;

  let totalOneWay = 0;

  const tollsBreakdown = route.tolls.map(toll => {
    const pricePerPass = isExempt ? 0 : toll.prices[category as VehicleCategory] || 0;
    const totalForTrip = pricePerPass * multiplier;
    totalOneWay += pricePerPass;

    return {
      toll,
      pricePerPass,
      totalForTrip,
    };
  });

  const totalTrip = totalOneWay * multiplier;

  return {
    route,
    category,
    categoryInfo: catInfo,
    isRoundTrip,
    tollCount: route.tolls.length,
    totalOneWay,
    totalTrip,
    tollsBreakdown,
    hasExemptionNotice: isExempt,
  };
};

/**
 * Busca peajes en todo el catálogo nacional por nombre, departamento o sector
 */
export const searchTolls = (query: string): TollStation[] => {
  const cleanQuery = (query || '').trim().toLowerCase();
  if (!cleanQuery) return TOLL_STATIONS;

  return TOLL_STATIONS.filter(t => {
    return (
      t.name.toLowerCase().includes(cleanQuery) ||
      t.department.toLowerCase().includes(cleanQuery) ||
      t.sector.toLowerCase().includes(cleanQuery) ||
      t.concessionName.toLowerCase().includes(cleanQuery)
    );
  });
};

/**
 * Formateador de moneda en Pesos Colombianos (COP)
 */
export const formatTollCOP = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Directorio oficial de teléfonos de emergencia y auxilio vial en carretera
 */
export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  description: string;
  isNational: boolean;
}

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'invias-767',
    name: 'Policía de Tránsito e INVIAS (#767)',
    number: '#767',
    description: 'Reporte de estado de vías en tiempo real, accidentes y grúas en vías nacionales.',
    isNational: true,
  },
  {
    id: 'cruz-roja',
    name: 'Cruz Roja Colombiana',
    number: '132',
    description: 'Atención prehospitalaria y emergencias médicas en carretera.',
    isNational: true,
  },
  {
    id: 'coviandina',
    name: 'Coviandina (Bogotá - Villavicencio)',
    number: '018000910110',
    description: 'Auxilio mecánico, grúa e información de túneles en la Vía al Llano.',
    isNational: false,
  },
  {
    id: 'via40',
    name: 'Vía 40 Express (Bogotá - Girardot)',
    number: '018000180301',
    description: 'Asistencia vial, ambulancia y grúa 24/7 en el corredor Bogotá - Girardot.',
    isNational: false,
  },
  {
    id: 'devimed',
    name: 'Devimed (Autopista Medellín - Bogotá)',
    number: '018000518420',
    description: 'Atención a usuarios y grúas en el tramo Guarne - Marinilla - Santuario.',
    isNational: false,
  },
  {
    id: 'autopistas-cafe',
    name: 'Autopistas del Café (Eje Cafetero)',
    number: '018000517766',
    description: 'Auxilio vial en Caldas, Quindío, Risaralda y norte del Valle.',
    isNational: false,
  },
];

