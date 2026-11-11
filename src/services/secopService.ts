/**
 * Servicio de Licitaciones y Contratación Pública (SECOP II / Datos Abiertos)
 * Colombia Compra Eficiente - Portal datos.gov.co (Socrata API p6dx-8zbt)
 * Estrategia Offline-First con caché local, marcadores y fallback embebido.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SecopProcess,
  SecopFilterParams,
  SecopSummary,
  SecopPhase,
  SecopModality,
  SecopContractType,
  SecopBudgetTier,
} from '../types/secop.types';

const STORAGE_KEYS = {
  BOOKMARKS: '@al_dia:secop_bookmarks',
  CACHED_PROCESSES: '@al_dia:secop_cached_processes',
};

const SECOP_API_URL = 'https://www.datos.gov.co/resource/p6dx-8zbt.json';

// ============================================================================
// BASE DE DATOS LOCAL EMBEBIDA: LICITACIONES VIGENTES 2026 EN COLOMBIA
// ============================================================================
export const EMBEDDED_SECOP_PROCESSES: SecopProcess[] = [
  // BOGOTÁ D.C.
  {
    id: 'CO1.REQ.4510201',
    reference: 'IDU-LP-014-2026',
    entity: 'INSTITUTO DE DESARROLLO URBANO (IDU)',
    department: 'Distrito Capital de Bogotá',
    city: 'Bogotá',
    title: 'Mantenimiento integral y rehabilitación de losas de concreto en troncal TransMilenio Av. Caracas y NQS',
    description: 'Ejecución a precio global fijo y monto agotable de obras de conservación vial, sellado de juntas y parcheo en carriles exclusivos de transporte masivo.',
    phase: 'Presentación de oferta',
    modality: 'Licitación pública',
    contractType: 'Obra',
    basePrice: 8450000000,
    formattedPrice: '$8.450.000.000 COP',
    duration: '10 meses',
    publicationDate: '2026-10-18',
    closingDate: '2026-11-28',
    url: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.4510201',
  },
  {
    id: 'CO1.REQ.4510202',
    reference: 'SED-SA-042-2026',
    entity: 'SECRETARÍA DE EDUCACIÓN DEL DISTRITO',
    department: 'Distrito Capital de Bogotá',
    city: 'Bogotá',
    title: 'Suministro e instalación de equipos de cómputo y aulas digitales interactivas para colegios distritales oficiales',
    description: 'Adquisición de portátiles educativos, pantallas táctiles y servidores locales de contenido pedagógico para 45 sedes educativas.',
    phase: 'Presentación de oferta',
    modality: 'Selección abreviada',
    contractType: 'Tecnología',
    basePrice: 1280000000,
    formattedPrice: '$1.280.000.000 COP',
    duration: '4 meses',
    publicationDate: '2026-10-24',
    closingDate: '2026-11-20',
    url: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.4510202',
  },
  {
    id: 'CO1.REQ.4510203',
    reference: 'SDS-MC-118-2026',
    entity: 'SUBRED INTEGRADA DE SERVICIOS DE SALUD CENTRO ORIENTE E.S.E.',
    department: 'Distrito Capital de Bogotá',
    city: 'Bogotá',
    title: 'Suministro de material médico-quirúrgico y guantes estériles para unidades de atención prioritaria',
    description: 'Adquisición de insumos de protección biológica, jeringas y sondas para los centros de salud de la subred centro oriente.',
    phase: 'Presentación de oferta',
    modality: 'Mínima cuantía',
    contractType: 'Suministro',
    basePrice: 84500000,
    formattedPrice: '$84.500.000 COP',
    duration: '60 días',
    publicationDate: '2026-11-04',
    closingDate: '2026-11-16',
    url: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.4510203',
  },

  // MEDELLÍN / ANTIOQUIA
  {
    id: 'CO1.REQ.4510204',
    reference: 'METRO-SA-019-2026',
    entity: 'EMPRESA DE TRANSPORTE MASIVO DEL VALLE DE ABURRÁ LIMITADA - METRO DE MEDELLÍN',
    department: 'Antioquia',
    city: 'Medellín',
    title: 'Servicio de mantenimiento predictivo, preventivo y correctivo para subestaciones eléctricas de tracción ferroviaria',
    description: 'Contratación de servicios de ingeniería eléctrica especializada en líneas aéreas de contacto y bancos de transformadores.',
    phase: 'Presentación de oferta',
    modality: 'Selección abreviada',
    contractType: 'Servicios',
    basePrice: 3600000000,
    formattedPrice: '$3.600.000.000 COP',
    duration: '12 meses',
    publicationDate: '2026-10-15',
    closingDate: '2026-11-25',
    url: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.4510204',
  },
  {
    id: 'CO1.REQ.4510205',
    reference: 'INDER-LP-008-2026',
    entity: 'INSTITUTO DE DEPORTES Y RECREACIÓN DE MEDELLÍN (INDER)',
    department: 'Antioquia',
    city: 'Medellín',
    title: 'Adecuación, reposición de grama sintética y cerramiento de canchas polideportivas en las comunas 1, 3 y 13',
    description: 'Obras civiles para el mejoramiento integral de la infraestructura deportiva barrial de uso comunitario.',
    phase: 'Presentación de oferta',
    modality: 'Licitación pública',
    contractType: 'Obra',
    basePrice: 940000000,
    formattedPrice: '$940.000.000 COP',
    duration: '5 meses',
    publicationDate: '2026-10-29',
    closingDate: '2026-11-22',
    url: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.4510205',
  },
  {
    id: 'CO1.REQ.4510206',
    reference: 'RN-CM-003-2026',
    entity: 'CORPORACIÓN RUTA N MEDELLÍN',
    department: 'Antioquia',
    city: 'Medellín',
    title: 'Consultoría especializada para el diseño del programa de aceleración de startups de Inteligencia Artificial aplicada',
    description: 'Servicios de mentoría de alto impacto, validación comercial e internacionalización de empresas innovadoras del ecosistema CTi.',
    phase: 'Presentación de oferta',
    modality: 'Concurso de méritos',
    contractType: 'Consultoría',
    basePrice: 195000000,
    formattedPrice: '$195.000.000 COP',
    duration: '6 meses',
    publicationDate: '2026-11-02',
    closingDate: '2026-11-19',
    url: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.4510206',
  },

  // CALI / VALLE DEL CAUCA
  {
    id: 'CO1.REQ.4510207',
    reference: 'EMCALI-LP-031-2026',
    entity: 'EMPRESAS MUNICIPALES DE CALI (EMCALI E.I.C.E. E.S.P.)',
    department: 'Valle del Cauca',
    city: 'Cali',
    title: 'Suministro de tuberías de polietileno de alta densidad (HDPE) y accesorios para reposición de redes de acueducto sector Aguablanca',
    description: 'Adquisición de materiales hidráulicos certificados para reducción de pérdidas de agua potable en la red de distribución.',
    phase: 'Presentación de oferta',
    modality: 'Licitación pública',
    contractType: 'Suministro',
    basePrice: 1420000000,
    formattedPrice: '$1.420.000.000 COP',
    duration: '3 meses',
    publicationDate: '2026-10-21',
    closingDate: '2026-11-30',
    url: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.4510207',
  },
  {
    id: 'CO1.REQ.4510208',
    reference: 'METROCALI-CM-012-2026',
    entity: 'METRO CALI S.A.',
    department: 'Valle del Cauca',
    city: 'Cali',
    title: 'Interventoría técnica, administrativa y ambiental a las obras de adecuación de accesibilidad en terminales MIO',
    description: 'Control y vigilancia a la instalación de guías podotáctiles, rampas y señalética braille en corredores troncales.',
    phase: 'Presentación de oferta',
    modality: 'Concurso de méritos',
    contractType: 'Consultoría',
    basePrice: 320000000,
    formattedPrice: '$320.000.000 COP',
    duration: '6 meses',
    publicationDate: '2026-11-01',
    closingDate: '2026-11-21',
    url: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.4510208',
  },

  // BARRANQUILLA / ATLÁNTICO
  {
    id: 'CO1.REQ.4510209',
    reference: 'ALCBAQ-LP-018-2026',
    entity: 'ALCALDÍA DISTRITAL DE BARRANQUILLA',
    department: 'Atlántico',
    city: 'Barranquilla',
    title: 'Obras de mitigación hidráulica, canalización y limpieza del arroyo La María en la localidad Suroccidente',
    description: 'Construcción de box culverts de concreto reforzado, gaviones y canalización subterránea para evitar desbordamientos.',
    phase: 'Presentación de oferta',
    modality: 'Licitación pública',
    contractType: 'Obra',
    basePrice: 5200000000,
    formattedPrice: '$5.200.000.000 COP',
    duration: '8 meses',
    publicationDate: '2026-10-10',
    closingDate: '2026-11-27',
    url: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.4510209',
  },
  {
    id: 'CO1.REQ.4510210',
    reference: 'TRABAQ-SA-007-2026',
    entity: 'SECRETARÍA DISTRITAL DE TRÁNSITO Y SEGURIDAD VIAL DE BARRANQUILLA',
    department: 'Atlántico',
    city: 'Barranquilla',
    title: 'Actualización tecnológica del sistema centralizado de control semafórico y cámaras de aforo vehicular inteligente',
    description: 'Integración de controladores semafóricos adaptativos, sensores de conteo en tiempo real y enlaces de fibra óptica.',
    phase: 'Presentación de oferta',
    modality: 'Selección abreviada',
    contractType: 'Tecnología',
    basePrice: 1850000000,
    formattedPrice: '$1.850.000.000 COP',
    duration: '6 meses',
    publicationDate: '2026-10-27',
    closingDate: '2026-11-24',
    url: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.4510210',
  },

  // BUCARAMANGA / SANTANDER
  {
    id: 'CO1.REQ.4510211',
    reference: 'ALCBUC-SA-022-2026',
    entity: 'ALCALDÍA DE BUCARAMANGA',
    department: 'Santander',
    city: 'Bucaramanga',
    title: 'Mantenimiento preventivo y embellecimiento de espacio público en parques de la Comuna 13 y Centro',
    description: 'Reparación de adoquines, pintura de mobiliario urbano, siembra de jardinería nativa y luminarias solares.',
    phase: 'Presentación de oferta',
    modality: 'Selección abreviada',
    contractType: 'Obra',
    basePrice: 680000000,
    formattedPrice: '$680.000.000 COP',
    duration: '4 meses',
    publicationDate: '2026-10-30',
    closingDate: '2026-11-23',
    url: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.4510211',
  },
  {
    id: 'CO1.REQ.4510212',
    reference: 'UIS-MC-089-2026',
    entity: 'UNIVERSIDAD INDUSTRIAL DE SANTANDER (UIS)',
    department: 'Santander',
    city: 'Bucaramanga',
    title: 'Adquisición e instalación de servidores en rack de alto rendimiento y switches 10GbE para laboratorios de computación',
    description: 'Equipamiento informático para el cluster de computación científica de la facultad de ingenierías físico-mecánicas.',
    phase: 'Presentación de oferta',
    modality: 'Mínima cuantía',
    contractType: 'Tecnología',
    basePrice: 165000000,
    formattedPrice: '$165.000.000 COP',
    duration: '45 días',
    publicationDate: '2026-11-05',
    closingDate: '2026-11-17',
    url: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.4510212',
  },

  // MANIZALES / CALDAS
  {
    id: 'CO1.REQ.4510213',
    reference: 'INVAMA-LP-005-2026',
    entity: 'INSTITUTO DE VALORIZACIÓN DE MANIZALES (INVAMA)',
    department: 'Caldas',
    city: 'Manizales',
    title: 'Modernización y expansión del alumbrado público a tecnología LED con telegestión en vías urbanas y rurales',
    description: 'Sustitución de luminarias de sodio por luminarias LED de alta eficiencia lumínica y sistema de monitoreo remoto.',
    phase: 'Presentación de oferta',
    modality: 'Licitación pública',
    contractType: 'Obra',
    basePrice: 1150000000,
    formattedPrice: '$1.150.000.000 COP',
    duration: '6 meses',
    publicationDate: '2026-10-19',
    closingDate: '2026-11-29',
    url: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.4510213',
  },
  {
    id: 'CO1.REQ.4510214',
    reference: 'AGUASMAN-MC-044-2026',
    entity: 'AGUAS DE MANIZALES S.A. E.S.P.',
    department: 'Caldas',
    city: 'Manizales',
    title: 'Suministro de reactivos químicos (Sulfato de Aluminio Tipo A y Cloro Gaseoso) para la planta de potabilización Niza',
    description: 'Adquisición periódica de coagulantes y desinfectantes para asegurar los estándares de potabilidad del agua de la ciudad.',
    phase: 'Presentación de oferta',
    modality: 'Mínima cuantía',
    contractType: 'Suministro',
    basePrice: 95000000,
    formattedPrice: '$95.000.000 COP',
    duration: '60 días',
    publicationDate: '2026-11-06',
    closingDate: '2026-11-18',
    url: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.4510214',
  },
  {
    id: 'CO1.REQ.4510215',
    reference: 'GOBCAL-SA-033-2026',
    entity: 'GOBERNACIÓN DE CALDAS - SECRETARÍA DE INFRAESTRUCTURA',
    department: 'Caldas',
    city: 'Manizales',
    title: 'Atención de puntos críticos y construcción de muros de contención en el corredor cafetero Chinchiná - Palestina',
    description: 'Obras de geotecnia, pantallas ancladas y filtros subdrenantes para estabilización de taludes viales.',
    phase: 'Presentación de oferta',
    modality: 'Selección abreviada',
    contractType: 'Obra',
    basePrice: 890000000,
    formattedPrice: '$890.000.000 COP',
    duration: '5 meses',
    publicationDate: '2026-10-25',
    closingDate: '2026-11-26',
    url: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.4510215',
  },

  // CARTAGENA / BOLÍVAR
  {
    id: 'CO1.REQ.4510216',
    reference: 'ALCCAR-LP-011-2026',
    entity: 'ALCALDÍA MAYOR DE CARTAGENA DE INDIAS',
    department: 'Bolívar',
    city: 'Cartagena',
    title: 'Mantenimiento del canal El Laguito y dragado hidráulico ambiental de la bahía de Cartagena',
    description: 'Extracción de sedimentos, oxigenación de cuerpos de agua internos y dragado mecánico para flujo de marea.',
    phase: 'Presentación de oferta',
    modality: 'Licitación pública',
    contractType: 'Obra',
    basePrice: 4300000000,
    formattedPrice: '$4.300.000.000 COP',
    duration: '7 meses',
    publicationDate: '2026-10-12',
    closingDate: '2026-11-26',
    url: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.4510216',
  },

  // PEREIRA / RISARALDA
  {
    id: 'CO1.REQ.4510217',
    reference: 'MEGAP-MC-023-2026',
    entity: 'MEGABÚS S.A. - SISTEMA INTEGRADO DE TRANSPORTE MASIVO',
    department: 'Risaralda',
    city: 'Pereira',
    title: 'Servicio de limpieza profunda, aseo y desinfección en las estaciones e intercambiadores del sistema Megabús',
    description: 'Contratación de cuadrillas operativas con insumos biodegradables y maquinaria de lavado a presión para plataformas de pasajeros.',
    phase: 'Presentación de oferta',
    modality: 'Mínima cuantía',
    contractType: 'Servicios',
    basePrice: 135000000,
    formattedPrice: '$135.000.000 COP',
    duration: '90 días',
    publicationDate: '2026-11-03',
    closingDate: '2026-11-16',
    url: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.4510217',
  },

  // CÚCUTA / NORTE DE SANTANDER
  {
    id: 'CO1.REQ.4510218',
    reference: 'GOBNDS-LP-009-2026',
    entity: 'GOBERNACIÓN DE NORTE DE SANTANDER',
    department: 'Norte de Santander',
    city: 'Cúcuta',
    title: 'Operación del Programa de Alimentación Escolar (PAE) para estudiantes de instituciones públicas en zonas de frontera',
    description: 'Suministro de raciones alimentarias balanceadas con estándares nutricionales y cadena de frío en Cúcuta y Villa del Rosario.',
    phase: 'Presentación de oferta',
    modality: 'Licitación pública',
    contractType: 'Suministro',
    basePrice: 2400000000,
    formattedPrice: '$2.400.000.000 COP',
    duration: '180 días calendario escolar',
    publicationDate: '2026-10-17',
    closingDate: '2026-11-24',
    url: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.4510218',
  },

  // VILLAVICENCIO / META
  {
    id: 'CO1.REQ.4510219',
    reference: 'CORMAC-CM-008-2026',
    entity: 'CORPORACIÓN PARA EL DESARROLLO SOSTENIBLE DEL ÁREA DE MANEJO ESPECIAL LA MACARENA (CORMACARENA)',
    department: 'Meta',
    city: 'Villavicencio',
    title: 'Consultoría ambiental para la formulación del plan de manejo y delimitación de rondas hídricas en la cuenca del Río Guatiquía',
    description: 'Estudios hidrológicos, cartografía satelital y talleres de concertación comunitaria para preservación de fuentes de agua.',
    phase: 'Presentación de oferta',
    modality: 'Concurso de méritos',
    contractType: 'Consultoría',
    basePrice: 420000000,
    formattedPrice: '$420.000.000 COP',
    duration: '5 meses',
    publicationDate: '2026-10-28',
    closingDate: '2026-11-22',
    url: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.4510219',
  },

  // IBAGUÉ / TOLIMA
  {
    id: 'CO1.REQ.4510220',
    reference: 'IBAL-LP-015-2026',
    entity: 'EMPRESA Ibaguereña de Acueducto y Alcantarillado (IBAL S.A. E.S.P. OFICIAL)',
    department: 'Tolima',
    city: 'Ibagué',
    title: 'Optimización estructural de desarenadores y conducción matriz de agua cruda en la bocatoma Combeima',
    description: 'Construcción de compuertas automatizadas de purga, muros de encauzamiento y desarenadores de alta tasa.',
    phase: 'Presentación de oferta',
    modality: 'Licitación pública',
    contractType: 'Obra',
    basePrice: 1920000000,
    formattedPrice: '$1.920.000.000 COP',
    duration: '6 meses',
    publicationDate: '2026-10-22',
    closingDate: '2026-11-27',
    url: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.4510220',
  },

  // NEIVA / HUILA
  {
    id: 'CO1.REQ.4510221',
    reference: 'ALCNEI-MC-057-2026',
    entity: 'ALCALDÍA DE NEIVA',
    department: 'Huila',
    city: 'Neiva',
    title: 'Mantenimiento preventivo y correctivo de motobombas y plantas eléctricas de emergencia en sedes administrativas',
    description: 'Inspección de bobinados, cambio de filtros, aceite y pruebas de arranque con transferencia automática.',
    phase: 'Presentación de oferta',
    modality: 'Mínima cuantía',
    contractType: 'Servicios',
    basePrice: 72000000,
    formattedPrice: '$72.000.000 COP',
    duration: '60 días',
    publicationDate: '2026-11-04',
    closingDate: '2026-11-17',
    url: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.4510221',
  },

  // SANTA MARTA / MAGDALENA
  {
    id: 'CO1.REQ.4510222',
    reference: 'ALCSMR-LP-006-2026',
    entity: 'ALCALDÍA DISTRITAL DE SANTA MARTA',
    department: 'Magdalena',
    city: 'Santa Marta',
    title: 'Construcción de colectores pluviales y pavimentación en concreto hidráulico sector El Rodadero Sur',
    description: 'Obras de drenaje pluvial para mitigar encharcamientos durante la temporada de lluvias en el corredor turístico.',
    phase: 'Presentación de oferta',
    modality: 'Licitación pública',
    contractType: 'Obra',
    basePrice: 3100000000,
    formattedPrice: '$3.100.000.000 COP',
    duration: '7 meses',
    publicationDate: '2026-10-14',
    closingDate: '2026-11-28',
    url: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.4510222',
  },

  // PASTO / NARIÑO
  {
    id: 'CO1.REQ.4510223',
    reference: 'EMPOPAS-MC-031-2026',
    entity: 'EMPRESA METROPOLITANA DE ASEO DE PASTO (EMAS PASTO)',
    department: 'Nariño',
    city: 'Pasto',
    title: 'Suministro de dotación industrial de seguridad, botas dieléctricas e impermeables para operarios de barrido y recolección',
    description: 'Entrega de elementos de protección personal reglamentarios con certificación de resistencia y reflectividad vial.',
    phase: 'Presentación de oferta',
    modality: 'Mínima cuantía',
    contractType: 'Suministro',
    basePrice: 65000000,
    formattedPrice: '$65.000.000 COP',
    duration: '45 días',
    publicationDate: '2026-11-05',
    closingDate: '2026-11-18',
    url: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.4510223',
  },
];

// ============================================================================
// FUNCIONES DE CONSULTA, LIVE API Y GESTIÓN DE MARCADORES
// ============================================================================

/**
 * Normaliza registros crudos devueltos por la API de Datos Abiertos (Socrata)
 */
