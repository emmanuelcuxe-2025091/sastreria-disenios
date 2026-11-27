import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Inicio',
    loadComponent: () =>
      import('./features/home/home-page').then((m) => m.HomePageComponent),
  },
  {
    path: 'agregar',
    title: 'Agregar Prenda',
    loadComponent: () =>
      import('./features/add-garment/add-garment-page').then(
        (m) => m.AddGarmentPageComponent,
      ),
  },
  {
    path: 'editar/:slug',
    title: 'Editar Prenda',
    loadComponent: () =>
      import('./features/add-garment/add-garment-page').then(
        (m) => m.AddGarmentPageComponent,
      ),
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
