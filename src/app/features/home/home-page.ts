import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { GarmentCategory, GarmentSection } from '../../core/models/catalog.models';
import { CatalogStateService } from '../../core/services/catalog-state.service';
import { GarmentCardComponent } from '../../shared/components/garment-card/garment-card';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';

@Component({
  selector: 'app-home-page',
  imports: [GarmentCardComponent, SectionHeaderComponent],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {
  protected readonly catalog = inject(CatalogStateService);

  protected readonly activeSection = computed(() => this.catalog.filter().section);

  protected readonly sectionMeta = computed(() =>
    this.activeSection() === 'opciones'
      ? {
          eyebrow: 'Modelos de Referencia',
          title: 'Opciones de prendas',
          description:
            'Explore modelos de referencia disponibles para confeccionar a medida según su preferencia de tejido, corte y acabados.',
        }
      : {
          eyebrow: 'Archivo de Confección',
          title: 'Prendas creadas',
          description:
            'Recorra las prendas elaboradas por nuestra casa a lo largo de su trayectoria, filtrando por tipo de ropa o buscando por tejido y colección.',
        },
  );

  ngOnInit(): void {
    void this.catalog.ensureLoaded();
  }

  protected selectSection(section: GarmentSection): void {
    this.catalog.setSection(section);
  }

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.catalog.setSearch(value);
  }

  protected clearSearch(): void {
    this.catalog.setSearch('');
  }

  protected selectAllCategories(): void {
    this.catalog.clearCategories();
  }

  protected toggleCategory(category: GarmentCategory): void {
    this.catalog.toggleCategory(category);
  }

  protected isAllSelected(): boolean {
    return this.catalog.filter().categories.length === 0;
  }

  protected isCategorySelected(category: GarmentCategory): boolean {
    return this.catalog.isCategorySelected(category);
  }

  protected resetFilters(): void {
    this.catalog.resetFilters();
  }
}