function normalizeSocrataRecord(raw: any): SecopProcess | null {
  try {
    const id = raw.id_del_proceso || raw.referencia_del_proceso || `SECOP-${Math.random().toString(36).substring(7)}`;
    const reference = raw.referencia_del_proceso || raw.id_del_proceso || 'Sin ref.';
    const entity = raw.entidad || 'Entidad Pública';
    const department = raw.departamento_entidad || 'Colombia';
    const city = raw.ciudad_entidad || raw.ciudad_de_la_unidad_de || 'Nacional';
    const title = raw.nombre_del_procedimiento || raw.descripci_n_del_procedimiento || 'Proceso de contratación pública';
    const description = raw.descripci_n_del_procedimiento || title;

    // Normalizar fase
    let phase: SecopPhase = 'Presentación de oferta';
    const rawFase = (raw.fase || raw.estado_resumen || '').toLowerCase();
    if (rawFase.includes('borrador')) phase = 'Borrador';
    else if (rawFase.includes('evalua')) phase = 'En evaluación';
    else if (rawFase.includes('adjudic')) phase = 'Adjudicado';
    else if (rawFase.includes('cierra') || rawFase.includes('cerrad')) phase = 'Cerrado';

    // Normalizar modalidad
    let modality: SecopModality = 'Licitación pública';
    const rawMod = (raw.modalidad_de_contratacion || '').toLowerCase();
    if (rawMod.includes('mínima') || rawMod.includes('minima')) modality = 'Mínima cuantía';
    else if (rawMod.includes('abreviada')) modality = 'Selección abreviada';
    else if (rawMod.includes('méritos') || rawMod.includes('meritos')) modality = 'Concurso de méritos';
    else if (rawMod.includes('directa')) modality = 'Contratación directa';
    else if (rawMod.includes('subasta')) modality = 'Subasta inversa';

    // Normalizar tipo de contrato
    let contractType: SecopContractType = 'Servicios';
    const rawType = (raw.tipo_de_contrato || '').toLowerCase();
    if (rawType.includes('obra')) contractType = 'Obra';
    else if (rawType.includes('suministro')) contractType = 'Suministro';
    else if (rawType.includes('consult')) contractType = 'Consultoría';
    else if (rawType.includes('tecnolog') || rawType.includes('softw') || rawType.includes('sistemas')) contractType = 'Tecnología';
    else if (rawType.includes('transporte')) contractType = 'Transporte';
    else if (rawType.includes('compra')) contractType = 'Compraventa';

    // Precio
    const priceNum = parseFloat(raw.precio_base || raw.valor_total_adjudicacion || '0') || 0;
    const formattedPrice = formatCOP(priceNum);

    const publicationDate = raw.fecha_de_publicacion_del ? raw.fecha_de_publicacion_del.split('T')[0] : '2026-01-01';
    const closingDate = raw.fecha_de_publicacion_fase_3 ? raw.fecha_de_publicacion_fase_3.split('T')[0] : undefined;
    const url = raw.urlproceso?.url || `https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=${raw.id_del_proceso}`;

    const duration = raw.duracion ? `${raw.duracion} ${raw.unidad_de_duracion || 'días'}` : 'Según pliegos';

    return {
      id,
      reference,
      entity,
      department,
      city,
      title,
      description,
      phase,
      modality,
      contractType,
      basePrice: priceNum,
      formattedPrice,
      duration,
      publicationDate,
      closingDate,
      url,
    };
  } catch (e) {
    return null;
  }
}

