import { Observable } from 'rxjs';
import { CompanyMilestone, Garment } from '../models/catalog.models';

/**
 * Abstract contract separating the Angular UI/state layer from the underlying
 * data persistence strategy (built-in static archive vs. PostgreSQL + PostgREST).
 */
export interface CatalogRepository {
  readonly sourceName: 'local' | 'postgrest';
  getGarments(): Observable<readonly Garment[]>;
  getGarmentBySlug(slug: string): Observable<Garment | null>;
  getMilestones(): Observable<readonly CompanyMilestone[]>;
}
