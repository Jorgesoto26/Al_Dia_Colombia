/**
 * Formateadores y Helpers de Fechas para Colombia
 * Al Día Colombia
 */
import { ColombianHoliday } from '../types/database.types';

const MONTH_NAMES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

const DAY_NAMES = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

/**
 * Retorna el saludo según la hora colombiana
 */
export function getColombianGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return 'Buenos días';
  } else if (hour >= 12 && hour < 19) {
    return 'Buenas tardes';
  } else {
    return 'Buenas noches';
  }
}

/**
 * Formatea una fecha a estilo colombiano: "Martes, 10 de noviembre de 2026"
 */
export function formatColombianDate(date: Date | string): string {
  let d: Date;
  if (typeof date === 'string') {
    const [year, month, day] = date.split('T')[0].split('-').map(Number);
    d = new Date(year, month - 1, day);
  } else {
    d = date;
  }

  const dayOfWeek = DAY_NAMES[d.getDay()];
  const dayOfMonth = d.getDate();
  const monthName = MONTH_NAMES[d.getMonth()];
  const year = d.getFullYear();

  return `${dayOfWeek}, ${dayOfMonth} de ${monthName} de ${year}`;
}

/**
 * Formato corto: "10 Nov" o "Lun, 10 Nov"
 */
export function formatShortDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('T')[0].split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const dayOfWeekShort = DAY_NAMES[d.getDay()].slice(0, 3);
  const monthShort = MONTH_NAMES[d.getMonth()].slice(0, 3);

  return `${dayOfWeekShort}, ${day} ${monthShort}`;
}

/**
 * Calcula la diferencia en días entre hoy y una fecha futura
 */
export function getDaysUntil(targetDateStr: string, fromDate = new Date()): number {
  const [year, month, day] = targetDateStr.split('T')[0].split('-').map(Number);
  const target = new Date(year, month - 1, day, 0, 0, 0);

  const start = new Date(
    fromDate.getFullYear(),
    fromDate.getMonth(),
    fromDate.getDate(),
    0,
    0,
    0
  );

  const diffMs = target.getTime() - start.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export interface NextHolidayResult {
  holiday: ColombianHoliday;
  daysRemaining: number;
  formattedDate: string;
  isToday: boolean;
}

/**
 * Encuentra el próximo día festivo a partir de la fecha dada
 */
export function findNextHoliday(
  holidays: ColombianHoliday[],
  fromDate = new Date()
): NextHolidayResult | null {
  const y = fromDate.getFullYear();
  const m = String(fromDate.getMonth() + 1).padStart(2, '0');
  const d = String(fromDate.getDate()).padStart(2, '0');
  const todayStr = `${y}-${m}-${d}`;

  // Filtrar festivos de hoy en adelante y ordenar
  const upcoming = holidays
    .filter(h => h.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (upcoming.length === 0) return null;

  const next = upcoming[0];
  const days = getDaysUntil(next.date, fromDate);

  return {
    holiday: next,
    daysRemaining: days,
    formattedDate: formatShortDate(next.date),
    isToday: days === 0,
  };
}

/**
 * Encuentra el próximo puente festivo (is_bridge = true)
 */
export function findNextBridge(
  holidays: ColombianHoliday[],
  fromDate = new Date()
): NextHolidayResult | null {
  const bridges = holidays.filter(h => h.is_bridge);
  return findNextHoliday(bridges, fromDate);
}

/**
 * Normaliza y formatea una placa (ej: "abc123" -> "ABC-123" o "XYZ45D")
 */
export function formatPlateDisplay(plate: string): string {
  if (!plate) return '';
  const clean = plate.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (clean.length === 6) {
    return `${clean.slice(0, 3)}·${clean.slice(3)}`;
  }
  return clean;
}

