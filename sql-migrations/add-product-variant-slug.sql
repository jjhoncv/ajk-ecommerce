-- Migración: Agregar slug SEO-friendly a product_variants
-- Fecha: 2026-01-23

-- Agregar columna slug a product_variants
ALTER TABLE product_variants
  ADD COLUMN slug VARCHAR(255) NULL UNIQUE AFTER sku;

-- Crear índice para búsquedas por slug
ALTER TABLE product_variants ADD INDEX idx_product_variants_slug (slug);

-- Generar slugs para las variantes existentes
-- El slug se genera como: nombre_producto-atributo1-atributo2-...
-- Ejemplo: iphone-16-pro-max-negro-128gb

-- Actualizar slugs existentes (esto se debe ejecutar manualmente o mediante un script)
-- UPDATE product_variants pv
-- JOIN products p ON pv.product_id = p.id
-- SET pv.slug = LOWER(REPLACE(REPLACE(REPLACE(p.name, ' ', '-'), 'á', 'a'), 'é', 'e'))
-- WHERE pv.slug IS NULL;
