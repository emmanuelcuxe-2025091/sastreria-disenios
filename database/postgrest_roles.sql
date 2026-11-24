-- =============================================================================
-- PostgREST Least-Privilege Security Configuration
-- Exposes ONLY read-only views in the `api` schema to anonymous catalog viewers.
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'web_anon') THEN
    CREATE ROLE web_anon NOLOGIN;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticator') THEN
    CREATE ROLE authenticator NOINHERIT LOGIN PASSWORD 'change_me_in_production';
  END IF;
END
$$;

GRANT web_anon TO authenticator;

-- Restrictive privileges: web_anon can only read from `api` views
REVOKE ALL ON SCHEMA public FROM web_anon;
REVOKE ALL ON SCHEMA core FROM web_anon;

GRANT USAGE ON SCHEMA api TO web_anon;
GRANT SELECT ON api.catalog_garments TO web_anon;
GRANT SELECT ON api.company_milestones TO web_anon;

-- Enable Row-Level Security on internal garments table as defense-in-depth
ALTER TABLE core.garments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS published_garments_read_only ON core.garments;
CREATE POLICY published_garments_read_only
  ON core.garments
  FOR SELECT
  USING (is_published = TRUE);
