-- Script para limpiar registros inválidos y agregar imágenes reales del iPhone 16 Pro Max
-- Basado en las imágenes que proporcionaste

-- PASO 1: LIMPIAR REGISTROS DUPLICADOS E INVÁLIDOS
-- Eliminar todas las imágenes duplicadas y placeholders
DELETE FROM variant_images WHERE id BETWEEN 6 AND 29;

-- PASO 2: AGREGAR IMÁGENES REALES DE ALTA CALIDAD
-- Usando URLs de imágenes reales del iPhone 16 Pro Max

-- Limpiar imágenes existentes de las variantes del producto 2
DELETE FROM variant_images WHERE variant_id IN (3, 4, 5, 6);

-- VARIANTE 3: iPhone 16 Pro Max Negro 128GB
INSERT INTO variant_images (variant_id, image_type, image_url_thumb, image_url_normal, image_url_zoom, is_primary, display_order, alt_text) VALUES
-- Imagen frontal principal (Negro)
(3, 'front', 
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-black-titanium-select?wid=140&hei=140&fmt=jpeg&qlt=90&.v=1725040027705',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-black-titanium-select?wid=600&hei=800&fmt=jpeg&qlt=90&.v=1725040027705',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-black-titanium-select?wid=1200&hei=1200&fmt=jpeg&qlt=95&.v=1725040027705',
 1, 1, 'iPhone 16 Pro Max Titanio Negro - Vista frontal'),

-- Imagen trasera (Negro)
(3, 'back',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-black-titanium-back?wid=140&hei=140&fmt=jpeg&qlt=90&.v=1725040027705',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-black-titanium-back?wid=600&hei=800&fmt=jpeg&qlt=90&.v=1725040027705',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-black-titanium-back?wid=1200&hei=1200&fmt=jpeg&qlt=95&.v=1725040027705',
 0, 2, 'iPhone 16 Pro Max Titanio Negro - Vista trasera'),

-- Imagen lateral (Negro)
(3, 'left',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-black-titanium-side?wid=140&hei=140&fmt=jpeg&qlt=90&.v=1725040027705',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-black-titanium-side?wid=600&hei=800&fmt=jpeg&qlt=90&.v=1725040027705',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-black-titanium-side?wid=1200&hei=1200&fmt=jpeg&qlt=95&.v=1725040027705',
 0, 3, 'iPhone 16 Pro Max Titanio Negro - Vista lateral');

-- VARIANTE 4: iPhone 16 Pro Max Blanco 128GB
INSERT INTO variant_images (variant_id, image_type, image_url_thumb, image_url_normal, image_url_zoom, is_primary, display_order, alt_text) VALUES
-- Imagen frontal principal (Blanco)
(4, 'front',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-white-titanium-select?wid=140&hei=140&fmt=jpeg&qlt=90&.v=1725040027705',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-white-titanium-select?wid=600&hei=800&fmt=jpeg&qlt=90&.v=1725040027705',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-white-titanium-select?wid=1200&hei=1200&fmt=jpeg&qlt=95&.v=1725040027705',
 1, 1, 'iPhone 16 Pro Max Titanio Blanco - Vista frontal'),

-- Imagen trasera (Blanco)
(4, 'back',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-white-titanium-back?wid=140&hei=140&fmt=jpeg&qlt=90&.v=1725040027705',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-white-titanium-back?wid=600&hei=800&fmt=jpeg&qlt=90&.v=1725040027705',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-white-titanium-back?wid=1200&hei=1200&fmt=jpeg&qlt=95&.v=1725040027705',
 0, 2, 'iPhone 16 Pro Max Titanio Blanco - Vista trasera'),

-- Imagen lateral (Blanco)
(4, 'left',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-white-titanium-side?wid=140&hei=140&fmt=jpeg&qlt=90&.v=1725040027705',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-white-titanium-side?wid=600&hei=800&fmt=jpeg&qlt=90&.v=1725040027705',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-white-titanium-side?wid=1200&hei=1200&fmt=jpeg&qlt=95&.v=1725040027705',
 0, 3, 'iPhone 16 Pro Max Titanio Blanco - Vista lateral');

-- VARIANTE 5: iPhone 16 Pro Max Negro 256GB
INSERT INTO variant_images (variant_id, image_type, image_url_thumb, image_url_normal, image_url_zoom, is_primary, display_order, alt_text) VALUES
-- Imagen frontal principal (Negro 256GB)
(5, 'front',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-black-titanium-select?wid=140&hei=140&fmt=jpeg&qlt=90&.v=1725040027705',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-black-titanium-select?wid=600&hei=800&fmt=jpeg&qlt=90&.v=1725040027705',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-black-titanium-select?wid=1200&hei=1200&fmt=jpeg&qlt=95&.v=1725040027705',
 1, 1, 'iPhone 16 Pro Max Titanio Negro 256GB - Vista frontal'),

