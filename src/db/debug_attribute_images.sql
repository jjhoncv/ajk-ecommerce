-- Script para debuggear las imágenes de atributos

-- 1. Verificar si existen registros en attribute_option_images
SELECT 'Registros en attribute_option_images:' as debug_step;
SELECT * FROM attribute_option_images;

-- 2. Verificar las opciones de atributos del producto 2
SELECT 'Opciones de atributos del producto 2:' as debug_step;
SELECT DISTINCT
  ao.id as option_id,
  ao.value as option_value,
  a.id as attribute_id,
  a.name as attribute_name,
  a.display_type
FROM attribute_options ao
JOIN attributes a ON ao.attribute_id = a.id
JOIN variant_attribute_options vao ON ao.id = vao.attribute_option_id
JOIN product_variants pv ON vao.variant_id = pv.id
WHERE pv.product_id = 2;

-- 3. Verificar la consulta que usa el ProductVariantModel
SELECT 'Consulta del ProductVariantModel para variante 3:' as debug_step;
SELECT DISTINCT
  aoi.id,
  aoi.attribute_option_id,
  aoi.image_url_thumb,
  aoi.image_url_normal,
  aoi.image_url_zoom,
  aoi.alt_text,
  a.id as attribute_id,
  a.name as attribute_name,
  a.display_type,
  ao.value as option_value,
  ao.additional_cost
FROM 
  attribute_option_images aoi
JOIN 
  attribute_options ao ON aoi.attribute_option_id = ao.id
JOIN 
  attributes a ON ao.attribute_id = a.id
WHERE 
  aoi.attribute_option_id IN (
    SELECT DISTINCT vao.attribute_option_id 
    FROM variant_attribute_options vao 
    JOIN product_variants pv ON vao.variant_id = pv.id 
    WHERE pv.product_id = 2
  );

-- 4. Verificar si las imágenes de atributos están asociadas correctamente
SELECT 'Verificación de asociaciones:' as debug_step;
SELECT 
  aoi.id as image_id,
  aoi.attribute_option_id,
  aoi.image_url_thumb,
  ao.value as color_name,
  a.name as attribute_name
FROM attribute_option_images aoi
JOIN attribute_options ao ON aoi.attribute_option_id = ao.id
JOIN attributes a ON ao.attribute_id = a.id
WHERE a.name = 'Color';
