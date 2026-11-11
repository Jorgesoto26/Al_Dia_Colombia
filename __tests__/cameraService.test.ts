/**
 * Pruebas unitarias para cameraService (Cámaras de Fotodetección y Radares ANSV)
 * Al Día Colombia
 */

import {
  EMBEDDED_CAMERAS,
  VIOLATION_METADATA,
  getCamerasByCity,
  getCityCameraSummary,
  filterCameras,
} from '../src/services/cameraService';

describe('Módulo Cámaras Salvavidas ANSV (cameraService)', () => {
  it('debe contener cámaras habilitadas con campos obligatorios para ciudades principales', () => {
    expect(EMBEDDED_CAMERAS.length).toBeGreaterThanOrEqual(20);

    EMBEDDED_CAMERAS.forEach(cam => {
      expect(cam.id).toBeTruthy();
      expect(cam.code).toBeTruthy();
      expect(cam.cityName).toBeTruthy();
      expect(cam.location).toBeTruthy();
      expect(cam.speedLimit).toBeGreaterThan(0);
      expect(cam.violations.length).toBeGreaterThan(0);
      expect(cam.isAnsvApproved).toBe(true);
    });
  });

  it('debe tener metadatos de infracciones con valores de comparendos de 2026', () => {
    expect(VIOLATION_METADATA['C.14'].fineCOP).toBe(875453); // 15 SMLDV 2026
    expect(VIOLATION_METADATA['C.29'].fineCOP).toBe(875453);
    expect(VIOLATION_METADATA['D.04'].fineCOP).toBe(1750905); // 30 SMLDV 2026
    expect(VIOLATION_METADATA['D.02'].fineCOP).toBe(1750905);
  });

  it('debe obtener cámaras por slug de ciudad o por nombre sin distinción de mayúsculas ni acentos', () => {
    const bogotaCams = getCamerasByCity('bogota');
    expect(bogotaCams.length).toBeGreaterThan(0);
    bogotaCams.forEach(c => expect(c.cityId).toBe('bogota'));

    const medellinCams = getCamerasByCity('Medellín');
    expect(medellinCams.length).toBeGreaterThan(0);

    const manizalesCams = getCamerasByCity('Manizales');
    expect(manizalesCams.length).toBeGreaterThan(0);
  });

  it('debe calcular el resumen de cámaras de la ciudad correctamente', () => {
    const summary = getCityCameraSummary('bogota');
    expect(summary.totalCameras).toBeGreaterThan(0);
    expect(summary.speedLimitUrban).toBe(50);
    expect(summary.pypCameraCount).toBeGreaterThan(0);
    expect(summary.speedCameraCount).toBeGreaterThan(0);
  });

  it('debe filtrar cámaras por tipo de infracción (ej. C.14 Pico y Placa)', () => {
    const allBogota = getCamerasByCity('bogota');
    const pypOnly = filterCameras(allBogota, undefined, 'C.14');
    expect(pypOnly.length).toBeGreaterThan(0);
    pypOnly.forEach(c => expect(c.violations).toContain('C.14'));
  });

  it('debe filtrar cámaras por palabra clave en la ubicación (ej. Autopista Norte)', () => {
    const allBogota = getCamerasByCity('bogota');
    const filtered = filterCameras(allBogota, 'Autopista Norte');
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach(c => expect(c.location).toContain('Autopista Norte'));
  });
});

