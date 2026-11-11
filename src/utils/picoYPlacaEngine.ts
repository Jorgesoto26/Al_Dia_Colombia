/**
 * MOTOR LÓGICO DE PICO Y PLACA (ISOLATED & DETERMINISTIC)
 * Al Día Colombia - Arquitectura Base
 *
 * Servicio aislado de alta precisión que determina si un vehículo tiene
 * restricción de circulación activa, próxima o finalizada en cualquier ciudad
 * de Colombia para cualquier fecha y hora.
 */

import {
  VehicleType,
  RuleType,
  PicoYPlacaRule,
  ColombianHoliday,
} from '../types/database.types';
import {
  EngineResult,
  CityDaySummary,
  CitySummaryVehicleGroup,
} from '../types/picoYPlaca.types';

export interface EvaluatePicoYPlacaParams {
  date: Date | string; // Fecha de consulta
  cityId: string; // ID de la ciudad
  vehicleType: VehicleType; // 'particular' | 'moto' | 'taxi'
  plateNumberOrDigit: string; // Placa completa (ej: "ABC123", "XYZ45D") o dígito
  holidays: ColombianHoliday[]; // Lista de festivos de Colombia
  rules: PicoYPlacaRule[]; // Catálogo de reglas
  currentTime?: string; // Hora 'HH:mm' o 'HH:mm:ss' (opcional, defaults to now)
  isExempt?: boolean; // Híbrido, eléctrico o Pico y Placa Solidario
  exemptionType?: 'electrico_hibrido' | 'solidario' | 'ninguno';
}

/**
 * Normaliza una fecha a formato local 'YYYY-MM-DD' y objeto Date estándar
 */
export function normalizeDate(input: Date | string): { dateStr: string; dateObj: Date } {
  let dateObj: Date;
  if (typeof input === 'string') {
    // Si viene en formato 'YYYY-MM-DD', forzar parsing seguro local
    const [year, month, day] = input.split('T')[0].split('-').map(Number);
    if (year && month && day) {
      dateObj = new Date(year, month - 1, day);
    } else {
      dateObj = new Date(input);
    }
  } else {
    dateObj = new Date(input.getTime());
  }

  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  const dateStr = `${y}-${m}-${d}`;

  return { dateStr, dateObj };
}

/**
 * Extrae el dígito relevante de la placa según el tipo de regla:
 * - 'last_digit': último dígito numérico (ej: "ABC123" -> '3', moto "XYZ45D" -> '5')
 * - 'first_digit': primer dígito numérico (ej: moto "XYZ45D" -> '4', Medellín)
 * - 'even_odd_date': último dígito numérico (Bogotá evalúa el último dígito con la fecha par/impar)
 */
export function extractRelevantDigit(plateOrDigit: string, ruleType: RuleType): string {
  if (!plateOrDigit) return '';

  const clean = plateOrDigit.trim().toUpperCase();

  // Si ya es un solo dígito numérico
  if (/^\d$/.test(clean)) {
    return clean;
  }

  // Extraer todos los dígitos numéricos contenidos en la placa
  const numericDigits = clean.match(/\d/g);
  if (!numericDigits || numericDigits.length === 0) {
    return '';
  }

  if (ruleType === 'first_digit') {
    return numericDigits[0];
  }

  // 'last_digit' y 'even_odd_date' usan el último dígito
  return numericDigits[numericDigits.length - 1];
}

/**
 * Convierte 'HH:mm:ss' o 'HH:mm' a minutos transcurridos desde medianoche
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(':').map(Number);
  const hours = parts[0] || 0;
  const minutes = parts[1] || 0;
  return hours * 60 + minutes;
}

/**
 * Formatea minutos o string de tiempo a formato legible 12 horas (ej: "6:00 AM", "8:00 PM")
 */
export function formatTimeFriendly(timeStr: string): string {
  if (!timeStr) return '';
  const parts = timeStr.split(':').map(Number);
  const hours24 = parts[0] || 0;
  const minutes = parts[1] || 0;

  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minStr = String(minutes).padStart(2, '0');

  return `${hours12}:${minStr} ${period}`;
}

