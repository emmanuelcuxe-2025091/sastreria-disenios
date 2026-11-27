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

  it('requires at least one image, title, description, month, and year for both sections', () => {
    const fixture = TestBed.createComponent(AddGarmentPageComponent);
    const component = fixture.componentInstance as unknown as {
      form: { invalid: boolean; controls: Record<string, { invalid: boolean }> };
      showMissingImagesError(): boolean;
      selectSection(section: 'opciones' | 'creadas'): void;
      onSubmit(): void;
    };

    fixture.detectChanges();

    component.selectSection('opciones');
    component.onSubmit();
    expect(component.form.invalid).toBe(true);
    expect(component.showMissingImagesError()).toBe(true);
    expect(component.form.controls['title'].invalid).toBe(true);
    expect(component.form.controls['description'].invalid).toBe(true);
    expect(component.form.controls['month'].invalid).toBe(true);
    expect(component.form.controls['year'].invalid).toBe(true);

    component.selectSection('creadas');
    component.onSubmit();
    expect(component.form.invalid).toBe(true);
  });

  it('supports adding dynamic Ficha de Confección rows and multiple images up to 10', () => {
    const fixture = TestBed.createComponent(AddGarmentPageComponent);
    const catalog = TestBed.inject(CatalogStateService);
    const initialCreated = catalog.sectionCounts().creadas;

    const component = fixture.componentInstance as unknown as {
      form: {
        patchValue(v: Record<string, unknown>): void;
        valid: boolean;
      };
      specsArray: { length: number; at(i: number): { patchValue(v: Record<string, string>): void } };
      uploadedImages: { set(v: readonly { dataUrl: string; name: string }[]): void };
      addSpecRow(): void;
      removeSpecRow(i: number): void;
      selectSection(section: 'opciones' | 'creadas'): void;
      onSubmit(): void;
    };

    fixture.detectChanges();
    component.selectSection('creadas');
    component.addSpecRow();
    component.addSpecRow();
    expect(component.specsArray.length).toBe(2);

    component.specsArray.at(0).patchValue({
      subtitle: 'Tejido',
      description: 'Lana merino azul marino',
    });
    component.specsArray.at(1).patchValue({
      subtitle: 'Botones',
      description: 'Asta natural pulida',
    });

    component.uploadedImages.set([
      { dataUrl: 'data:image/png;base64,AAA=', name: 'foto1.png' },
      { dataUrl: 'data:image/png;base64,BBB=', name: 'foto2.png' },
    ]);

    component.form.patchValue({
      category: 'trajes-a-medida',
      title: 'Traje Azul Personalizado',
      description: 'Traje confeccionado a medida en lana merino con solapa de pico.',
      month: '11',
      year: '2026',
    });

    expect(component.form.valid).toBe(true);
    component.onSubmit();

    expect(catalog.sectionCounts().creadas).toBe(initialCreated + 1);
    const created = catalog.filteredGarments()[0];
    expect(created.name).toBe('Traje Azul Personalizado');
    expect(created.createdDateLabel).toBe('Noviembre 2026');
    expect(created.images.length).toBe(2);
    expect(created.customSpecs?.length).toBe(2);
    expect(created.customSpecs?.[0]).toEqual({
      subtitle: 'Tejido',
      description: 'Lana merino azul marino',
    });
  });
});
