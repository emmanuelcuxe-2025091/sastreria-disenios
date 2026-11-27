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

  it('requires image, title, description, date, and mandatory Ficha de Confección', () => {
    const fixture = TestBed.createComponent(AddGarmentPageComponent);
    const component = fixture.componentInstance as unknown as {
      form: { invalid: boolean; controls: Record<string, { invalid: boolean }> };
      specsArray: { length: number; at(i: number): { invalid: boolean } };
      showMissingImagesError(): boolean;
      onSubmit(): void;
    };

    fixture.detectChanges();
    expect(component.specsArray.length).toBe(1);

    component.onSubmit();
    expect(component.form.invalid).toBe(true);
    expect(component.showMissingImagesError()).toBe(true);
    expect(component.specsArray.at(0).invalid).toBe(true);
  });

  it('allows adding custom category filters, custom subtitles, and choosing the primary photo', () => {
    const fixture = TestBed.createComponent(AddGarmentPageComponent);
    const catalog = TestBed.inject(CatalogStateService);
    const initialCategories = catalog.categories().length;

    const component = fixture.componentInstance as unknown as {
      form: { patchValue(v: Record<string, unknown>): void; valid: boolean };
      specsArray: { length: number; at(i: number): { patchValue(v: Record<string, string>): void } };
      uploadedImages: { set(v: readonly { dataUrl: string; name: string }[]): void };
      newCategoryDraft: { set(v: string): void };
      newSubtitleDraft: { set(v: string): void };
      confirmAddCategory(): void;
      confirmAddSubtitle(rowIndex: number): void;
      setPrimaryImage(index: number): void;
      selectSection(section: 'opciones' | 'creadas'): void;
      onSubmit(): void;
    };

    fixture.detectChanges();
    component.selectSection('creadas');

    // Add a new garment type filter
    component.newCategoryDraft.set('Chalecos');
    component.confirmAddCategory();
    expect(catalog.categories().length).toBe(initialCategories + 1);

    // Add a custom subtitle for row 0
    component.newSubtitleDraft.set('Bordado artesanal');
    component.confirmAddSubtitle(0);
    component.specsArray.at(0).patchValue({
      description: 'Iniciales bordadas en hilo de seda',
    });

    // Upload 2 photos and choose the 2nd photo as primary
    component.uploadedImages.set([
      { dataUrl: 'data:image/png;base64,FIRST=', name: 'foto1.png' },
      { dataUrl: 'data:image/png;base64,SECOND=', name: 'foto2.png' },
    ]);
    component.setPrimaryImage(1);

    component.form.patchValue({
      title: 'Chaleco Cruzado Gris',
      description: 'Chaleco a medida en lana inglesa con espalda en seda.',
      month: '11',
      year: '2026',
    });

    expect(component.form.valid).toBe(true);
    component.onSubmit();

    const created = catalog.filteredGarments()[0];
    expect(created.category).toBe('chalecos');
    expect(created.images[0].url).toBe('data:image/png;base64,SECOND=');
    expect(created.images[0].isPrimary).toBe(true);
    expect(created.customSpecs?.[0]).toEqual({
      subtitle: 'Bordado artesanal',
      description: 'Iniciales bordadas en hilo de seda',
    });
  });
});
