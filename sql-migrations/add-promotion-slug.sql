-- Agregar campo slug a la tabla promotions para URLs SEO-friendly
ALTER TABLE promotions
  ADD COLUMN slug VARCHAR(255) NULL UNIQUE AFTER name;

-- Crear índice para búsquedas rápidas por slug
ALTER TABLE promotions ADD INDEX idx_promotions_slug (slug);

-- Generar slugs para promociones existentes basados en el nombre
UPDATE promotions
SET slug = LOWER(
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(name, ' ', '-'),
            'á', 'a'
          ),
          'é', 'e'
        ),
        'í', 'i'
      ),
      'ó', 'o'
    ),
    'ú', 'u'
  )
)
WHERE slug IS NULL;