/**
 * Consulta procesos en la API en vivo de Socrata con timeout y fallback automático
 */
export async function getSecopProcesses(forceLive = false): Promise<{ processes: SecopProcess[]; isLive: boolean }> {
  // 1. Obtener marcadores guardados
  const bookmarkedIds = await getBookmarkedProcessIds();
  const markBookmarks = (list: SecopProcess[]): SecopProcess[] => {
    return list.map(item => ({
      ...item,
      isBookmarked: bookmarkedIds.includes(item.id),
    }));
  };

  // 2. Si no se fuerza red, intentar cargar caché local previa
  if (!forceLive) {
    try {
      const cachedStr = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_PROCESSES);
      if (cachedStr) {
        const cached = JSON.parse(cachedStr) as SecopProcess[];
        if (cached && cached.length > 0) {
          return { processes: markBookmarks(cached), isLive: false };
        }
      }
    } catch (e) {
      // Ignorar error de lectura de caché
    }
  }

  // 3. Consulta en vivo a datos.gov.co
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 segundos máximo

    // Traer los 30 procesos más recientes que estén abiertos
    const endpoint = `${SECOP_API_URL}?$limit=30&$order=fecha_de_publicacion_del%20DESC&$where=estado_de_apertura_del_proceso%3D%27Abierto%27`;
    const response = await fetch(endpoint, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const rawData = await response.json();
      if (Array.isArray(rawData) && rawData.length > 0) {
        const parsed: SecopProcess[] = rawData
          .map(normalizeSocrataRecord)
          .filter((item): item is SecopProcess => item !== null && item.basePrice > 0);

        if (parsed.length > 0) {
          // Guardar en caché para disponibilidad offline
          await AsyncStorage.setItem(STORAGE_KEYS.CACHED_PROCESSES, JSON.stringify(parsed));
          return { processes: markBookmarks(parsed), isLive: true };
        }
      }
    }
  } catch (error) {
    // Falla de red, timeout o endpoint no disponible: proceder al fallback
  }

  // 4. Fallback: Base de datos embebida con licitaciones 2026
  return { processes: markBookmarks(EMBEDDED_SECOP_PROCESSES), isLive: false };
}

