import { fuelService, EMBEDDED_BENCHMARKS } from '../src/services/fuelService';

describe('FuelService - Módulo de Combustibles y Estaciones (SICOM / MinMinas)', () => {
  const bogotaId = '11111111-1111-1111-1111-111111111111';
  const medellinId = '22222222-2222-2222-2222-222222222222';

  describe('Consultas de Estaciones y Benchmarks', () => {
    it('obtiene el benchmark oficial CREG para Bogotá y Medellín', () => {
      const benchmarkBog = fuelService.getCityBenchmark(bogotaId);
      expect(benchmarkBog).toBeDefined();
      expect(benchmarkBog.city_name).toBe('Bogotá D.C.');
      expect(benchmarkBog.corriente).toBeGreaterThan(15000);
      expect(benchmarkBog.diesel).toBeGreaterThan(9000);

      const benchmarkMed = fuelService.getCityBenchmark(medellinId);
      expect(benchmarkMed.city_name).toBe('Medellín');
      expect(benchmarkMed.corriente).toBe(15790);
    });

    it('retorna estaciones filtradas por ciudad y ordenadas por precio más económico', async () => {
      const stations = await fuelService.getStationsByCity(bogotaId, 'corriente', 'cheapest');
      expect(stations.length).toBeGreaterThan(0);

      // Verificar que el primero es menor o igual al segundo
      if (stations.length >= 2) {
        expect(stations[0].prices.corriente).toBeLessThanOrEqual(stations[1].prices.corriente);
      }
    });

    it('identifica la estación más económica de la ciudad', async () => {
      const cheapest = await fuelService.getCheapestStation(bogotaId, 'corriente');
      expect(cheapest).not.toBeNull();
      expect(cheapest?.city_id).toBe(bogotaId);
      expect(cheapest?.prices.corriente).toBeGreaterThan(0);
    });
  });

  describe('Calculadora de Tanqueada y Autonomía', () => {
    it('calcula galones y autonomía en modo presupuesto ($50.000)', () => {
      const pricePerGal = 15690;
      const budget = 50000;
      const result = fuelService.calculateTanking(
        'corriente',
        'particular',
        budget,
        'budget',
        pricePerGal
      );

      expect(result.mode).toBe('budget');
      expect(result.totalCost).toBe(50000);
      // 50000 / 15690 = 3.19 gal aprox
      expect(result.gallonsReceived).toBeCloseTo(3.19, 1);
      // Para carro (~40 km/gal): 3.19 * 40 = ~128 km
      expect(result.estimatedKilometers).toBeGreaterThan(115);
      expect(result.estimatedKilometers).toBeLessThan(140);
    });

    it('calcula costo y autonomía en modo galones (10 galones)', () => {
      const pricePerGal = 15860;
      const gallons = 10;
      const result = fuelService.calculateTanking(
        'corriente',
        'particular',
        gallons,
        'gallons',
        pricePerGal
      );

      expect(result.mode).toBe('gallons');
      expect(result.gallonsReceived).toBe(10);
      expect(result.totalCost).toBe(158600);
      expect(result.estimatedKilometers).toBe(400); // 10 * 40
    });

    it('asigna mayor autonomía por galón para motocicletas (~120 km/gal)', () => {
      const resultMoto = fuelService.calculateTanking(
        'corriente',
        'moto',
        2,
        'gallons',
        15500
      );
      expect(resultMoto.autonomyKmPerGallon).toBe(120);
      expect(resultMoto.estimatedKilometers).toBe(240); // 2 * 120
    });

    it('calcula ahorro potencial cuando el precio está por debajo del promedio', () => {
      const pricePerGal = 15500; // $360 más barato que 15860
      const result = fuelService.calculateTanking(
        'corriente',
        'particular',
        10,
        'gallons',
        pricePerGal
      );

      expect(result.potentialSavings).toBe(3600); // (15860 - 15500) * 10
    });
  });

  describe('Formato de Moneda', () => {
    it('formatea correctamente a pesos colombianos', () => {
      const formatted = fuelService.formatCOP(15860);
      expect(formatted).toContain('15.860');
    });
  });
});

