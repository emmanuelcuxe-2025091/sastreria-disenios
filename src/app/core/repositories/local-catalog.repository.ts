import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CATALOG_GARMENTS, COMPANY_MILESTONES } from '../data/catalog.data';
import { CompanyMilestone, Garment } from '../models/catalog.models';
import { CatalogRepository } from './catalog.repository';

@Injectable({ providedIn: 'root' })
export class LocalCatalogRepository implements CatalogRepository {
  readonly sourceName = 'local' as const;

  getGarments(): Observable<readonly Garment[]> {
    return of(CATALOG_GARMENTS);
  }

  getGarmentBySlug(slug: string): Observable<Garment | null> {
    const match = CATALOG_GARMENTS.find((garment) => garment.slug === slug) ?? null;
    return of(match);
  }

  getMilestones(): Observable<readonly CompanyMilestone[]> {
    return of(COMPANY_MILESTONES);
  }
}