/**
 * Calcula la cuenta regresiva formateada entre dos marcas de minutos
 */
export function calculateRemainingTime(fromMinutes: number, toMinutes: number): {
  hours: number;
  minutes: number;
  formatted: string;
} {
  const diff = Math.max(0, toMinutes - fromMinutes);
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  let formatted = '';
  if (hours > 0 && minutes > 0) {
    formatted = `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    formatted = `${hours}h`;
  } else {
    formatted = `${minutes} min`;
  }

  return { hours, minutes, formatted };
}

/**
 * MOTOR LÓGICO PRINCIPAL
 * Evalúa las restricciones para un vehículo específico
 */
export function evaluatePicoYPlaca({
  date,
  cityId,
  vehicleType,
  plateNumberOrDigit,
  holidays,
  rules,
  currentTime,
  isExempt,
  exemptionType,
}: EvaluatePicoYPlacaParams): EngineResult {
  // --------------------------------------------------------------------------
  // PASO 0: VERIFICAR SI EL VEHÍCULO ESTÁ EXENTO (Híbrido/Eléctrico/Solidario)
  // --------------------------------------------------------------------------
  if (isExempt) {
    const subtitle =
      exemptionType === 'electrico_hibrido'
        ? 'Vehículo Híbrido / Eléctrico'
        : exemptionType === 'solidario'
        ? 'Pico y Placa Solidario Activo'
        : 'Permiso Especial de Exención';

    return {
      status: 'EXENTO',
      isRestrictedNow: false,
      isRestrictedToday: false,
      title: 'VEHÍCULO EXENTO',
      subtitle,
      message: 'Tu vehículo cuenta con permiso oficial y está exento de la medida de Pico y Placa.',
      badgeText: 'LIBRE (EXENTO)',
      colorType: 'success',
      relevantDigit: '',
    };
  }

  const { dateStr, dateObj } = normalizeDate(date);

  // Determinar día de la semana (1=Lunes a 7=Domingo)
  const jsDay = dateObj.getDay();
  const dayOfWeek = jsDay === 0 ? 7 : jsDay;
  const dayOfMonth = dateObj.getDate();

  // Determinar hora actual de evaluación
  let currentMinutes: number;
  if (currentTime) {
    currentMinutes = timeToMinutes(currentTime);
  } else {
    const now = new Date();
    currentMinutes = now.getHours() * 60 + now.getMinutes();
  }

  // --------------------------------------------------------------------------
  // PASO 1: VERIFICAR SI LA FECHA ES DÍA FESTIVO EN COLOMBIA
  // --------------------------------------------------------------------------
  const holiday = holidays.find(h => h.date === dateStr);
  if (holiday) {
    return {
      status: 'FESTIVO_SIN_RESTRICCION',
      isRestrictedNow: false,
      isRestrictedToday: false,
      title: 'DÍA FESTIVO',
      subtitle: holiday.name,
      message: `Hoy es día festivo (${holiday.name}). No aplica restricción de Pico y Placa.`,
      badgeText: 'SIN PICO Y PLACA',
      colorType: 'success',
      relevantDigit: '',
      holidayInfo: holiday,
    };
  }

  // --------------------------------------------------------------------------
  // PASO 2: FILTRAR REGLAS DE LA CIUDAD, VEHÍCULO Y DÍA
  // --------------------------------------------------------------------------
  const matchingRules = rules.filter(
    r =>
      r.city_id === cityId &&
      r.vehicle_type === vehicleType &&
      r.day_of_week === dayOfWeek
  );

  // Si es fin de semana y no hay regla especial programada (ej. sábados para taxis)
  if (matchingRules.length === 0 && (dayOfWeek === 6 || dayOfWeek === 7)) {
    return {
      status: 'FIN_DE_SEMANA_SIN_RESTRICCION',
      isRestrictedNow: false,
      isRestrictedToday: false,
      title: 'FIN DE SEMANA',
      subtitle: dayOfWeek === 6 ? 'Sábado' : 'Domingo',
      message: 'Los fines de semana no rige restricción para tu tipo de vehículo.',
      badgeText: 'LIBRE PARA CIRCULAR',
      colorType: 'success',
      relevantDigit: '',
    };
  }

  // Si no hay ninguna regla para este día de la semana
  if (matchingRules.length === 0) {
    return {
      status: 'LIBRE',
      isRestrictedNow: false,
      isRestrictedToday: false,
      title: 'LIBRE PARA CIRCULAR',
      subtitle: 'Sin restricción programada',
      message: 'No hay medidas de Pico y Placa activas para tu vehículo hoy.',
      badgeText: 'LIBRE HOY',
      colorType: 'success',
      relevantDigit: '',
    };
  }

  // Usamos la regla aplicable (en caso de franjas, se toma la regla activa o la próxima)
  const rule = matchingRules[0];
  const relevantDigit = extractRelevantDigit(plateNumberOrDigit, rule.rule_type);

  // --------------------------------------------------------------------------
  // PASO 3: EVALUAR TIPO DE REGLA ('last_digit', 'first_digit', 'even_odd_date')
  // --------------------------------------------------------------------------
  let isPlateRestrictedToday = false;

  if (rule.rule_type === 'even_odd_date') {
    // REGLA BOGOTÁ D.C.:
    // Días calendario pares (2, 4, 6...): No circulan placas terminadas en 1, 2, 3, 4, 5
    // Días calendario impares (1, 3, 5...): No circulan placas terminadas en 6, 7, 8, 9, 0
    const isEvenDay = dayOfMonth % 2 === 0;
    const restrictedInEvenDays = ['1', '2', '3', '4', '5'];
    const restrictedInOddDays = ['6', '7', '8', '9', '0'];

    if (isEvenDay) {
      isPlateRestrictedToday = restrictedInEvenDays.includes(relevantDigit);
    } else {
      isPlateRestrictedToday = restrictedInOddDays.includes(relevantDigit);
    }
  } else {
    // REGLA ESTÁNDAR POR ÚLTIMO O PRIMER DÍGITO (Medellín, Cali, Manizales, etc.)
    isPlateRestrictedToday = rule.restricted_digits.includes(relevantDigit);
  }

  // --------------------------------------------------------------------------
  // PASO 4: SI LA PLACA NO TIENE RESTRICCIÓN HOY
  // --------------------------------------------------------------------------
  if (!isPlateRestrictedToday) {
    return {
      status: 'LIBRE',
      isRestrictedNow: false,
      isRestrictedToday: false,
      title: 'LIBRE PARA CIRCULAR',
      subtitle: `Placa ${relevantDigit ? `con dígito ${relevantDigit}` : 'autorizada'}`,
      message: 'Tu vehículo puede circular libremente durante todo el día.',
      badgeText: 'LIBRE PARA CIRCULAR',
      colorType: 'success',
      relevantDigit,
      matchedRule: rule,
    };
  }

  // --------------------------------------------------------------------------
  // PASO 5: LA PLACA TIENE RESTRICCIÓN HOY -> EVALUAR HORARIO EXACTO
  // --------------------------------------------------------------------------
  const startMinutes = timeToMinutes(rule.start_time);
  const endMinutes = timeToMinutes(rule.end_time);

  const startFormatted = formatTimeFriendly(rule.start_time);
  const endFormatted = formatTimeFriendly(rule.end_time);

  // Escenario A: Aún no inicia el horario de restricción
  if (currentMinutes < startMinutes) {
    const countdown = calculateRemainingTime(currentMinutes, startMinutes);
    return {
      status: 'PROXIMA_A_INICIAR',
      isRestrictedNow: false,
      isRestrictedToday: true,
      title: 'RESTRICCIÓN PRÓXIMA',
      subtitle: `Inicia hoy a las ${startFormatted}`,
      message: `Tu restricción comienza a las ${startFormatted} (${rule.start_time.slice(0, 5)} - ${rule.end_time.slice(0, 5)}). Faltan ${countdown.formatted}.`,
      badgeText: `INICIA EN ${countdown.formatted.toUpperCase()}`,
      colorType: 'warning',
      relevantDigit,
      startTime: rule.start_time,
      endTime: rule.end_time,
      timeRemaining: countdown,
      matchedRule: rule,
    };
  }

  // Escenario B: En plena restricción horaria (ACTIVA)
  if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
    const countdown = calculateRemainingTime(currentMinutes, endMinutes);
    return {
      status: 'ACTIVA',
      isRestrictedNow: true,
      isRestrictedToday: true,
      title: 'TIENES PICO Y PLACA HOY',
      subtitle: `Restricción activa hasta las ${endFormatted}`,
      message: `No puedes circular en este horario. Finaliza en ${countdown.formatted} (a las ${endFormatted}).`,
      badgeText: 'TIENES PICO Y PLACA HOY',
      colorType: 'danger',
      relevantDigit,
      startTime: rule.start_time,
      endTime: rule.end_time,
      timeRemaining: countdown,
      matchedRule: rule,
    };
  }

  // Escenario C: La restricción de hoy ya terminó
  return {
    status: 'FINALIZADA',
    isRestrictedNow: false,
    isRestrictedToday: true,
    title: 'RESTRICCIÓN FINALIZADA',
    subtitle: `Terminó a las ${endFormatted}`,
    message: `La restricción de hoy finalizó a las ${endFormatted}. Ya puedes circular con total libertad.`,
    badgeText: 'CIRCULACIÓN PERMITIDA',
    colorType: 'success',
    relevantDigit,
    startTime: rule.start_time,
    endTime: rule.end_time,
    matchedRule: rule,
  };
}

/**
 * Genera el resumen general de la ciudad para el Dashboard "Hoy"
 * Calcula los dígitos que tienen restricción hoy para Particulares, Motos y Taxis
 */
export function getCityDaySummary(
  date: Date | string,
  cityId: string,
  holidays: ColombianHoliday[],
  rules: PicoYPlacaRule[]
): CityDaySummary {
  const { dateStr, dateObj } = normalizeDate(date);
  const jsDay = dateObj.getDay();
  const dayOfWeek = jsDay === 0 ? 7 : jsDay;
  const dayOfMonth = dateObj.getDate();

  const holiday = holidays.find(h => h.date === dateStr);
  const isWeekend = dayOfWeek === 6 || dayOfWeek === 7;

  if (holiday) {
    return {
      cityId,
      date: dateStr,
      isHoliday: true,
      holidayName: holiday.name,
      isWeekend,
      hasRestriction: false,
      groups: [],
    };
  }

  const cityRules = rules.filter(r => r.city_id === cityId && r.day_of_week === dayOfWeek);

  const vehicleTypes: { type: VehicleType; label: string }[] = [
    { type: 'particular', label: 'Carros Particulares' },
    { type: 'moto', label: 'Motocicletas' },
    { type: 'taxi', label: 'Taxis' },
  ];

  const groups: CitySummaryVehicleGroup[] = [];

  for (const vt of vehicleTypes) {
    const rule = cityRules.find(r => r.vehicle_type === vt.type);
    if (!rule) continue;

    let restrictedDigits: string[] = [];

    if (rule.rule_type === 'even_odd_date') {
      // Bogotá: día par descansan 1,2,3,4,5 / día impar descansan 6,7,8,9,0
      const isEven = dayOfMonth % 2 === 0;
      restrictedDigits = isEven ? ['1', '2', '3', '4', '5'] : ['6', '7', '8', '9', '0'];
    } else {
      restrictedDigits = [...rule.restricted_digits];
    }

    groups.push({
      vehicleType: vt.type,
      label: vt.label,
      restrictedDigits,
      schedule: `${formatTimeFriendly(rule.start_time)} a ${formatTimeFriendly(rule.end_time)}`,
      ruleType: rule.rule_type,
      notes: rule.notes,
    });
  }

  return {
    cityId,
    date: dateStr,
    isHoliday: false,
    isWeekend,
    hasRestriction: groups.length > 0,
    groups,
  };
}

