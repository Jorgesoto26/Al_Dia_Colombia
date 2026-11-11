import {
  calculateRouteTolls,
  getCorridorRoutes,
  getRouteById,
  searchTolls,
  formatTollCOP,
  CORRIDOR_ROUTES,
  TOLL_STATIONS,
} from '../src/services/tollService';

describe('TollService - Calculador de Tarifas de Peajes (INVIAS / ANI)', () => {
  it('debe tener corredores viales y peajes registrados', () => {
    expect(CORRIDOR_ROUTES.length).toBeGreaterThanOrEqual(10);
    expect(TOLL_STATIONS.length).toBeGreaterThanOrEqual(20);
  });

  describe('calculateRouteTolls', () => {
    it('debe calcular correctamente el peaje de ida para Categoría I (Bogotá -> Girardot / Melgar)', () => {
      const result = calculateRouteTolls('bogota-girardot-ibague', 'I', false);

      expect(result.tollCount).toBe(4);
      expect(result.isRoundTrip).toBe(false);
      // Chusacá (13900) + Chinauta (13900) + Chicoral (14800) + Gualanday (13300) = 55900
      expect(result.totalOneWay).toBe(55900);
      expect(result.totalTrip).toBe(55900);
      expect(result.tollsBreakdown.length).toBe(4);
      expect(result.hasExemptionNotice).toBe(false);
    });

    it('debe duplicar el valor en viaje de ida y vuelta (Round Trip x2)', () => {
      const result = calculateRouteTolls('bogota-girardot-ibague', 'I', true);

      expect(result.isRoundTrip).toBe(true);
      expect(result.totalOneWay).toBe(55900);
      expect(result.totalTrip).toBe(111800); // 55900 * 2
    });

    it('debe aplicar exención total de peaje ($0 COP) a las motocicletas por Ley 787 de 2002', () => {
      const result = calculateRouteTolls('bogota-villavicencio', 'MOTO', true);

      expect(result.totalOneWay).toBe(0);
      expect(result.totalTrip).toBe(0);
      expect(result.hasExemptionNotice).toBe(true);
      result.tollsBreakdown.forEach(item => {
        expect(item.pricePerPass).toBe(0);
        expect(item.totalForTrip).toBe(0);
      });
    });

    it('debe calcular tarifas diferenciadas para categorías de carga (Cat V Tractomulas)', () => {
      const cat1Result = calculateRouteTolls('bogota-villavicencio', 'I', false);
      const cat5Result = calculateRouteTolls('bogota-villavicencio', 'V', false);

      expect(cat5Result.totalTrip).toBeGreaterThan(cat1Result.totalTrip);
      // Boquerón V (73500) + Naranjal V (62100) + Pipiral V (88400) = 224000
      expect(cat5Result.totalTrip).toBe(224000);
    });
  });

  describe('getCorridorRoutes & getRouteById', () => {
    it('debe filtrar corredores por ciudad de origen', () => {
      const bogotaRoutes = getCorridorRoutes('bogota');
      expect(bogotaRoutes.length).toBeGreaterThan(0);
      bogotaRoutes.forEach(r => expect(r.originCityId).toBe('bogota'));

      const medellinRoutes = getCorridorRoutes('medellin');
      expect(medellinRoutes.length).toBeGreaterThan(0);
      medellinRoutes.forEach(r => expect(r.originCityId).toBe('medellin'));

      const manizalesRoutes = getCorridorRoutes('manizales');
      expect(manizalesRoutes.length).toBeGreaterThanOrEqual(3);
      manizalesRoutes.forEach(r => expect(r.originCityId).toBe('manizales'));

      const allRoutes = getCorridorRoutes('all');
      expect(allRoutes.length).toBe(CORRIDOR_ROUTES.length);
    });

    it('debe recuperar un corredor por su ID', () => {
      const route = getRouteById('barranquilla-cartagena');
      expect(route).toBeDefined();
      expect(route?.originCityName).toBe('Barranquilla');
      expect(route?.destination).toBe('Cartagena de Indias');
    });
  });

  describe('searchTolls', () => {
    it('debe encontrar peajes por nombre', () => {
      const results = searchTolls('pipiral');
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].name).toContain('Pipiral');
    });

    it('debe encontrar peajes por departamento', () => {
      const santanderResults = searchTolls('Santander');
      expect(santanderResults.length).toBeGreaterThanOrEqual(2);
      expect(santanderResults.some(t => t.name.includes('Pescadero'))).toBe(true);
      expect(santanderResults.some(t => t.name.includes('Curití'))).toBe(true);
    });

    it('debe retornar todos los peajes si la búsqueda está vacía', () => {
      const results = searchTolls('');
      expect(results.length).toBe(TOLL_STATIONS.length);
    });
  });

  describe('formatTollCOP', () => {
    it('debe formatear montos en pesos colombianos', () => {
      const formatted = formatTollCOP(55900);
      expect(formatted).toContain('55');
      expect(formatted).toContain('900');
    });
  });
});

