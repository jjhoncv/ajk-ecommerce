-- Script para corregir las asociaciones de atributos de las variantes del producto 2
-- El problema es que las variantes están usando IDs antiguos pero las imágenes están con IDs nuevos

-- Primero, verificar el estado actual
SELECT 'Estado actual de variantes del producto 2:' as info;
SELECT 
  pv.id as variant_id,
  pv.sku,
  vao.attribute_option_id,
  ao.value as attribute_value,
  a.name as attribute_name
FROM product_variants pv
JOIN variant_attribute_options vao ON pv.id = vao.variant_id
JOIN attribute_options ao ON vao.attribute_option_id = ao.id
JOIN attributes a ON ao.attribute_id = a.id
WHERE pv.product_id = 2
ORDER BY pv.id, a.name;

-- PASO 1: Eliminar asociaciones antiguas de color para las variantes del producto 2
DELETE vao FROM variant_attribute_options vao
JOIN product_variants pv ON vao.variant_id = pv.id
JOIN attribute_options ao ON vao.attribute_option_id = ao.id
WHERE pv.product_id = 2 AND ao.attribute_id = 1 AND ao.id IN (1, 2);

-- PASO 2: Agregar las nuevas asociaciones de color con los IDs correctos
-- Variante 3 (Negro 128GB) -> Titanio Negro (ID: 29)
INSERT INTO variant_attribute_options (variant_id, attribute_option_id) VALUES (3, 29);

-- Variante 4 (Blanco 128GB) -> Titanio Blanco (ID: 28)  
INSERT INTO variant_attribute_options (variant_id, attribute_option_id) VALUES (4, 28);

-- Variante 5 (Negro 256GB) -> Titanio Negro (ID: 29)
INSERT INTO variant_attribute_options (variant_id, attribute_option_id) VALUES (5, 29);

-- Variante 6 (Blanco 256GB) -> Titanio Blanco (ID: 28)
INSERT INTO variant_attribute_options (variant_id, attribute_option_id) VALUES (6, 28);

-- PASO 3: Verificar el resultado
SELECT 'Estado después de la corrección:' as info;
SELECT 
  pv.id as variant_id,
  pv.sku,
  vao.attribute_option_id,
  ao.value as attribute_value,
  a.name as attribute_name
FROM product_variants pv
JOIN variant_attribute_options vao ON pv.id = vao.variant_id
JOIN attribute_options ao ON vao.attribute_option_id = ao.id
JOIN attributes a ON ao.attribute_id = a.id
WHERE pv.product_id = 2
ORDER BY pv.id, a.name;

-- PASO 4: Verificar que ahora las imágenes de atributos se pueden encontrar
SELECT 'Verificación de imágenes disponibles:' as info;
SELECT DISTINCT
  aoi.id,
  aoi.attribute_option_id,
  aoi.image_url_thumb,
  ao.value as color_name,
  a.name as attribute_name
FROM attribute_option_images aoi
JOIN attribute_options ao ON aoi.attribute_option_id = ao.id
JOIN attributes a ON ao.attribute_id = a.id
WHERE aoi.attribute_option_id IN (
  SELECT DISTINCT vao.attribute_option_id 
  FROM variant_attribute_options vao 
  JOIN product_variants pv ON vao.variant_id = pv.id 
  WHERE pv.product_id = 2
);
