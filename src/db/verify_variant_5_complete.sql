-- =====================================================
-- VERIFICACIÓN COMPLETA DE LA VARIANTE 5
-- =====================================================

-- 1. Verificar que la variante 5 existe y sus atributos
SELECT 
    'VARIANTE 5 INFO' as section,
    pv.id,
    pv.sku,
    p.name as product_name,
    GROUP_CONCAT(CONCAT(a.name, ': ', ao.value) SEPARATOR ', ') as attributes
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
LEFT JOIN variant_attribute_options vao ON pv.id = vao.variant_id
LEFT JOIN attribute_options ao ON vao.attribute_option_id = ao.id
LEFT JOIN attributes a ON ao.attribute_id = a.id
WHERE pv.id = 5
GROUP BY pv.id, pv.sku, p.name;

-- 2. Verificar imágenes específicas de la variante 5
SELECT 
    'VARIANT_IMAGES' as section,
    COUNT(*) as count,
    'Imágenes específicas de la variante 5' as description
FROM variant_images vi
WHERE vi.variant_id = 5;

-- 3. Verificar imágenes de color para la variante 5
SELECT 
    'COLOR_IMAGES' as section,
    aoi.id,
    ao.value as color_name,
    aoi.image_url_thumb,
    aoi.image_url_normal,
    aoi.image_url_zoom
FROM attribute_option_images aoi
JOIN attribute_options ao ON aoi.attribute_option_id = ao.id
JOIN attributes a ON ao.attribute_id = a.id
JOIN variant_attribute_options vao ON ao.id = vao.attribute_option_id
WHERE vao.variant_id = 5 
  AND a.display_type = 'color';

-- 4. Simular la consulta exacta que hace el ProductVariantModel
SELECT 
    'MODEL_QUERY_SIMULATION' as section,
    aoi.id,
    aoi.image_url_thumb,
    aoi.image_url_normal,
    aoi.image_url_zoom,
    aoi.alt_text,
    aoi.created_at,
    aoi.updated_at,
    a.name as attribute_name,
    ao.value as option_value
FROM 
    attribute_option_images aoi
JOIN 
    attribute_options ao ON aoi.attribute_option_id = ao.id
JOIN 
    attributes a ON ao.attribute_id = a.id
JOIN 
    variant_attribute_options vao ON ao.id = vao.attribute_option_id
WHERE 
    vao.variant_id = 5
    AND a.display_type = 'color'
GROUP BY aoi.id, aoi.image_url_thumb, aoi.image_url_normal, aoi.image_url_zoom, aoi.alt_text, aoi.created_at, aoi.updated_at, a.name, ao.value
ORDER BY a.id ASC;

-- 5. Verificar que las rutas de imágenes existen (simulación)
SELECT 
    'IMAGE_PATHS_CHECK' as section,
    aoi.image_url_normal as image_path,
    CASE 
        WHEN aoi.image_url_normal LIKE '/images/%' THEN 'Ruta válida'
        ELSE 'Ruta inválida'
    END as path_status
FROM attribute_option_images aoi
WHERE aoi.attribute_option_id = 29;
