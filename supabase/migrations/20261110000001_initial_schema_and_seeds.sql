-- ============================================================================
-- AL DÍA COLOMBIA - ESQUEMA DE BASE DE DATOS Y DATOS SEMILLA (SUPABASE)
-- Migración: 20261110000001_initial_schema_and_seeds.sql
-- ============================================================================

-- Extensión UUID si no está activa
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. TABLA: cities (Ciudades con pico y placa en Colombia)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    department TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.cities IS 'Catálogo de principales ciudades de Colombia monitoreadas.';

-- ----------------------------------------------------------------------------
-- 2. TABLA: pico_y_placa_rules (Reglas de restricción vehicular)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pico_y_placa_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('particular', 'moto', 'taxi')),
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1=Lunes a 7=Domingo
    rule_type TEXT NOT NULL CHECK (rule_type IN ('last_digit', 'first_digit', 'even_odd_date')),
    restricted_digits TEXT[] NOT NULL DEFAULT '{}',
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    notes TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.pico_y_placa_rules IS 'Reglas horarias y de dígitos restringidos por ciudad, tipo de vehículo y día de la semana.';

-- ----------------------------------------------------------------------------
-- 3. TABLA: colombian_holidays (Calendario oficial de festivos en Colombia)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.colombian_holidays (
    date DATE PRIMARY KEY,
    name TEXT NOT NULL,
    is_bridge BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.colombian_holidays IS 'Días festivos oficiales en Colombia (incluye Ley Emiliani / puentes festivos).';

-- ----------------------------------------------------------------------------
-- 4. TABLA: economic_indicators (Indicadores económicos clave de Colombia)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.economic_indicators (
    key TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    value NUMERIC NOT NULL,
    formatted_value TEXT NOT NULL,
    unit TEXT DEFAULT 'COP',
    notes TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.economic_indicators IS 'Valores oficiales de referencia económica (SMMLV, UVT, Multas, etc.).';

-- ----------------------------------------------------------------------------
-- ÍNDICES DE RENDIMIENTO
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_pyp_rules_lookup 
  ON public.pico_y_placa_rules(city_id, vehicle_type, day_of_week);

CREATE INDEX IF NOT EXISTS idx_holidays_date 
  ON public.colombian_holidays(date);

-- ----------------------------------------------------------------------------
-- POLÍTICAS DE SEGURIDAD (RLS - LECTURA PÚBLICA)
-- ----------------------------------------------------------------------------
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pico_y_placa_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colombian_holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.economic_indicators ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on cities" ON public.cities;
CREATE POLICY "Allow public read on cities" 
  ON public.cities FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public read on pico_y_placa_rules" ON public.pico_y_placa_rules;
CREATE POLICY "Allow public read on pico_y_placa_rules" 
  ON public.pico_y_placa_rules FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public read on colombian_holidays" ON public.colombian_holidays;
CREATE POLICY "Allow public read on colombian_holidays" 
  ON public.colombian_holidays FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public read on economic_indicators" ON public.economic_indicators;
CREATE POLICY "Allow public read on economic_indicators" 
  ON public.economic_indicators FOR SELECT TO anon, authenticated USING (true);


-- ============================================================================
-- DATOS SEMILLA (SEED DATA)
-- ============================================================================

-- 1. CIUDADES
INSERT INTO public.cities (id, name, slug, department, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Bogotá D.C.', 'bogota', 'Cundinamarca', true),
  ('22222222-2222-2222-2222-222222222222', 'Medellín', 'medellin', 'Antioquia', true),
  ('33333333-3333-3333-3333-333333333333', 'Cali', 'cali', 'Valle del Cauca', true),
  ('44444444-4444-4444-4444-444444444444', 'Manizales', 'manizales', 'Caldas', true),
  ('55555555-5555-5555-5555-555555555555', 'Pereira', 'pereira', 'Risaralda', true),
  ('66666666-6666-6666-6666-666666666666', 'Bucaramanga', 'bucaramanga', 'Santander', true),
  ('77777777-7777-7777-7777-777777777777', 'Armenia', 'armenia', 'Quindío', true)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  slug = EXCLUDED.slug, 
  department = EXCLUDED.department, 
  is_active = EXCLUDED.is_active;

-- 2. REGLAS DE PICO Y PLACA

-- ----------------------------------------------------
-- A. BOGOTÁ D.C.
-- Esquema Par / Impar para vehículos particulares
-- Días pares del mes: Restricción para placas terminadas en 1, 2, 3, 4, 5
-- Días impares del mes: Restricción para placas terminadas en 6, 7, 8, 9, 0
-- Horario: Lunes a Viernes 06:00 a 21:00
-- ----------------------------------------------------
INSERT INTO public.pico_y_placa_rules (city_id, vehicle_type, day_of_week, rule_type, restricted_digits, start_time, end_time, notes) VALUES
  ('11111111-1111-1111-1111-111111111111', 'particular', 1, 'even_odd_date', ARRAY['1','2','3','4','5','6','7','8','9','0'], '06:00:00', '21:00:00', 'Días pares descansan 1,2,3,4,5. Días impares descansan 6,7,8,9,0. Exento con Pico y Placa Solidario.'),
  ('11111111-1111-1111-1111-111111111111', 'particular', 2, 'even_odd_date', ARRAY['1','2','3','4','5','6','7','8','9','0'], '06:00:00', '21:00:00', 'Días pares descansan 1,2,3,4,5. Días impares descansan 6,7,8,9,0. Exento con Pico y Placa Solidario.'),
  ('11111111-1111-1111-1111-111111111111', 'particular', 3, 'even_odd_date', ARRAY['1','2','3','4','5','6','7','8','9','0'], '06:00:00', '21:00:00', 'Días pares descansan 1,2,3,4,5. Días impares descansan 6,7,8,9,0. Exento con Pico y Placa Solidario.'),
  ('11111111-1111-1111-1111-111111111111', 'particular', 4, 'even_odd_date', ARRAY['1','2','3','4','5','6','7','8','9','0'], '06:00:00', '21:00:00', 'Días pares descansan 1,2,3,4,5. Días impares descansan 6,7,8,9,0. Exento con Pico y Placa Solidario.'),
  ('11111111-1111-1111-1111-111111111111', 'particular', 5, 'even_odd_date', ARRAY['1','2','3','4','5','6','7','8','9','0'], '06:00:00', '21:00:00', 'Días pares descansan 1,2,3,4,5. Días impares descansan 6,7,8,9,0. Exento con Pico y Placa Solidario.');

-- Taxis Bogotá: Lunes a Sábado 05:30 a 21:00 (Rotativo parejas de dígitos)
INSERT INTO public.pico_y_placa_rules (city_id, vehicle_type, day_of_week, rule_type, restricted_digits, start_time, end_time, notes) VALUES
  ('11111111-1111-1111-1111-111111111111', 'taxi', 1, 'last_digit', ARRAY['1','2'], '05:30:00', '21:00:00', 'Taxis en Bogotá rige de lunes a sábado'),
  ('11111111-1111-1111-1111-111111111111', 'taxi', 2, 'last_digit', ARRAY['3','4'], '05:30:00', '21:00:00', 'Taxis en Bogotá rige de lunes a sábado'),
  ('11111111-1111-1111-1111-111111111111', 'taxi', 3, 'last_digit', ARRAY['5','6'], '05:30:00', '21:00:00', 'Taxis en Bogotá rige de lunes a sábado'),
  ('11111111-1111-1111-1111-111111111111', 'taxi', 4, 'last_digit', ARRAY['7','8'], '05:30:00', '21:00:00', 'Taxis en Bogotá rige de lunes a sábado'),
  ('11111111-1111-1111-1111-111111111111', 'taxi', 5, 'last_digit', ARRAY['9','0'], '05:30:00', '21:00:00', 'Taxis en Bogotá rige de lunes a sábado'),
  ('11111111-1111-1111-1111-111111111111', 'taxi', 6, 'last_digit', ARRAY['1','2'], '05:30:00', '21:00:00', 'Taxis los sábados según rotación distrital');

-- ----------------------------------------------------
-- B. MEDELLÍN Y ÁREA METROPOLITANA
-- Particulares: Último dígito (05:00 a 20:00)
-- Motos 2T y 4T: Primer número de la placa (05:00 a 20:00)
-- ----------------------------------------------------
-- Particulares
INSERT INTO public.pico_y_placa_rules (city_id, vehicle_type, day_of_week, rule_type, restricted_digits, start_time, end_time, notes) VALUES
  ('22222222-2222-2222-2222-222222222222', 'particular', 1, 'last_digit', ARRAY['5','8'], '05:00:00', '20:00:00', 'Aplica en los 10 municipios del Valle de Aburrá'),
  ('22222222-2222-2222-2222-222222222222', 'particular', 2, 'last_digit', ARRAY['1','4'], '05:00:00', '20:00:00', 'Aplica en los 10 municipios del Valle de Aburrá'),
  ('22222222-2222-2222-2222-222222222222', 'particular', 3, 'last_digit', ARRAY['2','0'], '05:00:00', '20:00:00', 'Aplica en los 10 municipios del Valle de Aburrá'),
  ('22222222-2222-2222-2222-222222222222', 'particular', 4, 'last_digit', ARRAY['3','6'], '05:00:00', '20:00:00', 'Aplica en los 10 municipios del Valle de Aburrá'),
  ('22222222-2222-2222-2222-222222222222', 'particular', 5, 'last_digit', ARRAY['7','9'], '05:00:00', '20:00:00', 'Aplica en los 10 municipios del Valle de Aburrá');

-- Motos (Medellín usa el PRIMER dígito numérico de la placa)
INSERT INTO public.pico_y_placa_rules (city_id, vehicle_type, day_of_week, rule_type, restricted_digits, start_time, end_time, notes) VALUES
  ('22222222-2222-2222-2222-222222222222', 'moto', 1, 'first_digit', ARRAY['5','8'], '05:00:00', '20:00:00', 'Motos 2 y 4 tiempos rige con el primer dígito'),
  ('22222222-2222-2222-2222-222222222222', 'moto', 2, 'first_digit', ARRAY['1','4'], '05:00:00', '20:00:00', 'Motos 2 y 4 tiempos rige con el primer dígito'),
  ('22222222-2222-2222-2222-222222222222', 'moto', 3, 'first_digit', ARRAY['2','0'], '05:00:00', '20:00:00', 'Motos 2 y 4 tiempos rige con el primer dígito'),
  ('22222222-2222-2222-2222-222222222222', 'moto', 4, 'first_digit', ARRAY['3','6'], '05:00:00', '20:00:00', 'Motos 2 y 4 tiempos rige con el primer dígito'),
  ('22222222-2222-2222-2222-222222222222', 'moto', 5, 'first_digit', ARRAY['7','9'], '05:00:00', '20:00:00', 'Motos 2 y 4 tiempos rige con el primer dígito');

-- ----------------------------------------------------
-- C. CALI (SANTIAGO DE CALI)
-- Horario: Lunes a Viernes 06:00 a 19:00
-- ----------------------------------------------------
INSERT INTO public.pico_y_placa_rules (city_id, vehicle_type, day_of_week, rule_type, restricted_digits, start_time, end_time, notes) VALUES
  ('33333333-3333-3333-3333-333333333333', 'particular', 1, 'last_digit', ARRAY['7','8'], '06:00:00', '19:00:00', 'Decreto distrital de movilidad de Cali'),
  ('33333333-3333-3333-3333-333333333333', 'particular', 2, 'last_digit', ARRAY['9','0'], '06:00:00', '19:00:00', 'Decreto distrital de movilidad de Cali'),
  ('33333333-3333-3333-3333-333333333333', 'particular', 3, 'last_digit', ARRAY['1','2'], '06:00:00', '19:00:00', 'Decreto distrital de movilidad de Cali'),
  ('33333333-3333-3333-3333-333333333333', 'particular', 4, 'last_digit', ARRAY['3','4'], '06:00:00', '19:00:00', 'Decreto distrital de movilidad de Cali'),
  ('33333333-3333-3333-3333-333333333333', 'particular', 5, 'last_digit', ARRAY['5','6'], '06:00:00', '19:00:00', 'Decreto distrital de movilidad de Cali');

-- ----------------------------------------------------
-- D. MANIZALES
-- Horario Particular: 06:00 a 20:00 continuo (Sector delimitado Centro)
-- ----------------------------------------------------
INSERT INTO public.pico_y_placa_rules (city_id, vehicle_type, day_of_week, rule_type, restricted_digits, start_time, end_time, notes) VALUES
  ('44444444-4444-4444-4444-444444444444', 'particular', 1, 'last_digit', ARRAY['1','2'], '06:00:00', '20:00:00', 'Zona Centro: Av. Santander, Paralela, Kevin Ángel y Centro Histórico.'),
  ('44444444-4444-4444-4444-444444444444', 'particular', 2, 'last_digit', ARRAY['3','4'], '06:00:00', '20:00:00', 'Zona Centro: Av. Santander, Paralela, Kevin Ángel y Centro Histórico.'),
  ('44444444-4444-4444-4444-444444444444', 'particular', 3, 'last_digit', ARRAY['5','6'], '06:00:00', '20:00:00', 'Zona Centro: Av. Santander, Paralela, Kevin Ángel y Centro Histórico.'),
  ('44444444-4444-4444-4444-444444444444', 'particular', 4, 'last_digit', ARRAY['7','8'], '06:00:00', '20:00:00', 'Zona Centro: Av. Santander, Paralela, Kevin Ángel y Centro Histórico.'),
  ('44444444-4444-4444-4444-444444444444', 'particular', 5, 'last_digit', ARRAY['9','0'], '06:00:00', '20:00:00', 'Zona Centro: Av. Santander, Paralela, Kevin Ángel y Centro Histórico.');

-- Taxis Manizales: 05:30 a 04:00 (Rotación de un dígito por día)
INSERT INTO public.pico_y_placa_rules (city_id, vehicle_type, day_of_week, rule_type, restricted_digits, start_time, end_time, notes) VALUES
  ('44444444-4444-4444-4444-444444444444', 'taxi', 1, 'last_digit', ARRAY['1'], '05:30:00', '23:59:00', 'Taxis Manizales'),
  ('44444444-4444-4444-4444-444444444444', 'taxi', 2, 'last_digit', ARRAY['2'], '05:30:00', '23:59:00', 'Taxis Manizales'),
  ('44444444-4444-4444-4444-444444444444', 'taxi', 3, 'last_digit', ARRAY['3'], '05:30:00', '23:59:00', 'Taxis Manizales'),
  ('44444444-4444-4444-4444-444444444444', 'taxi', 4, 'last_digit', ARRAY['4'], '05:30:00', '23:59:00', 'Taxis Manizales'),
  ('44444444-4444-4444-4444-444444444444', 'taxi', 5, 'last_digit', ARRAY['5'], '05:30:00', '23:59:00', 'Taxis Manizales');

-- ----------------------------------------------------------------------------
-- 3. CALENDARIO DE FESTIVOS DE COLOMBIA (LEY EMILIANI) - 2025 Y 2026
-- ----------------------------------------------------------------------------
INSERT INTO public.colombian_holidays (date, name, is_bridge) VALUES
  -- 2025
  ('2025-01-01', 'Año Nuevo', false),
  ('2025-01-06', 'Día de los Reyes Magos', true),
  ('2025-03-24', 'Día de San José', true),
  ('2025-04-17', 'Jueves Santo', false),
  ('2025-04-18', 'Viernes Santo', false),
  ('2025-05-01', 'Día del Trabajo', false),
  ('2025-06-02', 'Día de la Ascensión', true),
  ('2025-06-23', 'Corpus Christi', true),
  ('2025-06-30', 'Sagrado Corazón de Jesús', true),
  ('2025-07-20', 'Día de la Independencia', false),
  ('2025-08-07', 'Batalla de Boyacá', false),
  ('2025-08-18', 'La Asunción de la Virgen', true),
  ('2025-10-13', 'Día de la Raza', true),
  ('2025-11-03', 'Día de Todos los Santos', true),
  ('2025-11-17', 'Independencia de Cartagena', true),
  ('2025-12-08', 'Inmaculada Concepción', false),
  ('2025-12-25', 'Navidad', false),

  -- 2026
  ('2026-01-01', 'Año Nuevo', false),
  ('2026-01-12', 'Día de los Reyes Magos', true),
  ('2026-03-23', 'Día de San José', true),
  ('2026-04-02', 'Jueves Santo', false),
  ('2026-04-03', 'Viernes Santo', false),
  ('2026-05-01', 'Día del Trabajo', false),
  ('2026-05-18', 'Día de la Ascensión', true),
  ('2026-06-08', 'Corpus Christi', true),
  ('2026-06-15', 'Sagrado Corazón de Jesús', true),
  ('2026-06-29', 'San Pedro y San Pablo', true),
  ('2026-07-20', 'Día de la Independencia', false),
  ('2026-08-07', 'Batalla de Boyacá', false),
  ('2026-08-17', 'La Asunción de la Virgen', true),
  ('2026-10-12', 'Día de la Raza', true),
  ('2026-11-02', 'Día de Todos los Santos', true),
  ('2026-11-16', 'Independencia de Cartagena', true),
  ('2026-12-08', 'Inmaculada Concepción', false),
  ('2026-12-25', 'Navidad', false)
ON CONFLICT (date) DO UPDATE SET 
  name = EXCLUDED.name, 
  is_bridge = EXCLUDED.is_bridge;

-- ----------------------------------------------------------------------------
-- 4. INDICADORES ECONÓMICOS
-- ----------------------------------------------------------------------------
INSERT INTO public.economic_indicators (key, name, value, formatted_value, unit, notes) VALUES
  ('smmlv', 'Salario Mínimo Legal Vigente (2026)', 1750905, '$1.750.905 COP', 'COP/mes', 'Decreto 1469 de finales de 2025 (+23%). En 2025 fue de $1.423.500 COP.'),
  ('auxilio_transporte', 'Auxilio de Transporte (2026)', 249095, '$249.095 COP', 'COP/mes', 'Decreto 1470 de finales de 2025 (+24.5%). En 2025 fue de $200.000 COP. Aplica hasta 2 SMMLV.'),
  ('total_minimo_con_auxilio', 'Ingreso Total Mínimo (2026)', 2000000, '$2.000.000 COP', 'COP/mes', 'Total devengado mensual ($1.750.905 + $249.095). Alcanza la meta oficial de $2.000.000.'),
  ('uvt', 'Unidad de Valor Tributario (UVT 2026)', 52374, '$52.374 COP', 'COP', 'Resolución DIAN 000238 del 15-dic-2025 (+5.17% IPC). En 2025 fue de $49.799 COP.'),
  ('multa_pico_y_placa', 'Comparendo C.14 Pico y Placa (2026)', 875453, '$875.453 COP', 'COP', '15 SMLDV vigentes 2026 ($58.364/día). En 2025 fue de $711.750 COP. Más costos de grúa y patios.'),
  ('gasolina_promedio', 'Gasolina Corriente (Promedio CREG)', 15860, '$15.860 COP', 'COP/galón', 'Precio promedio de referencia nacional CREG en ciudades principales.')
ON CONFLICT (key) DO UPDATE SET 
  name = EXCLUDED.name,
  value = EXCLUDED.value,
  formatted_value = EXCLUDED.formatted_value,
  unit = EXCLUDED.unit,
  notes = EXCLUDED.notes,
  updated_at = now();

