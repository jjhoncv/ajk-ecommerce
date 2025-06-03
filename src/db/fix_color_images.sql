-- =====================================================
-- CORREGIR RUTAS DE IMÁGENES POR COLOR
-- =====================================================

-- El problema: Las imágenes del Titanio Negro tienen rutas del Titanio Blanco
-- Vamos a corregir esto

-- 1. Actualizar las imágenes del Titanio Negro (ID: 29)
UPDATE attribute_option_images 
SET 
    image_url_normal = '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-front-default.webp',
    image_url_zoom = '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-front-zoom.webp'
WHERE attribute_option_id = 29;

-- 2. Verificar que se actualizó correctamente
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

-- 3. Verificar que las rutas son correctas para cada color
SELECT 
    'VERIFICACION' as section,
    ao.value as color,
    CASE 
        WHEN ao.value = 'Titanio Blanco' AND aoi.image_url_normal LIKE '%blanco%' THEN 'CORRECTO'
        WHEN ao.value = 'Titanio Negro' AND aoi.image_url_normal LIKE '%negro%' THEN 'CORRECTO'
        ELSE 'INCORRECTO'
    END as status,
    aoi.image_url_normal
FROM attribute_options ao
JOIN attributes a ON ao.attribute_id = a.id
LEFT JOIN attribute_option_images aoi ON ao.id = aoi.attribute_option_id
WHERE a.name = 'Color' 
  AND ao.id IN (28, 29);
