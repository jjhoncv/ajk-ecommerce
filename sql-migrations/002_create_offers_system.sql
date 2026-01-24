-- =====================================================
-- SISTEMA DE OFERTAS - AJK E-Commerce
-- Migración: 002_create_offers_system.sql
-- Fecha: 2026-01-24
-- =====================================================

-- -----------------------------------------------------
-- Tabla: offers (Ofertas principales)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `offers` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL COMMENT 'Nombre interno de la oferta',
  `title` VARCHAR(255) NOT NULL COMMENT 'Título visible para el cliente',
  `description` TEXT DEFAULT NULL,

  -- Tipo de oferta
  `offer_type` ENUM('flash_sale', 'daily_deal', 'clearance', 'bundle', 'volume_discount', 'seasonal') NOT NULL DEFAULT 'flash_sale',

  -- Configuración de descuento
  `discount_type` ENUM('percentage', 'fixed_amount', 'fixed_price') NOT NULL DEFAULT 'percentage',
  `discount_value` DECIMAL(10,2) NOT NULL COMMENT 'Valor del descuento (% o monto fijo)',

  -- Temporalidad
  `start_date` DATETIME NOT NULL,
  `end_date` DATETIME NOT NULL,

  -- Límites de uso
  `max_uses` INT(11) DEFAULT NULL COMMENT 'Máximo de usos totales (NULL = ilimitado)',
  `max_uses_per_customer` INT(11) DEFAULT 1 COMMENT 'Máximo por cliente',
  `current_uses` INT(11) DEFAULT 0 COMMENT 'Contador de usos actuales',

  -- Condiciones
  `min_quantity` INT(11) DEFAULT 1 COMMENT 'Cantidad mínima para aplicar',
  `min_purchase_amount` DECIMAL(10,2) DEFAULT NULL COMMENT 'Monto mínimo de compra',

  -- Configuración visual
  `badge_text` VARCHAR(50) DEFAULT NULL COMMENT 'Texto del badge (FLASH, -50%, HOT)',
  `badge_color` VARCHAR(20) DEFAULT 'red' COMMENT 'Color del badge',
  `show_countdown` TINYINT(1) DEFAULT 0 COMMENT 'Mostrar contador regresivo',
  `show_stock_indicator` TINYINT(1) DEFAULT 0 COMMENT 'Mostrar indicador de stock',
  `show_savings` TINYINT(1) DEFAULT 1 COMMENT 'Mostrar cuánto ahorra',

  -- Imagen/Banner para landing page de ofertas
  `image_url` VARCHAR(255) DEFAULT NULL,

  -- Prioridad (si hay múltiples ofertas, cuál aplica primero)
  `priority` INT(11) DEFAULT 0 COMMENT 'Mayor número = mayor prioridad',

  -- Estado
  `is_active` TINYINT(1) DEFAULT 1,
  `is_featured` TINYINT(1) DEFAULT 0 COMMENT 'Destacar en home/landing',

  -- Timestamps
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  INDEX `idx_offer_type` (`offer_type`),
  INDEX `idx_dates_active` (`start_date`, `end_date`, `is_active`),
  INDEX `idx_featured` (`is_featured`, `is_active`),
  INDEX `idx_priority` (`priority` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Ofertas y descuentos especiales';

-- -----------------------------------------------------
-- Tabla: offer_variants (Variantes en oferta)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `offer_variants` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `offer_id` INT(11) NOT NULL,
  `variant_id` INT(11) NOT NULL,

  -- Precio de oferta (puede ser calculado o fijo)
  `offer_price` DECIMAL(10,2) NOT NULL COMMENT 'Precio final de la oferta',
  `original_price` DECIMAL(10,2) NOT NULL COMMENT 'Precio original al momento de crear',

  -- Stock específico para la oferta
  `stock_limit` INT(11) DEFAULT NULL COMMENT 'Stock máximo para esta oferta (NULL = sin límite)',
  `sold_count` INT(11) DEFAULT 0 COMMENT 'Unidades vendidas en esta oferta',

  -- Timestamps
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_offer_variant` (`offer_id`, `variant_id`),
  INDEX `idx_variant` (`variant_id`),
  INDEX `idx_offer` (`offer_id`),

  CONSTRAINT `fk_offer_variants_offer` FOREIGN KEY (`offer_id`)
    REFERENCES `offers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_offer_variants_variant` FOREIGN KEY (`variant_id`)
    REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Variantes incluidas en cada oferta';

-- -----------------------------------------------------
-- Tabla: offer_categories (Categorías en oferta - opcional)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `offer_categories` (
  `offer_id` INT(11) NOT NULL,
  `category_id` INT(11) NOT NULL,

  PRIMARY KEY (`offer_id`, `category_id`),

  CONSTRAINT `fk_offer_categories_offer` FOREIGN KEY (`offer_id`)
    REFERENCES `offers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_offer_categories_category` FOREIGN KEY (`category_id`)
    REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Categorías completas en oferta';

-- -----------------------------------------------------
-- Tabla: offer_usage (Historial de uso de ofertas)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `offer_usage` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `offer_id` INT(11) NOT NULL,
  `customer_id` INT(11) NOT NULL,
  `order_id` INT(11) NOT NULL,
  `variant_id` INT(11) NOT NULL,
  `quantity` INT(11) NOT NULL DEFAULT 1,
  `original_price` DECIMAL(10,2) NOT NULL,
  `offer_price` DECIMAL(10,2) NOT NULL,
  `discount_amount` DECIMAL(10,2) NOT NULL COMMENT 'Ahorro total',
  `used_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  INDEX `idx_offer` (`offer_id`),
  INDEX `idx_customer` (`customer_id`),
  INDEX `idx_order` (`order_id`),
  INDEX `idx_customer_offer` (`customer_id`, `offer_id`),

  CONSTRAINT `fk_offer_usage_offer` FOREIGN KEY (`offer_id`)
    REFERENCES `offers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_offer_usage_customer` FOREIGN KEY (`customer_id`)
    REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_offer_usage_order` FOREIGN KEY (`order_id`)
    REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Historial de uso de ofertas';

-- -----------------------------------------------------
-- Vista: active_offers (Ofertas activas con stock disponible)
-- -----------------------------------------------------
CREATE OR REPLACE VIEW `active_offers` AS
SELECT
  o.*,
  COUNT(ov.variant_id) AS total_variants,
  SUM(ov.sold_count) AS total_sold,
  MIN(ov.offer_price) AS min_price,
  MAX(
    CASE
      WHEN o.discount_type = 'percentage' THEN o.discount_value
      ELSE ROUND(((ov.original_price - ov.offer_price) / ov.original_price) * 100, 0)
    END
  ) AS max_discount_percent
FROM offers o
LEFT JOIN offer_variants ov ON o.id = ov.offer_id
WHERE o.is_active = 1
  AND NOW() BETWEEN o.start_date AND o.end_date
  AND (o.max_uses IS NULL OR o.current_uses < o.max_uses)
GROUP BY o.id;

-- -----------------------------------------------------
-- Vista: variant_active_offers (Ofertas activas por variante)
-- -----------------------------------------------------
CREATE OR REPLACE VIEW `variant_active_offers` AS
SELECT
  ov.variant_id,
  ov.offer_id,
  ov.offer_price,
  ov.original_price,
  ov.stock_limit,
  ov.sold_count,
  (ov.stock_limit - ov.sold_count) AS remaining_stock,
  o.name AS offer_name,
  o.title AS offer_title,
  o.offer_type,
  o.discount_type,
  o.discount_value,
  o.start_date,
  o.end_date,
  o.badge_text,
  o.badge_color,
  o.show_countdown,
  o.show_stock_indicator,
  o.show_savings,
  o.priority,
  ROUND(((ov.original_price - ov.offer_price) / ov.original_price) * 100, 0) AS discount_percent,
  (ov.original_price - ov.offer_price) AS savings_amount
FROM offer_variants ov
INNER JOIN offers o ON ov.offer_id = o.id
WHERE o.is_active = 1
  AND NOW() BETWEEN o.start_date AND o.end_date
  AND (o.max_uses IS NULL OR o.current_uses < o.max_uses)
  AND (ov.stock_limit IS NULL OR ov.sold_count < ov.stock_limit)
ORDER BY o.priority DESC, o.end_date ASC;

-- -----------------------------------------------------
-- Insertar datos de ejemplo
-- -----------------------------------------------------

-- Flash Sale de ejemplo
INSERT INTO `offers` (
  `name`, `title`, `description`, `offer_type`,
  `discount_type`, `discount_value`,
  `start_date`, `end_date`,
  `max_uses`, `max_uses_per_customer`,
  `badge_text`, `badge_color`, `show_countdown`, `show_stock_indicator`,
  `priority`, `is_active`, `is_featured`
) VALUES (
  'Flash Sale iPhone',
  'Flash Sale - Solo 3 horas',
  'Aprovecha este descuento exclusivo por tiempo limitado',
  'flash_sale',
  'percentage', 25.00,
  NOW(), DATE_ADD(NOW(), INTERVAL 72 HOUR),
  20, 1,
  'FLASH -25%', 'red', 1, 1,
  100, 1, 1
);

-- Daily Deal de ejemplo
INSERT INTO `offers` (
  `name`, `title`, `description`, `offer_type`,
  `discount_type`, `discount_value`,
  `start_date`, `end_date`,
  `badge_text`, `badge_color`, `show_countdown`,
  `priority`, `is_active`, `is_featured`
) VALUES (
  'Oferta del Día - Smartwatch',
  'Oferta del Día',
  'Nuevo producto en oferta cada día',
  'daily_deal',
  'fixed_amount', 80.00,
  CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY),
  'HOY -S/80', 'orange', 1,
  90, 1, 1
);

-- Liquidación de ejemplo
INSERT INTO `offers` (
  `name`, `title`, `description`, `offer_type`,
  `discount_type`, `discount_value`,
  `start_date`, `end_date`,
  `badge_text`, `badge_color`, `show_stock_indicator`,
  `priority`, `is_active`
) VALUES (
  'Liquidación Audífonos',
  'Últimas Unidades',
  'Stock limitado - ¡No te quedes sin el tuyo!',
  'clearance',
  'percentage', 35.00,
  NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY),
  'ÚLTIMAS!', 'purple', 1,
  80, 1
);

-- Descuento por volumen
INSERT INTO `offers` (
  `name`, `title`, `description`, `offer_type`,
  `discount_type`, `discount_value`,
  `start_date`, `end_date`,
  `min_quantity`,
  `badge_text`, `badge_color`,
  `priority`, `is_active`
) VALUES (
  'Compra 2 y Ahorra',
  'Compra 2 o más y obtén 15% OFF',
  'Descuento aplicable al comprar 2 o más unidades',
  'volume_discount',
  'percentage', 15.00,
  NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY),
  2,
  '2+ = 15%OFF', 'green',
  70, 1
);

-- Asociar variantes a las ofertas
-- Flash Sale - iPhones
INSERT INTO `offer_variants` (`offer_id`, `variant_id`, `offer_price`, `original_price`, `stock_limit`)
SELECT 1, id, ROUND(price * 0.75, 2), price, 5
FROM `product_variants` WHERE product_id = 2 LIMIT 2;

-- Daily Deal - Smartwatch
INSERT INTO `offer_variants` (`offer_id`, `variant_id`, `offer_price`, `original_price`, `stock_limit`)
SELECT 2, id, price - 80, price, 10
FROM `product_variants` WHERE product_id = 4 LIMIT 1;

-- Liquidación - Audífonos
INSERT INTO `offer_variants` (`offer_id`, `variant_id`, `offer_price`, `original_price`, `stock_limit`)
SELECT 3, id, ROUND(price * 0.65, 2), price, NULL
FROM `product_variants` WHERE product_id = 3;

-- Volumen - Laptops
INSERT INTO `offer_variants` (`offer_id`, `variant_id`, `offer_price`, `original_price`, `stock_limit`)
SELECT 4, id, ROUND(price * 0.85, 2), price, NULL
FROM `product_variants` WHERE product_id = 1;

-- -----------------------------------------------------
-- Agregar sección de ofertas al admin
-- -----------------------------------------------------
INSERT INTO `sections` (`name`, `url`, `image`, `display_order`)
VALUES ('offers', '/offers', 'Tag', 10);

-- Asignar permiso a superadmin
INSERT INTO `roles_sections` (`id_section`, `id_rol`)
SELECT s.id, 1 FROM `sections` s WHERE s.url = '/offers';

-- =====================================================
-- FIN DE MIGRACIÓN
-- =====================================================
