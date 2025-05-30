-- Tabla para gestionar promociones/ofertas
DROP TABLE IF EXISTS `promotions`;
CREATE TABLE `promotions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `discount_type` enum('percentage','fixed_amount') NOT NULL DEFAULT 'percentage',
  `discount_value` decimal(10,2) NOT NULL,
  `min_purchase_amount` decimal(10,2) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Tabla para relacionar promociones con variantes de productos
DROP TABLE IF EXISTS `promotion_variants`;
CREATE TABLE `promotion_variants` (
  `promotion_id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL,
  `promotion_price` decimal(10,2) DEFAULT NULL,
  `stock_limit` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`promotion_id`,`variant_id`),
  KEY `idx_variant` (`variant_id`),
  CONSTRAINT `fk_promotion_variants_promotion` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_promotion_variants_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Datos de ejemplo para promociones
INSERT INTO `promotions` (`id`, `name`, `description`, `start_date`, `end_date`, `discount_type`, `discount_value`, `min_purchase_amount`, `is_active`) VALUES
(1, 'Ofertas del Día', 'Descuentos especiales por 24 horas', '2025-05-30 00:00:00', '2025-05-31 00:00:00', 'percentage', 15.00, NULL, 1),
(2, 'Cyber Week', 'Grandes descuentos en tecnología', '2025-06-01 00:00:00', '2025-06-07 23:59:59', 'percentage', 20.00, NULL, 1),
(3, 'Liquidación Smartphones', 'Precios especiales en smartphones seleccionados', '2025-05-25 00:00:00', '2025-06-10 23:59:59', 'fixed_amount', 200.00, NULL, 1);

-- Asignar promociones a variantes de productos
INSERT INTO `promotion_variants` (`promotion_id`, `variant_id`, `promotion_price`, `stock_limit`) VALUES
(1, 1, 2999.99, 5),
(1, 7, 199.99, 10),
(2, 3, 999.99, NULL),
(2, 4, 999.99, NULL),
(3, 5, 1299.99, 3),
(3, 6, 1299.99, 3);
