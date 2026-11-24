import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Inicio',
    loadComponent: () =>
      import('./features/home/home-page').then((m) => m.HomePageComponent),
  },
  {
    path: 'prenda/:slug',
    title: 'Ficha de Prenda',
    loadComponent: () =>
      import('./features/garment-detail/garment-detail-page').then(
        (m) => m.GarmentDetailPageComponent,
      ),
  },
  {
    path: '**',
    title: 'Página no encontrada',
    loadComponent: () =>
      import('./features/not-found/not-found-page').then((m) => m.NotFoundPageComponent),
  },
];
