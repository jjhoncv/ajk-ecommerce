-- ============================================================================
-- MIGRACIÓN 002: OPCIONES DE ATRIBUTOS ESPECÍFICAS POR PRODUCTO (SIMPLE)
-- ============================================================================
-- Crea estructura para que cada producto tenga sus propias opciones
-- No requiere migración de datos ya que el sistema está limpio
-- ============================================================================

SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

-- Paso 1: Limpiar tablas existentes
-- ============================================================================
DROP TABLE IF EXISTS variant_attribute_options;
DROP TABLE IF EXISTS product_attribute_option_images;
DROP TABLE IF EXISTS product_attribute_options;

-- Paso 2: Crear product_attribute_options con opciones específicas por producto
-- ============================================================================
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

-- Paso 3: Crear variant_attribute_options
-- ============================================================================
CREATE TABLE variant_attribute_options (
  variant_id INT NOT NULL,
  product_attribute_option_id INT NOT NULL COMMENT 'ID de la opción específica del producto',
  additional_cost DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Costo adicional para esta variante',

  PRIMARY KEY (variant_id, product_attribute_option_id),

  FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
  FOREIGN KEY (product_attribute_option_id) REFERENCES product_attribute_options(id) ON DELETE CASCADE,

  INDEX idx_variant (variant_id),
  INDEX idx_product_attribute_option (product_attribute_option_id)
) COMMENT='Asociación entre variantes y opciones de atributos del producto';

-- Paso 4: Crear product_attribute_option_images
-- ============================================================================
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

-- Paso 5: Restaurar foreign key checks
-- ============================================================================
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;

-- Paso 6: Resumen
-- ============================================================================
SELECT
  'MIGRACIÓN COMPLETADA' AS status,
  'Las tablas han sido creadas con la nueva estructura' AS message,
  'Cada producto ahora puede tener sus propias opciones de atributos' AS info;

-- ============================================================================
-- NOTAS:
-- ============================================================================
-- 1. product_attribute_options ahora almacena el VALUE directamente
-- 2. NO hay opciones globales compartidas, cada producto tiene las suyas
-- 3. Las variantes solo pueden usar opciones de SU producto padre
-- 4. La tabla attribute_options global puede seguir usándose como referencia
--    pero NO se comparten instancias entre productos
-- ============================================================================
