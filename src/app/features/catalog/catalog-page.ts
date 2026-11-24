import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CatalogSortOption,
  GarmentCategory,
  GarmentEra,
} from '../../core/models/catalog.models';
import { CatalogStateService } from '../../core/services/catalog-state.service';
import { GarmentCardComponent } from '../../shared/components/garment-card/garment-card';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';

const VALID_CATEGORIES = new Set<string>([
  'trajes-a-medida',
  'gala-y-etiqueta',
  'sastreria-femenina',
  'abrigos-y-capas',
  'camiseria-artesanal',
  'vestuario-corporativo',
]);

const VALID_ERAS = new Set<string>(['1998-2005', '2006-2015', '2016-2021', '2022-2026']);
const VALID_SORTS = new Set<string>(['recent', 'archive', 'name-asc']);

@Component({
  selector: 'app-catalog-page',
  imports: [GarmentCardComponent, SectionHeaderComponent],
  templateUrl: './catalog-page.html',
  styleUrl: './catalog-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPageComponent implements OnInit {
  protected readonly catalog = inject(CatalogStateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    void this.catalog.ensureLoaded();

    const params = this.route.snapshot.queryParamMap;
    const rawCategory = params.get('categoria');
    const rawEra = params.get('epoca');
    const rawSort = params.get('orden');
    const rawSearch = params.get('q') ?? '';

    this.catalog.patchFilter({
      search: rawSearch,
      category:
        rawCategory && VALID_CATEGORIES.has(rawCategory)
          ? (rawCategory as GarmentCategory)
          : 'all',
      era: rawEra && VALID_ERAS.has(rawEra) ? (rawEra as GarmentEra) : 'all',
      sort: rawSort && VALID_SORTS.has(rawSort) ? (rawSort as CatalogSortOption) : 'recent',
    });
  }

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.catalog.setSearch(value);
    this.syncQueryParams();
  }

  protected clearSearch(): void {
    this.catalog.setSearch('');
    this.syncQueryParams();
  }

  protected selectCategory(category: GarmentCategory | 'all'): void {
    this.catalog.setCategory(category);
    this.syncQueryParams();
  }

  protected onEraChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as GarmentEra | 'all';
    this.catalog.setEra(value);
    this.syncQueryParams();
  }

  protected onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as CatalogSortOption;
    this.catalog.setSort(value);
    this.syncQueryParams();
  }

  protected resetFilters(): void {
    this.catalog.resetFilters();
    this.syncQueryParams();
  }

  private syncQueryParams(): void {
    const { search, category, era, sort } = this.catalog.filter();
    void this.router.navigate([], {
      relativeTo: this.route,
      replaceUrl: true,
      queryParams: {
        q: search.trim() || null,
        categoria: category === 'all' ? null : category,
        epoca: era === 'all' ? null : era,
        orden: sort === 'recent' ? null : sort,
      },
    });
  }
}
