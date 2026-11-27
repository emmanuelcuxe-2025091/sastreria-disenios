import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GarmentCategory, GarmentSection } from '../../core/models/catalog.models';
import { CatalogStateService } from '../../core/services/catalog-state.service';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

function requiredTrimmed(control: AbstractControl<string>): ValidationErrors | null {
  return control.value.trim().length > 0 ? null : { required: true };
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
  protected readonly imagePreview = signal<string | null>(null);
  protected readonly imageFileName = signal<string>('');
  protected readonly imageError = signal<string>('');
  protected readonly submittedAttempt = signal<boolean>(false);

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
    imageDataUrl: this.fb.control<string>('', [Validators.required]),
  });

  protected readonly sectionCopy = computed(() =>
    this.selectedSection() === 'opciones'
      ? {
          eyebrow: 'Nueva Referencia',
          title: 'Agregar opción de prenda',
          description:
            'Registre un modelo de referencia en el apartado de Opciones de prendas. Todos los campos son obligatorios.',
          submitLabel: 'Guardar opción de prenda',
        }
      : {
          eyebrow: 'Nueva Confección',
          title: 'Agregar prenda creada',
          description:
            'Documente una prenda confeccionada en el apartado de Prendas creadas. Todos los campos son obligatorios.',
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
  }

  protected selectSection(section: GarmentSection): void {
    this.selectedSection.set(section);
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.imageError.set('');

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.imageError.set('Seleccione un archivo de imagen válido (JPG, PNG o WebP).');
      input.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      this.imageError.set('La imagen supera el tamaño máximo permitido de 5 MB.');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) {
        this.imageError.set('No se pudo leer la imagen seleccionada.');
        return;
      }
      this.imagePreview.set(result);
      this.imageFileName.set(file.name);
      this.form.controls.imageDataUrl.setValue(result);
      this.form.controls.imageDataUrl.markAsTouched();
    };
    reader.onerror = () => {
      this.imageError.set('Ocurrió un error al cargar la imagen.');
    };
    reader.readAsDataURL(file);
  }

  protected removeImage(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    this.imagePreview.set(null);
    this.imageFileName.set('');
    this.imageError.set('');
    this.form.controls.imageDataUrl.setValue('');
    this.form.controls.imageDataUrl.markAsTouched();
  }

  protected showError(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || this.submittedAttempt());
  }

  protected onSubmit(): void {
    this.submittedAttempt.set(true);
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const raw = this.form.getRawValue();
    this.catalog.addGarment({
      section: this.selectedSection(),
      category: raw.category,
      title: raw.title,
      description: raw.description,
      month: Number(raw.month),
      year: Number(raw.year),
      imageDataUrl: raw.imageDataUrl,
    });

    void this.router.navigate(['/']);
  }
}
