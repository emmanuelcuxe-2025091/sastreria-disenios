import { TestBed } from '@angular/core/testing';
import { CATALOG_REPOSITORY } from '../config/catalog.tokens';
import { LocalCatalogRepository } from '../repositories/local-catalog.repository';
import { CatalogStateService } from './catalog-state.service';

describe('CatalogStateService', () => {
  let service: CatalogStateService;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        CatalogStateService,
        { provide: CATALOG_REPOSITORY, useClass: LocalCatalogRepository },
      ],
    });
    service = TestBed.inject(CatalogStateService);
    await service.ensureLoaded();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('loads reference options and created garments in separate sections', () => {
    expect(service.sectionCounts().opciones).toBe(6);
    expect(service.sectionCounts().creadas).toBe(9);
    expect(service.totalGarments()).toBe(15);

    expect(service.filter().section).toBe('opciones');
    expect(service.filteredGarments().every((item) => item.section === 'opciones')).toBe(true);

    service.setSection('creadas');
    expect(service.filteredGarments().length).toBe(9);
    expect(service.filteredGarments().every((item) => item.section === 'creadas')).toBe(true);
  });

  it('supports selecting and toggling multiple garment categories simultaneously', () => {
    service.setSection('creadas');
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
    expect(service.filteredGarments().length).toBe(service.totalSectionGarments());
  });

  it('supports accent-insensitive search across fabric and name', () => {
    service.setSection('creadas');
    service.setSearch('borgona');

    const results = service.filteredGarments();
    expect(results.length).toBe(1);
    expect(results[0].slug).toBe('vestido-gala-terciopelo-borgona');
  });

  it('sorts chronologically from oldest to newest when archive sort is selected', () => {
    service.setSection('creadas');
    service.setSort('archive');

    const years = service.filteredGarments().map((item) => item.year);
    const sortedYears = [...years].sort((a, b) => a - b);
    expect(years).toEqual(sortedYears);
  });

  it('resets active filters while preserving the current section', () => {
    service.setSection('creadas');
    service.patchFilter({
      search: 'lino',
      categories: ['trajes-a-medida', 'camiseria-artesanal'],
      era: '2016-2021',
    });
    expect(service.activeFilterCount()).toBe(4);

    service.resetFilters();
    expect(service.filter().section).toBe('creadas');
    expect(service.activeFilterCount()).toBe(0);
    expect(service.filteredGarments().length).toBe(9);
  });

  it('returns related garments from the same section excluding the current garment', () => {
    const garment = service.getGarmentBySlug('traje-cruzado-azul-medianoche');
    expect(garment).not.toBeNull();

    const related = service.getRelatedGarments(garment!, 3);
    expect(related.length).toBe(3);
    expect(related.every((item) => item.section === garment!.section)).toBe(true);
    expect(related.some((item) => item.slug === garment!.slug)).toBe(false);
  });

  it('adds new garments to opciones and creadas with custom specs and max 10 images', () => {
    const twelveImages = Array.from({ length: 12 }, (_, i) => `data:image/png;base64,IMG${i}`);
    const added = service.addGarment({
      section: 'opciones',
      category: 'sastreria-femenina',
      title: 'Blazer Referencia Expert',
      description: 'Blazer entallado de referencia en lana fría azul marino.',
      month: 5,
      year: 2026,
      images: twelveImages,
      customSpecs: [
        { subtitle: 'Tejido', description: 'Lana fría italiana' },
        { subtitle: 'Forro', description: 'Seda natural' },
      ],
    });

    expect(added.section).toBe('opciones');
    expect(added.createdDateLabel).toBe('Mayo 2026');
    expect(added.images.length).toBe(10);
    expect(added.customSpecs?.length).toBe(2);
    expect(service.sectionCounts().opciones).toBe(7);
    expect(service.getGarmentBySlug(added.slug)?.name).toBe('Blazer Referencia Expert');
  });

  it('adds custom garment categories and spec subtitle options without duplicates', () => {
    const initialCats = service.categories().length;
    const addedCat = service.addCategory('Pantalones a Medida');
    expect(addedCat?.id).toBe('pantalones-a-medida');
    expect(service.categories().length).toBe(initialCats + 1);

    // Deduplicates case/accent-insensitively
    service.addCategory('pantalones a medida');
    expect(service.categories().length).toBe(initialCats + 1);

    const initialSubs = service.specSubtitles().length;
    const addedSub = service.addSpecSubtitle('Tipo de Solapa');
    expect(addedSub).toBe('Tipo de Solapa');
    expect(service.specSubtitles().length).toBe(initialSubs + 1);
  });
});
