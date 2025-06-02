-- Script para actualizar variant_images con las imágenes locales del proyecto
-- Basado en los archivos encontrados en public/images/products/iphone-16/pro-max/

-- PASO 1: LIMPIAR REGISTROS EXISTENTES
-- Eliminar todas las imágenes duplicadas y placeholders de las variantes del producto 2
DELETE FROM variant_images WHERE variant_id IN (3, 4, 5, 6);

-- PASO 2: AGREGAR IMÁGENES LOCALES REALES
-- Usando las rutas de los archivos que están en tu proyecto

-- VARIANTE 3: iPhone 16 Pro Max Negro 128GB (usando imágenes de blanco como placeholder para negro)
INSERT INTO variant_images (variant_id, image_type, image_url_thumb, image_url_normal, image_url_zoom, is_primary, display_order, alt_text) VALUES
-- Imagen frontal principal (Negro)
(3, 'front', 
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-thumb.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-default.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-default.webp',
 1, 1, 'iPhone 16 Pro Max Titanio Negro 128GB - Vista frontal'),

-- Imagen trasera (Negro)
(3, 'back',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-back-thumb.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-back-default.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-back-default.webp',
 0, 2, 'iPhone 16 Pro Max Titanio Negro 128GB - Vista trasera'),

-- Imagen lateral (Negro)
(3, 'left',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-left-thumb.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-left-default.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-left-default.webp',
 0, 3, 'iPhone 16 Pro Max Titanio Negro 128GB - Vista lateral');

-- VARIANTE 4: iPhone 16 Pro Max Blanco 128GB
INSERT INTO variant_images (variant_id, image_type, image_url_thumb, image_url_normal, image_url_zoom, is_primary, display_order, alt_text) VALUES
-- Imagen frontal principal (Blanco)
(4, 'front',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-thumb.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-default.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-default.webp',
 1, 1, 'iPhone 16 Pro Max Titanio Blanco 128GB - Vista frontal'),

-- Imagen trasera (Blanco)
(4, 'back',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-back-thumb.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-back-default.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-back-default.webp',
 0, 2, 'iPhone 16 Pro Max Titanio Blanco 128GB - Vista trasera'),

-- Imagen lateral (Blanco)
(4, 'left',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-left-thumb.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-left-default.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-left-default.webp',
 0, 3, 'iPhone 16 Pro Max Titanio Blanco 128GB - Vista lateral');

-- VARIANTE 5: iPhone 16 Pro Max Negro 256GB (usando imágenes de blanco como placeholder)
INSERT INTO variant_images (variant_id, image_type, image_url_thumb, image_url_normal, image_url_zoom, is_primary, display_order, alt_text) VALUES
-- Imagen frontal principal (Negro 256GB)
(5, 'front',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-thumb.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-default.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-default.webp',
 1, 1, 'iPhone 16 Pro Max Titanio Negro 256GB - Vista frontal'),

-- Imagen trasera (Negro 256GB)
(5, 'back',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-back-thumb.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-back-default.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-back-default.webp',
 0, 2, 'iPhone 16 Pro Max Titanio Negro 256GB - Vista trasera'),

-- Imagen lateral (Negro 256GB)
(5, 'left',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-left-thumb.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-left-default.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-left-default.webp',
 0, 3, 'iPhone 16 Pro Max Titanio Negro 256GB - Vista lateral');

-- VARIANTE 6: iPhone 16 Pro Max Blanco 256GB
INSERT INTO variant_images (variant_id, image_type, image_url_thumb, image_url_normal, image_url_zoom, is_primary, display_order, alt_text) VALUES
-- Imagen frontal principal (Blanco 256GB)
(6, 'front',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-thumb.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-default.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-default.webp',
 1, 1, 'iPhone 16 Pro Max Titanio Blanco 256GB - Vista frontal'),

-- Imagen trasera (Blanco 256GB)
(6, 'back',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-back-thumb.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-back-default.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-back-default.webp',
 0, 2, 'iPhone 16 Pro Max Titanio Blanco 256GB - Vista trasera'),

-- Imagen lateral (Blanco 256GB)
(6, 'left',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-left-thumb.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-left-default.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-left-default.webp',
 0, 3, 'iPhone 16 Pro Max Titanio Blanco 256GB - Vista lateral');

-- PASO 3: ACTUALIZAR IMÁGENES DE ATRIBUTOS CON RUTAS LOCALES
UPDATE attribute_option_images SET 
  image_url_thumb = '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-attribute-option-thumb.webp',
  image_url_normal = '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-default.webp',
  image_url_zoom = '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-default.webp'
WHERE attribute_option_id = 28; -- Titanio Blanco

UPDATE attribute_option_images SET 
  image_url_thumb = '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-attribute-option-thumb.webp',
  image_url_normal = '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-default.webp',
  image_url_zoom = '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-default.webp'
WHERE attribute_option_id = 29; -- Titanio Negro

UPDATE attribute_option_images SET 
  image_url_thumb = '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-natural-attribute-option-thumb.webp',
  image_url_normal = '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-default.webp',
  image_url_zoom = '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-default.webp'
WHERE attribute_option_id = 30; -- Titanio Natural

UPDATE attribute_option_images SET 
  image_url_thumb = '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-desierto-attribute-option-thumb.webp',
  image_url_normal = '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-default.webp',
  image_url_zoom = '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-default.webp'
WHERE attribute_option_id = 31; -- Titanio Desierto

-- PASO 4: VERIFICAR RESULTADO FINAL
SELECT 
  p.id as product_id,
  p.name as product_name,
  pv.id as variant_id,
  pv.sku,
  vi.id as image_id,
  vi.image_type,
  vi.is_primary,
  vi.display_order,
  vi.image_url_thumb,
  vi.image_url_normal,
  vi.alt_text
FROM products p
JOIN product_variants pv ON p.id = pv.product_id
LEFT JOIN variant_images vi ON pv.id = vi.variant_id
WHERE p.id = 2
ORDER BY pv.id, vi.display_order;

-- VERIFICAR IMÁGENES DE ATRIBUTOS
SELECT 
  aoi.id,
  ao.value as color,
  aoi.image_url_thumb,
  aoi.image_url_normal
FROM attribute_option_images aoi
JOIN attribute_options ao ON aoi.attribute_option_id = ao.id
WHERE ao.attribute_id = 1 -- Color
ORDER BY ao.id;
