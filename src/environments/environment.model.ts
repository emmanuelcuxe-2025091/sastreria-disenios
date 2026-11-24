export interface AppEnvironment {
  readonly production: boolean;
  /**
   * 'local'     -> Uses the curated built-in archive dataset (zero backend required).
   * 'postgrest' -> Fetches catalog garments and milestones from PostgreSQL via PostgREST,
   *                with graceful fallback to the local archive if the API is unreachable.
   */
  readonly dataSource: 'local' | 'postgrest';
  readonly postgrestBaseUrl: string;
  readonly company: {
    readonly name: string;
    readonly tagline: string;
    readonly foundedYear: number;
    readonly email: string;
    readonly phoneDisplay: string;
    readonly whatsappNumber: string;
    readonly city: string;
    readonly schedule: string;
  };
}
