-- Verificar qué opciones de atributos están asociadas con las variantes del producto 2

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

-- Verificar si las opciones de color están asociadas correctamente
SELECT 'Opciones de color en la base de datos:' as info;
SELECT id, value FROM attribute_options WHERE attribute_id = 1;

SELECT 'Asociaciones de variantes con opciones de color:' as info;
SELECT 
  pv.id as variant_id,
  pv.sku,
  ao.id as option_id,
  ao.value as color
FROM product_variants pv
JOIN variant_attribute_options vao ON pv.id = vao.variant_id
JOIN attribute_options ao ON vao.attribute_option_id = ao.id
WHERE pv.product_id = 2 AND ao.attribute_id = 1;
