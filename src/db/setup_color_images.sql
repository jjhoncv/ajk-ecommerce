-- =====================================================
-- CONFIGURAR IMÁGENES POR COLOR PARA IPHONE 16 PRO MAX
-- =====================================================

-- Primero, verificar qué imágenes ya existen para usar las rutas correctas
-- Basándome en las imágenes que ya tienes en variant_images

-- Para Titanio Blanco (attribute_option_id: 28)
-- Usando las rutas de las imágenes existentes de la variante 4 (Blanco 128GB)
INSERT INTO attribute_option_images (
    attribute_option_id, 
    image_url_thumb, 
    image_url_normal, 
    image_url_zoom, 
    alt_text
) VALUES
(28, 
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-thumb.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-default.webp', 
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-default.webp',
 'iPhone 16 Pro Max Titanio Blanco');

-- Para Titanio Negro (attribute_option_id: 29)  
-- Usando las rutas de las imágenes existentes de la variante 3 (Negro 128GB)
INSERT INTO attribute_option_images (
    attribute_option_id, 
    image_url_thumb, 
    image_url_normal, 
    image_url_zoom, 
    alt_text
) VALUES
(29,
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-front-thumb.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-front-default.webp',
 '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-front-zoom.webp', 
 'iPhone 16 Pro Max Titanio Negro');

-- Verificar que se insertaron correctamente
SELECT 
    ao.id as option_id,
    ao.value as color_name,
    aoi.image_url_thumb,
    aoi.image_url_normal,
    aoi.image_url_zoom,
    aoi.alt_text
FROM attribute_options ao
JOIN attributes a ON ao.attribute_id = a.id
LEFT JOIN attribute_option_images aoi ON ao.id = aoi.attribute_option_id
WHERE a.name = 'Color' 
  AND ao.id IN (28, 29)
ORDER BY ao.value;
