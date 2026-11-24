import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_ENVIRONMENT } from '../../core/config/catalog.tokens';
import { CatalogStateService } from '../../core/services/catalog-state.service';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';

@Component({
  selector: 'app-heritage-page',
  imports: [RouterLink, SectionHeaderComponent],
  templateUrl: './heritage-page.html',
  styleUrl: './heritage-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeritagePageComponent implements OnInit {
  protected readonly catalog = inject(CatalogStateService);
  protected readonly env = inject(APP_ENVIRONMENT);

  ngOnInit(): void {
    void this.catalog.ensureLoaded();
  }
}
