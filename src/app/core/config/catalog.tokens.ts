import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AppEnvironment } from '../../../environments/environment.model';
import { CatalogRepository } from '../repositories/catalog.repository';

export const APP_ENVIRONMENT = new InjectionToken<AppEnvironment>('APP_ENVIRONMENT', {
  providedIn: 'root',
  factory: () => environment,
});

export const CATALOG_REPOSITORY = new InjectionToken<CatalogRepository>('CATALOG_REPOSITORY');