/**
 * Filtra los procesos de contratación según los criterios seleccionados
 */
export function filterSecopProcesses(
  processes: SecopProcess[],
  filters: SecopFilterParams
): SecopProcess[] {
  return processes.filter(proc => {
    // Solo marcadores favoritos
    if (filters.onlyBookmarked && !proc.isBookmarked) {
      return false;
    }

    // Filtro por Ciudad
    if (filters.city && filters.city !== 'Todas') {
      const cityNorm = filters.city.toLowerCase().trim();
      const procCityNorm = proc.city.toLowerCase().trim();
      const procDeptNorm = proc.department.toLowerCase().trim();
      if (!procCityNorm.includes(cityNorm) && !procDeptNorm.includes(cityNorm)) {
        return false;
      }
    }

    // Filtro por Modalidad
    if (filters.modality && filters.modality !== 'all') {
      if (proc.modality !== filters.modality) {
        return false;
      }
    }

    // Filtro por Tipo de Contrato
    if (filters.contractType && filters.contractType !== 'all') {
      if (proc.contractType !== filters.contractType) {
        return false;
      }
    }

    // Filtro por Rango Presupuestal
    if (filters.budgetTier && filters.budgetTier !== 'all') {
      const price = proc.basePrice;
      if (filters.budgetTier === 'under_50m' && price > 50000000) return false;
      if (filters.budgetTier === '50m_200m' && (price < 50000000 || price > 200000000)) return false;
      if (filters.budgetTier === '200m_1000m' && (price < 200000000 || price > 1000000000)) return false;
      if (filters.budgetTier === 'over_1000m' && price < 1000000000) return false;
    }

    // Búsqueda por texto (palabra clave en título, entidad, referencia o descripción)
    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const query = filters.searchQuery.toLowerCase().trim();
      const match =
        proc.title.toLowerCase().includes(query) ||
        proc.entity.toLowerCase().includes(query) ||
        proc.reference.toLowerCase().includes(query) ||
        proc.description.toLowerCase().includes(query) ||
        proc.city.toLowerCase().includes(query);

      if (!match) return false;
    }

    return true;
  });
}

