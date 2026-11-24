export type GarmentCategory =
  | 'trajes-a-medida'
  | 'gala-y-etiqueta'
  | 'sastreria-femenina'
  | 'abrigos-y-capas'
  | 'camiseria-artesanal'
  | 'vestuario-corporativo';

export type GarmentEra = '1998-2005' | '2006-2015' | '2016-2021' | '2022-2026';

export type CatalogSortOption = 'recent' | 'archive' | 'name-asc';

export interface GarmentImage {
  readonly url: string;
  readonly alt: string;
  readonly caption?: string;
  readonly isPrimary: boolean;
}

export interface TailoringSpec {
  readonly fabric: string;
  readonly lining: string;
  readonly construction: string;
  readonly craftingHours: number;
  readonly fittings: number;
  readonly occasion: string;
}

export interface Garment {
  readonly id: string;
  readonly code: string;
  readonly slug: string;
  readonly name: string;
  readonly subtitle: string;
  readonly category: GarmentCategory;
  readonly collection: string;
  readonly year: number;
  readonly era: GarmentEra;
  readonly featured: boolean;
  readonly summary: string;
  readonly story: string;
  readonly techniques: readonly string[];
  readonly specs: TailoringSpec;
  readonly images: readonly GarmentImage[];
}

export interface CategoryMeta {
  readonly id: GarmentCategory;
  readonly label: string;
  readonly shortLabel: string;
  readonly description: string;
}

export interface EraMeta {
  readonly id: GarmentEra;
  readonly label: string;
  readonly subtitle: string;
}

export interface CompanyMilestone {
  readonly id: string;
  readonly year: string;
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly highlightMetric: string;
  readonly signatureGarmentSlug?: string;
}

export interface CatalogFilter {
  readonly search: string;
  readonly categories: readonly GarmentCategory[];
  readonly era: GarmentEra | 'all';
  readonly sort: CatalogSortOption;
}

export interface CraftsmanshipPillar {
  readonly step: string;
  readonly title: string;
  readonly description: string;
  readonly metric: string;
}
