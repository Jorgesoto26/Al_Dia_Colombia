-- ============================================================================
-- AL DÍA COLOMBIA - EXPANSIÓN NACIONAL DE CIUDADES Y REGLAS DE PICO Y PLACA
-- Migración: 20261111000001_add_major_cities_and_rules.sql
-- Añade 8 nuevas capitales principales para un total de 15 ciudades en el país
-- ============================================================================

-- 1. REGISTRO DE NUEVAS CIUDADES PRINCIPALES
INSERT INTO public.cities (id, name, slug, department, is_active) VALUES
  ('88888888-8888-8888-8888-888888888888', 'Barranquilla', 'barranquilla', 'Atlántico', true),
  ('99999999-9999-9999-9999-999999999999', 'Cartagena', 'cartagena', 'Bolívar', true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Cúcuta', 'cucuta', 'Norte de Santander', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Ibagué', 'ibague', 'Tolima', true),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Villavicencio', 'villavicencio', 'Meta', true),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Neiva', 'neiva', 'Huila', true),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Santa Marta', 'santa-marta', 'Magdalena', true),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Pasto', 'pasto', 'Nariño', true)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  slug = EXCLUDED.slug, 
  department = EXCLUDED.department, 
  is_active = EXCLUDED.is_active;

-- 2. REGLAS OFICIALES DE PICO Y PLACA

-- ----------------------------------------------------
-- A. BARRANQUILLA (ATLÁNTICO)
-- En Barranquilla los vehículos particulares NO tienen Pico y Placa general.
-- Rige exclusivamente para servicio público Taxi (06:00 a 21:00).
-- ----------------------------------------------------
INSERT INTO public.pico_y_placa_rules (city_id, vehicle_type, day_of_week, rule_type, restricted_digits, start_time, end_time, notes) VALUES
  ('88888888-8888-8888-8888-888888888888', 'taxi', 1, 'last_digit', ARRAY['1','2'], '06:00:00', '21:00:00', 'Taxis en Barranquilla. Particulares exentos de restricción general.'),
  ('88888888-8888-8888-8888-888888888888', 'taxi', 2, 'last_digit', ARRAY['3','4'], '06:00:00', '21:00:00', 'Taxis en Barranquilla. Particulares exentos de restricción general.'),
  ('88888888-8888-8888-8888-888888888888', 'taxi', 3, 'last_digit', ARRAY['5','6'], '06:00:00', '21:00:00', 'Taxis en Barranquilla. Particulares exentos de restricción general.'),
  ('88888888-8888-8888-8888-888888888888', 'taxi', 4, 'last_digit', ARRAY['7','8'], '06:00:00', '21:00:00', 'Taxis en Barranquilla. Particulares exentos de restricción general.'),
  ('88888888-8888-8888-8888-888888888888', 'taxi', 5, 'last_digit', ARRAY['9','0'], '06:00:00', '21:00:00', 'Taxis en Barranquilla. Particulares exentos de restricción general.');

-- ----------------------------------------------------
-- B. CARTAGENA DE INDIAS (BOLÍVAR)
-- Particulares: Lunes a Viernes en 3 franjas pico (07:00-09:00, 12:00-14:00, 18:00-20:00)
-- ----------------------------------------------------
INSERT INTO public.pico_y_placa_rules (city_id, vehicle_type, day_of_week, rule_type, restricted_digits, start_time, end_time, notes) VALUES
  ('99999999-9999-9999-9999-999999999999', 'particular', 1, 'last_digit', ARRAY['1','2'], '07:00:00', '20:00:00', 'Decreto DATT Cartagena. Franjas: 07-09, 12-14 y 18-20.'),
  ('99999999-9999-9999-9999-999999999999', 'particular', 2, 'last_digit', ARRAY['3','4'], '07:00:00', '20:00:00', 'Decreto DATT Cartagena. Franjas: 07-09, 12-14 y 18-20.'),
  ('99999999-9999-9999-9999-999999999999', 'particular', 3, 'last_digit', ARRAY['5','6'], '07:00:00', '20:00:00', 'Decreto DATT Cartagena. Franjas: 07-09, 12-14 y 18-20.'),
  ('99999999-9999-9999-9999-999999999999', 'particular', 4, 'last_digit', ARRAY['7','8'], '07:00:00', '20:00:00', 'Decreto DATT Cartagena. Franjas: 07-09, 12-14 y 18-20.'),
  ('99999999-9999-9999-9999-999999999999', 'particular', 5, 'last_digit', ARRAY['9','0'], '07:00:00', '20:00:00', 'Decreto DATT Cartagena. Franjas: 07-09, 12-14 y 18-20.');

