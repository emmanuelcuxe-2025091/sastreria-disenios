import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { routes } from './app.routes';
import { APP_ENVIRONMENT, CATALOG_REPOSITORY } from './core/config/catalog.tokens';
import { LocalCatalogRepository } from './core/repositories/local-catalog.repository';
import { PostgrestCatalogRepository } from './core/repositories/postgrest-catalog.repository';
import { AtelierTitleStrategy } from './core/services/page-title.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
    ),
    {
      provide: TitleStrategy,
      useClass: AtelierTitleStrategy,
    },
    {
      provide: CATALOG_REPOSITORY,
      useFactory: () => {
        const env = inject(APP_ENVIRONMENT);
        return env.dataSource === 'postgrest'
          ? inject(PostgrestCatalogRepository)
          : inject(LocalCatalogRepository);
      },
    },
  ],
};
