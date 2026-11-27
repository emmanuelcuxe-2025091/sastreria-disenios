import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CATALOG_REPOSITORY } from '../config/catalog.tokens';
import { CATALOG_CATEGORIES, CATALOG_ERAS, CRAFTSMANSHIP_PILLARS } from '../data/catalog.data';
import {
  CatalogFilter,
  CatalogSortOption,
  CompanyMilestone,
  Garment,
  GarmentCategory,
  GarmentEra,
  GarmentSection,
} from '../models/catalog.models';

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

@Injectable({ providedIn: 'root' })
export class CatalogStateService {
  private readonly repository = inject(CATALOG_REPOSITORY);

  readonly categories = CATALOG_CATEGORIES;
  readonly eras = CATALOG_ERAS;
  readonly pillars = CRAFTSMANSHIP_PILLARS;

  private readonly _garments = signal<readonly Garment[]>([]);
  private readonly _milestones = signal<readonly CompanyMilestone[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _loaded = signal<boolean>(false);
  private readonly _filter = signal<CatalogFilter>(DEFAULT_FILTER);

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
          garment.specs.fabric,
          garment.specs.occasion,
          String(garment.year),
          ...garment.techniques,
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
    for (const category of this.categories) {
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
      this._garments.set(garments);
      this._milestones.set(milestones);
      this._loaded.set(true);
    } finally {
      this._loading.set(false);
    }
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
    return this.categories.find((cat) => cat.id === categoryId)?.label ?? categoryId;
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
}