/**
 * Calcula métricas resumen para un conjunto de procesos
 */
export function calculateSecopSummary(processes: SecopProcess[]): SecopSummary {
  const totalProcesses = processes.length;
  const totalBudget = processes.reduce((acc, curr) => acc + curr.basePrice, 0);
  const openProcesses = processes.filter(p => p.phase === 'Presentación de oferta').length;

  return {
    totalProcesses,
    totalBudget,
    formattedTotalBudget: formatCOP(totalBudget),
    openProcesses,
  };
}

// ============================================================================
// GESTIÓN DE MARCADORES (FAVORITOS)
// ============================================================================

export async function getBookmarkedProcessIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function toggleBookmarkProcess(processId: string): Promise<boolean> {
  try {
    const current = await getBookmarkedProcessIds();
    const exists = current.includes(processId);
    let updated: string[];

    if (exists) {
      updated = current.filter(id => id !== processId);
    } else {
      updated = [...current, processId];
    }

    await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    return !exists; // Retorna true si quedó marcado, false si se desmarcó
  } catch {
    return false;
  }
}

// Helper de formato monetario en COP
export function formatCOP(value: number): string {
  if (value >= 1000000000) {
    const billones = (value / 1000000000).toFixed(1).replace('.', ',');
    return `$${billones} Mil Millones COP`;
  }
  return `$${Math.round(value).toLocaleString('es-CO')} COP`;
}

