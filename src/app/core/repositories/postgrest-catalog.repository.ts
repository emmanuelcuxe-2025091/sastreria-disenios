import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { APP_ENVIRONMENT } from '../config/catalog.tokens';
import { CompanyMilestone, Garment } from '../models/catalog.models';
import { CatalogRepository } from './catalog.repository';
import { LocalCatalogRepository } from './local-catalog.repository';

/**
 * PostgREST-backed implementation of CatalogRepository.
 * Targets read-only views in PostgreSQL's exposed `api` schema:
 *   - GET /catalog_garments
 *   - GET /company_milestones
 *
 * Gracefully falls back to LocalCatalogRepository if the PostgREST instance
 * is unavailable, keeping the public showcase resilient.
 */
@Injectable({ providedIn: 'root' })
export class PostgrestCatalogRepository implements CatalogRepository {
  readonly sourceName = 'postgrest' as const;

  private readonly http = inject(HttpClient);
  private readonly env = inject(APP_ENVIRONMENT);
  private readonly fallback = inject(LocalCatalogRepository);

  private get baseUrl(): string {
    return this.env.postgrestBaseUrl.replace(/\/+$/, '');
  }

  getGarments(): Observable<readonly Garment[]> {
    const params = new HttpParams()
      .set('select', '*')
      .set('order', 'year.desc,name.asc');

    return this.http
      .get<readonly Garment[]>(`${this.baseUrl}/catalog_garments`, { params })
      .pipe(catchError(() => this.fallback.getGarments()));
  }

  getGarmentBySlug(slug: string): Observable<Garment | null> {
    const params = new HttpParams()
      .set('select', '*')
      .set('slug', `eq.${slug}`)
      .set('limit', '1');

    return this.http
      .get<readonly Garment[]>(`${this.baseUrl}/catalog_garments`, { params })
      .pipe(
        map((rows) => rows[0] ?? null),
        catchError(() => this.fallback.getGarmentBySlug(slug)),
      );
  }

  getMilestones(): Observable<readonly CompanyMilestone[]> {
    const params = new HttpParams()
      .set('select', '*')
      .set('order', 'sortOrder.asc');

    return this.http
      .get<readonly CompanyMilestone[]>(`${this.baseUrl}/company_milestones`, { params })
      .pipe(catchError(() => this.fallback.getMilestones()));
  }
}
