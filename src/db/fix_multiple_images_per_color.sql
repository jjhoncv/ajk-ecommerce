-- =====================================================
-- PERMITIR MÚLTIPLES IMÁGENES POR COLOR
-- =====================================================

-- 1. Eliminar la restricción UNIQUE para permitir múltiples imágenes por color
ALTER TABLE attribute_option_images DROP INDEX unique_attribute_option;

-- 2. Agregar columnas para tipo de imagen y orden
ALTER TABLE attribute_option_images 
ADD COLUMN image_type ENUM('front','back','left','right','top','bottom','detail','lifestyle','packaging') NOT NULL DEFAULT 'front' AFTER attribute_option_id,
ADD COLUMN display_order INT DEFAULT 0 AFTER image_type;

-- 3. Crear nuevo índice único que permita múltiples imágenes por color pero no duplicados del mismo tipo
ALTER TABLE attribute_option_images 
ADD UNIQUE KEY unique_attribute_option_type (attribute_option_id, image_type);

-- 4. Actualizar las imágenes existentes con el tipo correcto
UPDATE attribute_option_images 
SET image_type = 'front', display_order = 0 
WHERE id IN (1, 2, 3, 4);

-- 5. Insertar las imágenes adicionales para Titanio Blanco (ID: 28)
INSERT INTO attribute_option_images (
    attribute_option_id, 
    image_type,
    image_url_thumb, 
    image_url_normal, 
    image_url_zoom, 
    alt_text,
    display_order
) VALUES
-- Back image para Titanio Blanco
(28, 'back',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-back-thumb.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-back-default.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-back-default.webp',
 'iPhone 16 Pro Max Titanio Blanco - Vista Trasera',
 1),
-- Left image para Titanio Blanco  
(28, 'left',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-left-thumb.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-left-default.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-left-default.webp',
 'iPhone 16 Pro Max Titanio Blanco - Vista Lateral',
 2);

-- 6. Insertar las imágenes adicionales para Titanio Negro (ID: 29)
INSERT INTO attribute_option_images (
    attribute_option_id, 
    image_type,
    image_url_thumb, 
    image_url_normal, 
    image_url_zoom, 
    alt_text,
    display_order
) VALUES
-- Back image para Titanio Negro
(29, 'back',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-back-thumb.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-back-default.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-back-default.webp',
 'iPhone 16 Pro Max Titanio Negro - Vista Trasera',
 1),
-- Left image para Titanio Negro
(29, 'left',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-left-thumb.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-left-default.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-left-default.webp',
 'iPhone 16 Pro Max Titanio Negro - Vista Lateral',
 2);

-- 7. Verificar el resultado
SELECT 
    ao.value as color_name,
    aoi.image_type,
    aoi.display_order,
    aoi.image_url_thumb,
    aoi.alt_text
FROM attribute_option_images aoi
JOIN attribute_options ao ON aoi.attribute_option_id = ao.id
WHERE ao.id IN (28, 29)
ORDER BY ao.value, aoi.display_order;
