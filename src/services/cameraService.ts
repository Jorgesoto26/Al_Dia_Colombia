/**
 * Servicio de Cámaras de Fotodetección y Radares Oficiales (ANSV)
 * Al Día Colombia - Offline-First
 * Reglamentación: Ley 1843/2017, Ley 2251/2022 (Julián Esteban) y Resoluciones ANSV.
 */

import { Linking, Platform, Alert } from 'react-native';
import {
  SpeedCamera,
  CameraViolationType,
  ViolationMetadata,
  CityCameraSummary,
} from '../types/camera.types';

// ============================================================================
// METADATOS DE INFRACCIONES CON TARIFAS OFICIALES 2026
// ============================================================================
export const VIOLATION_METADATA: Record<CameraViolationType, ViolationMetadata> = {
  'C.14': {
    code: 'C.14',
    name: 'Pico y Placa (Horario Restringido)',
    shortLabel: 'Pico y Placa',
    fineCOP: 875453,
    formattedFine: '$875.453 COP',
    description: 'Transitar por sitios restringidos o en horas prohibidas (15 SMLDV 2026). Requiere además inmovilización si es en vía pública.',
  },
  'C.29': {
    code: 'C.29',
    name: 'Exceso de Velocidad',
    shortLabel: 'Velocidad',
    fineCOP: 875453,
    formattedFine: '$875.453 COP',
    description: 'Conducir superando los límites reglamentarios (15 SMLDV 2026). Límite urbano legal general: 50 km/h (Ley 2251 de 2022).',
  },
  'D.04': {
    code: 'D.04',
    name: 'Semáforo en Rojo o Amarillo',
    shortLabel: 'Semáforo Rojo',
    fineCOP: 1750905,
    formattedFine: '$1.750.905 COP',
    description: 'No detenerse ante una luz roja o amarilla de semáforo (30 SMLDV 2026). Infracción grave de tránsito.',
  },
  'D.02': {
    code: 'D.02',
    name: 'SOAT Vencido o Inexistente',
    shortLabel: 'Sin SOAT',
    fineCOP: 1750905,
    formattedFine: '$1.750.905 COP',
    description: 'Conducir sin el Seguro Obligatorio de Accidentes de Tránsito al día (30 SMLDV 2026 + inmovilización del vehículo).',
  },
  'C.35': {
    code: 'C.35',
    name: 'Revisión Técnico-Mecánica Vencida',
    shortLabel: 'Sin RTM',
    fineCOP: 875453,
    formattedFine: '$875.453 COP',
    description: 'No realizar la revisión técnico-mecánica y de emisiones contaminantes en los plazos previstos (15 SMLDV 2026 + grúa y patios).',
  },
  'C.32': {
    code: 'C.32',
    name: 'Invasión de Paso Peatonal / Cebra',
    shortLabel: 'Paso Peatonal',
    fineCOP: 875453,
    formattedFine: '$875.453 COP',
    description: 'No respetar el paso de peatones que cruzan una vía o bloquear la intersección vial (15 SMLDV 2026).',
  },
};

