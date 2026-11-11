import {
  evaluatePicoYPlaca,
  extractRelevantDigit,
  getCityDaySummary,
} from '../src/utils/picoYPlacaEngine';
import { PicoYPlacaRule, ColombianHoliday } from '../src/types/database.types';

describe('Pico y Placa Engine - Al Día Colombia', () => {
  const BOGOTA_ID = '11111111-1111-1111-1111-111111111111';
  const MEDELLIN_ID = '22222222-2222-2222-2222-222222222222';
  const MANIZALES_ID = '44444444-4444-4444-4444-444444444444';

  const mockHolidays: ColombianHoliday[] = [
    { date: '2026-01-01', name: 'Año Nuevo', is_bridge: false },
    { date: '2026-05-01', name: 'Día del Trabajo', is_bridge: false },
    { date: '2026-07-20', name: 'Día de la Independencia', is_bridge: false },
  ];

  const mockRules: PicoYPlacaRule[] = [
    // Bogotá - Lunes a Viernes (días 1 al 5) - Par / Impar
    {
      id: 'rule-bog-1',
      city_id: BOGOTA_ID,
      vehicle_type: 'particular',
      day_of_week: 1, // Lunes
      rule_type: 'even_odd_date',
      restricted_digits: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      start_time: '06:00:00',
      end_time: '21:00:00',
    },
    {
      id: 'rule-bog-2',
      city_id: BOGOTA_ID,
      vehicle_type: 'particular',
      day_of_week: 2, // Martes
      rule_type: 'even_odd_date',
      restricted_digits: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      start_time: '06:00:00',
      end_time: '21:00:00',
    },
    // Medellín - Lunes (Día 1): 5 y 8
    {
      id: 'rule-med-1',
      city_id: MEDELLIN_ID,
      vehicle_type: 'particular',
      day_of_week: 1,
      rule_type: 'last_digit',
      restricted_digits: ['5', '8'],
      start_time: '05:00:00',
      end_time: '20:00:00',
    },
    // Medellín Moto - Lunes (Día 1): Primer dígito 5 y 8
    {
      id: 'rule-med-moto-1',
      city_id: MEDELLIN_ID,
      vehicle_type: 'moto',
      day_of_week: 1,
      rule_type: 'first_digit',
      restricted_digits: ['5', '8'],
      start_time: '05:00:00',
      end_time: '20:00:00',
    },
    // Manizales - Lunes (Día 1): 1 y 2
    {
      id: 'rule-mnz-1',
      city_id: MANIZALES_ID,
      vehicle_type: 'particular',
      day_of_week: 1,
      rule_type: 'last_digit',
      restricted_digits: ['1', '2'],
      start_time: '06:00:00',
      end_time: '20:00:00',
    },
  ];

  describe('extractRelevantDigit', () => {
    it('debe extraer el último dígito numérico para carros', () => {
      expect(extractRelevantDigit('ABC123', 'last_digit')).toBe('3');
      expect(extractRelevantDigit('CFK984', 'last_digit')).toBe('4');
      expect(extractRelevantDigit('7', 'last_digit')).toBe('7');
    });

    it('debe extraer el primer dígito numérico para motos en regla first_digit', () => {
      expect(extractRelevantDigit('XYZ54D', 'first_digit')).toBe('5');
      expect(extractRelevantDigit('ABC89E', 'first_digit')).toBe('8');
    });

    it('debe extraer el último dígito para motos con regla last_digit', () => {
      expect(extractRelevantDigit('XYZ54D', 'last_digit')).toBe('4');
    });
  });

  describe('Días Festivos', () => {
    it('debe retornar FESTIVO_SIN_RESTRICCION en días feriados oficiales', () => {
      const res = evaluatePicoYPlaca({
        date: '2026-05-01', // Viernes festivo Día del Trabajo
        cityId: MEDELLIN_ID,
        vehicleType: 'particular',
        plateNumberOrDigit: 'ABC125',
        holidays: mockHolidays,
        rules: mockRules,
        currentTime: '10:00:00',
      });

      expect(res.status).toBe('FESTIVO_SIN_RESTRICCION');
      expect(res.isRestrictedNow).toBe(false);
      expect(res.isRestrictedToday).toBe(false);
      expect(res.title).toBe('DÍA FESTIVO');
      expect(res.subtitle).toBe('Día del Trabajo');
    });
  });

  describe('Fines de Semana', () => {
    it('debe retornar FIN_DE_SEMANA_SIN_RESTRICCION si es domingo sin reglas', () => {
      const res = evaluatePicoYPlaca({
        date: '2026-05-03', // Domingo
        cityId: MEDELLIN_ID,
        vehicleType: 'particular',
        plateNumberOrDigit: 'ABC125',
        holidays: mockHolidays,
        rules: mockRules,
        currentTime: '10:00:00',
      });

      expect(res.status).toBe('FIN_DE_SEMANA_SIN_RESTRICCION');
      expect(res.isRestrictedNow).toBe(false);
      expect(res.badgeText).toBe('LIBRE PARA CIRCULAR');
    });
  });

  describe('Regla Especial Bogotá (even_odd_date)', () => {
    // 2026-11-10 es Martes (día par del mes: 10)
    // En día par descansan placas 1, 2, 3, 4, 5
    // Circulan 6, 7, 8, 9, 0
    it('en día par restringe placas terminadas en 1, 2, 3, 4, 5', () => {
      const resRestringido = evaluatePicoYPlaca({
        date: '2026-11-10', // Día 10 (par), Martes
        cityId: BOGOTA_ID,
        vehicleType: 'particular',
        plateNumberOrDigit: 'BOG123', // termina en 3 -> Restringido
        holidays: mockHolidays,
        rules: mockRules,
        currentTime: '12:00:00',
      });

      expect(resRestringido.isRestrictedToday).toBe(true);
      expect(resRestringido.status).toBe('ACTIVA');

      const resLibre = evaluatePicoYPlaca({
        date: '2026-11-10', // Día 10 (par)
        cityId: BOGOTA_ID,
        vehicleType: 'particular',
        plateNumberOrDigit: 'BOG128', // termina en 8 -> Libre
        holidays: mockHolidays,
        rules: mockRules,
        currentTime: '12:00:00',
      });

      expect(resLibre.isRestrictedToday).toBe(false);
      expect(resLibre.status).toBe('LIBRE');
    });

    // 2026-11-17 es Martes (día impar del mes: 17)
    // En día impar descansan placas 6, 7, 8, 9, 0
    // Circulan 1, 2, 3, 4, 5
    it('en día impar restringe placas terminadas en 6, 7, 8, 9, 0', () => {
      const resRestringido = evaluatePicoYPlaca({
        date: '2026-11-17', // Día 17 (impar), Martes
        cityId: BOGOTA_ID,
        vehicleType: 'particular',
        plateNumberOrDigit: 'BOG128', // termina en 8 -> Restringido
        holidays: mockHolidays,
        rules: mockRules,
        currentTime: '12:00:00',
      });

      expect(resRestringido.isRestrictedToday).toBe(true);
      expect(resRestringido.status).toBe('ACTIVA');

      const resLibre = evaluatePicoYPlaca({
        date: '2026-11-17', // Día 17 (impar)
        cityId: BOGOTA_ID,
        vehicleType: 'particular',
        plateNumberOrDigit: 'BOG123', // termina en 3 -> Libre
        holidays: mockHolidays,
        rules: mockRules,
        currentTime: '12:00:00',
      });

      expect(resLibre.isRestrictedToday).toBe(false);
      expect(resLibre.status).toBe('LIBRE');
    });
  });

  describe('Control Horario (PROXIMA_A_INICIAR, ACTIVA, FINALIZADA)', () => {
    // 2026-11-09 es Lunes. Medellín particular tiene restricción para dígito 5 de 05:00 a 20:00
    it('debe marcar PROXIMA_A_INICIAR antes de las 05:00', () => {
      const res = evaluatePicoYPlaca({
        date: '2026-11-09',
        cityId: MEDELLIN_ID,
        vehicleType: 'particular',
        plateNumberOrDigit: 'MED125',
        holidays: mockHolidays,
        rules: mockRules,
        currentTime: '04:30:00',
      });

      expect(res.status).toBe('PROXIMA_A_INICIAR');
      expect(res.isRestrictedNow).toBe(false);
      expect(res.isRestrictedToday).toBe(true);
      expect(res.timeRemaining?.minutes).toBe(30);
    });

    it('debe marcar ACTIVA dentro de la franja', () => {
      const res = evaluatePicoYPlaca({
        date: '2026-11-09',
        cityId: MEDELLIN_ID,
        vehicleType: 'particular',
        plateNumberOrDigit: 'MED125',
        holidays: mockHolidays,
        rules: mockRules,
        currentTime: '14:00:00',
      });

      expect(res.status).toBe('ACTIVA');
      expect(res.isRestrictedNow).toBe(true);
      expect(res.isRestrictedToday).toBe(true);
      expect(res.badgeText).toBe('TIENES PICO Y PLACA HOY');
    });

    it('debe marcar FINALIZADA después de las 20:00', () => {
      const res = evaluatePicoYPlaca({
        date: '2026-11-09',
        cityId: MEDELLIN_ID,
        vehicleType: 'particular',
        plateNumberOrDigit: 'MED125',
        holidays: mockHolidays,
        rules: mockRules,
        currentTime: '20:30:00',
      });

      expect(res.status).toBe('FINALIZADA');
      expect(res.isRestrictedNow).toBe(false);
      expect(res.isRestrictedToday).toBe(true);
      expect(res.badgeText).toBe('CIRCULACIÓN PERMITIDA');
    });
  });

  describe('Resumen de la Ciudad (getCityDaySummary)', () => {
    it('debe generar el resumen de dígitos restringidos del día', () => {
      const summary = getCityDaySummary('2026-11-09', MEDELLIN_ID, mockHolidays, mockRules);
      expect(summary.isHoliday).toBe(false);
      expect(summary.groups.length).toBe(2); // Particular y Moto

      const partGroup = summary.groups.find(g => g.vehicleType === 'particular');
      expect(partGroup?.restrictedDigits).toEqual(['5', '8']);
    });
  });
});

