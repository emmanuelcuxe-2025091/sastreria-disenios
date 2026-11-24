import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Garment } from '../../../core/models/catalog.models';
import { CatalogStateService } from '../../../core/services/catalog-state.service';

@Component({
  selector: 'app-garment-card',
  imports: [RouterLink],
  templateUrl: './garment-card.html',
  styleUrl: './garment-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GarmentCardComponent {
  private readonly catalog = inject(CatalogStateService);

  readonly garment = input.required<Garment>();
  readonly priority = input<boolean>(false);

  protected readonly primaryImage = computed(() => {
    const images = this.garment().images;
    return images.find((img) => img.isPrimary) ?? images[0];
  });

  protected readonly categoryLabel = computed(() =>
    this.catalog.getCategoryLabel(this.garment().category),
  );
}
