import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
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
        provideRouter([{ path: '**', component: AddGarmentPageComponent }]),
        { provide: CATALOG_REPOSITORY, useClass: LocalCatalogRepository },
      ],
    }).compileComponents();

    const catalog = TestBed.inject(CatalogStateService);
    await catalog.ensureLoaded();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('requires image, title, description, date, and mandatory Ficha de Confección', async () => {
    const fixture = TestBed.createComponent(AddGarmentPageComponent);
    const component = fixture.componentInstance as unknown as {
      form: { invalid: boolean; controls: Record<string, { invalid: boolean }> };
      specsArray: { length: number; at(i: number): { invalid: boolean } };
      showMissingImagesError(): boolean;
      onSubmit(): void;
    };

    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.specsArray.length).toBe(1);

    component.onSubmit();
    expect(component.form.invalid).toBe(true);
    expect(component.showMissingImagesError()).toBe(true);
    expect(component.specsArray.at(0).invalid).toBe(true);
  });

  it('allows adding/deleting category filters, adding/deleting subtitles, and choosing primary photo', async () => {
    const fixture = TestBed.createComponent(AddGarmentPageComponent);
    const catalog = TestBed.inject(CatalogStateService);
    const initialCategories = catalog.categories().length;

    const component = fixture.componentInstance as unknown as {
      form: {
        patchValue(v: Record<string, unknown>): void;
        valid: boolean;
        controls: { category: { value: string } };
      };
      specsArray: {
        length: number;
        at(i: number): {
          patchValue(v: Record<string, string>): void;
          controls: { subtitle: { value: string } };
        };
      };
      uploadedImages: { set(v: readonly { dataUrl: string; name: string }[]): void };
      newCategoryDraft: { set(v: string): void };
      newSubtitleDraft: { set(v: string): void };
      confirmAddCategory(): void;
      deleteSelectedCategory(): void;
      confirmAddSubtitle(rowIndex: number): void;
      deleteRowSubtitle(rowIndex: number): void;
      confirmPendingDelete(): void;
      cancelPendingDelete(): void;
      pendingDelete(): unknown;
      setPrimaryImage(index: number): void;
      selectSection(section: 'opciones' | 'creadas'): void;
      onSubmit(): void;
    };

    fixture.detectChanges();
    await fixture.whenStable();
    component.selectSection('creadas');

    // Add a garment type filter, cancel deletion (stays), then confirm deletion (removed)
    component.newCategoryDraft.set('Temporal');
    component.confirmAddCategory();
    expect(catalog.categories().length).toBe(initialCategories + 1);
    component.deleteSelectedCategory();
    expect(component.pendingDelete()).not.toBeNull();
    component.cancelPendingDelete();
    expect(catalog.categories().length).toBe(initialCategories + 1);

    component.deleteSelectedCategory();
    component.confirmPendingDelete();
    expect(catalog.categories().length).toBe(initialCategories);

    // Add final category
    component.newCategoryDraft.set('Chalecos');
    component.confirmAddCategory();

    // Add subtitle, require confirmation before deleting, then add final subtitle
    component.newSubtitleDraft.set('Subtitulo Temporal');
    component.confirmAddSubtitle(0);
    component.deleteRowSubtitle(0);
    expect(component.pendingDelete()).not.toBeNull();
    expect(catalog.specSubtitles().includes('Subtitulo Temporal')).toBe(true);
    component.confirmPendingDelete();
    expect(component.specsArray.at(0).controls.subtitle.value).toBe('');
    expect(catalog.specSubtitles().includes('Subtitulo Temporal')).toBe(false);

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

  it('hydrates and updates all options when editing an existing garment', async () => {
    TestBed.resetTestingModule();
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [AddGarmentPageComponent],
      providers: [
        provideRouter([{ path: '**', component: AddGarmentPageComponent }]),
        { provide: CATALOG_REPOSITORY, useClass: LocalCatalogRepository },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ slug: 'traje-cruzado-azul-medianoche' }),
              queryParamMap: convertToParamMap({}),
            },
          },
        },
      ],
    }).compileComponents();

    const catalog = TestBed.inject(CatalogStateService);
    await catalog.ensureLoaded();

    const fixture = TestBed.createComponent(AddGarmentPageComponent);
    const component = fixture.componentInstance as unknown as {
      isEditMode(): boolean;
      form: { patchValue(v: Record<string, unknown>): void; valid: boolean };
      specsArray: { length: number; at(i: number): { patchValue(v: Record<string, string>): void } };
      selectSection(section: 'opciones' | 'creadas'): void;
      onSubmit(): void;
    };

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.isEditMode()).toBe(true);
    expect(component.specsArray.length).toBeGreaterThan(0);

    component.selectSection('opciones');
    component.form.patchValue({
      title: 'Traje Cruzado Editado',
      description: 'Descripción actualizada desde el modo de edición.',
      month: '8',
      year: '2026',
    });
    component.specsArray.at(0).patchValue({
      description: 'Lana Super 180s actualizada',
    });

    expect(component.form.valid).toBe(true);
    component.onSubmit();

    const updated = catalog.getGarmentBySlug('traje-cruzado-azul-medianoche');
    expect(updated?.name).toBe('Traje Cruzado Editado');
    expect(updated?.section).toBe('opciones');
    expect(updated?.createdDateLabel).toBe('Agosto 2026');
    expect(updated?.customSpecs?.[0].description).toBe('Lana Super 180s actualizada');
  });
});
