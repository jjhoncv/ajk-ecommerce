-- ============================================================================
-- MIGRACIÓN 002: OPCIONES DE ATRIBUTOS ESPECÍFICAS POR PRODUCTO
-- ============================================================================
-- Convierte las opciones de atributos de globales a específicas por producto
-- Cada producto tendrá sus propias opciones independientes
-- ============================================================================

-- Paso 1: Deshabilitar foreign key checks
-- ============================================================================
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

-- Paso 2: Renombrar tablas originales a backup
-- ============================================================================
DROP TABLE IF EXISTS product_attribute_options_backup;
DROP TABLE IF EXISTS variant_attribute_options_backup;
DROP TABLE IF EXISTS attribute_option_images_backup;

RENAME TABLE product_attribute_options TO product_attribute_options_backup;
RENAME TABLE variant_attribute_options TO variant_attribute_options_backup;
RENAME TABLE attribute_option_images TO attribute_option_images_backup;

-- Paso 3: Crear nueva tabla product_attribute_options
-- ============================================================================

-- Crear nueva tabla con value almacenado directamente
CREATE TABLE product_attribute_options (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL COMMENT 'ID del producto al que pertenece esta opción',
  attribute_id INT NOT NULL COMMENT 'ID del atributo (Color, Almacenamiento, etc.)',
  value VARCHAR(255) NOT NULL COMMENT 'Valor de la opción (ej: "Titanio Negro", "128GB")',
  display_order INT DEFAULT 0 COMMENT 'Orden de visualización',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (attribute_id) REFERENCES attributes(id) ON DELETE CASCADE,

  UNIQUE KEY unique_product_attr_value (product_id, attribute_id, value),
  INDEX idx_product_id (product_id),
  INDEX idx_attribute_id (attribute_id)
) COMMENT='Opciones de atributos específicas de cada producto';

-- Paso 4: Migrar datos existentes
-- ============================================================================
-- Insertar opciones con sus valores desde el backup
INSERT INTO product_attribute_options (product_id, attribute_id, value, created_at, updated_at)
SELECT
  pao_backup.product_id,
  ao.attribute_id,
  ao.value,
  pao_backup.created_at,
  pao_backup.updated_at
FROM product_attribute_options_backup pao_backup
JOIN attribute_options ao ON pao_backup.attribute_option_id = ao.id
ON DUPLICATE KEY UPDATE updated_at = VALUES(updated_at);

-- Paso 5: Actualizar variant_attribute_options
-- ============================================================================
-- Crear tabla temporal con el mapeo de IDs viejos a nuevos
CREATE TEMPORARY TABLE option_id_mapping AS
SELECT
  pao_backup.attribute_option_id AS old_option_id,
  pao_new.id AS new_option_id,
  pao_backup.product_id
FROM product_attribute_options_backup pao_backup
JOIN attribute_options ao ON pao_backup.attribute_option_id = ao.id
JOIN product_attribute_options pao_new ON
  pao_new.product_id = pao_backup.product_id AND
  pao_new.attribute_id = ao.attribute_id AND
  pao_new.value = ao.value;

-- Eliminar tabla variant_attribute_options
DROP TABLE IF EXISTS variant_attribute_options;

-- Recrear tabla con nueva estructura
CREATE TABLE variant_attribute_options (
  variant_id INT NOT NULL,
  product_attribute_option_id INT NOT NULL COMMENT 'ID de la opción específica del producto',
  additional_cost DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Costo adicional de este atributo para esta variante',

  PRIMARY KEY (variant_id, product_attribute_option_id),

  FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
  FOREIGN KEY (product_attribute_option_id) REFERENCES product_attribute_options(id) ON DELETE CASCADE,

  INDEX idx_variant (variant_id),
  INDEX idx_product_attribute_option (product_attribute_option_id)
);

-- Migrar datos de variantes usando el mapeo
INSERT IGNORE INTO variant_attribute_options (variant_id, product_attribute_option_id, additional_cost)
SELECT
  vao_backup.variant_id,
  mapping.new_option_id,
  vao_backup.additional_cost
FROM variant_attribute_options_backup vao_backup
JOIN product_variants pv ON vao_backup.variant_id = pv.id
JOIN option_id_mapping mapping ON
  vao_backup.attribute_option_id = mapping.old_option_id AND
  mapping.product_id = pv.product_id;

-- Paso 6: Actualizar attribute_option_images (renombrar a product_attribute_option_images)
-- ============================================================================
-- Eliminar tabla de imágenes
DROP TABLE IF EXISTS attribute_option_images;

-- Crear nueva tabla para imágenes de opciones de producto
CREATE TABLE product_attribute_option_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_attribute_option_id INT NOT NULL COMMENT 'ID de la opción específica del producto',
  image_type ENUM('front','back','left','right','top','bottom','detail','lifestyle','packaging') NOT NULL DEFAULT 'front',
  display_order INT DEFAULT 0,
  image_url_thumb VARCHAR(255) NOT NULL COMMENT 'Imagen thumbnail 140x140',
  image_url_normal VARCHAR(255) NOT NULL COMMENT 'Imagen normal 600x800',
  image_url_zoom VARCHAR(255) NOT NULL COMMENT 'Imagen zoom 1200x1200',
  alt_text VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_primary TINYINT(1) DEFAULT 0,

  FOREIGN KEY (product_attribute_option_id) REFERENCES product_attribute_options(id) ON DELETE CASCADE,

  UNIQUE KEY unique_option_type (product_attribute_option_id, image_type),
  INDEX idx_product_attribute_option (product_attribute_option_id)
) COMMENT='Imágenes para opciones de atributos específicas del producto';

-- Migrar imágenes existentes
INSERT IGNORE INTO product_attribute_option_images (
  product_attribute_option_id,
  image_type,
  display_order,
  image_url_thumb,
  image_url_normal,
  image_url_zoom,
  alt_text,
  created_at,
  updated_at,
  is_primary
)
SELECT
  mapping.new_option_id,
  img_backup.image_type,
  img_backup.display_order,
  img_backup.image_url_thumb,
  img_backup.image_url_normal,
  img_backup.image_url_zoom,
  img_backup.alt_text,
  img_backup.created_at,
  img_backup.updated_at,
  img_backup.is_primary
FROM attribute_option_images_backup img_backup
JOIN option_id_mapping mapping ON
  img_backup.attribute_option_id = mapping.old_option_id AND
  (img_backup.product_id IS NULL OR img_backup.product_id = mapping.product_id);

-- Paso 7: Limpiar tablas temporales
-- ============================================================================
DROP TEMPORARY TABLE IF EXISTS option_id_mapping;

-- Restaurar foreign key checks
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;

-- Paso 8: Resumen de migración
-- ============================================================================
SELECT
  'RESUMEN DE MIGRACIÓN' AS info,
  (SELECT COUNT(*) FROM product_attribute_options) AS opciones_migradas,
  (SELECT COUNT(*) FROM variant_attribute_options) AS asociaciones_variantes,
  (SELECT COUNT(*) FROM product_attribute_option_images) AS imagenes_migradas;

-- ============================================================================
-- NOTAS IMPORTANTES:
-- ============================================================================
-- 1. Las opciones de atributos ahora son específicas de cada producto
-- 2. La tabla attribute_options global YA NO SE USA (puede eliminarse después)
-- 3. Cada producto tiene sus propias opciones independientes
-- 4. Las variantes solo pueden usar opciones de su producto padre
-- 5. Las tablas de backup se mantienen por seguridad
-- ============================================================================
