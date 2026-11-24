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

  it('filters garments by category and updates active filter count', () => {
    service.setCategory('gala-y-etiqueta');

    const results = service.filteredGarments();
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((item) => item.category === 'gala-y-etiqueta')).toBe(true);
    expect(service.activeFilterCount()).toBe(1);
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
      category: 'trajes-a-medida',
      era: '2016-2021',
    });
    expect(service.activeFilterCount()).toBe(3);

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
