import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { APP_ENVIRONMENT } from '../config/catalog.tokens';

@Injectable({ providedIn: 'root' })
export class AtelierTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly env = inject(APP_ENVIRONMENT);

  override updateTitle(routerState: RouterStateSnapshot): void {
    const routeTitle = this.buildTitle(routerState);
    if (routeTitle) {
      this.title.setTitle(`${routeTitle} | ${this.env.company.name}`);
    } else {
      this.title.setTitle(`${this.env.company.name} — ${this.env.company.tagline}`);
    }
  }
}
