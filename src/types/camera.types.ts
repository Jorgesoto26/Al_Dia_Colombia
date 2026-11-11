/**
 * Tipos de datos para Cámaras de Fotodetección y Radares
 * Al Día Colombia - Conforme a Ley 1843/2017 y ANSV
 */

export type CameraViolationType =
  | 'C.14' // Pico y Placa
  | 'C.29' // Exceso de velocidad
  | 'D.04' // Semáforo en rojo o amarillo
  | 'D.02' // SOAT vencido
  | 'C.35' // Técnico-Mecánica vencida
  | 'C.32'; // Invasión de paso peatonal / cebra

export interface ViolationMetadata {
  code: CameraViolationType;
  name: string;
  shortLabel: string;
  fineCOP: number;
  formattedFine: string;
  description: string;
}

export interface SpeedCamera {
  id: string;
  code: string; // Radicado de habilitación ANSV
  cityId: string; // Slug de la ciudad (ej. 'bogota', 'medellin', 'manizales')
  cityName: string;
  department: string;
  location: string; // Ubicación exacta o intersección vial
  direction: string; // Sentido de la vía (ej. 'Norte - Sur', 'Ambos sentidos')
  speedLimit: number; // Límite en km/h
  speedLimitLabel: string; // ej. '50 km/h (Urbano)'
  violations: CameraViolationType[];
  isAnsvApproved: boolean; // Si cuenta con certificación técnica y de señalización ANSV
  cameraType: 'fija' | 'movil';
  operatingHours: string; // ej. '24 Horas' o '6:00 AM - 9:00 PM'
  latitude?: number;
  longitude?: number;
}

export interface CityCameraSummary {
  cityId: string;
  cityName: string;
  totalCameras: number;
  speedLimitUrban: number;
  pypCameraCount: number;
  speedCameraCount: number;
  soatCameraCount: number;
  redLightCameraCount: number;
}

