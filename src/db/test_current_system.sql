-- =====================================================
-- PRUEBA DEL SISTEMA ACTUAL
-- =====================================================

-- Ver qué imágenes tiene cada variante del iPhone 16 Pro Max
SELECT 
    pv.id as variant_id,
    pv.sku,
    CONCAT(
        GROUP_CONCAT(DISTINCT CONCAT(a.name, ': ', ao.value) SEPARATOR ', ')
    ) as attributes,
    
    -- Imágenes específicas de variante
    (SELECT COUNT(*) FROM variant_images vi WHERE vi.variant_id = pv.id) as variant_images_count,
    
    -- Imágenes de atributos de color
    (SELECT COUNT(*) 
     FROM attribute_option_images aoi 
     JOIN attribute_options ao2 ON aoi.attribute_option_id = ao2.id
     JOIN attributes a2 ON ao2.attribute_id = a2.id
     JOIN variant_attribute_options vao2 ON ao2.id = vao2.attribute_option_id
     WHERE vao2.variant_id = pv.id AND a2.display_type = 'color') as color_images_count,
     
    -- Imagen que se usará (simulando la lógica del sistema)
    CASE 
        WHEN (SELECT COUNT(*) FROM variant_images vi WHERE vi.variant_id = pv.id) > 0 
        THEN 'Usa variant_images'
        WHEN (SELECT COUNT(*) 
              FROM attribute_option_images aoi 
              JOIN attribute_options ao2 ON aoi.attribute_option_id = ao2.id
              JOIN attributes a2 ON ao2.attribute_id = a2.id
              JOIN variant_attribute_options vao2 ON ao2.id = vao2.attribute_option_id
              WHERE vao2.variant_id = pv.id AND a2.display_type = 'color') > 0 
        THEN 'Usa attribute_option_images'
        ELSE 'Usa /no-image.webp'
    END as image_source

FROM product_variants pv
JOIN products p ON pv.product_id = p.id
LEFT JOIN variant_attribute_options vao ON pv.id = vao.variant_id
LEFT JOIN attribute_options ao ON vao.attribute_option_id = ao.id
LEFT JOIN attributes a ON ao.attribute_id = a.id
WHERE p.id = 2  -- iPhone 16 Pro Max
GROUP BY pv.id, pv.sku
ORDER BY pv.id;