-- ----------------------------------------------------
-- C. CÚCUTA (NORTE DE SANTANDER)
-- Horario: Lunes a Viernes 07:00 a 19:00 continuo (Anillo metropolitano)
-- ----------------------------------------------------
INSERT INTO public.pico_y_placa_rules (city_id, vehicle_type, day_of_week, rule_type, restricted_digits, start_time, end_time, notes) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'particular', 1, 'last_digit', ARRAY['1','2'], '07:00:00', '19:00:00', 'Aplica en el perímetro centro y metropolitano de Cúcuta.'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'particular', 2, 'last_digit', ARRAY['3','4'], '07:00:00', '19:00:00', 'Aplica en el perímetro centro y metropolitano de Cúcuta.'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'particular', 3, 'last_digit', ARRAY['5','6'], '07:00:00', '19:00:00', 'Aplica en el perímetro centro y metropolitano de Cúcuta.'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'particular', 4, 'last_digit', ARRAY['7','8'], '07:00:00', '19:00:00', 'Aplica en el perímetro centro y metropolitano de Cúcuta.'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'particular', 5, 'last_digit', ARRAY['9','0'], '07:00:00', '19:00:00', 'Aplica en el perímetro centro y metropolitano de Cúcuta.');

-- ----------------------------------------------------
-- D. IBAGUÉ (TOLIMA)
-- Horario: Lunes a Viernes 06:00 a 20:00 continuo
-- ----------------------------------------------------
INSERT INTO public.pico_y_placa_rules (city_id, vehicle_type, day_of_week, rule_type, restricted_digits, start_time, end_time, notes) VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'particular', 1, 'last_digit', ARRAY['0','1'], '06:00:00', '20:00:00', 'Decreto municipal Ibagué.'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'particular', 2, 'last_digit', ARRAY['2','3'], '06:00:00', '20:00:00', 'Decreto municipal Ibagué.'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'particular', 3, 'last_digit', ARRAY['4','5'], '06:00:00', '20:00:00', 'Decreto municipal Ibagué.'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'particular', 4, 'last_digit', ARRAY['6','7'], '06:00:00', '20:00:00', 'Decreto municipal Ibagué.'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'particular', 5, 'last_digit', ARRAY['8','9'], '06:00:00', '20:00:00', 'Decreto municipal Ibagué.');

-- ----------------------------------------------------
-- E. VILLAVICENCIO (META)
-- Horario: Lunes a Viernes (06:30-08:30 y 17:00-19:30)
-- ----------------------------------------------------
INSERT INTO public.pico_y_placa_rules (city_id, vehicle_type, day_of_week, rule_type, restricted_digits, start_time, end_time, notes) VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'particular', 1, 'last_digit', ARRAY['1','2'], '06:30:00', '19:30:00', 'Secretaría de Movilidad Villavicencio (Horarios pico mañana y tarde).'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'particular', 2, 'last_digit', ARRAY['3','4'], '06:30:00', '19:30:00', 'Secretaría de Movilidad Villavicencio (Horarios pico mañana y tarde).'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'particular', 3, 'last_digit', ARRAY['5','6'], '06:30:00', '19:30:00', 'Secretaría de Movilidad Villavicencio (Horarios pico mañana y tarde).'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'particular', 4, 'last_digit', ARRAY['7','8'], '06:30:00', '19:30:00', 'Secretaría de Movilidad Villavicencio (Horarios pico mañana y tarde).'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'particular', 5, 'last_digit', ARRAY['9','0'], '06:30:00', '19:30:00', 'Secretaría de Movilidad Villavicencio (Horarios pico mañana y tarde).');