-- Imagen trasera (Negro 256GB)
(5, 'back',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-black-titanium-back?wid=140&hei=140&fmt=jpeg&qlt=90&.v=1725040027705',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-black-titanium-back?wid=600&hei=800&fmt=jpeg&qlt=90&.v=1725040027705',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-black-titanium-back?wid=1200&hei=1200&fmt=jpeg&qlt=95&.v=1725040027705',
 0, 2, 'iPhone 16 Pro Max Titanio Negro 256GB - Vista trasera'),

-- Imagen de detalle de cámara (Negro 256GB)
(5, 'detail',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-camera-control?wid=140&hei=140&fmt=jpeg&qlt=90&.v=1725040027705',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-camera-control?wid=600&hei=800&fmt=jpeg&qlt=90&.v=1725040027705',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-camera-control?wid=1200&hei=1200&fmt=jpeg&qlt=95&.v=1725040027705',
 0, 3, 'iPhone 16 Pro Max - Control de Cámara');

-- VARIANTE 6: iPhone 16 Pro Max Blanco 256GB
INSERT INTO variant_images (variant_id, image_type, image_url_thumb, image_url_normal, image_url_zoom, is_primary, display_order, alt_text) VALUES
-- Imagen frontal principal (Blanco 256GB)
(6, 'front',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-white-titanium-select?wid=140&hei=140&fmt=jpeg&qlt=90&.v=1725040027705',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-white-titanium-select?wid=600&hei=800&fmt=jpeg&qlt=90&.v=1725040027705',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-white-titanium-select?wid=1200&hei=1200&fmt=jpeg&qlt=95&.v=1725040027705',
 1, 1, 'iPhone 16 Pro Max Titanio Blanco 256GB - Vista frontal'),

-- Imagen trasera (Blanco 256GB)
(6, 'back',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-white-titanium-back?wid=140&hei=140&fmt=jpeg&qlt=90&.v=1725040027705',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-white-titanium-back?wid=600&hei=800&fmt=jpeg&qlt=90&.v=1725040027705',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-white-titanium-back?wid=1200&hei=1200&fmt=jpeg&qlt=95&.v=1725040027705',
 0, 2, 'iPhone 16 Pro Max Titanio Blanco 256GB - Vista trasera'),

-- Imagen de detalle de cámara (Blanco 256GB)
(6, 'detail',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-camera-control?wid=140&hei=140&fmt=jpeg&qlt=90&.v=1725040027705',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-camera-control?wid=600&hei=800&fmt=jpeg&qlt=90&.v=1725040027705',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-camera-control?wid=1200&hei=1200&fmt=jpeg&qlt=95&.v=1725040027705',
 0, 3, 'iPhone 16 Pro Max - Control de Cámara');

-- PASO 3: ACTUALIZAR IMÁGENES DE ATRIBUTOS CON URLs REALES
UPDATE attribute_option_images SET 
  image_url_thumb = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-white-titanium-select?wid=140&hei=140&fmt=jpeg&qlt=90&.v=1725040027705',
  image_url_normal = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-white-titanium-select?wid=600&hei=800&fmt=jpeg&qlt=90&.v=1725040027705',
  image_url_zoom = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-white-titanium-select?wid=1200&hei=1200&fmt=jpeg&qlt=95&.v=1725040027705'
WHERE attribute_option_id = 28; -- Titanio Blanco

UPDATE attribute_option_images SET 
  image_url_thumb = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-black-titanium-select?wid=140&hei=140&fmt=jpeg&qlt=90&.v=1725040027705',
  image_url_normal = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-black-titanium-select?wid=600&hei=800&fmt=jpeg&qlt=90&.v=1725040027705',
  image_url_zoom = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-black-titanium-select?wid=1200&hei=1200&fmt=jpeg&qlt=95&.v=1725040027705'
WHERE attribute_option_id = 29; -- Titanio Negro

UPDATE attribute_option_images SET 
  image_url_thumb = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-natural-titanium-select?wid=140&hei=140&fmt=jpeg&qlt=90&.v=1725040027705',
  image_url_normal = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-natural-titanium-select?wid=600&hei=800&fmt=jpeg&qlt=90&.v=1725040027705',
  image_url_zoom = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-natural-titanium-select?wid=1200&hei=1200&fmt=jpeg&qlt=95&.v=1725040027705'
WHERE attribute_option_id = 30; -- Titanio Natural

UPDATE attribute_option_images SET 
  image_url_thumb = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-desert-titanium-select?wid=140&hei=140&fmt=jpeg&qlt=90&.v=1725040027705',
  image_url_normal = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-desert-titanium-select?wid=600&hei=800&fmt=jpeg&qlt=90&.v=1725040027705',
  image_url_zoom = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-desert-titanium-select?wid=1200&hei=1200&fmt=jpeg&qlt=95&.v=1725040027705'
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
  vi.alt_text
FROM products p
JOIN product_variants pv ON p.id = pv.product_id
LEFT JOIN variant_images vi ON pv.id = vi.variant_id
WHERE p.id = 2
ORDER BY pv.id, vi.display_order;
