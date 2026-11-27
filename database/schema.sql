-- =============================================================================
-- Sastrería & Diseños — PostgreSQL 16 Schema (PostgREST Ready)
-- Purpose: Read-only showcase archive of bespoke garments crafted across
--          the company's trajectory.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Dedicated schemas following PostgREST security best practices:
--   * core: internal tables (not exposed directly to HTTP)
--   * api:  read-only views exposed by PostgREST
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS api;

-- -----------------------------------------------------------------------------
-- Utility trigger to keep updated_at synchronized
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION core.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- -----------------------------------------------------------------------------
-- Categories
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.categories (
  id          TEXT PRIMARY KEY,
  label       TEXT NOT NULL,
  short_label TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order  SMALLINT NOT NULL DEFAULT 0
);

-- -----------------------------------------------------------------------------
-- Collections
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.collections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  year_start  SMALLINT NOT NULL CHECK (year_start BETWEEN 1950 AND 2100),
  year_end    SMALLINT CHECK (year_end IS NULL OR year_end >= year_start),
  description TEXT NOT NULL DEFAULT ''
);

-- -----------------------------------------------------------------------------
-- Garments (Catalog Showcase Archive)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.garments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT NOT NULL UNIQUE,
  slug            TEXT NOT NULL UNIQUE,
  section         TEXT NOT NULL DEFAULT 'creadas' CHECK (section IN ('opciones', 'creadas')),
  name            TEXT NOT NULL,
  subtitle        TEXT NOT NULL,
  category_id     TEXT NOT NULL REFERENCES core.categories(id) ON UPDATE CASCADE,
  collection_id   UUID REFERENCES core.collections(id) ON DELETE SET NULL,
  collection_name TEXT NOT NULL,
  year            SMALLINT NOT NULL CHECK (year BETWEEN 1950 AND 2100),
  era             TEXT NOT NULL CHECK (era IN ('1998-2005', '2006-2015', '2016-2021', '2022-2026')),
  is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
  is_published    BOOLEAN NOT NULL DEFAULT TRUE,
  summary         TEXT NOT NULL,
  story           TEXT NOT NULL,
  fabric          TEXT NOT NULL,
  lining          TEXT NOT NULL,
  construction    TEXT NOT NULL,
  crafting_hours  SMALLINT NOT NULL CHECK (crafting_hours > 0),
  fittings        SMALLINT NOT NULL DEFAULT 3 CHECK (fittings > 0),
  occasion        TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_garments_category_year
  ON core.garments (category_id, year DESC);

CREATE INDEX IF NOT EXISTS idx_garments_published_featured
  ON core.garments (is_published, is_featured, year DESC);

DROP TRIGGER IF EXISTS trg_garments_updated_at ON core.garments;
CREATE TRIGGER trg_garments_updated_at
  BEFORE UPDATE ON core.garments
  FOR EACH ROW
  EXECUTE FUNCTION core.set_updated_at();

-- -----------------------------------------------------------------------------
-- Garment Images
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.garment_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  garment_id  UUID NOT NULL REFERENCES core.garments(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt         TEXT NOT NULL,
  caption     TEXT,
  is_primary  BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order  SMALLINT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_garment_images_garment
  ON core.garment_images (garment_id, sort_order);

-- -----------------------------------------------------------------------------
-- Garment Craftsmanship Techniques
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.garment_techniques (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  garment_id  UUID NOT NULL REFERENCES core.garments(id) ON DELETE CASCADE,
  technique   TEXT NOT NULL,
  sort_order  SMALLINT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_garment_techniques_garment
  ON core.garment_techniques (garment_id, sort_order);

-- -----------------------------------------------------------------------------
-- Company Trajectory Milestones
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.company_milestones (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year_label              TEXT NOT NULL,
  title                   TEXT NOT NULL,
  subtitle                TEXT NOT NULL,
  description             TEXT NOT NULL,
  highlight_metric        TEXT NOT NULL,
  signature_garment_slug  TEXT REFERENCES core.garments(slug) ON DELETE SET NULL,
  sort_order              SMALLINT NOT NULL DEFAULT 0
);

-- -----------------------------------------------------------------------------
-- Public Read-Only Views for PostgREST (api schema)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW api.catalog_garments AS
SELECT
  g.id,
  g.code,
  g.slug,
  g.section,
  g.name,
  g.subtitle,
  g.category_id AS category,
  g.collection_name AS collection,
  g.year,
  g.era,
  g.is_featured AS featured,
  g.summary,
  g.story,
  jsonb_build_object(
    'fabric', g.fabric,
    'lining', g.lining,
    'construction', g.construction,
    'craftingHours', g.crafting_hours,
    'fittings', g.fittings,
    'occasion', g.occasion
  ) AS specs,
  COALESCE(
    (
      SELECT jsonb_agg(t.technique ORDER BY t.sort_order)
      FROM core.garment_techniques t
      WHERE t.garment_id = g.id
    ),
    '[]'::jsonb
  ) AS techniques,
  COALESCE(
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'url', i.url,
          'alt', i.alt,
          'caption', i.caption,
          'isPrimary', i.is_primary
        )
        ORDER BY i.is_primary DESC, i.sort_order ASC
      )
      FROM core.garment_images i
      WHERE i.garment_id = g.id
    ),
    '[]'::jsonb
  ) AS images
FROM core.garments g
WHERE g.is_published = TRUE;

CREATE OR REPLACE VIEW api.company_milestones AS
SELECT
  m.id,
  m.year_label AS year,
  m.title,
  m.subtitle,
  m.description,
  m.highlight_metric AS "highlightMetric",
  m.signature_garment_slug AS "signatureGarmentSlug",
  m.sort_order AS "sortOrder"
FROM core.company_milestones m
ORDER BY m.sort_order ASC;
