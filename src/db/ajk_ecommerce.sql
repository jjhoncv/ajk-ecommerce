-- -------------------------------------------------------------
-- TablePlus 6.4.2(600)
--
-- https://tableplus.com/
--
-- Database: ajk_ecommerce
-- Generation Time: 2025-06-02 18:26:57.5730
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


DROP TABLE IF EXISTS `attribute_option_images`;
CREATE TABLE `attribute_option_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `attribute_option_id` int(11) NOT NULL,
  `image_url_thumb` varchar(255) NOT NULL COMMENT 'Imagen thumbnail 140x140 para selector de atributo',
  `image_url_normal` varchar(255) DEFAULT NULL COMMENT 'Imagen normal 600x800 (opcional)',
  `image_url_zoom` varchar(255) DEFAULT NULL COMMENT 'Imagen zoom 1200x1200 (opcional)',
  `alt_text` varchar(255) DEFAULT NULL COMMENT 'Texto alternativo',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_attribute_option` (`attribute_option_id`),
  KEY `idx_attribute_option` (`attribute_option_id`),
  CONSTRAINT `fk_aoi_attribute_option` FOREIGN KEY (`attribute_option_id`) REFERENCES `attribute_options` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='Imágenes para opciones de atributos (colores, materiales, etc.)';

DROP TABLE IF EXISTS `attribute_options`;
CREATE TABLE `attribute_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `attribute_id` int(11) NOT NULL,
  `value` varchar(255) NOT NULL,
  `additional_cost` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `idx_attribute` (`attribute_id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `attributes`;
