import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GarmentCategory, GarmentSection } from '../../core/models/catalog.models';
import { CatalogStateService } from '../../core/services/catalog-state.service';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';

const MAX_IMAGES = 10;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

interface UploadedImage {
  readonly dataUrl: string;
  readonly name: string;
}

type SpecRowForm = FormGroup<{
  subtitle: FormControl<string>;
  description: FormControl<string>;
}>;

function requiredTrimmed(control: AbstractControl<string>): ValidationErrors | null {
  return control.value.trim().length > 0 ? null : { required: true };
}

function readAndOptimizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const rawUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!rawUrl) {
        reject(new Error('empty'));
        return;
      }

      if (typeof document === 'undefined' || typeof Image === 'undefined') {
        resolve(rawUrl);
        return;
      }

      const img = new Image();
      img.onload = () => {
        const maxSide = 1200;
        const scale = Math.min(1, maxSide / Math.max(img.width || 1, img.height || 1));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        try {
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        } catch {
          resolve(rawUrl);
        }
      };
      img.onerror = () => resolve(rawUrl);
      img.src = rawUrl;
    };
    reader.onerror = () => reject(new Error('read-error'));
    reader.readAsDataURL(file);
  });
}

@Component({
  selector: 'app-add-garment-page',
  imports: [ReactiveFormsModule, RouterLink, SectionHeaderComponent],
  templateUrl: './add-garment-page.html',
  styleUrl: './add-garment-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddGarmentPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly catalog = inject(CatalogStateService);

  protected readonly maxImages = MAX_IMAGES;
  protected readonly currentYear = new Date().getFullYear();
  protected readonly minYear = 1980;
  protected readonly maxYear = this.currentYear + 1;

  protected readonly years = computed(() => {
    const list: number[] = [];
    for (let y = this.maxYear; y >= this.minYear; y--) {
      list.push(y);
    }
    return list;
  });

  protected readonly selectedSection = signal<GarmentSection>('opciones');
  protected readonly uploadedImages = signal<readonly UploadedImage[]>([]);
  protected readonly primaryImageIndex = signal<number>(0);
  protected readonly imageError = signal<string>('');
  protected readonly submittedAttempt = signal<boolean>(false);

  // Inline creation of new garment type (filter)
  protected readonly addingCategory = signal<boolean>(false);
  protected readonly newCategoryDraft = signal<string>('');
  protected readonly newCategoryError = signal<string>('');

  // Inline creation of new Ficha de Confección subtitle for a specific row
  protected readonly addingSubtitleRow = signal<number | null>(null);
  protected readonly newSubtitleDraft = signal<string>('');
  protected readonly newSubtitleError = signal<string>('');

  protected readonly canAddMoreImages = computed(() => this.uploadedImages().length < MAX_IMAGES);

  protected readonly form = this.fb.group({
    category: this.fb.control<GarmentCategory>('trajes-a-medida', [Validators.required]),
    title: this.fb.control<string>('', [
      requiredTrimmed,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    description: this.fb.control<string>('', [
      requiredTrimmed,
      Validators.minLength(10),
      Validators.maxLength(280),
    ]),
    month: this.fb.control<string>('', [Validators.required]),
    year: this.fb.control<string>('', [
      Validators.required,
      Validators.min(this.minYear),
      Validators.max(this.maxYear),
    ]),
    specs: this.fb.array<SpecRowForm>([]),
  });

  protected get specsArray(): FormArray<SpecRowForm> {
    return this.form.controls.specs;
  }

  protected readonly sectionCopy = computed(() =>
    this.selectedSection() === 'opciones'
      ? {
          eyebrow: 'Nueva Referencia',
          title: 'Agregar opción de prenda',
          description:
            'Registre un modelo de referencia en Opciones de prendas. Suba hasta 10 imágenes, elija la principal y complete la Ficha de Confección obligatoria.',
          submitLabel: 'Guardar opción de prenda',
        }
      : {
          eyebrow: 'Nueva Confección',
          title: 'Agregar prenda creada',
          description:
            'Documente una prenda confeccionada en Prendas creadas. Suba hasta 10 imágenes, elija la principal y complete la Ficha de Confección obligatoria.',
          submitLabel: 'Guardar prenda creada',
        },
  );

  ngOnInit(): void {
    void this.catalog.ensureLoaded();
    const querySection = this.route.snapshot.queryParamMap.get('seccion');
    if (querySection === 'opciones' || querySection === 'creadas') {
      this.selectedSection.set(querySection);
    } else {
      this.selectedSection.set(this.catalog.filter().section);
    }

    // Ficha de Confección is mandatory: start with one required row ready to fill
    if (this.specsArray.length === 0) {
      this.addSpecRow();
    }
  }

  protected selectSection(section: GarmentSection): void {
    this.selectedSection.set(section);
  }

  protected toggleAddCategory(): void {
    const next = !this.addingCategory();
    this.addingCategory.set(next);
    this.newCategoryDraft.set('');
    this.newCategoryError.set('');
  }

  protected onCategoryDraftInput(event: Event): void {
    this.newCategoryDraft.set((event.target as HTMLInputElement).value);
    this.newCategoryError.set('');
  }

  protected confirmAddCategory(): void {
    const label = this.newCategoryDraft().trim();
    if (label.length < 2) {
      this.newCategoryError.set('Ingrese un nombre de al menos 2 caracteres.');
      return;
    }

    const created = this.catalog.addCategory(label);
    if (created) {
      this.form.controls.category.setValue(created.id);
      this.addingCategory.set(false);
      this.newCategoryDraft.set('');
      this.newCategoryError.set('');
    }
  }

  protected toggleAddSubtitle(rowIndex: number): void {
    const isSame = this.addingSubtitleRow() === rowIndex;
    this.addingSubtitleRow.set(isSame ? null : rowIndex);
    this.newSubtitleDraft.set('');
    this.newSubtitleError.set('');
  }

  protected onSubtitleDraftInput(event: Event): void {
    this.newSubtitleDraft.set((event.target as HTMLInputElement).value);
    this.newSubtitleError.set('');
  }

  protected confirmAddSubtitle(rowIndex: number): void {
    const label = this.newSubtitleDraft().trim();
    if (label.length < 2) {
      this.newSubtitleError.set('Ingrese un subtítulo de al menos 2 caracteres.');
      return;
    }

    const created = this.catalog.addSpecSubtitle(label);
    if (created) {
      this.specsArray.at(rowIndex).controls.subtitle.setValue(created);
      this.specsArray.at(rowIndex).controls.subtitle.markAsTouched();
      this.addingSubtitleRow.set(null);
      this.newSubtitleDraft.set('');
      this.newSubtitleError.set('');
    }
  }

  protected async onFilesSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    this.imageError.set('');

    if (files.length === 0) {
      return;
    }

    const remainingSlots = MAX_IMAGES - this.uploadedImages().length;
    if (remainingSlots <= 0) {
      this.imageError.set(`Solo se permite un máximo de ${MAX_IMAGES} imágenes por prenda.`);
      return;
    }

    const warnings: string[] = [];
    let filesToProcess = files;

    if (files.length > remainingSlots) {
      filesToProcess = files.slice(0, remainingSlots);
      warnings.push(
        `Solo se permite un máximo de ${MAX_IMAGES} imágenes por prenda (se cargaron ${remainingSlots}).`,
      );
    }

    const added: UploadedImage[] = [];
    for (const file of filesToProcess) {
      if (!file.type.startsWith('image/')) {
        warnings.push(`"${file.name}" no es una imagen válida.`);
        continue;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        warnings.push(`"${file.name}" supera el límite de 5 MB.`);
        continue;
      }
      try {
        const dataUrl = await readAndOptimizeImage(file);
        added.push({ dataUrl, name: file.name });
      } catch {
        warnings.push(`No se pudo leer "${file.name}".`);
      }
    }

    if (added.length > 0) {
      const wasEmpty = this.uploadedImages().length === 0;
      this.uploadedImages.update((current) => [...current, ...added].slice(0, MAX_IMAGES));
      if (wasEmpty) {
        this.primaryImageIndex.set(0);
      }
    }
    if (warnings.length > 0) {
      this.imageError.set(warnings[0]);
    }
  }

  protected setPrimaryImage(index: number): void {
    if (index >= 0 && index < this.uploadedImages().length) {
      this.primaryImageIndex.set(index);
    }
  }

  protected removeImage(index: number): void {
    const currentPrimary = this.primaryImageIndex();
    this.uploadedImages.update((current) => current.filter((_, idx) => idx !== index));
    const remaining = this.uploadedImages().length;

    if (remaining === 0) {
      this.primaryImageIndex.set(0);
    } else if (index === currentPrimary) {
      this.primaryImageIndex.set(0);
    } else if (index < currentPrimary) {
      this.primaryImageIndex.set(currentPrimary - 1);
    }
    this.imageError.set('');
  }

  protected addSpecRow(): void {
    this.specsArray.push(
      this.fb.group({
        subtitle: this.fb.control<string>('', [requiredTrimmed, Validators.maxLength(80)]),
        description: this.fb.control<string>('', [requiredTrimmed, Validators.maxLength(240)]),
      }),
    );
  }

  protected removeSpecRow(index: number): void {
    if (this.specsArray.length <= 1) {
      return;
    }
    if (this.addingSubtitleRow() === index) {
      this.addingSubtitleRow.set(null);
    }
    this.specsArray.removeAt(index);
  }

  protected showError(controlName: 'category' | 'title' | 'description' | 'month' | 'year'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || this.submittedAttempt());
  }

  protected showSpecError(index: number, field: 'subtitle' | 'description'): boolean {
    const control = this.specsArray.at(index).controls[field];
    return control.invalid && (control.touched || this.submittedAttempt());
  }

  protected showMissingImagesError(): boolean {
    return this.submittedAttempt() && this.uploadedImages().length === 0;
  }

  protected showMissingSpecsError(): boolean {
    return this.submittedAttempt() && this.specsArray.length === 0;
  }

  protected onSubmit(): void {
    this.submittedAttempt.set(true);
    this.form.markAllAsTouched();

    const images = this.uploadedImages();
    if (this.form.invalid || images.length === 0 || this.specsArray.length === 0) {
      return;
    }

    const primaryIdx = Math.min(this.primaryImageIndex(), images.length - 1);
    const orderedImages = [
      images[primaryIdx].dataUrl,
      ...images.filter((_, idx) => idx !== primaryIdx).map((item) => item.dataUrl),
    ];

    const raw = this.form.getRawValue();
    this.catalog.addGarment({
      section: this.selectedSection(),
      category: raw.category,
      title: raw.title,
      description: raw.description,
      month: Number(raw.month),
      year: Number(raw.year),
      images: orderedImages,
      customSpecs: raw.specs.map((row) => ({
        subtitle: row.subtitle,
        description: row.description,
      })),
    });

    void this.router.navigate(['/']);
  }
}
