import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CATALOG_REPOSITORY } from '../config/catalog.tokens';
import { CATALOG_CATEGORIES, CATALOG_ERAS, CRAFTSMANSHIP_PILLARS } from '../data/catalog.data';
import {
  CatalogFilter,
  CatalogSortOption,
  CategoryMeta,
  CompanyMilestone,
  CreateGarmentInput,
  CustomSpecItem,
  Garment,
  GarmentCategory,
  GarmentEra,
  GarmentSection,
} from '../models/catalog.models';

const STORAGE_KEY = 'expert_custom_garments_v1';
const EDITED_GARMENTS_KEY = 'expert_edited_garments_v1';
const CUSTOM_CATEGORIES_KEY = 'expert_custom_categories_v1';
const DELETED_CATEGORIES_KEY = 'expert_deleted_categories_v1';
const CUSTOM_SUBTITLES_KEY = 'expert_custom_subtitles_v1';
const DELETED_SUBTITLES_KEY = 'expert_deleted_subtitles_v1';

const DEFAULT_SPEC_SUBTITLES: readonly string[] = [
  'Tejido principal',
  'Forro y acabados',
  'Estructura interna',
  'Dedicación artesanal',
  'Ocasión recomendada',
  'Color y tono',
  'Corte y silueta',
  'Botones y detalles',
  'Cuidados de la prenda',
];

const SPANISH_MONTHS: readonly string[] = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const DEFAULT_FILTER: CatalogFilter = {
  section: 'opciones',
  search: '',
  categories: [],
  era: 'all',
  sort: 'recent',
};

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function slugify(value: string): string {
  const base = normalizeText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || 'prenda';
}

function resolveEra(year: number): GarmentEra {
  if (year <= 2005) return '1998-2005';
  if (year <= 2015) return '2006-2015';
  if (year <= 2021) return '2016-2021';
  return '2022-2026';
}

function formatMonthYear(month: number, year: number): string {
  const monthName = SPANISH_MONTHS[month - 1] ?? '';
  return monthName ? `${monthName} ${year}` : String(year);
}

@Injectable({ providedIn: 'root' })
export class CatalogStateService {
  private readonly repository = inject(CATALOG_REPOSITORY);

  readonly eras = CATALOG_ERAS;
  readonly pillars = CRAFTSMANSHIP_PILLARS;
  readonly months = SPANISH_MONTHS;

