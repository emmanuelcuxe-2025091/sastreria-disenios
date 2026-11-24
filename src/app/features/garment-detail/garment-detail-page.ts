import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { APP_ENVIRONMENT } from '../../core/config/catalog.tokens';
import { CatalogStateService } from '../../core/services/catalog-state.service';
import { GarmentCardComponent } from '../../shared/components/garment-card/garment-card';

@Component({
  selector: 'app-garment-detail-page',
  imports: [RouterLink, GarmentCardComponent],
  templateUrl: './garment-detail-page.html',
  styleUrl: './garment-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GarmentDetailPageComponent implements OnInit {
  private readonly title = inject(Title);
  protected readonly catalog = inject(CatalogStateService);
  protected readonly env = inject(APP_ENVIRONMENT);

  readonly slug = input.required<string>();
  protected readonly selectedImageIndex = signal(0);

  protected readonly garment = computed(() => this.catalog.getGarmentBySlug(this.slug()));

  protected readonly activeImage = computed(() => {
    const item = this.garment();
    if (!item || item.images.length === 0) {
      return null;
    }
    const index = this.selectedImageIndex();
    return item.images[index] ?? item.images[0];
  });

  protected readonly categoryLabel = computed(() => {
    const item = this.garment();
    return item ? this.catalog.getCategoryLabel(item.category) : '';
  });

  protected readonly relatedGarments = computed(() => {
    const item = this.garment();
    return item ? this.catalog.getRelatedGarments(item, 3) : [];
  });

  constructor() {
    effect(() => {
      const current = this.garment();
      this.selectedImageIndex.set(0);
      if (current) {
        this.title.setTitle(`${current.name} (${current.code}) | ${this.env.company.name}`);
      }
    });
  }

  ngOnInit(): void {
    void this.catalog.ensureLoaded();
  }

  protected selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }
}