-- ----------------------------------------------------
-- F. NEIVA (HUILA)
-- Horario: Lunes a Viernes en franjas (07:00-09:00, 11:30-14:00 y 17:00-19:00)
-- ----------------------------------------------------
INSERT INTO public.pico_y_placa_rules (city_id, vehicle_type, day_of_week, rule_type, restricted_digits, start_time, end_time, notes) VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'particular', 1, 'last_digit', ARRAY['1','2'], '07:00:00', '19:00:00', 'Decreto municipal Neiva (Microcentro).'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'particular', 2, 'last_digit', ARRAY['3','4'], '07:00:00', '19:00:00', 'Decreto municipal Neiva (Microcentro).'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'particular', 3, 'last_digit', ARRAY['5','6'], '07:00:00', '19:00:00', 'Decreto municipal Neiva (Microcentro).'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'particular', 4, 'last_digit', ARRAY['7','8'], '07:00:00', '19:00:00', 'Decreto municipal Neiva (Microcentro).'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'particular', 5, 'last_digit', ARRAY['9','0'], '07:00:00', '19:00:00', 'Decreto municipal Neiva (Microcentro).');

-- ----------------------------------------------------
-- G. SANTA MARTA (MAGDALENA)
-- Horario: Lunes a Viernes (07:00-09:00, 11:30-14:00 y 17:30-20:00)
-- ----------------------------------------------------
INSERT INTO public.pico_y_placa_rules (city_id, vehicle_type, day_of_week, rule_type, restricted_digits, start_time, end_time, notes) VALUES
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'particular', 1, 'last_digit', ARRAY['1','2'], '07:00:00', '20:00:00', 'Alcaldía de Santa Marta. Incluye zona turística.'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'particular', 2, 'last_digit', ARRAY['3','4'], '07:00:00', '20:00:00', 'Alcaldía de Santa Marta. Incluye zona turística.'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'particular', 3, 'last_digit', ARRAY['5','6'], '07:00:00', '20:00:00', 'Alcaldía de Santa Marta. Incluye zona turística.'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'particular', 4, 'last_digit', ARRAY['7','8'], '07:00:00', '20:00:00', 'Alcaldía de Santa Marta. Incluye zona turística.'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'particular', 5, 'last_digit', ARRAY['9','0'], '07:00:00', '20:00:00', 'Alcaldía de Santa Marta. Incluye zona turística.');

-- ----------------------------------------------------
-- H. PASTO (NARIÑO)
-- Horario: Lunes a Viernes 07:30 a 19:00 continuo
-- ----------------------------------------------------
INSERT INTO public.pico_y_placa_rules (city_id, vehicle_type, day_of_week, rule_type, restricted_digits, start_time, end_time, notes) VALUES
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'particular', 1, 'last_digit', ARRAY['0','1'], '07:30:00', '19:00:00', 'Decreto de Tránsito Municipal de Pasto.'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'particular', 2, 'last_digit', ARRAY['2','3'], '07:30:00', '19:00:00', 'Decreto de Tránsito Municipal de Pasto.'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'particular', 3, 'last_digit', ARRAY['4','5'], '07:30:00', '19:00:00', 'Decreto de Tránsito Municipal de Pasto.'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'particular', 4, 'last_digit', ARRAY['6','7'], '07:30:00', '19:00:00', 'Decreto de Tránsito Municipal de Pasto.'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'particular', 5, 'last_digit', ARRAY['8','9'], '07:30:00', '19:00:00', 'Decreto de Tránsito Municipal de Pasto.');

