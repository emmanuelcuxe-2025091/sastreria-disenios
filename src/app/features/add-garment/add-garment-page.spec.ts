import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CATALOG_REPOSITORY } from '../../core/config/catalog.tokens';
import { LocalCatalogRepository } from '../../core/repositories/local-catalog.repository';
import { CatalogStateService } from '../../core/services/catalog-state.service';
import { AddGarmentPageComponent } from './add-garment-page';

describe('AddGarmentPageComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [AddGarmentPageComponent],
      providers: [
        provideRouter([]),
        { provide: CATALOG_REPOSITORY, useClass: LocalCatalogRepository },
      ],
    }).compileComponents();

    const catalog = TestBed.inject(CatalogStateService);
    await catalog.ensureLoaded();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('requires image, title, description, month, and year for both sections', () => {
    const fixture = TestBed.createComponent(AddGarmentPageComponent);
    const component = fixture.componentInstance as unknown as {
      form: { invalid: boolean; controls: Record<string, { invalid: boolean }> };
      selectSection(section: 'opciones' | 'creadas'): void;
      onSubmit(): void;
    };

    fixture.detectChanges();

    // Opciones de prendas
    component.selectSection('opciones');
    component.onSubmit();
    expect(component.form.invalid).toBe(true);
    expect(component.form.controls['imageDataUrl'].invalid).toBe(true);
    expect(component.form.controls['title'].invalid).toBe(true);
    expect(component.form.controls['description'].invalid).toBe(true);
    expect(component.form.controls['month'].invalid).toBe(true);
    expect(component.form.controls['year'].invalid).toBe(true);

    // Prendas creadas
    component.selectSection('creadas');
    component.onSubmit();
    expect(component.form.invalid).toBe(true);
  });

  it('adds a garment to the selected section when all required fields are valid', () => {
    const fixture = TestBed.createComponent(AddGarmentPageComponent);
    const catalog = TestBed.inject(CatalogStateService);
    const initialCreated = catalog.sectionCounts().creadas;

    const component = fixture.componentInstance as unknown as {
      form: {
        patchValue(v: Record<string, unknown>): void;
        valid: boolean;
      };
      selectSection(section: 'opciones' | 'creadas'): void;
      onSubmit(): void;
    };

    fixture.detectChanges();
    component.selectSection('creadas');
    component.form.patchValue({
      category: 'trajes-a-medida',
      title: 'Traje Azul Personalizado',
      description: 'Traje confeccionado a medida en lana merino con solapa de pico.',
      month: '11',
      year: '2026',
      imageDataUrl: 'data:image/png;base64,iVBORw0KGgo=',
    });

    expect(component.form.valid).toBe(true);
    component.onSubmit();

    expect(catalog.sectionCounts().creadas).toBe(initialCreated + 1);
    expect(catalog.filter().section).toBe('creadas');
    expect(catalog.filteredGarments()[0].name).toBe('Traje Azul Personalizado');
    expect(catalog.filteredGarments()[0].createdDateLabel).toBe('Noviembre 2026');
  });
});
