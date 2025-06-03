-- =====================================================
-- SISTEMA OPTIMIZADO DE IMÁGENES POR VARIANTES
-- =====================================================
-- Este script demuestra cómo configurar el sistema híbrido
-- donde las imágenes se comparten por atributos visuales

-- =====================================================
-- 1. CONFIGURACIÓN DE ATRIBUTOS
-- =====================================================

-- Marcar qué atributos son visuales (requieren imágenes)
-- El atributo 'Color' ya está marcado como 'color' en display_type
UPDATE attributes SET display_type = 'color' WHERE name = 'Color';

-- Los atributos no visuales como 'Almacenamiento' mantienen su tipo
UPDATE attributes SET display_type = 'pills' WHERE name = 'Almacenamiento';

-- =====================================================
-- 2. EJEMPLO: iPhone 16 Pro Max
-- =====================================================

-- Producto: iPhone 16 Pro Max (ID: 2)
-- Colores: Titanio Blanco (28), Titanio Negro (29)
-- Almacenamiento: 128GB (8), 256GB (9)
-- Variantes: 4 (2 colores × 2 almacenamientos)

-- =====================================================
-- 3. CONFIGURACIÓN DE IMÁGENES OPTIMIZADA
-- =====================================================

-- OPCIÓN A: Solo imágenes por COLOR (Recomendado)
-- Las variantes comparten imágenes según el color

-- Imágenes para Titanio Blanco (attribute_option_id: 28)
INSERT INTO attribute_option_images (attribute_option_id, image_url_thumb, image_url_normal, image_url_zoom, alt_text) VALUES
(28, '/images/products/iphone-16/pro-max/titanio-blanco-thumb.webp', 
     '/images/products/iphone-16/pro-max/titanio-blanco-normal.webp', 
     '/images/products/iphone-16/pro-max/titanio-blanco-zoom.webp', 
     'iPhone 16 Pro Max Titanio Blanco');

-- Imágenes para Titanio Negro (attribute_option_id: 29)
INSERT INTO attribute_option_images (attribute_option_id, image_url_thumb, image_url_normal, image_url_zoom, alt_text) VALUES
(29, '/images/products/iphone-16/pro-max/titanio-negro-thumb.webp', 
     '/images/products/iphone-16/pro-max/titanio-negro-normal.webp', 
     '/images/products/iphone-16/pro-max/titanio-negro-zoom.webp', 
     'iPhone 16 Pro Max Titanio Negro');

-- =====================================================
-- 4. RESULTADO DEL SISTEMA OPTIMIZADO
-- =====================================================

-- Con esta configuración:
-- ✅ Variante 3 (Negro 128GB) → Usa imágenes del atributo "Titanio Negro"
-- ✅ Variante 4 (Blanco 128GB) → Usa imágenes del atributo "Titanio Blanco"  
-- ✅ Variante 5 (Negro 256GB) → Usa imágenes del atributo "Titanio Negro"
-- ✅ Variante 6 (Blanco 256GB) → Usa imágenes del atributo "Titanio Blanco"

-- BENEFICIOS:
-- 🎯 Solo 2 sets de imágenes en lugar de 4
-- 🎯 Mantenimiento simplificado
-- 🎯 Consistencia visual automática
-- 🎯 Escalabilidad mejorada

-- =====================================================
-- 5. CASOS ESPECIALES (OPCIONAL)
-- =====================================================

-- Si una variante específica necesita imágenes únicas,
-- se pueden agregar a variant_images y tendrán prioridad:

-- Ejemplo: Variante especial con imágenes específicas
-- INSERT INTO variant_images (variant_id, image_type, image_url_thumb, image_url_normal, image_url_zoom, is_primary, display_order, alt_text) VALUES
-- (4, 'front', '/images/special/variant-4-front-thumb.webp', '/images/special/variant-4-front-normal.webp', '/images/special/variant-4-front-zoom.webp', 1, 1, 'iPhone 16 Pro Max Blanco 128GB - Edición Especial');

