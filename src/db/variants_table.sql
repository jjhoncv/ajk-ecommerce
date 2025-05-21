-- Tabla de variantes de productos
DROP TABLE IF EXISTS `product_variants`;
CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `sku` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  KEY `idx_product` (`product_id`),
  CONSTRAINT `fk_variant_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Actualizar las restricciones de clave foránea en las tablas relacionadas
ALTER TABLE `variant_attribute_options`
ADD CONSTRAINT `fk_vao_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `fk_vao_attribute_option` FOREIGN KEY (`attribute_option_id`) REFERENCES `attribute_options` (`id`) ON DELETE CASCADE;

ALTER TABLE `variant_images`
ADD CONSTRAINT `fk_vi_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;

-- Datos de ejemplo para variantes
INSERT INTO `product_variants` (`id`, `product_id`, `sku`, `price`, `stock`) VALUES
(1, 1, 'LAPTOP-PRO-15-8GB', 3499.99, 10),
(2, 1, 'LAPTOP-PRO-15-16GB', 3999.99, 5),
(3, 2, 'PHONE-X-BLACK-128GB', 1299.99, 20),
(4, 2, 'PHONE-X-WHITE-128GB', 1299.99, 15),
(5, 2, 'PHONE-X-BLACK-256GB', 1499.99, 8),
(6, 2, 'PHONE-X-WHITE-256GB', 1499.99, 12),
(7, 3, 'HEADPHONES-PRO-BLACK', 249.99, 30),
(8, 3, 'HEADPHONES-PRO-WHITE', 249.99, 25),
(9, 4, 'SMARTWATCH-5-BLACK', 399.99, 18),
(10, 4, 'SMARTWATCH-5-SILVER', 399.99, 22);
