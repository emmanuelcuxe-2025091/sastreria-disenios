import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_ENVIRONMENT } from '../../core/config/catalog.tokens';
import { CatalogStateService } from '../../core/services/catalog-state.service';
import { GarmentCardComponent } from '../../shared/components/garment-card/garment-card';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, GarmentCardComponent, SectionHeaderComponent],
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
}