// ============================================================================
// BASE DE DATOS VERIFICADA DE CÁMARAS SALVAVIDAS HABILITADAS POR LA ANSV
// ============================================================================
export const EMBEDDED_CAMERAS: SpeedCamera[] = [
  // --------------------------------------------------------------------------
  // BOGOTÁ D.C. (Cámaras Salvavidas oficiales de Movilidad Bogotá / ANSV)
  // --------------------------------------------------------------------------
  {
    id: 'CAM-BOG-001',
    code: 'SAST-BOG-012',
    cityId: 'bogota',
    cityName: 'Bogotá',
    department: 'Cundinamarca',
    location: 'Autopista Norte con Calle 127',
    direction: 'Norte - Sur (Carril mixto y TransMilenio)',
    speedLimit: 50,
    speedLimitLabel: '50 km/h (Ley 2251)',
    violations: ['C.14', 'C.29', 'D.04', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 4.7088,
    longitude: -74.0534,
  },
  {
    id: 'CAM-BOG-002',
    code: 'SAST-BOG-015',
    cityId: 'bogota',
    cityName: 'Bogotá',
    department: 'Cundinamarca',
    location: 'Autopista Norte con Calle 95',
    direction: 'Sur - Norte (Carril central)',
    speedLimit: 50,
    speedLimitLabel: '50 km/h (Ley 2251)',
    violations: ['C.14', 'C.29', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 4.6852,
    longitude: -74.0573,
  },
  {
    id: 'CAM-BOG-003',
    code: 'SAST-BOG-022',
    cityId: 'bogota',
    cityName: 'Bogotá',
    department: 'Cundinamarca',
    location: 'Avenida Boyacá con Calle 53',
    direction: 'Norte - Sur',
    speedLimit: 50,
    speedLimitLabel: '50 km/h (Urbana)',
    violations: ['C.14', 'C.29', 'D.04', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 4.6721,
    longitude: -74.1145,
  },
  {
    id: 'CAM-BOG-004',
    code: 'SAST-BOG-028',
    cityId: 'bogota',
    cityName: 'Bogotá',
    department: 'Cundinamarca',
    location: 'Avenida Boyacá con Calle 26 (Av. El Dorado)',
    direction: 'Sur - Norte',
    speedLimit: 50,
    speedLimitLabel: '50 km/h',
    violations: ['C.14', 'C.29', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 4.6625,
    longitude: -74.1189,
  },
  {
    id: 'CAM-BOG-005',
    code: 'SAST-BOG-033',
    cityId: 'bogota',
    cityName: 'Bogotá',
    department: 'Cundinamarca',
    location: 'Avenida Ciudad de Cali con Calle 13',
    direction: 'Ambos sentidos',
    speedLimit: 50,
    speedLimitLabel: '50 km/h (Intersección crítica)',
    violations: ['C.14', 'C.29', 'D.04', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 4.6468,
    longitude: -74.1487,
  },
  {
    id: 'CAM-BOG-006',
    code: 'SAST-BOG-041',
    cityId: 'bogota',
    cityName: 'Bogotá',
    department: 'Cundinamarca',
    location: 'NQS (Avenida Carrera 30) con Calle 53',
    direction: 'Sur - Norte (Sector Universidad Nacional)',
    speedLimit: 50,
    speedLimitLabel: '50 km/h',
    violations: ['C.14', 'C.29', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 4.6479,
    longitude: -74.0852,
  },
  {
    id: 'CAM-BOG-007',
    code: 'SAST-BOG-048',
    cityId: 'bogota',
    cityName: 'Bogotá',
    department: 'Cundinamarca',
    location: 'Avenida Las Américas con Carrera 53',
    direction: 'Occidente - Oriente',
    speedLimit: 50,
    speedLimitLabel: '50 km/h',
    violations: ['C.14', 'C.29', 'D.04', 'D.02'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 4.6294,
    longitude: -74.1172,
  },
  {
    id: 'CAM-BOG-008',
    code: 'SAST-BOG-055',
    cityId: 'bogota',
    cityName: 'Bogotá',
    department: 'Cundinamarca',
    location: 'Avenida Suba con Calle 127 (Sector Bulevar Niza)',
    direction: 'Oriente - Occidente',
    speedLimit: 50,
    speedLimitLabel: '50 km/h',
    violations: ['C.14', 'C.29', 'D.04', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 4.7112,
    longitude: -74.0756,
  },

  // --------------------------------------------------------------------------
  // MEDELLÍN Y VALLE DE ABURRÁ (Cámaras Salva Vidas Alcaldía de Medellín / ANSV)
  // --------------------------------------------------------------------------
  {
    id: 'CAM-MED-001',
    code: 'SAST-MED-002',
    cityId: 'medellin',
    cityName: 'Medellín',
    department: 'Antioquia',
    location: 'Autopista Norte con Calle 77 (Sector Tricentenario)',
    direction: 'Norte - Sur',
    speedLimit: 60,
    speedLimitLabel: '60 km/h (Corredor Rápido)',
    violations: ['C.14', 'C.29', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 6.2912,
    longitude: -75.5684,
  },
  {
    id: 'CAM-MED-002',
    code: 'SAST-MED-008',
    cityId: 'medellin',
    cityName: 'Medellín',
    department: 'Antioquia',
    location: 'Autopista Sur con Calle 10 (Sector Puente Gilberto Echeverri)',
    direction: 'Sur - Norte',
    speedLimit: 60,
    speedLimitLabel: '60 km/h',
    violations: ['C.14', 'C.29', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 6.2089,
    longitude: -75.5794,
  },
  {
    id: 'CAM-MED-003',
    code: 'SAST-MED-014',
    cityId: 'medellin',
    cityName: 'Medellín',
    department: 'Antioquia',
    location: 'Avenida Regional con Calle 48 (Sector Estación San Antonio)',
    direction: 'Sur - Norte',
    speedLimit: 60,
    speedLimitLabel: '60 km/h',
    violations: ['C.14', 'C.29', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 6.2467,
    longitude: -75.5745,
  },
  {
    id: 'CAM-MED-004',
    code: 'SAST-MED-019',
    cityId: 'medellin',
    cityName: 'Medellín',
    department: 'Antioquia',
    location: 'Avenida Oriental con Calle 49 (Sector La Playa)',
    direction: 'Norte - Sur (Zona Centro)',
    speedLimit: 50,
    speedLimitLabel: '50 km/h (Urbano)',
    violations: ['C.14', 'C.29', 'D.04', 'C.32'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 6.2482,
    longitude: -75.5641,
  },
  {
    id: 'CAM-MED-005',
    code: 'SAST-ENV-003',
    cityId: 'medellin',
    cityName: 'Medellín',
    department: 'Antioquia',
    location: 'Avenida Las Vegas con Calle 25 Sur (Envigado límite Medellín)',
    direction: 'Ambos sentidos',
    speedLimit: 50,
    speedLimitLabel: '50 km/h',
    violations: ['C.14', 'C.29', 'D.04', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 6.1824,
    longitude: -75.5861,
  },

  // --------------------------------------------------------------------------
  // CALI (Secretaría de Movilidad de Cali / ANSV)
  // --------------------------------------------------------------------------
  {
    id: 'CAM-CAL-001',
    code: 'SAST-CAL-004',
    cityId: 'cali',
    cityName: 'Cali',
    department: 'Valle del Cauca',
    location: 'Autopista Suroriental con Carrera 50',
    direction: 'Norte - Sur',
    speedLimit: 50,
    speedLimitLabel: '50 km/h (Ley 2251)',
    violations: ['C.14', 'C.29', 'D.04', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 3.4215,
    longitude: -76.5389,
  },
  {
    id: 'CAM-CAL-002',
    code: 'SAST-CAL-009',
    cityId: 'cali',
    cityName: 'Cali',
    department: 'Valle del Cauca',
    location: 'Calle 5 con Carrera 66 (Sector Cañaveralejo)',
    direction: 'Sur - Norte',
    speedLimit: 50,
    speedLimitLabel: '50 km/h',
    violations: ['C.14', 'C.29', 'D.04', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 3.4082,
    longitude: -76.5492,
  },
  {
    id: 'CAM-CAL-003',
    code: 'SAST-CAL-015',
    cityId: 'cali',
    cityName: 'Cali',
    department: 'Valle del Cauca',
    location: 'Avenida 3 Norte con Calle 34 (Sector San Vicente)',
    direction: 'Norte - Sur',
    speedLimit: 50,
    speedLimitLabel: '50 km/h',
    violations: ['C.14', 'C.29', 'D.04'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 3.4687,
    longitude: -76.5198,
  },
  {
    id: 'CAM-CAL-004',
    code: 'SAST-CAL-021',
    cityId: 'cali',
    cityName: 'Cali',
    department: 'Valle del Cauca',
    location: 'Carrera 1 con Calle 44 (Paso del Comercio salida a Palmira)',
    direction: 'Ambos sentidos',
    speedLimit: 50,
    speedLimitLabel: '50 km/h',
    violations: ['C.14', 'C.29', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 3.4795,
    longitude: -76.4951,
  },

  // --------------------------------------------------------------------------
  // BARRANQUILLA (Secretaría de Tránsito de Barranquilla / ANSV)
  // --------------------------------------------------------------------------
  {
    id: 'CAM-BAQ-001',
    code: 'SAST-BAQ-003',
    cityId: 'barranquilla',
    cityName: 'Barranquilla',
    department: 'Atlántico',
    location: 'Vía 40 con Calle 76',
    direction: 'Sur - Norte (Sector Las Flores)',
    speedLimit: 50,
    speedLimitLabel: '50 km/h',
    violations: ['C.14', 'C.29', 'D.04', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 11.0094,
    longitude: -74.8012,
  },
  {
    id: 'CAM-BAQ-002',
    code: 'SAST-BAQ-007',
    cityId: 'barranquilla',
    cityName: 'Barranquilla',
    department: 'Atlántico',
    location: 'Avenida Circunvalar con Carrera 46',
    direction: 'Ambos sentidos',
    speedLimit: 60,
    speedLimitLabel: '60 km/h (Corredor Perimetral)',
    violations: ['C.14', 'C.29', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 11.0035,
    longitude: -74.8398,
  },
  {
    id: 'CAM-BAQ-003',
    code: 'SAST-BAQ-012',
    cityId: 'barranquilla',
    cityName: 'Barranquilla',
    department: 'Atlántico',
    location: 'Calle Murillo (Calle 45) con Carrera 21',
    direction: 'Oriente - Occidente (Troncal Transmetro)',
    speedLimit: 50,
    speedLimitLabel: '50 km/h',
    violations: ['C.14', 'C.29', 'D.04', 'C.32'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 10.9654,
    longitude: -74.7915,
  },

  // --------------------------------------------------------------------------
  // MANIZALES (Secretaría de Tránsito de Manizales / ANSV)
  // --------------------------------------------------------------------------
  {
    id: 'CAM-MZL-001',
    code: 'SAST-MZL-001',
    cityId: 'manizales',
    cityName: 'Manizales',
    department: 'Caldas',
    location: 'Avenida Kevin Ángel con Calle 59 (Sector Laureles)',
    direction: 'Ambos sentidos',
    speedLimit: 50,
    speedLimitLabel: '50 km/h (Urbana)',
    violations: ['C.14', 'C.29', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 5.0612,
    longitude: -75.4921,
  },
  {
    id: 'CAM-MZL-002',
    code: 'SAST-MZL-003',
    cityId: 'manizales',
    cityName: 'Manizales',
    department: 'Caldas',
    location: 'Avenida Santander con Calle 62 (Sector Triángulo)',
    direction: 'Oriente - Occidente',
    speedLimit: 50,
    speedLimitLabel: '50 km/h',
    violations: ['C.14', 'C.29', 'D.04', 'D.02'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 5.0628,
    longitude: -75.4984,
  },
  {
    id: 'CAM-MZL-003',
    code: 'SAST-MZL-006',
    cityId: 'manizales',
    cityName: 'Manizales',
    department: 'Caldas',
    location: 'Vía Panamericana (Sector Estación Uribe - Salida a Chinchiná)',
    direction: 'Ambos sentidos',
    speedLimit: 60,
    speedLimitLabel: '60 km/h (Vía Perimetral)',
    violations: ['C.29', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 5.0421,
    longitude: -75.5245,
  },

  // --------------------------------------------------------------------------
  // BUCARAMANGA Y FLORIDABLANCA (DTTB / ANSV)
  // --------------------------------------------------------------------------
  {
    id: 'CAM-BUC-001',
    code: 'SAST-BUC-002',
    cityId: 'bucaramanga',
    cityName: 'Bucaramanga',
    department: 'Santander',
    location: 'Autopista a Floridablanca (Sector Papi Quiero Piña)',
    direction: 'Ambos sentidos',
    speedLimit: 60,
    speedLimitLabel: '60 km/h',
    violations: ['C.14', 'C.29', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 7.0682,
    longitude: -73.0984,
  },
  {
    id: 'CAM-BUC-002',
    code: 'SAST-BUC-005',
    cityId: 'bucaramanga',
    cityName: 'Bucaramanga',
    department: 'Santander',
    location: 'Carrera 27 con Calle 36 (Sector Parque de los Niños)',
    direction: 'Norte - Sur',
    speedLimit: 50,
    speedLimitLabel: '50 km/h',
    violations: ['C.14', 'C.29', 'D.04', 'D.02'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 7.1215,
    longitude: -73.1189,
  },

  // --------------------------------------------------------------------------
  // CARTAGENA (DATT / ANSV)
  // --------------------------------------------------------------------------
  {
    id: 'CAM-CTG-001',
    code: 'SAST-CTG-002',
    cityId: 'cartagena',
    cityName: 'Cartagena',
    department: 'Bolívar',
    location: 'Avenida Pedro de Heredia (Sector Mercado de Bazurto)',
    direction: 'Ambos sentidos (Troncal Transcaribe)',
    speedLimit: 50,
    speedLimitLabel: '50 km/h',
    violations: ['C.14', 'C.29', 'D.04', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 10.4121,
    longitude: -75.5215,
  },
  {
    id: 'CAM-CTG-002',
    code: 'SAST-CTG-006',
    cityId: 'cartagena',
    cityName: 'Cartagena',
    department: 'Bolívar',
    location: 'Vía al Mar Anillo Vial (Sector La Boquilla - Entrada a Manzanillo)',
    direction: 'Ambos sentidos',
    speedLimit: 80,
    speedLimitLabel: '80 km/h (Corredor Nacional)',
    violations: ['C.29', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 10.4852,
    longitude: -75.4891,
  },

  // --------------------------------------------------------------------------
  // PEREIRA (Instituto de Movilidad de Pereira / ANSV)
  // --------------------------------------------------------------------------
  {
    id: 'CAM-PEI-001',
    code: 'SAST-PEI-001',
    cityId: 'pereira',
    cityName: 'Pereira',
    department: 'Risaralda',
    location: 'Avenida 30 de Agosto con Calle 48 (Sector Maraya)',
    direction: 'Oriente - Occidente',
    speedLimit: 50,
    speedLimitLabel: '50 km/h',
    violations: ['C.14', 'C.29', 'D.04', 'D.02'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 4.8115,
    longitude: -75.7082,
  },

  // --------------------------------------------------------------------------
  // IBAGUÉ (Secretaría de Movilidad de Ibagué / ANSV)
  // --------------------------------------------------------------------------
  {
    id: 'CAM-IBG-001',
    code: 'SAST-IBG-002',
    cityId: 'ibague',
    cityName: 'Ibagué',
    department: 'Tolima',
    location: 'Carrera 5 con Calle 60 (Sector Centro Comercial La Estación)',
    direction: 'Ambos sentidos',
    speedLimit: 50,
    speedLimitLabel: '50 km/h',
    violations: ['C.14', 'C.29', 'D.04', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 4.4385,
    longitude: -75.2124,
  },

  // --------------------------------------------------------------------------
  // CÚCUTA (Secretaría de Tránsito y Transporte de Cúcuta / ANSV)
  // --------------------------------------------------------------------------
  {
    id: 'CAM-CUC-001',
    code: 'SAST-CUC-001',
    cityId: 'cucuta',
    cityName: 'Cúcuta',
    department: 'Norte de Santander',
    location: 'Avenida Los Libertadores (Sector El Malecón)',
    direction: 'Norte - Sur',
    speedLimit: 50,
    speedLimitLabel: '50 km/h',
    violations: ['C.14', 'C.29', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 7.8924,
    longitude: -72.4951,
  },

  // --------------------------------------------------------------------------
  // VILLAVICENCIO (Secretaría de Movilidad de Villavicencio / ANSV)
  // --------------------------------------------------------------------------
  {
    id: 'CAM-VVC-001',
    code: 'SAST-VVC-001',
    cityId: 'villavicencio',
    cityName: 'Villavicencio',
    department: 'Meta',
    location: 'Avenida 40 con Calle 15 (Sector Llanocentro)',
    direction: 'Ambos sentidos',
    speedLimit: 50,
    speedLimitLabel: '50 km/h',
    violations: ['C.14', 'C.29', 'D.04', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 4.1425,
    longitude: -73.6385,
  },

  // --------------------------------------------------------------------------
  // NEIVA (Secretaría de Movilidad de Neiva / ANSV)
  // --------------------------------------------------------------------------
  {
    id: 'CAM-NVA-001',
    code: 'SAST-NVA-001',
    cityId: 'neiva',
    cityName: 'Neiva',
    department: 'Huila',
    location: 'Carrera 7 con Calle 21 (Sector Quirinal)',
    direction: 'Sur - Norte',
    speedLimit: 50,
    speedLimitLabel: '50 km/h',
    violations: ['C.14', 'C.29', 'D.04', 'D.02'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 2.9385,
    longitude: -75.2912,
  },

  // --------------------------------------------------------------------------
  // SANTA MARTA (Secretaría de Movilidad de Santa Marta / ANSV)
  // --------------------------------------------------------------------------
  {
    id: 'CAM-SMR-001',
    code: 'SAST-SMR-002',
    cityId: 'santa-marta',
    cityName: 'Santa Marta',
    department: 'Magdalena',
    location: 'Troncal del Caribe (Sector Pozos Colorados - Salida al Aeropuerto)',
    direction: 'Ambos sentidos',
    speedLimit: 60,
    speedLimitLabel: '60 km/h (Corredor Turístico)',
    violations: ['C.29', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 11.1685,
    longitude: -74.2285,
  },

  // --------------------------------------------------------------------------
  // PASTO (Secretaría de Tránsito y Transporte de Pasto / ANSV)
  // --------------------------------------------------------------------------
  {
    id: 'CAM-PAS-001',
    code: 'SAST-PAS-001',
    cityId: 'pasto',
    cityName: 'Pasto',
    department: 'Nariño',
    location: 'Avenida Panamericana con Calle 18 (Sector Torobajo)',
    direction: 'Norte - Sur (Salida a Chachagüí)',
    speedLimit: 50,
    speedLimitLabel: '50 km/h',
    violations: ['C.14', 'C.29', 'D.02', 'C.35'],
    isAnsvApproved: true,
    cameraType: 'fija',
    operatingHours: '24 Horas',
    latitude: 1.2185,
    longitude: -77.2885,
  },
];

// ============================================================================
// CONSEJOS Y MARCO LEGAL PARA EL CONDUCTOR
// ============================================================================
export const DRIVER_LEGAL_RIGHTS = [
  {
    title: 'Sentencia C-038 de 2020 de la Corte Constitucional',
    desc: 'No existe responsabilidad solidaria automática. El organismo de tránsito debe individualizar e identificar plenamente al conductor infractor para poder sancionar.',
  },
  {
    title: 'Señalización Previa Obligatoria',
    desc: 'La ley exige señalización vertical visible que advierta la presencia de la cámara de fotodetección metros antes del punto de captura.',
  },
  {
    title: 'Plazo Legal de Notificación (3 Días)',
    desc: 'La orden de comparendo debe enviarse por correo certificado dentro de los tres (3) días hábiles siguientes a la validación de la prueba fotográfica.',
  },
  {
    title: 'Descuento del 50% por Curso Pedagógico',
    desc: 'Si realizas el curso dentro de los primeros 11 días hábiles siguientes a la notificación, puedes pagar únicamente el 50% del valor total de la multa.',
  },
];

// ============================================================================
// FUNCIONES DE CONSULTA Y FILTRADO
// ============================================================================

/**
 * Normaliza nombres de ciudad para búsqueda insensible a acentos o mayúsculas
 */
function normalizeStr(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Obtiene las cámaras registradas para una ciudad específica
 */
export function getCamerasByCity(cityIdOrName: string): SpeedCamera[] {
  const norm = normalizeStr(cityIdOrName);
  return EMBEDDED_CAMERAS.filter(
    cam => normalizeStr(cam.cityId) === norm || normalizeStr(cam.cityName) === norm
  );
}

/**
 * Genera el resumen métrico de cámaras para una ciudad
 */
export function getCityCameraSummary(cityIdOrName: string): CityCameraSummary {
  const cameras = getCamerasByCity(cityIdOrName);
  const pypCameraCount = cameras.filter(c => c.violations.includes('C.14')).length;
  const speedCameraCount = cameras.filter(c => c.violations.includes('C.29')).length;
  const soatCameraCount = cameras.filter(c => c.violations.includes('D.02') || c.violations.includes('C.35')).length;
  const redLightCameraCount = cameras.filter(c => c.violations.includes('D.04')).length;

  return {
    cityId: cityIdOrName,
    cityName: cameras.length > 0 ? cameras[0].cityName : cityIdOrName,
    totalCameras: cameras.length,
    speedLimitUrban: 50,
    pypCameraCount,
    speedCameraCount,
    soatCameraCount,
    redLightCameraCount,
  };
}

/**
 * Filtra cámaras por texto (calle/avenida) y por tipo de infracción
 */
export function filterCameras(
  cameras: SpeedCamera[],
  searchQuery?: string,
  violationFilter?: CameraViolationType | 'all'
): SpeedCamera[] {
  return cameras.filter(cam => {
    // Filtro por infracción
    if (violationFilter && violationFilter !== 'all') {
      if (!cam.violations.includes(violationFilter)) {
        return false;
      }
    }

    // Filtro por texto
    if (searchQuery && searchQuery.trim().length > 0) {
      const q = normalizeStr(searchQuery);
      const match =
        normalizeStr(cam.location).includes(q) ||
        normalizeStr(cam.direction).includes(q) ||
        normalizeStr(cam.code).includes(q);
      if (!match) return false;
    }

    return true;
  });
}

/**
 * Abre la ubicación de la cámara en Google Maps, Waze o Apple Maps
 */
export async function openCameraInMaps(camera: SpeedCamera): Promise<void> {
  const query = encodeURIComponent(`${camera.location}, ${camera.cityName}, Colombia`);
  const webUrl = camera.latitude && camera.longitude
    ? `https://www.google.com/maps/search/?api=1&query=${camera.latitude},${camera.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${query}`;

  try {
    if (camera.latitude && camera.longitude) {
      const nativeUrl = Platform.select({
        ios: `maps:0,0?q=${encodeURIComponent(camera.location)}@${camera.latitude},${camera.longitude}`,
        android: `geo:${camera.latitude},${camera.longitude}?q=${camera.latitude},${camera.longitude}(${encodeURIComponent(camera.location)})`,
      });

      if (nativeUrl) {
        try {
          await Linking.openURL(nativeUrl);
          return;
        } catch {
          // Si el esquema nativo falla, continuar con la URL web universal
        }
      }
    }

    // URL web universal garantizada para abrir Google Maps o navegador
    await Linking.openURL(webUrl);
  } catch (error) {
    Alert.alert('Mapa', 'No fue posible abrir la aplicación de mapas en este dispositivo.');
  }
}

