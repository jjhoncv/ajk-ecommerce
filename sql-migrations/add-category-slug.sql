-- Migration: Add slug field to categories for SEO-friendly URLs
-- Date: 2026-01-23

-- Add slug column
ALTER TABLE categories
  ADD COLUMN slug VARCHAR(255) NULL UNIQUE COMMENT 'SEO-friendly URL slug';

-- Create index for slug lookups
ALTER TABLE categories ADD INDEX idx_categories_slug (slug);

-- Generate initial slugs from existing category names
-- This converts names to lowercase, replaces spaces with hyphens, and removes special characters
UPDATE categories
SET slug = LOWER(
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(name, ' ', '-'),
            'á', 'a'),
          'é', 'e'),
        'í', 'i'),
      'ó', 'o'),
    'ú', 'u'),
  'ñ', 'n')
)
WHERE slug IS NULL;

-- Make slug NOT NULL after populating
ALTER TABLE categories MODIFY COLUMN slug VARCHAR(255) NOT NULL;
