/**
 * Pruebas unitarias para secopService
 * Al Día Colombia - Módulo 4: Licitaciones y Contratación Pública (SECOP II)
 */

import {
  EMBEDDED_SECOP_PROCESSES,
  filterSecopProcesses,
  calculateSecopSummary,
  formatCOP,
  getSecopProcesses,
  toggleBookmarkProcess,
  getBookmarkedProcessIds,
} from '../src/services/secopService';

describe('Módulo 4: secopService (SECOP II Colombia)', () => {
  it('debe contener procesos embebidos oficiales con datos coherentes para 2026', () => {
    expect(EMBEDDED_SECOP_PROCESSES.length).toBeGreaterThanOrEqual(15);

    EMBEDDED_SECOP_PROCESSES.forEach(proc => {
      expect(proc.id).toBeTruthy();
      expect(proc.reference).toBeTruthy();
      expect(proc.entity).toBeTruthy();
      expect(proc.basePrice).toBeGreaterThan(0);
      expect(proc.url).toContain('community.secop.gov.co');
      expect(proc.publicationDate).toMatch(/^2026-/);
    });
  });

  it('debe filtrar correctamente por ciudad', () => {
    const bogotaProcs = filterSecopProcesses(EMBEDDED_SECOP_PROCESSES, { city: 'Bogotá' });
    expect(bogotaProcs.length).toBeGreaterThan(0);
    bogotaProcs.forEach(p => {
      expect(p.city.toLowerCase()).toContain('bogotá');
    });

    const medellinProcs = filterSecopProcesses(EMBEDDED_SECOP_PROCESSES, { city: 'Medellín' });
    expect(medellinProcs.length).toBeGreaterThan(0);
    medellinProcs.forEach(p => {
      expect(p.city.toLowerCase()).toContain('medellín');
    });
  });

  it('debe filtrar correctamente por modalidad de contratación', () => {
    const licitaciones = filterSecopProcesses(EMBEDDED_SECOP_PROCESSES, { modality: 'Licitación pública' });
    expect(licitaciones.length).toBeGreaterThan(0);
    licitaciones.forEach(p => expect(p.modality).toBe('Licitación pública'));

    const minimas = filterSecopProcesses(EMBEDDED_SECOP_PROCESSES, { modality: 'Mínima cuantía' });
    expect(minimas.length).toBeGreaterThan(0);
    minimas.forEach(p => expect(p.modality).toBe('Mínima cuantía'));
  });

  it('debe filtrar por rango presupuestal (budgetTier)', () => {
    const under50m = filterSecopProcesses(EMBEDDED_SECOP_PROCESSES, { budgetTier: 'under_50m' });
    under50m.forEach(p => expect(p.basePrice).toBeLessThanOrEqual(50000000));

    const over1000m = filterSecopProcesses(EMBEDDED_SECOP_PROCESSES, { budgetTier: 'over_1000m' });
    expect(over1000m.length).toBeGreaterThan(0);
    over1000m.forEach(p => expect(p.basePrice).toBeGreaterThanOrEqual(1000000000));
  });

  it('debe buscar por texto libre (keyword) en título y entidad', () => {
    const searchTransmilenio = filterSecopProcesses(EMBEDDED_SECOP_PROCESSES, { searchQuery: 'TransMilenio' });
    expect(searchTransmilenio.length).toBeGreaterThan(0);
    expect(searchTransmilenio[0].title).toContain('TransMilenio');

    const searchMetro = filterSecopProcesses(EMBEDDED_SECOP_PROCESSES, { searchQuery: 'Metro' });
    expect(searchMetro.length).toBeGreaterThan(0);
  });

  it('debe calcular métricas de resumen financiero correctamente', () => {
    const summary = calculateSecopSummary(EMBEDDED_SECOP_PROCESSES);
    expect(summary.totalProcesses).toBe(EMBEDDED_SECOP_PROCESSES.length);
    expect(summary.totalBudget).toBeGreaterThan(10000000000);
    expect(summary.formattedTotalBudget).toBeTruthy();
    expect(summary.openProcesses).toBeGreaterThan(0);
  });

  it('debe formatear cifras en COP de manera legible', () => {
    expect(formatCOP(45000000)).toContain('$45.000.000 COP');
    expect(formatCOP(8450000000)).toContain('Mil Millones COP');
  });

  it('debe gestionar marcadores de favoritos con AsyncStorage mockeado', async () => {
    const procId = 'CO1.REQ.4510201';
    
    // Toggle on
    const isSaved = await toggleBookmarkProcess(procId);
    expect(isSaved).toBe(true);

    const bookmarked = await getBookmarkedProcessIds();
    expect(bookmarked).toContain(procId);

    // Toggle off
    const isRemoved = await toggleBookmarkProcess(procId);
    expect(isRemoved).toBe(false);

    const bookmarkedAfter = await getBookmarkedProcessIds();
    expect(bookmarkedAfter).not.toContain(procId);
  });

  it('debe retornar procesos y estado de fallback con getSecopProcesses', async () => {
    const res = await getSecopProcesses(false);
    expect(res.processes.length).toBeGreaterThan(0);
    expect(typeof res.isLive).toBe('boolean');
  });
});