CREATE TABLE `attributes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `display_type` enum('radio','pills','select','color','custom') NOT NULL DEFAULT 'select',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `banner`;
CREATE TABLE `banner` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `display_order` int(11) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `brands`;
CREATE TABLE `brands` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `parent_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_parent` (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastname` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `customers_addresses`;
CREATE TABLE `customers_addresses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `id_customer` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_customer` (`id_customer`),
  CONSTRAINT `customers_addresses_ibfk_1` FOREIGN KEY (`id_customer`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `product_categories`;
CREATE TABLE `product_categories` (
  `product_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`category_id`),
  KEY `idx_category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP VIEW IF EXISTS `product_rating_summary`;


DROP TABLE IF EXISTS `product_variants`;
CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `sku` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  KEY `idx_product` (`product_id`),
  CONSTRAINT `fk_variant_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `brand_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `base_price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_brand` (`brand_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `rating_images`;
CREATE TABLE `rating_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rating_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_rating` (`rating_id`),
  CONSTRAINT `fk_rating_image` FOREIGN KEY (`rating_id`) REFERENCES `variant_ratings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `roles_sections`;
CREATE TABLE `roles_sections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_section` int(11) DEFAULT NULL,
  `id_rol` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_rol` (`id_rol`) USING BTREE,
  KEY `id_section` (`id_section`) USING BTREE,
  CONSTRAINT `roles_sections_ibfk_1` FOREIGN KEY (`id_section`) REFERENCES `sections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `roles_sections_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `sections`;
CREATE TABLE `sections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `display_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `services`;
CREATE TABLE `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `display_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `services_images`;
CREATE TABLE `services_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `display_order` int(11) DEFAULT NULL,
  `id_service` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_service` (`id_service`),
  CONSTRAINT `services_images_ibfk_1` FOREIGN KEY (`id_service`) REFERENCES `services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastname` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`) USING BTREE,
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `variant_attribute_options`;
CREATE TABLE `variant_attribute_options` (
  `variant_id` int(11) NOT NULL,
  `attribute_option_id` int(11) NOT NULL,
  PRIMARY KEY (`variant_id`,`attribute_option_id`),
  UNIQUE KEY `unique_variant_attribute` (`variant_id`,`attribute_option_id`),
  KEY `idx_attribute_option` (`attribute_option_id`),
  KEY `idx_variant` (`variant_id`),
  CONSTRAINT `fk_vao_attribute_option` FOREIGN KEY (`attribute_option_id`) REFERENCES `attribute_options` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_vao_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `variant_images`;
CREATE TABLE `variant_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `variant_id` int(11) NOT NULL,
  `image_type` enum('front','back','left','right','top','bottom','detail','lifestyle','packaging') NOT NULL DEFAULT 'front',
  `image_url_thumb` varchar(255) NOT NULL COMMENT 'Imagen thumbnail 140x140',
  `image_url_normal` varchar(255) NOT NULL COMMENT 'Imagen normal 600x800',
  `image_url_zoom` varchar(255) NOT NULL COMMENT 'Imagen zoom 1200x1200',
  `is_primary` tinyint(1) DEFAULT '0' COMMENT 'Imagen principal de la variante',
  `display_order` int(11) DEFAULT '0' COMMENT 'Orden de visualización',
  `alt_text` varchar(255) DEFAULT NULL COMMENT 'Texto alternativo para SEO',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_variant` (`variant_id`),
  KEY `idx_type_order` (`image_type`,`display_order`),
  CONSTRAINT `fk_vi_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COMMENT='Imágenes de variantes con múltiples tamaños y tipos';

DROP VIEW IF EXISTS `variant_rating_summary`;


DROP TABLE IF EXISTS `variant_ratings`;
CREATE TABLE `variant_ratings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `variant_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `rating` tinyint(1) NOT NULL DEFAULT '5',
  `review` text,
  `title` varchar(255) DEFAULT NULL,
  `verified_purchase` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_customer_variant` (`customer_id`,`variant_id`),
  KEY `idx_variant` (`variant_id`),
  KEY `idx_customer` (`customer_id`),
  CONSTRAINT `fk_rating_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rating_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

INSERT INTO `attribute_option_images` (`id`, `attribute_option_id`, `image_url_thumb`, `image_url_normal`, `image_url_zoom`, `alt_text`, `created_at`, `updated_at`) VALUES
(1, 28, '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-blanco-attr-thumb.webp', NULL, NULL, 'iPhone 16 Pro Max Titanio Blanco', '2025-06-02 22:33:23', '2025-06-02 22:33:23'),
(2, 29, '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-negro-attr-thumb.webp', NULL, NULL, 'iPhone 16 Pro Max Titanio Negro', '2025-06-02 22:33:23', '2025-06-02 22:33:23'),
(3, 30, '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-natural-attr-thumb.webp', NULL, NULL, 'iPhone 16 Pro Max Titanio Natural', '2025-06-02 22:33:23', '2025-06-02 22:33:23'),
(4, 31, '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-desierto-attr-thumb.webp', NULL, NULL, 'iPhone 16 Pro Max Titanio Desierto', '2025-06-02 22:33:23', '2025-06-02 22:33:23');

INSERT INTO `attribute_options` (`id`, `attribute_id`, `value`, `additional_cost`) VALUES
(1, 1, 'Negro', 0.00),
(2, 1, 'Blanco', 0.00),
(3, 1, 'Plata', 0.00),
(4, 1, 'Azul', 0.00),
(5, 2, '13 pulgadas', 0.00),
(6, 2, '15 pulgadas', 0.00),
(7, 2, '17 pulgadas', 0.00),
(8, 3, '128GB', 0.00),
(9, 3, '256GB', 0.00),
(10, 3, '512GB', 0.00),
(11, 3, '1TB', 0.00),
(12, 3, '8GB RAM', 0.00),
(13, 3, '16GB RAM', 0.00),
(14, 3, '32GB RAM', 0.00),
(25, 4, 'Plástico', 0.00),
(26, 4, 'Aluminio', 500.00),
(27, 4, 'Fibra de Carbono', 1000.00),
(28, 1, 'Titanio Blanco', 0.00),
(29, 1, 'Titanio Negro', 0.00),
(30, 1, 'Titanio Natural', 0.00),
(31, 1, 'Titanio Desierto', 0.00),
(32, 3, '256GB', 0.00),
(33, 3, '512GB', 200.00),
(34, 3, '1TB', 500.00);

INSERT INTO `attributes` (`id`, `name`, `display_type`) VALUES
(1, 'Color', 'color'),
(2, 'Tamaño', 'radio'),
(3, 'Almacenamiento', 'pills'),
(4, 'Material', 'pills');

INSERT INTO `brands` (`id`, `name`) VALUES
(1, 'TechPro'),
(2, 'Apple'),
(3, 'SoundMaster'),
(4, 'SmartLife');

INSERT INTO `categories` (`id`, `name`, `description`, `parent_id`, `image_url`) VALUES
(1, 'Electrónicos', 'Productos electrónicos de alta calidad', NULL, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Electrónicos'),
(2, 'Computadoras', 'Laptops y computadoras de escritorio', 1, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Computadoras'),
(3, 'Laptops', 'Computadoras portátiles', 2, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Laptops'),
(4, 'Smartphones', 'Teléfonos inteligentes', 1, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Smartphones'),
(5, 'Audio', 'Dispositivos de audio', 1, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Audio'),
(6, 'Auriculares', 'Auriculares y audífonos', 5, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Auriculares'),
(7, 'Wearables', 'Dispositivos vestibles', 1, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Wearables'),
(8, 'Smartwatches', 'Relojes inteligentes', 7, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Smartwatches'),
(21, 'iPhone', 'Smartphones iPhone de Apple', 4, 'https://placehold.co/600x400/e2e8f0/1e293b?text=iPhone');

INSERT INTO `customers` (`id`, `username`, `email`, `password`, `address_id`, `is_active`, `created_at`, `updated_at`, `lastname`, `photo`, `name`) VALUES
(3, 'Jhonnatan', 'user@example.com', '$2a$10$vk7kb/OC.HsSXps.x3DbwuJrn5GjmCbkto43TX9S8G0SyUU/ofzvq', 1, 1, '2024-08-16 02:41:34', '2024-11-30 00:05:34', 'Castro', '/uploads/1732925134811-802344022.jpeg', NULL),
(4, 'asd', 'asd@asd.com', '$2b$10$RwSQFjp0aF8IcAVGqymgWO7fB6WyMr4VJmc2L5aHOuEAuvS2IU3Ee', NULL, 1, '2025-05-21 04:49:46', '2025-05-21 04:49:46', 'asd', NULL, 'asd');

INSERT INTO `product_categories` (`product_id`, `category_id`) VALUES
(1, 2),
(1, 3),
(2, 1),
(2, 4),
(3, 1),
(3, 5),
(3, 6),
(4, 1),
(4, 7),
(4, 8),
(5, 4),
(5, 21);

INSERT INTO `product_variants` (`id`, `product_id`, `sku`, `price`, `stock`, `created_at`, `updated_at`) VALUES
(1, 1, 'LAPTOP-PRO-15-8GB-BLACK', 3499.99, 10, '2025-05-21 06:04:54', '2025-05-30 21:23:37'),
(2, 1, 'LAPTOP-PRO-15-16GB', 3999.99, 5, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(3, 2, 'PHONE-X-BLACK-128GB', 1299.99, 20, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(4, 2, 'PHONE-X-WHITE-128GB', 1299.99, 15, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(5, 2, 'PHONE-X-BLACK-256GB', 1499.99, 8, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(6, 2, 'PHONE-X-WHITE-256GB', 1499.99, 12, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(7, 3, 'HEADPHONES-PRO-BLACK', 249.99, 30, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(8, 3, 'HEADPHONES-PRO-WHITE', 249.99, 25, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(9, 4, 'SMARTWATCH-5-BLACK', 399.99, 18, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(10, 4, 'SMARTWATCH-5-SILVER', 399.99, 22, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(11, 1, 'LAPTOP-PRO-15-8GB-WHITE', 3499.99, 13, '2025-05-30 21:25:05', '2025-05-30 21:25:05');

INSERT INTO `products` (`id`, `name`, `description`, `brand_id`, `created_at`, `updated_at`, `base_price`) VALUES
(1, 'Laptop Ultrabook Pro', 'Laptop ultradelgada con procesador de última generación', 1, '2025-01-15 10:00:00', '2025-01-15 10:00:00', 3499.99),
(2, 'IPhone 16 Pro Max', 'Imponente diseño de titanio. Control de la Cámara. 4K Dolby Vision a 120 cps. Y el chip A18 Pro.', 2, '2025-01-20 11:30:00', '2025-06-02 18:07:49', 1299.99),
(3, 'Auriculares Inalámbricos Pro', 'Auriculares con cancelación de ruido y alta fidelidad', 3, '2025-02-05 09:15:00', '2025-02-05 09:15:00', 249.99),
(4, 'Smartwatch Huawei Watch FIT 3 Sport 1.82\" AMOLED', 'Reloj inteligente con monitor de salud y GPS', 4, '2025-02-10 14:45:00', '2025-06-02 18:06:22', 399.99),
(5, 'iPhone 16 Pro Max', 'El iPhone más avanzado con pantalla Super Retina XDR de 6.9 pulgadas', 1, '2025-06-02 22:33:23', '2025-06-02 22:33:23', 1199.99);

INSERT INTO `promotion_variants` (`promotion_id`, `variant_id`, `promotion_price`, `stock_limit`, `created_at`) VALUES
(1, 1, 2999.99, 5, '2025-05-30 17:41:53'),
(1, 7, 199.99, 10, '2025-05-30 17:41:53'),
(2, 3, 999.99, NULL, '2025-05-30 17:41:53'),
(2, 4, 999.99, NULL, '2025-05-30 17:41:53'),
(3, 5, 1299.99, 3, '2025-05-30 17:41:53'),
(3, 6, 1299.99, 3, '2025-05-30 17:41:53');

INSERT INTO `promotions` (`id`, `name`, `description`, `start_date`, `end_date`, `discount_type`, `discount_value`, `min_purchase_amount`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Ofertas del Día', 'Descuentos especiales por 24 horas', '2025-05-30 00:00:00', '2025-05-31 00:00:00', 'percentage', 15.00, NULL, 1, '2025-05-30 17:41:53', '2025-05-30 17:41:53'),
(2, 'Cyber Week', 'Grandes descuentos en tecnología', '2025-06-01 00:00:00', '2025-06-07 23:59:59', 'percentage', 20.00, NULL, 1, '2025-05-30 17:41:53', '2025-05-30 17:41:53'),
(3, 'Liquidación Smartphones', 'Precios especiales en smartphones seleccionados', '2025-05-25 00:00:00', '2025-06-10 23:59:59', 'fixed_amount', 200.00, NULL, 1, '2025-05-30 17:41:53', '2025-05-30 17:41:53');

INSERT INTO `rating_images` (`id`, `rating_id`, `image_url`, `created_at`) VALUES
(1, 1, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Review-Image-1', '2025-05-30 18:56:20'),
(2, 1, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Review-Image-2', '2025-05-30 18:56:20'),
(3, 3, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Review-Image-3', '2025-05-30 18:56:20'),
(4, 7, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Review-Image-4', '2025-05-30 18:56:20'),
(5, 9, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Review-Image-5', '2025-05-30 18:56:20');

INSERT INTO `roles` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'superadmin', '2024-08-06 20:59:34', '2024-08-06 20:59:34'),
(2, 'admin', '2024-08-06 20:59:34', '2024-08-06 20:59:34');

INSERT INTO `roles_sections` (`id`, `id_section`, `id_rol`) VALUES
(86, 1, 2),
(87, 2, 2),
(88, 3, 2),
(99, 2, 1),
(100, 3, 1),
(101, 4, 1),
(102, 5, 1),
(103, 6, 1),
(104, 7, 1),
(105, 8, 1),
(106, 1, 1);

INSERT INTO `sections` (`id`, `name`, `url`, `image`, `display_order`) VALUES
(1, 'banners', '/dashboard/banners', 'Image', 1),
(2, 'services', '/dashboard/services', 'HandPlatter', 3),
(3, 'projects', '/dashboard/projects', 'FolderKanban', 4),
(4, 'pages', '/dashboard/pages', 'StickyNote', 2),
(5, 'gallery', '/dashboard/gallery', 'GalleryHorizontal', 5),
(6, 'profile', '/dashboard/profile', 'UserPen', 6),
(7, 'users', '/dashboard/users', 'Users', 7),
(8, 'roles', '/dashboard/roles', 'SlidersHorizontal', 8);

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role_id`, `is_active`, `created_at`, `updated_at`, `lastname`, `photo`) VALUES
(3, 'Jhonnatan', 'admin@example.com', '$2a$10$vk7kb/OC.HsSXps.x3DbwuJrn5GjmCbkto43TX9S8G0SyUU/ofzvq', 1, 1, '2024-08-16 02:41:34', '2024-11-30 00:05:34', 'Castro', '/uploads/1732925134811-802344022.jpeg'),
(13, 'Derek', 'test@example.com', '$2a$10$yZd0FgII.5BMqj0p3o9eWOgKRppXAfOo/efab7NxFiBHCfyMYD3qa', 2, 1, '2024-08-16 03:41:19', '2024-10-29 00:36:55', 'Vito2', NULL);

INSERT INTO `variant_attribute_options` (`variant_id`, `attribute_option_id`) VALUES
(1, 1),
(1, 6),
(1, 12),
(2, 1),
(2, 6),
(2, 13),
(3, 1),
(3, 8),
(4, 2),
(4, 8),
(5, 1),
(5, 9),
(6, 2),
(6, 9),
(7, 1),
(8, 2),
(9, 1),
(10, 3),
(11, 2),
(11, 6),
(11, 12);

INSERT INTO `variant_images` (`id`, `variant_id`, `image_type`, `image_url_thumb`, `image_url_normal`, `image_url_zoom`, `is_primary`, `display_order`, `alt_text`, `created_at`, `updated_at`) VALUES
(1, 11, 'front', '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-blanco-1-thumb.webp', '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-blanco-1-default.webp', '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-blanco-1-zoom.webp', 1, 1, 'iPhone 16 Pro Max Titanio Blanco - Vista frontal', '2025-06-02 22:33:23', '2025-06-02 22:33:23'),
(2, 11, 'back', '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-blanco-2-thumb.webp', '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-blanco-2-default.webp', '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-blanco-2-zoom.webp', 0, 2, 'iPhone 16 Pro Max Titanio Blanco - Vista trasera', '2025-06-02 22:33:23', '2025-06-02 22:33:23'),
(3, 11, 'left', '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-blanco-3-thumb.webp', '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-blanco-3-default.webp', '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-blanco-3-zoom.webp', 0, 3, 'iPhone 16 Pro Max Titanio Blanco - Vista lateral', '2025-06-02 22:33:23', '2025-06-02 22:33:23'),
(4, 11, 'detail', '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-blanco-4-thumb.webp', '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-blanco-4-default.webp', '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-blanco-4-zoom.webp', 0, 4, 'iPhone 16 Pro Max Titanio Blanco - Detalle de cámara', '2025-06-02 22:33:23', '2025-06-02 22:33:23'),
(5, 11, 'lifestyle', '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-blanco-5-thumb.webp', '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-blanco-5-default.webp', '/images/products/iphone-16/pro-max/iphone-16-pro-max-titanio-blanco-5-zoom.webp', 0, 5, 'iPhone 16 Pro Max Titanio Blanco - Lifestyle', '2025-06-02 22:33:23', '2025-06-02 22:33:23'),
(6, 3, 'front', 'https://placehold.co/140x140/1f2937/ffffff?text=iPhone+Negro+128GB', 'https://placehold.co/600x800/1f2937/ffffff?text=iPhone+16+Pro+Max+Negro+128GB+Front', 'https://placehold.co/1200x1200/1f2937/ffffff?text=iPhone+16+Pro+Max+Negro+128GB+Front+Zoom', 1, 1, 'iPhone 16 Pro Max Negro 128GB - Vista frontal', '2025-06-02 23:12:13', '2025-06-02 23:12:13'),
(7, 3, 'back', 'https://placehold.co/140x140/1f2937/ffffff?text=iPhone+Negro+Back', 'https://placehold.co/600x800/1f2937/ffffff?text=iPhone+16+Pro+Max+Negro+128GB+Back', 'https://placehold.co/1200x1200/1f2937/ffffff?text=iPhone+16+Pro+Max+Negro+128GB+Back+Zoom', 0, 2, 'iPhone 16 Pro Max Negro 128GB - Vista trasera', '2025-06-02 23:12:13', '2025-06-02 23:12:13'),
(8, 3, 'left', 'https://placehold.co/140x140/1f2937/ffffff?text=iPhone+Negro+Side', 'https://placehold.co/600x800/1f2937/ffffff?text=iPhone+16+Pro+Max+Negro+128GB+Side', 'https://placehold.co/1200x1200/1f2937/ffffff?text=iPhone+16+Pro+Max+Negro+128GB+Side+Zoom', 0, 3, 'iPhone 16 Pro Max Negro 128GB - Vista lateral', '2025-06-02 23:12:13', '2025-06-02 23:12:13'),
(9, 4, 'front', 'https://placehold.co/140x140/f8fafc/1f2937?text=iPhone+Blanco+128GB', 'https://placehold.co/600x800/f8fafc/1f2937?text=iPhone+16+Pro+Max+Blanco+128GB+Front', 'https://placehold.co/1200x1200/f8fafc/1f2937?text=iPhone+16+Pro+Max+Blanco+128GB+Front+Zoom', 1, 1, 'iPhone 16 Pro Max Blanco 128GB - Vista frontal', '2025-06-02 23:12:13', '2025-06-02 23:12:13'),
(10, 4, 'back', 'https://placehold.co/140x140/f8fafc/1f2937?text=iPhone+Blanco+Back', 'https://placehold.co/600x800/f8fafc/1f2937?text=iPhone+16+Pro+Max+Blanco+128GB+Back', 'https://placehold.co/1200x1200/f8fafc/1f2937?text=iPhone+16+Pro+Max+Blanco+128GB+Back+Zoom', 0, 2, 'iPhone 16 Pro Max Blanco 128GB - Vista trasera', '2025-06-02 23:12:13', '2025-06-02 23:12:13'),
(11, 4, 'left', 'https://placehold.co/140x140/f8fafc/1f2937?text=iPhone+Blanco+Side', 'https://placehold.co/600x800/f8fafc/1f2937?text=iPhone+16+Pro+Max+Blanco+128GB+Side', 'https://placehold.co/1200x1200/f8fafc/1f2937?text=iPhone+16+Pro+Max+Blanco+128GB+Side+Zoom', 0, 3, 'iPhone 16 Pro Max Blanco 128GB - Vista lateral', '2025-06-02 23:12:13', '2025-06-02 23:12:13'),
(12, 5, 'front', 'https://placehold.co/140x140/1f2937/ffffff?text=iPhone+Negro+256GB', 'https://placehold.co/600x800/1f2937/ffffff?text=iPhone+16+Pro+Max+Negro+256GB+Front', 'https://placehold.co/1200x1200/1f2937/ffffff?text=iPhone+16+Pro+Max+Negro+256GB+Front+Zoom', 1, 1, 'iPhone 16 Pro Max Negro 256GB - Vista frontal', '2025-06-02 23:12:13', '2025-06-02 23:12:13'),
(13, 5, 'back', 'https://placehold.co/140x140/1f2937/ffffff?text=iPhone+Negro+256+Back', 'https://placehold.co/600x800/1f2937/ffffff?text=iPhone+16+Pro+Max+Negro+256GB+Back', 'https://placehold.co/1200x1200/1f2937/ffffff?text=iPhone+16+Pro+Max+Negro+256GB+Back+Zoom', 0, 2, 'iPhone 16 Pro Max Negro 256GB - Vista trasera', '2025-06-02 23:12:13', '2025-06-02 23:12:13'),
(14, 5, 'detail', 'https://placehold.co/140x140/1f2937/ffffff?text=iPhone+Negro+Detail', 'https://placehold.co/600x800/1f2937/ffffff?text=iPhone+16+Pro+Max+Negro+256GB+Camera', 'https://placehold.co/1200x1200/1f2937/ffffff?text=iPhone+16+Pro+Max+Negro+256GB+Camera+Zoom', 0, 3, 'iPhone 16 Pro Max Negro 256GB - Detalle de cámara', '2025-06-02 23:12:13', '2025-06-02 23:12:13'),
(15, 6, 'front', 'https://placehold.co/140x140/f8fafc/1f2937?text=iPhone+Blanco+256GB', 'https://placehold.co/600x800/f8fafc/1f2937?text=iPhone+16+Pro+Max+Blanco+256GB+Front', 'https://placehold.co/1200x1200/f8fafc/1f2937?text=iPhone+16+Pro+Max+Blanco+256GB+Front+Zoom', 1, 1, 'iPhone 16 Pro Max Blanco 256GB - Vista frontal', '2025-06-02 23:12:13', '2025-06-02 23:12:13'),
(16, 6, 'back', 'https://placehold.co/140x140/f8fafc/1f2937?text=iPhone+Blanco+256+Back', 'https://placehold.co/600x800/f8fafc/1f2937?text=iPhone+16+Pro+Max+Blanco+256GB+Back', 'https://placehold.co/1200x1200/f8fafc/1f2937?text=iPhone+16+Pro+Max+Blanco+256GB+Back+Zoom', 0, 2, 'iPhone 16 Pro Max Blanco 256GB - Vista trasera', '2025-06-02 23:12:13', '2025-06-02 23:12:13'),
(17, 6, 'detail', 'https://placehold.co/140x140/f8fafc/1f2937?text=iPhone+Blanco+Detail', 'https://placehold.co/600x800/f8fafc/1f2937?text=iPhone+16+Pro+Max+Blanco+256GB+Camera', 'https://placehold.co/1200x1200/f8fafc/1f2937?text=iPhone+16+Pro+Max+Blanco+256GB+Camera+Zoom', 0, 3, 'iPhone 16 Pro Max Blanco 256GB - Detalle de cámara', '2025-06-02 23:12:13', '2025-06-02 23:12:13'),
(18, 3, 'front', 'https://placehold.co/140x140/1f2937/ffffff?text=iPhone+Negro+128GB', 'https://placehold.co/600x800/1f2937/ffffff?text=iPhone+16+Pro+Max+Negro+128GB+Front', 'https://placehold.co/1200x1200/1f2937/ffffff?text=iPhone+16+Pro+Max+Negro+128GB+Front+Zoom', 1, 1, 'iPhone 16 Pro Max Negro 128GB - Vista frontal', '2025-06-02 23:17:38', '2025-06-02 23:17:38'),
(19, 3, 'back', 'https://placehold.co/140x140/1f2937/ffffff?text=iPhone+Negro+Back', 'https://placehold.co/600x800/1f2937/ffffff?text=iPhone+16+Pro+Max+Negro+128GB+Back', 'https://placehold.co/1200x1200/1f2937/ffffff?text=iPhone+16+Pro+Max+Negro+128GB+Back+Zoom', 0, 2, 'iPhone 16 Pro Max Negro 128GB - Vista trasera', '2025-06-02 23:17:38', '2025-06-02 23:17:38'),
(20, 3, 'left', 'https://placehold.co/140x140/1f2937/ffffff?text=iPhone+Negro+Side', 'https://placehold.co/600x800/1f2937/ffffff?text=iPhone+16+Pro+Max+Negro+128GB+Side', 'https://placehold.co/1200x1200/1f2937/ffffff?text=iPhone+16+Pro+Max+Negro+128GB+Side+Zoom', 0, 3, 'iPhone 16 Pro Max Negro 128GB - Vista lateral', '2025-06-02 23:17:38', '2025-06-02 23:17:38'),
(21, 4, 'front', 'https://placehold.co/140x140/f8fafc/1f2937?text=iPhone+Blanco+128GB', 'https://placehold.co/600x800/f8fafc/1f2937?text=iPhone+16+Pro+Max+Blanco+128GB+Front', 'https://placehold.co/1200x1200/f8fafc/1f2937?text=iPhone+16+Pro+Max+Blanco+128GB+Front+Zoom', 1, 1, 'iPhone 16 Pro Max Blanco 128GB - Vista frontal', '2025-06-02 23:17:38', '2025-06-02 23:17:38'),
(22, 4, 'back', 'https://placehold.co/140x140/f8fafc/1f2937?text=iPhone+Blanco+Back', 'https://placehold.co/600x800/f8fafc/1f2937?text=iPhone+16+Pro+Max+Blanco+128GB+Back', 'https://placehold.co/1200x1200/f8fafc/1f2937?text=iPhone+16+Pro+Max+Blanco+128GB+Back+Zoom', 0, 2, 'iPhone 16 Pro Max Blanco 128GB - Vista trasera', '2025-06-02 23:17:38', '2025-06-02 23:17:38'),
(23, 4, 'left', 'https://placehold.co/140x140/f8fafc/1f2937?text=iPhone+Blanco+Side', 'https://placehold.co/600x800/f8fafc/1f2937?text=iPhone+16+Pro+Max+Blanco+128GB+Side', 'https://placehold.co/1200x1200/f8fafc/1f2937?text=iPhone+16+Pro+Max+Blanco+128GB+Side+Zoom', 0, 3, 'iPhone 16 Pro Max Blanco 128GB - Vista lateral', '2025-06-02 23:17:38', '2025-06-02 23:17:38'),
(24, 5, 'front', 'https://placehold.co/140x140/1f2937/ffffff?text=iPhone+Negro+256GB', 'https://placehold.co/600x800/1f2937/ffffff?text=iPhone+16+Pro+Max+Negro+256GB+Front', 'https://placehold.co/1200x1200/1f2937/ffffff?text=iPhone+16+Pro+Max+Negro+256GB+Front+Zoom', 1, 1, 'iPhone 16 Pro Max Negro 256GB - Vista frontal', '2025-06-02 23:17:38', '2025-06-02 23:17:38'),
(25, 5, 'back', 'https://placehold.co/140x140/1f2937/ffffff?text=iPhone+Negro+256+Back', 'https://placehold.co/600x800/1f2937/ffffff?text=iPhone+16+Pro+Max+Negro+256GB+Back', 'https://placehold.co/1200x1200/1f2937/ffffff?text=iPhone+16+Pro+Max+Negro+256GB+Back+Zoom', 0, 2, 'iPhone 16 Pro Max Negro 256GB - Vista trasera', '2025-06-02 23:17:38', '2025-06-02 23:17:38'),
(26, 5, 'detail', 'https://placehold.co/140x140/1f2937/ffffff?text=iPhone+Negro+Detail', 'https://placehold.co/600x800/1f2937/ffffff?text=iPhone+16+Pro+Max+Negro+256GB+Camera', 'https://placehold.co/1200x1200/1f2937/ffffff?text=iPhone+16+Pro+Max+Negro+256GB+Camera+Zoom', 0, 3, 'iPhone 16 Pro Max Negro 256GB - Detalle de cámara', '2025-06-02 23:17:38', '2025-06-02 23:17:38'),
(27, 6, 'front', 'https://placehold.co/140x140/f8fafc/1f2937?text=iPhone+Blanco+256GB', 'https://placehold.co/600x800/f8fafc/1f2937?text=iPhone+16+Pro+Max+Blanco+256GB+Front', 'https://placehold.co/1200x1200/f8fafc/1f2937?text=iPhone+16+Pro+Max+Blanco+256GB+Front+Zoom', 1, 1, 'iPhone 16 Pro Max Blanco 256GB - Vista frontal', '2025-06-02 23:17:38', '2025-06-02 23:17:38'),
(28, 6, 'back', 'https://placehold.co/140x140/f8fafc/1f2937?text=iPhone+Blanco+256+Back', 'https://placehold.co/600x800/f8fafc/1f2937?text=iPhone+16+Pro+Max+Blanco+256GB+Back', 'https://placehold.co/1200x1200/f8fafc/1f2937?text=iPhone+16+Pro+Max+Blanco+256GB+Back+Zoom', 0, 2, 'iPhone 16 Pro Max Blanco 256GB - Vista trasera', '2025-06-02 23:17:38', '2025-06-02 23:17:38'),
(29, 6, 'detail', 'https://placehold.co/140x140/f8fafc/1f2937?text=iPhone+Blanco+Detail', 'https://placehold.co/600x800/f8fafc/1f2937?text=iPhone+16+Pro+Max+Blanco+256GB+Camera', 'https://placehold.co/1200x1200/f8fafc/1f2937?text=iPhone+16+Pro+Max+Blanco+256GB+Camera+Zoom', 0, 3, 'iPhone 16 Pro Max Blanco 256GB - Detalle de cámara', '2025-06-02 23:17:38', '2025-06-02 23:17:38');

INSERT INTO `variant_ratings` (`id`, `variant_id`, `customer_id`, `rating`, `review`, `title`, `verified_purchase`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 5, 'Excelente laptop, muy rápida y con buena duración de batería.', 'Compra perfecta', 1, '2025-05-30 18:56:20', '2025-05-30 18:56:20'),
(2, 1, 4, 4, 'Buena laptop, pero un poco pesada para llevar a todos lados.', 'Buen producto', 1, '2025-05-30 18:56:20', '2025-05-30 18:56:20'),
(3, 2, 3, 5, 'La memoria adicional hace una gran diferencia en el rendimiento.', 'Vale la pena pagar más', 1, '2025-05-30 18:56:20', '2025-05-30 18:56:20'),
(4, 3, 4, 4, 'Buen teléfono, la cámara es excelente pero la batería podría durar más.', 'Muy satisfecho', 1, '2025-05-30 18:56:20', '2025-05-30 18:56:20'),
(5, 4, 3, 3, 'El color blanco se ensucia fácilmente, pero funciona bien.', 'Funcional pero requiere cuidado', 0, '2025-05-30 18:56:20', '2025-05-30 18:56:20'),
(6, 7, 3, 5, 'La cancelación de ruido es impresionante, perfectos para viajar.', 'Los mejores auriculares', 1, '2025-05-30 18:56:20', '2025-05-30 18:56:20'),
(7, 8, 4, 4, 'Buena calidad de sonido, pero un poco incómodos después de varias horas.', 'Buenos pero mejorables', 1, '2025-05-30 18:56:20', '2025-05-30 18:56:20'),
(8, 9, 3, 5, 'Monitorea perfectamente mi actividad física y las notificaciones son útiles.', 'Excelente smartwatch', 1, '2025-05-30 18:56:20', '2025-05-30 18:56:20'),
(9, 10, 4, 4, 'Buena duración de batería y diseño elegante.', 'Recomendado', 0, '2025-05-30 18:56:20', '2025-05-30 18:56:20');

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `product_rating_summary` AS select `pv`.`product_id` AS `product_id`,count(`vr`.`id`) AS `total_ratings`,avg(`vr`.`rating`) AS `average_rating`,sum((case when (`vr`.`rating` = 5) then 1 else 0 end)) AS `five_star`,sum((case when (`vr`.`rating` = 4) then 1 else 0 end)) AS `four_star`,sum((case when (`vr`.`rating` = 3) then 1 else 0 end)) AS `three_star`,sum((case when (`vr`.`rating` = 2) then 1 else 0 end)) AS `two_star`,sum((case when (`vr`.`rating` = 1) then 1 else 0 end)) AS `one_star`,sum((case when (`vr`.`verified_purchase` = 1) then 1 else 0 end)) AS `verified_purchases` from (`product_variants` `pv` left join `variant_ratings` `vr` on((`pv`.`id` = `vr`.`variant_id`))) group by `pv`.`product_id`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `variant_rating_summary` AS select `variant_ratings`.`variant_id` AS `variant_id`,count(0) AS `total_ratings`,avg(`variant_ratings`.`rating`) AS `average_rating`,sum((case when (`variant_ratings`.`rating` = 5) then 1 else 0 end)) AS `five_star`,sum((case when (`variant_ratings`.`rating` = 4) then 1 else 0 end)) AS `four_star`,sum((case when (`variant_ratings`.`rating` = 3) then 1 else 0 end)) AS `three_star`,sum((case when (`variant_ratings`.`rating` = 2) then 1 else 0 end)) AS `two_star`,sum((case when (`variant_ratings`.`rating` = 1) then 1 else 0 end)) AS `one_star`,sum((case when (`variant_ratings`.`verified_purchase` = 1) then 1 else 0 end)) AS `verified_purchases` from `variant_ratings` group by `variant_ratings`.`variant_id`;


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;