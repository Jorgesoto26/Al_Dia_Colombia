# 🇨🇴 Al Día Colombia - Mobile App (MVP)

> **Aplicación móvil utilitaria de alto rendimiento para movilidad, calendario de festivos y economía nacional en Colombia.**

Construida con **React Native**, **Supabase (PostgreSQL)** y arquitectura **Offline-First**.

---

## 🌟 Características Principales

1. **Dashboard Inteligente ("Hoy"):**
   - Semáforo visual de lectura instantánea: **"LIBRE PARA CIRCULAR"** (Verde esmeralda) o **"TIENES PICO Y PLACA HOY"** (Rojo coral) con horario y cuenta regresiva.
   - Detección automática de **Días Festivos Oficiales** (Ley Emiliani) con anulación de restricciones.
   - Selector rápido para cambiar entre múltiples vehículos con 1 solo toque.
   - Selector dinámico de ciudad activa (Bogotá, Medellín, Cali, Manizales, Pereira, Bucaramanga y Armenia).
   - Resumen completo de dígitos restringidos por modalidad (Particulares, Motos y Taxis).
   - **Bento Grid:** Dólar en vivo (TRM oficial) y contador regresivo hacia el próximo festivo.

2. **Mis Vehículos y Alertas:**
   - Gestión local sin login ni fricción de registro (100% privado en el dispositivo con `AsyncStorage`).
   - Soporte para carros particulares, motocicletas (regla de primer dígito en Medellín y último en otras ciudades) y taxis.
   - Soporte para **Vehículos Exentos** (Híbridos, Eléctricos y Pico y Placa Solidario).
   - Programación de recordatorios automáticos: a las **7:00 PM** del día anterior y a las **6:00 AM** del mismo día.

3. **Calendario y Festivos:**
   - Catálogo oficial de todos los festivos de Colombia con distintivo de **Puente Festivo**.
   - Banner destacado del próximo fin de semana largo de 3 días.
   - **Buscador Predictivo de Movilidad:** Consulta cualquier fecha futura para saber si tu vehículo podrá circular.

4. **Indicadores y Ajustes:**
   - Tablero con valores de referencia de Colombia: Salario Mínimo (SMMLV), Auxilio de Transporte, UVT de la DIAN, Infracción C.14 Pico y Placa ($650.000 COP) y Gasolina Corriente promedio.
   - Botón de **Sincronización Cloud** en 1 toque con Supabase.

---

## 🎨 Identidad Visual y UI/UX

- **Dark Mode Nativo:** Fondos espaciales Deep Space (`#0B0F19` a `#111827`).
- **Glassmorphism:** Tarjetas translúcidas esmeriladas (`rgba(17, 24, 39, 0.75)`), bordes sutiles iluminados y resplandores de estado.
- **Iconografía Nativa:** Iconos vectoriales SVG optimizados sin dependencias pesadas de fuentes.

---

## 🚀 Puesta en Marcha

### 1. Clonar e Instalar Dependencias

```bash
cd Al_Dia_Colombia
npm install
```

### 2. Configurar Supabase

El archivo `src/config/env.ts` ya contiene la conexión directa a tu proyecto en Supabase:

```typescript
// src/config/env.ts
export const ENV = {
  SUPABASE_URL: 'https://rkalrxiislhzwjukzyvb.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  // ...
};
```

Las migraciones y datos semilla de ciudades, reglas de Pico y Placa, festivos e indicadores se encuentran en:
`supabase/migrations/20261110000001_initial_schema_and_seeds.sql`

### 3. Ejecutar en Android / iOS

```bash
# Iniciar Metro Bundler
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS (requiere macOS y pod install)
npm run ios
```

---

## 🧪 Pruebas Automatizadas

El proyecto cuenta con suites de pruebas unitarias e integración en Jest:

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas específicas del motor lógico
npm test -- __tests__/picoYPlacaEngine.test.ts
```

Cobertura de pruebas:
- ✅ Reglas por último dígito y primer dígito (Motos Medellín)
- ✅ Esquema de fecha par/impar de Bogotá D.C.
- ✅ Detección de días festivos oficiales y fines de semana
- ✅ Franjas horarias (Próxima a iniciar, Activa, Finalizada)
- ✅ Resumen general de la ciudad
- ✅ Renderizado del árbol de navegación completo en Jest
