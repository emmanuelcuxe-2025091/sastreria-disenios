import { TestBed } from '@angular/core/testing';
import { CATALOG_REPOSITORY } from '../config/catalog.tokens';
import { LocalCatalogRepository } from '../repositories/local-catalog.repository';
import { CatalogStateService } from './catalog-state.service';

describe('CatalogStateService', () => {
  let service: CatalogStateService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        CatalogStateService,
        { provide: CATALOG_REPOSITORY, useClass: LocalCatalogRepository },
      ],
    });
    service = TestBed.inject(CatalogStateService);
    await service.ensureLoaded();
  });

  it('loads the curated archive garments and company milestones', () => {
    expect(service.totalGarments()).toBeGreaterThanOrEqual(9);
    expect(service.milestones().length).toBeGreaterThanOrEqual(5);
    expect(service.featuredGarments().length).toBeGreaterThan(0);
  });

  it('supports selecting and toggling multiple garment categories simultaneously', () => {
    service.toggleCategory('gala-y-etiqueta');
    service.toggleCategory('abrigos-y-capas');

    const results = service.filteredGarments();
    expect(results.length).toBe(3);
    expect(
      results.every(
        (item) => item.category === 'gala-y-etiqueta' || item.category === 'abrigos-y-capas',
      ),
    ).toBe(true);
    expect(service.activeFilterCount()).toBe(2);

    service.toggleCategory('abrigos-y-capas');
    expect(service.filteredGarments().every((item) => item.category === 'gala-y-etiqueta')).toBe(
      true,
    );
    expect(service.activeFilterCount()).toBe(1);

    service.clearCategories();
    expect(service.activeFilterCount()).toBe(0);
    expect(service.filteredGarments().length).toBe(service.totalGarments());
  });

  it('supports accent-insensitive search across fabric and name', () => {
    service.setSearch('borgona');

    const results = service.filteredGarments();
    expect(results.length).toBe(1);
    expect(results[0].slug).toBe('vestido-gala-terciopelo-borgona');
  });

  it('sorts chronologically from oldest to newest when archive sort is selected', () => {
    service.setSort('archive');

    const years = service.filteredGarments().map((item) => item.year);
    const sortedYears = [...years].sort((a, b) => a - b);
    expect(years).toEqual(sortedYears);
  });

  it('resets all active filters cleanly', () => {
    service.patchFilter({
      search: 'lino',
      categories: ['trajes-a-medida', 'camiseria-artesanal'],
      era: '2016-2021',
    });
    expect(service.activeFilterCount()).toBe(4);

    service.resetFilters();
    expect(service.activeFilterCount()).toBe(0);
    expect(service.filteredGarments().length).toBe(service.totalGarments());
  });

  it('returns related garments excluding the current garment', () => {
    const garment = service.getGarmentBySlug('traje-cruzado-azul-medianoche');
    expect(garment).not.toBeNull();

    const related = service.getRelatedGarments(garment!, 3);
    expect(related.length).toBe(3);
    expect(related.some((item) => item.slug === garment!.slug)).toBe(false);
  });
});