  private readonly _categories = signal<readonly CategoryMeta[]>(this.loadInitialCategories());
  private readonly _specSubtitles = signal<readonly string[]>(this.loadInitialSubtitles());
  private readonly _garments = signal<readonly Garment[]>([]);
  private readonly _milestones = signal<readonly CompanyMilestone[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _loaded = signal<boolean>(false);
  private readonly _filter = signal<CatalogFilter>(DEFAULT_FILTER);

  readonly categories = this._categories.asReadonly();
  readonly specSubtitles = this._specSubtitles.asReadonly();
  readonly garments = this._garments.asReadonly();
  readonly milestones = this._milestones.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly filter = this._filter.asReadonly();
  readonly dataSource = this.repository.sourceName;

  readonly sectionCounts = computed(() => {
    let opciones = 0;
    let creadas = 0;
    for (const garment of this._garments()) {
      if (garment.section === 'opciones') opciones++;
      else creadas++;
    }
    return { opciones, creadas };
  });

  readonly sectionGarments = computed(() => {
    const activeSection = this._filter().section;
    return this._garments().filter((garment) => garment.section === activeSection);
  });

  readonly totalSectionGarments = computed(() => this.sectionGarments().length);

  readonly featuredGarments = computed(() =>
    this.sectionGarments()
      .filter((garment) => garment.featured)
      .slice(0, 6),
  );

  readonly filteredGarments = computed(() => {
    const { search, categories, era, sort } = this._filter();
    const query = normalizeText(search);

    const matching = this.sectionGarments().filter((garment) => {
      if (categories.length > 0 && !categories.includes(garment.category)) {
        return false;
      }
      if (era !== 'all' && garment.era !== era) {
        return false;
      }
      if (!query) {
        return true;
      }

      const searchable = normalizeText(
        [
          garment.name,
          garment.subtitle,
          garment.code,
          garment.collection,
          garment.summary,
          garment.createdDateLabel ?? '',
          garment.specs.fabric,
          garment.specs.occasion,
          String(garment.year),
          ...(garment.customSpecs?.flatMap((spec) => [spec.subtitle, spec.description]) ?? []),
        ].join(' '),
      );

      return searchable.includes(query);
    });

    return [...matching].sort((a, b) => {
      switch (sort) {
        case 'archive':
          return a.year - b.year || a.name.localeCompare(b.name, 'es');
        case 'name-asc':
          return a.name.localeCompare(b.name, 'es');
        case 'recent':
        default:
          return b.year - a.year || a.name.localeCompare(b.name, 'es');
      }
    });
  });

  readonly activeFilterCount = computed(() => {
    const f = this._filter();
    let count = f.categories.length;
    if (f.search.trim().length > 0) count++;
    if (f.era !== 'all') count++;
    return count;
  });

  readonly categoryCounts = computed(() => {
    const counts = new Map<GarmentCategory, number>();
    for (const category of this._categories()) {
      counts.set(category.id, 0);
    }
    for (const garment of this.sectionGarments()) {
      counts.set(garment.category, (counts.get(garment.category) ?? 0) + 1);
    }
    return counts;
  });

  readonly totalGarments = computed(() => this._garments().length);

  async ensureLoaded(): Promise<void> {
    if (this._loaded() || this._loading()) {
      return;
    }

    this._loading.set(true);
    try {
      const [garments, milestones] = await Promise.all([
        firstValueFrom(this.repository.getGarments()),
        firstValueFrom(this.repository.getMilestones()),
      ]);
      const storedCustom = this.readStorageArray<Garment>(STORAGE_KEY);
      const editedMap = this.readEditedMap();
      const existingIds = new Set(garments.map((item) => item.id));
      const uniqueCustom = storedCustom.filter((item) => !existingIds.has(item.id));
      const merged = [...uniqueCustom, ...garments].map((item) => editedMap[item.id] ?? item);

      this._garments.set(merged);
      this._milestones.set(milestones);
      this._loaded.set(true);
    } finally {
      this._loading.set(false);
    }
  }

  addCategory(rawLabel: string): CategoryMeta | null {
    const label = rawLabel.trim();
    if (!label) return null;

    const id = slugify(label);
    const normalized = normalizeText(label);
    const existing = this._categories().find(
      (cat) => normalizeText(cat.label) === normalized || cat.id === id,
    );
    if (existing) {
      return existing;
    }

    // If it was previously deleted, remove from deleted list
    const deleted = this.readStorageArray<string>(DELETED_CATEGORIES_KEY).filter((d) => d !== id);
    this.writeStorageArray(DELETED_CATEGORIES_KEY, deleted);

    const created: CategoryMeta = {
      id,
      label,
      shortLabel: label,
      description: `Prendas de la categoría ${label}.`,
    };

    this._categories.update((current) => [...current, created]);
    const stored = this.readStorageArray<CategoryMeta>(CUSTOM_CATEGORIES_KEY).filter(
      (c) => c.id !== id,
    );
    this.writeStorageArray(CUSTOM_CATEGORIES_KEY, [...stored, created]);
    return created;
  }

  removeCategory(categoryId: GarmentCategory): boolean {
    if (this._categories().length <= 1) {
      return false;
    }

    const exists = this._categories().some((cat) => cat.id === categoryId);
    if (!exists) {
      return false;
    }

    this._categories.update((current) => current.filter((cat) => cat.id !== categoryId));
    this._filter.update((current) => ({
      ...current,
      categories: current.categories.filter((id) => id !== categoryId),
    }));

    const storedCustom = this.readStorageArray<CategoryMeta>(CUSTOM_CATEGORIES_KEY).filter(
      (cat) => cat.id !== categoryId,
    );
    this.writeStorageArray(CUSTOM_CATEGORIES_KEY, storedCustom);

    const deleted = this.readStorageArray<string>(DELETED_CATEGORIES_KEY);
    if (!deleted.includes(categoryId)) {
      this.writeStorageArray(DELETED_CATEGORIES_KEY, [...deleted, categoryId]);
    }

    return true;
  }

  addSpecSubtitle(rawSubtitle: string): string | null {
    const subtitle = rawSubtitle.trim();
    if (!subtitle) return null;

    const normalized = normalizeText(subtitle);
    const existing = this._specSubtitles().find((item) => normalizeText(item) === normalized);
    if (existing) {
      return existing;
    }

    const deleted = this.readStorageArray<string>(DELETED_SUBTITLES_KEY).filter(
      (item) => normalizeText(item) !== normalized,
    );
    this.writeStorageArray(DELETED_SUBTITLES_KEY, deleted);

    this._specSubtitles.update((current) => [...current, subtitle]);
    const stored = this.readStorageArray<string>(CUSTOM_SUBTITLES_KEY).filter(
      (item) => normalizeText(item) !== normalized,
    );
    this.writeStorageArray(CUSTOM_SUBTITLES_KEY, [...stored, subtitle]);
    return subtitle;
  }

  removeSpecSubtitle(rawSubtitle: string): boolean {
    if (this._specSubtitles().length <= 1) {
      return false;
    }

    const normalized = normalizeText(rawSubtitle);
    const target = this._specSubtitles().find((item) => normalizeText(item) === normalized);
    if (!target) {
      return false;
    }

    this._specSubtitles.update((current) =>
      current.filter((item) => normalizeText(item) !== normalized),
    );

    const storedCustom = this.readStorageArray<string>(CUSTOM_SUBTITLES_KEY).filter(
      (item) => normalizeText(item) !== normalized,
    );
    this.writeStorageArray(CUSTOM_SUBTITLES_KEY, storedCustom);

    const deleted = this.readStorageArray<string>(DELETED_SUBTITLES_KEY);
    if (!deleted.some((item) => normalizeText(item) === normalized)) {
      this.writeStorageArray(DELETED_SUBTITLES_KEY, [...deleted, target]);
    }

    return true;
  }

  addGarment(input: CreateGarmentInput): Garment {
    const title = input.title.trim();
    const description = input.description.trim();
    const timestamp = Date.now();
    const sequence = String(this._garments().length + 1).padStart(2, '0');
    const prefix = input.section === 'opciones' ? 'OP' : 'EX';
    const createdDateLabel = formatMonthYear(input.month, input.year);
    const isOption = input.section === 'opciones';

    const cleanedSpecs = this.cleanSpecs(input.customSpecs);
    const galleryImages = this.buildImages(input.images, title, createdDateLabel);

    const garment: Garment = {
      id: `custom-${input.section}-${timestamp}`,
      code: `${prefix}-${input.year}-${sequence}`,
      slug: `${slugify(title)}-${timestamp.toString(36)}`,
      section: input.section,
      name: title,
      subtitle: description,
      category: input.category,
      collection: isOption ? 'Opciones de Referencia' : 'Prendas Creadas',
      year: input.year,
      createdDateLabel,
      era: resolveEra(input.year),
      featured: false,
      summary: description,
      story: '',
      techniques: [],
      specs: {
        fabric: cleanedSpecs[0]?.description ?? (isOption ? 'Referencia a medida' : 'Confección a medida'),
        lining: '',
        construction: '',
        craftingHours: 0,
        fittings: 0,
        occasion: '',
      },
      customSpecs: cleanedSpecs,
      images: galleryImages,
    };

    this._garments.update((current) => [garment, ...current]);
    const existing = this.readStorageArray<Garment>(STORAGE_KEY);
    this.writeStorageArray(STORAGE_KEY, [garment, ...existing]);
    this._filter.set({
      ...DEFAULT_FILTER,
      section: input.section,
    });

    return garment;
  }

  updateGarment(garmentId: string, input: CreateGarmentInput): Garment | null {
    const current = this._garments().find((item) => item.id === garmentId);
    if (!current) {
      return null;
    }

    const title = input.title.trim();
    const description = input.description.trim();
    const createdDateLabel = formatMonthYear(input.month, input.year);
    const isOption = input.section === 'opciones';
    const cleanedSpecs = this.cleanSpecs(input.customSpecs);
    const galleryImages = this.buildImages(input.images, title, createdDateLabel);

    const updated: Garment = {
      ...current,
      section: input.section,
      category: input.category,
      name: title,
      subtitle: description,
      summary: description,
      collection: isOption ? 'Opciones de Referencia' : 'Prendas Creadas',
      year: input.year,
      createdDateLabel,
      era: resolveEra(input.year),
      specs: {
        ...current.specs,
        fabric: cleanedSpecs[0]?.description ?? current.specs.fabric,
      },
      customSpecs: cleanedSpecs,
      images: galleryImages,
    };

    this._garments.update((list) =>
      list.map((item) => (item.id === garmentId ? updated : item)),
    );

    const customList = this.readStorageArray<Garment>(STORAGE_KEY);
    if (customList.some((item) => item.id === garmentId)) {
      this.writeStorageArray(
        STORAGE_KEY,
        customList.map((item) => (item.id === garmentId ? updated : item)),
      );
    } else {
      const editedMap = this.readEditedMap();
      editedMap[garmentId] = updated;
      this.writeEditedMap(editedMap);
    }

    this._filter.update((filter) => ({
      ...filter,
      section: input.section,
    }));

    return updated;
  }

  extractSpecRows(garment: Garment): readonly CustomSpecItem[] {
    if (garment.customSpecs !== undefined) {
      return garment.customSpecs;
    }

    return [
      { subtitle: 'Tejido principal', description: garment.specs.fabric },
      { subtitle: 'Forro y acabados', description: garment.specs.lining },
      { subtitle: 'Estructura interna', description: garment.specs.construction },
      {
        subtitle: 'Dedicación artesanal',
        description: `${garment.specs.craftingHours} horas · ${garment.specs.fittings} pruebas de ajuste`,
      },
      { subtitle: 'Ocasión recomendada', description: garment.specs.occasion },
    ];
  }

  extractMonth(garment: Garment): number {
    if (garment.createdDateLabel) {
      const firstWord = normalizeText(garment.createdDateLabel.split(' ')[0] ?? '');
      const idx = SPANISH_MONTHS.findIndex((m) => normalizeText(m) === firstWord);
      if (idx >= 0) {
        return idx + 1;
      }
    }
    return 1;
  }

  getGarmentBySlug(slug: string): Garment | null {
    return this._garments().find((garment) => garment.slug === slug) ?? null;
  }

  getRelatedGarments(garment: Garment, limit = 3): readonly Garment[] {
    const pool = this._garments().filter(
      (item) => item.slug !== garment.slug && item.section === garment.section,
    );
    const sameCategory = pool.filter((item) => item.category === garment.category);
    const others = pool.filter((item) => item.category !== garment.category);
    return [...sameCategory, ...others].slice(0, limit);
  }

  getCategoryLabel(categoryId: GarmentCategory): string {
    return this._categories().find((cat) => cat.id === categoryId)?.label ?? categoryId;
  }

  setSection(section: GarmentSection): void {
    this._filter.update((current) => ({ ...current, section, categories: [] }));
  }

  setSearch(search: string): void {
    this._filter.update((current) => ({ ...current, search }));
  }

  toggleCategory(category: GarmentCategory): void {
    this._filter.update((current) => {
      const exists = current.categories.includes(category);
      const categories = exists
        ? current.categories.filter((item) => item !== category)
        : [...current.categories, category];
      return { ...current, categories };
    });
  }

  clearCategories(): void {
    this._filter.update((current) => ({ ...current, categories: [] }));
  }

  isCategorySelected(category: GarmentCategory): boolean {
    return this._filter().categories.includes(category);
  }

  setEra(era: GarmentEra | 'all'): void {
    this._filter.update((current) => ({ ...current, era }));
  }

  setSort(sort: CatalogSortOption): void {
    this._filter.update((current) => ({ ...current, sort }));
  }

  patchFilter(partial: Partial<CatalogFilter>): void {
    this._filter.update((current) => ({ ...current, ...partial }));
  }

  resetFilters(): void {
    this._filter.update((current) => ({
      ...DEFAULT_FILTER,
      section: current.section,
    }));
  }

  private cleanSpecs(specs: readonly CustomSpecItem[]): readonly CustomSpecItem[] {
    return specs
      .map((spec) => ({
        subtitle: spec.subtitle.trim(),
        description: spec.description.trim(),
      }))
      .filter((spec) => spec.subtitle.length > 0 && spec.description.length > 0);
  }

  private buildImages(images: readonly string[], title: string, createdDateLabel: string) {
    return images.slice(0, 10).map((url, idx) => ({
      url,
      alt: `${title} — fotografía ${idx + 1}`,
      caption: `${title} — ${createdDateLabel}`,
      isPrimary: idx === 0,
    }));
  }

  private loadInitialCategories(): readonly CategoryMeta[] {
    const custom = this.readStorageArray<CategoryMeta>(CUSTOM_CATEGORIES_KEY);
    const deleted = new Set(this.readStorageArray<string>(DELETED_CATEGORIES_KEY));
    const ids = new Set(CATALOG_CATEGORIES.map((c) => c.id));
    const merged = [
      ...CATALOG_CATEGORIES,
      ...custom.filter((c) => c?.id && c?.label && !ids.has(c.id)),
    ];
    const active = merged.filter((cat) => !deleted.has(cat.id));
    return active.length > 0 ? active : CATALOG_CATEGORIES;
  }

  private loadInitialSubtitles(): readonly string[] {
    const custom = this.readStorageArray<string>(CUSTOM_SUBTITLES_KEY);
    const deleted = new Set(this.readStorageArray<string>(DELETED_SUBTITLES_KEY).map(normalizeText));
    const seen = new Set(DEFAULT_SPEC_SUBTITLES.map(normalizeText));
    const extras = custom.filter(
      (s) => typeof s === 'string' && s.trim() && !seen.has(normalizeText(s)),
    );
    const active = [...DEFAULT_SPEC_SUBTITLES, ...extras].filter(
      (item) => !deleted.has(normalizeText(item)),
    );
    return active.length > 0 ? active : DEFAULT_SPEC_SUBTITLES;
  }

  private readEditedMap(): Record<string, Garment> {
    try {
      if (typeof localStorage === 'undefined') return {};
      const raw = localStorage.getItem(EDITED_GARMENTS_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? (parsed as Record<string, Garment>) : {};
    } catch {
      return {};
    }
  }

  private writeEditedMap(map: Record<string, Garment>): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(EDITED_GARMENTS_KEY, JSON.stringify(map));
    } catch {
      // Ignore quota errors cleanly
    }
  }

  private readStorageArray<T>(key: string): readonly T[] {
    try {
      if (typeof localStorage === 'undefined') return [];
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }

  private writeStorageArray<T>(key: string, items: readonly T[]): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(key, JSON.stringify(items));
    } catch {
      // Ignore quota / privacy mode errors while preserving in-memory state
    }
  }
}