-- =====================================================
-- 6. VERIFICACIÓN DEL SISTEMA
-- =====================================================

-- Consulta para verificar qué imágenes usará cada variante:
SELECT 
    pv.id as variant_id,
    pv.sku,
    p.name as product_name,
    GROUP_CONCAT(DISTINCT CONCAT(a.name, ': ', ao.value) SEPARATOR ', ') as attributes,
    CASE 
        WHEN vi.id IS NOT NULL THEN 'Imágenes específicas de variante'
        WHEN aoi.id IS NOT NULL THEN CONCAT('Imágenes del atributo: ', color_attr.value)
        ELSE 'Sin imágenes'
    END as image_source,
    COALESCE(vi.image_url_normal, aoi.image_url_normal, '/no-image.webp') as main_image
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
LEFT JOIN variant_attribute_options vao ON pv.id = vao.variant_id
LEFT JOIN attribute_options ao ON vao.attribute_option_id = ao.id
LEFT JOIN attributes a ON ao.attribute_id = a.id
LEFT JOIN variant_images vi ON pv.id = vi.variant_id AND vi.is_primary = 1
LEFT JOIN variant_attribute_options color_vao ON pv.id = color_vao.variant_id
LEFT JOIN attribute_options color_ao ON color_vao.attribute_option_id = color_ao.id
LEFT JOIN attributes color_a ON color_ao.attribute_id = color_a.id AND color_a.display_type = 'color'
LEFT JOIN attribute_option_images aoi ON color_ao.id = aoi.attribute_option_id
LEFT JOIN attribute_options color_attr ON color_ao.id = color_attr.id
WHERE p.id = 2  -- iPhone 16 Pro Max
GROUP BY pv.id, vi.id, aoi.id, color_attr.value
ORDER BY pv.id;

-- =====================================================
-- 7. MIGRACIÓN DE DATOS EXISTENTES (SI ES NECESARIO)
-- =====================================================

-- Si ya tienes imágenes en variant_images que quieres optimizar:

-- 1. Identificar imágenes duplicadas por color
-- 2. Mover una copia a attribute_option_images
-- 3. Eliminar duplicados de variant_images

-- Ejemplo de migración (EJECUTAR CON CUIDADO):
/*
-- Mover imágenes de variantes a atributos de color
INSERT INTO attribute_option_images (attribute_option_id, image_url_thumb, image_url_normal, image_url_zoom, alt_text)
SELECT DISTINCT
    ao.id as attribute_option_id,
    vi.image_url_thumb,
    vi.image_url_normal,
    vi.image_url_zoom,
    CONCAT(ao.value, ' - ', a.name) as alt_text
FROM variant_images vi
JOIN product_variants pv ON vi.variant_id = pv.id
JOIN variant_attribute_options vao ON pv.id = vao.variant_id
JOIN attribute_options ao ON vao.attribute_option_id = ao.id
JOIN attributes a ON ao.attribute_id = a.id
WHERE a.display_type = 'color'
    AND vi.is_primary = 1
    AND NOT EXISTS (
        SELECT 1 FROM attribute_option_images aoi 
        WHERE aoi.attribute_option_id = ao.id
    );

-- Eliminar imágenes redundantes de variant_images (OPCIONAL)
-- DELETE vi FROM variant_images vi
-- JOIN product_variants pv ON vi.variant_id = pv.id
-- JOIN variant_attribute_options vao ON pv.id = vao.variant_id
-- JOIN attribute_options ao ON vao.attribute_option_id = ao.id
-- JOIN attributes a ON ao.attribute_id = a.id
-- WHERE a.display_type = 'color'
--     AND EXISTS (
--         SELECT 1 FROM attribute_option_images aoi 
--         WHERE aoi.attribute_option_id = ao.id
--     );
*/
