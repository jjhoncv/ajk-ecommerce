-- =====================================================
-- MIGRACIÓN: Sistema de Atributos por Producto
-- =====================================================
-- Este script crea la tabla para asociar opciones de atributos
-- específicamente a productos, en lugar de ser globales.
-- =====================================================

-- 1. CREAR NUEVA TABLA
CREATE TABLE IF NOT EXISTS product_attribute_options (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL COMMENT 'ID del producto',
  attribute_option_id INT NOT NULL COMMENT 'ID de la opción de atributo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Foreign keys
  CONSTRAINT fk_pao_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_pao_attribute_option FOREIGN KEY (attribute_option_id) REFERENCES attribute_options(id) ON DELETE CASCADE,

  -- Índices
  INDEX idx_product_id (product_id),
  INDEX idx_attribute_option_id (attribute_option_id),

  -- Restricción única: un producto no puede tener la misma opción duplicada
  UNIQUE KEY unique_product_option (product_id, attribute_option_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Opciones de atributos asignadas a productos específicos';

-- 2. MIGRACIÓN AUTOMÁTICA: Detectar qué opciones usa cada producto
-- Esto analiza las variantes existentes y asigna automáticamente
-- las opciones de atributos que ya están en uso
INSERT INTO product_attribute_options (product_id, attribute_option_id)
SELECT DISTINCT
    pv.product_id,
    vao.attribute_option_id
FROM variant_attribute_options vao
INNER JOIN product_variants pv ON vao.variant_id = pv.id
WHERE NOT EXISTS (
    SELECT 1 FROM product_attribute_options pao
    WHERE pao.product_id = pv.product_id
    AND pao.attribute_option_id = vao.attribute_option_id
)
ORDER BY pv.product_id, vao.attribute_option_id;

-- 3. VERIFICACIÓN: Mostrar cuántas opciones se asignaron por producto
SELECT
    p.id AS product_id,
    p.name AS product_name,
    COUNT(pao.id) AS opciones_asignadas,
    GROUP_CONCAT(
        CONCAT(a.name, ': ', ao.value)
        ORDER BY a.name
        SEPARATOR ', '
    ) AS opciones
FROM products p
LEFT JOIN product_attribute_options pao ON p.id = pao.product_id
LEFT JOIN attribute_options ao ON pao.attribute_option_id = ao.id
LEFT JOIN attributes a ON ao.attribute_id = a.id
GROUP BY p.id, p.name
ORDER BY p.name;

-- 4. DETECTAR POSIBLES INCONSISTENCIAS
-- Este query muestra productos con opciones que podrían ser incorrectas
-- basándose en el nombre del atributo
SELECT
    p.name AS producto,
    a.name AS atributo,
    ao.value AS opcion,
    COUNT(pv.id) AS variantes_usando
FROM product_attribute_options pao
JOIN products p ON pao.product_id = p.id
JOIN attribute_options ao ON pao.attribute_option_id = ao.id
JOIN attributes a ON ao.attribute_id = a.id
LEFT JOIN product_variants pv ON pv.product_id = p.id
LEFT JOIN variant_attribute_options vao ON vao.variant_id = pv.id
    AND vao.attribute_option_id = ao.id
GROUP BY p.id, p.name, a.id, a.name, ao.id, ao.value
ORDER BY p.name, a.name, ao.value;

-- =====================================================
-- INSTRUCCIONES:
-- 1. Revisar el resultado de la verificación (paso 3)
-- 2. Revisar posibles inconsistencias (paso 4)
-- 3. Usar la herramienta de admin para limpiar opciones incorrectas
-- =====================================================
