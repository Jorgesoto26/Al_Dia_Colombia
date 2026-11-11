/**
/**
 * Tipos de datos para el Módulo 4: Licitaciones y Contratación Pública
 * SECOP II / Datos Abiertos (Colombia Compra Eficiente)
 */

export type SecopPhase =
  | 'Presentación de oferta'
  | 'Borrador'
  | 'En evaluación'
  | 'Adjudicado'
  | 'Cerrado';

export type SecopModality =
  | 'Licitación pública'
  | 'Selección abreviada'
  | 'Mínima cuantía'
  | 'Concurso de méritos'
  | 'Contratación directa'
  | 'Subasta inversa';

export type SecopContractType =
  | 'Servicios'
  | 'Obra'
  | 'Suministro'
  | 'Consultoría'
  | 'Tecnología'
  | 'Compraventa'
  | 'Transporte';

export type SecopBudgetTier =
  | 'all'
  | 'under_50m'
  | '50m_200m'
  | '200m_1000m'
  | 'over_1000m';

export interface SecopProcess {
  id: string;
  reference: string;
  entity: string;
  department: string;
  city: string;
  title: string;
  description: string;
  phase: SecopPhase;
  modality: SecopModality;
  contractType: SecopContractType;
  basePrice: number;
  formattedPrice: string;
  duration: string;
  publicationDate: string; // ISO String (ej. 2026-02-15)
  closingDate?: string; // ISO String si está disponible
  url: string;
  isBookmarked?: boolean;
}

export interface SecopFilterParams {
  searchQuery?: string;
  city?: string;
  modality?: SecopModality | 'all';
  contractType?: SecopContractType | 'all';
  budgetTier?: SecopBudgetTier;
  onlyBookmarked?: boolean;
}

export interface SecopSummary {
  totalProcesses: number;
  totalBudget: number;
  formattedTotalBudget: string;
  openProcesses: number;
}

