import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { APP_ENVIRONMENT } from '../../core/config/catalog.tokens';
import { GarmentCategory } from '../../core/models/catalog.models';
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
  protected readonly env = inject(APP_ENVIRONMENT);

  protected readonly yearsInBusiness = new Date().getFullYear() - this.env.company.foundedYear;

  ngOnInit(): void {
    void this.catalog.ensureLoaded();
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
