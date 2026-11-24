import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Inicio',
    loadComponent: () =>
      import('./features/home/home-page').then((m) => m.HomePageComponent),
  },
  {
    path: 'catalogo',
    title: 'Catálogo de Prendas',
    loadComponent: () =>
      import('./features/catalog/catalog-page').then((m) => m.CatalogPageComponent),
  },
  {
    path: 'catalogo/:slug',
    title: 'Ficha de Prenda',
    loadComponent: () =>
      import('./features/garment-detail/garment-detail-page').then(
        (m) => m.GarmentDetailPageComponent,
      ),
  },
  {
    path: 'trayectoria',
    title: 'Historia y Trayectoria',
    loadComponent: () =>
      import('./features/heritage/heritage-page').then((m) => m.HeritagePageComponent),
  },
  {
    path: '**',
    title: 'Página no encontrada',
    loadComponent: () =>
      import('./features/not-found/not-found-page').then((m) => m.NotFoundPageComponent),
  },
];
