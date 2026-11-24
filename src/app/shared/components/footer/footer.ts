import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_ENVIRONMENT } from '../../../core/config/catalog.tokens';
import { CatalogStateService } from '../../../core/services/catalog-state.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  protected readonly env = inject(APP_ENVIRONMENT);
  protected readonly catalog = inject(CatalogStateService);
  protected readonly currentYear = new Date().getFullYear();
}
