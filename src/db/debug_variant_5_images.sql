-- =====================================================
-- DEBUG: Verificar imágenes de la variante 5
-- =====================================================

-- 1. Ver información básica de la variante 5
SELECT 
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

-- 2. Ver imágenes específicas de la variante 5 (variant_images)
SELECT 
    'variant_images' as source,
    vi.id,
    vi.image_type,
    vi.image_url_thumb,
    vi.image_url_normal,
    vi.image_url_zoom,
    vi.is_primary,
    vi.alt_text
FROM variant_images vi
WHERE vi.variant_id = 5
ORDER BY vi.display_order, vi.is_primary DESC;

-- 3. Ver imágenes de atributos de color para la variante 5 (attribute_option_images)
SELECT 
    'attribute_option_images' as source,
    aoi.id,
    ao.value as color_name,
    aoi.image_url_thumb,
    aoi.image_url_normal,
    aoi.image_url_zoom,
    aoi.alt_text
FROM attribute_option_images aoi
JOIN attribute_options ao ON aoi.attribute_option_id = ao.id
JOIN attributes a ON ao.attribute_id = a.id
JOIN variant_attribute_options vao ON ao.id = vao.attribute_option_id
WHERE vao.variant_id = 5 
  AND a.display_type = 'color'
ORDER BY a.id;

-- 4. Ver TODAS las imágenes disponibles para colores del iPhone 16 Pro Max
SELECT 
    'all_color_images' as source,
    ao.id as option_id,
    ao.value as color_name,
    aoi.id as image_id,
    aoi.image_url_thumb,
    aoi.image_url_normal,
    aoi.image_url_zoom,
    aoi.alt_text
FROM attribute_options ao
JOIN attributes a ON ao.attribute_id = a.id
LEFT JOIN attribute_option_images aoi ON ao.id = aoi.attribute_option_id
WHERE a.name = 'Color' 
  AND ao.id IN (28, 29)  -- IDs de Titanio Blanco y Titanio Negro
ORDER BY ao.value;

-- 5. Verificar qué color tiene la variante 5
SELECT 
    pv.id as variant_id,
    ao.id as color_option_id,
    ao.value as color_name,
    a.display_type
FROM product_variants pv
JOIN variant_attribute_options vao ON pv.id = vao.variant_id
JOIN attribute_options ao ON vao.attribute_option_id = ao.id
JOIN attributes a ON ao.attribute_id = a.id
WHERE pv.id = 5 AND a.name = 'Color';
