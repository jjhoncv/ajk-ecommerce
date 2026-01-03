-- -------------------------------------------------------------
-- TablePlus 6.6.8(632)
--
-- https://tableplus.com/
--
-- Database: ajkecommerce
-- Generation Time: 2026-01-02 20:13:33.0700
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
  `image_type` enum('front','back','left','right','top','bottom','detail','lifestyle','packaging') NOT NULL DEFAULT 'front',
  `display_order` int(11) DEFAULT '0',
  `image_url_thumb` varchar(255) NOT NULL COMMENT 'Imagen thumbnail 140x140 para selector de atributo',
  `image_url_normal` varchar(255) NOT NULL COMMENT 'Imagen normal 600x800 (opcional)',
  `image_url_zoom` varchar(255) NOT NULL COMMENT 'Imagen zoom 1200x1200 (opcional)',
  `alt_text` varchar(255) DEFAULT NULL COMMENT 'Texto alternativo',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_primary` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_attribute_option_type` (`attribute_option_id`,`image_type`),
  KEY `idx_attribute_option` (`attribute_option_id`),
  CONSTRAINT `fk_aoi_attribute_option` FOREIGN KEY (`attribute_option_id`) REFERENCES `attribute_options` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COMMENT='Imágenes para opciones de atributos (colores, materiales, etc.)';

DROP TABLE IF EXISTS `attribute_options`;
CREATE TABLE `attribute_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `attribute_id` int(11) NOT NULL,
  `value` varchar(255) NOT NULL,
  `additional_cost` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `idx_attribute` (`attribute_id`),
  CONSTRAINT `attribute_options_ibfk_1` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=latin1;

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
  `button_text` varchar(255) DEFAULT NULL,
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
  `show_nav` int(11) DEFAULT '0',
  `display_order` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_parent` (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `coupon_usage`;
CREATE TABLE `coupon_usage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coupon_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL,
  `used_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_coupon_order` (`coupon_id`,`order_id`),
  KEY `order_id` (`order_id`),
  KEY `idx_customer_coupon` (`customer_id`,`coupon_id`),
  CONSTRAINT `coupon_usage_ibfk_1` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `coupon_usage_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `coupon_usage_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `coupons`;
CREATE TABLE `coupons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `discount_type` enum('fixed_amount','percentage') NOT NULL,
  `discount_value` decimal(10,4) NOT NULL,
  `min_purchase_amount` decimal(10,2) DEFAULT '0.00',
  `max_discount_amount` decimal(10,2) DEFAULT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `usage_limit_per_customer` int(11) DEFAULT '1',
  `used_count` int(11) DEFAULT '0',
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `applicable_to` enum('all','categories','products') DEFAULT 'all',
  `applicable_ids` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code_active` (`code`,`is_active`),
  KEY `idx_dates_active` (`start_date`,`end_date`,`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastname` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(9) DEFAULT NULL COMMENT 'numero de celular',
  `dni` varchar(8) DEFAULT NULL COMMENT 'Documento de identidad ',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `customers_addresses`;
CREATE TABLE `customers_addresses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_customer` int(11) NOT NULL,
  `alias` varchar(100) NOT NULL COMMENT 'Nombre de la dirección (Casa, Oficina, etc.)',
  `department` varchar(100) NOT NULL DEFAULT 'LIMA',
  `province` varchar(100) NOT NULL DEFAULT 'LIMA',
  `district` varchar(100) NOT NULL,
  `street_name` varchar(255) NOT NULL COMMENT 'Nombre de la avenida/calle/jirón',
  `street_number` varchar(50) NOT NULL COMMENT 'Número de la dirección',
  `apartment` varchar(100) DEFAULT NULL COMMENT 'Dpto/Interior/Piso/Lote/Bloque (opcional)',
  `latitude` decimal(10,8) DEFAULT NULL COMMENT 'Latitud GPS',
  `longitude` decimal(11,8) DEFAULT NULL COMMENT 'Longitud GPS',
  `is_default` tinyint(1) DEFAULT '0' COMMENT '1 = dirección por defecto',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_customer` (`id_customer`),
  KEY `idx_default` (`id_customer`,`is_default`),
  KEY `idx_coordinates` (`latitude`,`longitude`),
  CONSTRAINT `customers_addresses_ibfk_1` FOREIGN KEY (`id_customer`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL COMMENT 'Variante del producto comprada',
  `product_name` varchar(255) NOT NULL COMMENT 'Nombre del producto al momento de compra',
  `variant_sku` varchar(255) NOT NULL COMMENT 'SKU de la variante',
  `variant_attributes` json DEFAULT NULL COMMENT 'Atributos de la variante (color, talla, etc.)',
  `quantity` int(11) NOT NULL DEFAULT '1',
  `unit_price` decimal(10,2) NOT NULL COMMENT 'Precio unitario al momento de compra',
  `total_price` decimal(10,2) NOT NULL COMMENT 'Precio total (quantity * unit_price)',
  `discount_amount` decimal(10,2) DEFAULT '0.00' COMMENT 'Descuento aplicado a este item',
  PRIMARY KEY (`id`),
  KEY `idx_order` (`order_id`),
  KEY `idx_variant` (`variant_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COMMENT='Items/productos de cada orden';

DROP VIEW IF EXISTS `order_summary`;


DROP TABLE IF EXISTS `order_tracking`;
CREATE TABLE `order_tracking` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `tracking_number` varchar(100) DEFAULT NULL COMMENT 'Número de seguimiento del courier',
  `courier_company` varchar(100) DEFAULT NULL COMMENT 'Empresa de courier (Olva, Shalom, etc.)',
  `status` enum('preparing','shipped','in_transit','out_for_delivery','delivered','failed_delivery') NOT NULL DEFAULT 'preparing',
  `current_location` varchar(255) DEFAULT NULL COMMENT 'Ubicación actual del paquete',
  `shipped_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `delivered_to` varchar(255) DEFAULT NULL COMMENT 'Nombre de quien recibió',
  `delivery_notes` text COMMENT 'Notas de entrega',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id` (`order_id`),
  KEY `idx_tracking_number` (`tracking_number`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_order_tracking_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='Seguimiento de envíos';

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `order_number` varchar(50) NOT NULL COMMENT 'Número único de orden (ORD-2025-001234)',
  `status` enum('pending','processing','shipped','delivered','cancelled','refunded') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `subtotal` decimal(10,2) NOT NULL COMMENT 'Subtotal antes de descuentos',
  `discount_amount` decimal(10,2) DEFAULT '0.00' COMMENT 'Descuento aplicado',
  `shipping_cost` decimal(10,2) DEFAULT '0.00' COMMENT 'Costo de envío',
  `tax_amount` decimal(10,2) DEFAULT '0.00' COMMENT 'Impuestos (IGV)',
  `total_amount` decimal(10,2) NOT NULL COMMENT 'Total final a pagar',
  `shipping_address_id` int(11) NOT NULL COMMENT 'Dirección de envío',
  `shipping_method` varchar(100) DEFAULT 'standard' COMMENT 'Método de envío',
  `estimated_delivery` date DEFAULT NULL COMMENT 'Fecha estimada de entrega',
  `payment_method` varchar(50) DEFAULT NULL COMMENT 'Método de pago usado',
  `payment_status` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  `paid_at` timestamp NULL DEFAULT NULL COMMENT 'Fecha de pago confirmado',
  `customer_notes` text COMMENT 'Notas del cliente',
  `admin_notes` text COMMENT 'Notas internas del admin',
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `idx_customer` (`customer_id`),
  KEY `idx_status` (`status`),
  KEY `idx_payment_status` (`payment_status`),
  KEY `idx_created` (`created_at`),
  KEY `idx_shipping_address` (`shipping_address_id`),
  KEY `idx_customer_status_date` (`customer_id`,`status`,`created_at`),
  KEY `idx_payment_status_date` (`payment_status`,`created_at`),
  KEY `idx_status_delivery` (`status`,`estimated_delivery`),
  CONSTRAINT `fk_orders_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `fk_orders_shipping_address` FOREIGN KEY (`shipping_address_id`) REFERENCES `customers_addresses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COMMENT='Órdenes principales del ecommerce';

DROP TABLE IF EXISTS `payment_methods`;
CREATE TABLE `payment_methods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` text,
  `icon_url` varchar(500) DEFAULT NULL,
  `processing_fee_type` enum('fixed','percentage') DEFAULT 'percentage',
  `processing_fee_value` decimal(10,4) DEFAULT '0.0000',
  `min_amount` decimal(10,2) DEFAULT '0.00',
  `max_amount` decimal(10,2) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `requires_verification` tinyint(1) DEFAULT '0',
  `display_order` int(11) DEFAULT '0',
  `settings` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `payment_transactions`;
CREATE TABLE `payment_transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `payment_method_id` int(11) NOT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `reference_number` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `processing_fee` decimal(10,2) DEFAULT '0.00',
  `net_amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'PEN',
  `status` enum('pending','processing','completed','failed','cancelled','refunded') DEFAULT 'pending',
  `payment_data` json DEFAULT NULL,
  `gateway_response` json DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `payment_method_id` (`payment_method_id`),
  KEY `idx_order_payment` (`order_id`,`payment_method_id`),
  KEY `idx_transaction_id` (`transaction_id`),
  KEY `idx_reference_number` (`reference_number`),
  KEY `idx_status_created` (`status`,`created_at`),
  CONSTRAINT `payment_transactions_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payment_transactions_ibfk_2` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `product_categories`;
CREATE TABLE `product_categories` (
  `product_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`category_id`),
  KEY `idx_category` (`category_id`),
  CONSTRAINT `fk_product_categories_category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_product_categories_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
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
  KEY `idx_brand` (`brand_id`),
  CONSTRAINT `fk_products_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `promotion_variants`;
CREATE TABLE `promotion_variants` (
  `promotion_id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL,
  `promotion_price` decimal(10,2) DEFAULT NULL,
  `stock_limit` int(11) NOT NULL,
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
  `type` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `display_order` int(11) DEFAULT '0',
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `shipping_methods`;
CREATE TABLE `shipping_methods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `base_cost` decimal(10,2) NOT NULL DEFAULT '0.00',
  `free_shipping_threshold` decimal(10,2) DEFAULT NULL,
  `estimated_days_min` int(11) DEFAULT '1',
  `estimated_days_max` int(11) DEFAULT '7',
  `is_active` tinyint(1) DEFAULT '1',
  `display_order` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `shipping_zone_methods`;
CREATE TABLE `shipping_zone_methods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shipping_method_id` int(11) NOT NULL,
  `shipping_zone_id` int(11) NOT NULL,
  `cost` decimal(10,2) NOT NULL DEFAULT '0.00',
  `free_shipping_threshold` decimal(10,2) NOT NULL DEFAULT '0.00',
  `estimated_days_min` int(11) DEFAULT '1',
  `estimated_days_max` int(11) DEFAULT '7',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_method_zone` (`shipping_method_id`,`shipping_zone_id`),
  KEY `shipping_zone_id` (`shipping_zone_id`),
  CONSTRAINT `shipping_zone_methods_ibfk_1` FOREIGN KEY (`shipping_method_id`) REFERENCES `shipping_methods` (`id`) ON DELETE CASCADE,
  CONSTRAINT `shipping_zone_methods_ibfk_2` FOREIGN KEY (`shipping_zone_id`) REFERENCES `shipping_zones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `shipping_zones`;
CREATE TABLE `shipping_zones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `districts` json NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) DEFAULT '2',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastname` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`) USING BTREE,
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Imágenes de variantes con múltiples tamaños y tipos';

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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

INSERT INTO `attribute_option_images` (`id`, `attribute_option_id`, `image_type`, `display_order`, `image_url_thumb`, `image_url_normal`, `image_url_zoom`, `alt_text`, `created_at`, `updated_at`, `is_primary`) VALUES
(1, 28, 'front', 2, '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-thumb.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-default.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-default.webp', 'iPhone 16 Pro Max Titanio Blanco', '2025-06-02 22:33:23', '2025-06-14 16:32:21', 0),
(2, 29, 'front', 2, '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-front-thumb.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-front-default.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-front-default.webp', 'iPhone 16 Pro Max Titanio Negro', '2025-06-02 22:33:23', '2025-06-14 16:32:21', 0),
(3, 30, 'back', 0, '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-natural-back-thumb.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-natural-back-default.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-natural-back-default.webp', 'iPhone 16 Pro Max Titanio Natural', '2025-06-02 22:33:23', '2025-06-12 16:48:28', 1),
(4, 31, 'back', 0, '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-desierto-back-thumb.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-desierto-back-default.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-desierto-back-default.webp', 'iPhone 16 Pro Max Titanio Desierto', '2025-06-02 22:33:23', '2025-06-12 16:48:28', 1),
(8, 28, 'back', 0, '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-back-thumb.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-back-default.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-back-default.webp', 'iPhone 16 Pro Max Titanio Blanco - Vista Trasera', '2025-06-03 07:56:37', '2025-06-14 17:38:32', 1),
(9, 28, 'left', 1, '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-left-thumb.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-left-default.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-left-default.webp', 'iPhone 16 Pro Max Titanio Blanco - Vista Lateral', '2025-06-03 07:56:37', '2025-06-14 16:30:34', 0),
(10, 29, 'back', 0, '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-back-thumb.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-back-default.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-back-default.webp', 'iPhone 16 Pro Max Titanio Negro - Vista Trasera', '2025-06-03 07:56:37', '2025-06-14 16:32:43', 1),
(11, 29, 'left', 1, '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-left-thumb.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-left-default.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-left-default.webp', 'iPhone 16 Pro Max Titanio Negro - Vista Lateral', '2025-06-03 07:56:37', '2025-06-14 16:30:34', 0),
(12, 35, 'front', 0, '/images/products/smartwatch/smartwatch-negro-front-thumb.webp', '/images/products/smartwatch/smartwatch-negro-front-default.webp', '/images/products/smartwatch/smartwatch-negro-front-default.webp', 'Smartwatch Huawei Watch FIT 3 Sport 1.82\" AMOLED - Vista Frontal', '2025-06-03 23:36:05', '2025-06-12 16:48:28', 1),
(13, 36, 'front', 0, '/images/products/smartwatch/smartwatch-blanco-front-thumb.webp', '/images/products/smartwatch/smartwatch-blanco-front-default.webp', '/images/products/smartwatch/smartwatch-blanco-front-default.webp', 'Smartwatch Huawei Watch FIT 3 Sport 1.82\" AMOLED - Vista Frontal', '2025-06-04 00:03:36', '2025-06-12 16:48:28', 1),
(14, 37, 'front', 0, '/images/products/audifonos/audifonos-front-black-thumb.webp', '/images/products/audifonos/audifonos-front-black-default.webp', '/images/products/audifonos/audifonos-front-black-default.webp', 'audifonos', '2025-06-23 06:49:25', '2025-06-23 06:54:42', 1),
(15, 38, 'front', 0, '/images/products/audifonos/audifonos-front-white-thumb.webp', '/images/products/audifonos/audifonos-front-white-default.webp', '/images/products/audifonos/audifonos-front-white-default.webp', 'audifonos', '2025-06-23 06:57:33', '2025-06-23 06:57:33', 1);

INSERT INTO `attribute_options` (`id`, `attribute_id`, `value`, `additional_cost`) VALUES
(1, 1, 'Negro', 0.00),
(2, 1, 'Blanco', 0.00),
(3, 1, 'Plata', 0.00),
(4, 1, 'Azul', 0.00),
(5, 2, '13 pulgadas', 0.00),
(6, 2, '15 pulgadas', 0.00),
(7, 2, '17 pulgadas', 0.00),
(8, 3, '128GB RAM', 0.00),
(9, 3, '256GB RAM', 0.00),
(10, 3, '512GB RAM', 0.00),
(11, 3, '1TB RAM', 0.00),
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
(32, 3, '256GB RAM', 0.00),
(33, 3, '512GB RAM', 200.00),
(34, 3, '1TB RAM', 500.00),
(35, 1, 'Negro', 0.00),
(36, 1, 'Blanco', 0.00),
(37, 1, 'Negro', 0.00),
(38, 1, 'Blanco', 0.00);

INSERT INTO `attributes` (`id`, `name`, `display_type`) VALUES
(1, 'Color', 'color'),
(2, 'Tamaño', 'radio'),
(3, 'Almacenamiento', 'pills'),
(4, 'Material', 'pills');

INSERT INTO `banner` (`id`, `title`, `subtitle`, `description`, `created_at`, `updated_at`, `display_order`, `link`, `image_url`, `button_text`) VALUES
(1, 'Ahorra hasta 50% OFF en toda la tienda', 'No te pierdas las ofertas increíbles', 'Aprovecha nuestras ofertas especiales en tecnología', '2025-06-23 17:52:06', '2025-08-12 23:14:03', 1, 'http:///www.com', '/uploads/1755040412311-626359976.webp', 'Comprar Ahora'),
(2, 'Ahorra hasta S/1,200', 'Descuentos en Tecnología', 'Los mejores smartphones y laptops con precios especiales', '2025-06-23 17:52:59', '2025-08-12 23:28:35', 9999, 'http://localhost:3000/promotions', '/images/banners/banner2.webp', 'Ver Ofertas');

INSERT INTO `brands` (`id`, `name`) VALUES
(1, 'TechPro'),
(2, 'Apple'),
(3, 'SoundMaster'),
(4, 'SmartLife');

INSERT INTO `categories` (`id`, `name`, `description`, `parent_id`, `image_url`, `show_nav`, `display_order`) VALUES
(1, 'Electrónicos', 'Dispositivos electrónicos y tecnología', NULL, '/uploads/1755045098102-869152374.webp', 1, 1),
(2, 'Ropa y Moda', 'Vestimenta y accesorios de moda', NULL, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop', 1, 2),
(3, 'Hogar y Jardín', 'Artículos para el hogar y jardín', NULL, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=200&fit=crop', 0, 12),
(4, 'Deportes', 'Equipos y accesorios deportivos', NULL, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop', 0, 10),
(5, 'Salud y Belleza', 'Productos de cuidado personal', NULL, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=200&fit=crop', 0, 17),
(6, 'Smartphones', 'Teléfonos inteligentes y accesorios', 1, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=200&fit=crop', 0, 6),
(7, 'Computadoras', 'Laptops, PCs y accesorios', NULL, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=200&fit=crop', 1, 16),
(10, 'Wearables2', 'Smartwatches y dispositivos vestibles', 1, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=200&fit=crop', 0, 9),
(11, 'iPhone3', 'Smartphones Apple iPhone', 6, 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&h=200&fit=crop', 0, 14),
(12, 'Samsung Galaxy', 'Smartphones Samsung Galaxy', 6, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=200&fit=crop', 0, 19),
(13, 'Xiaomi', 'Smartphones Xiaomi', 6, 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=200&fit=crop', 0, 11),
(14, 'Accesorios Móviles', 'Fundas, cargadores y accesorios', 6, 'https://images.unsplash.com/photo-1601593346740-925612772716?w=400&h=200&fit=crop', 0, 18),
(15, 'Laptops2', 'Computadoras portátiles', NULL, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=200&fit=crop', 0, 7),
(16, 'PCs de Escritorio', 'Computadoras de escritorio', 7, 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&h=200&fit=crop', 0, 13),
(17, 'Componentes PC', 'Procesadores, RAM, tarjetas gráficas', NULL, 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=200&fit=crop', 0, 15),
(18, 'Periféricos2', 'Teclados, ratones, monitores', NULL, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=200&fit=crop', 0, 8),
(19, 'Ropa Hombre', 'Vestimenta masculina', 2, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop', 0, 5),
(20, 'Ropa Mujer', 'Vestimenta femenina', 2, 'https://images.unsplash.com/photo-1494790108755-2616c9c0e4b5?w=400&h=200&fit=crop', 1, 4);

INSERT INTO `customers` (`id`, `email`, `password`, `address_id`, `is_active`, `created_at`, `updated_at`, `lastname`, `photo`, `name`, `phone`, `dni`) VALUES
(3, 'user@example.com', '$2b$12$jMi5XEnLsw70nHr6uFccvufU29hRsAHw68dIRS/gDiSZa.W/rhnsC', 1, 1, '2024-08-16 02:41:34', '2025-06-26 22:18:30', 'Castro', '', 'Jhonnatan', '', ''),
(4, 'asd@asd.com', '$2b$10$RwSQFjp0aF8IcAVGqymgWO7fB6WyMr4VJmc2L5aHOuEAuvS2IU3Ee', NULL, 1, '2025-05-21 04:49:46', '2025-05-21 04:49:46', 'asd', NULL, 'asd', '', '');

INSERT INTO `customers_addresses` (`id`, `id_customer`, `alias`, `department`, `province`, `district`, `street_name`, `street_number`, `apartment`, `latitude`, `longitude`, `is_default`, `created_at`, `updated_at`) VALUES
(8, 3, 'Direccion de trabajo', 'LIMA', 'LIMA', 'JESÚS MARÍA', 'Jr Arona', '3935', 'piso 5/ unidad UND', NULL, NULL, 0, '2025-06-18 19:19:47', '2025-06-20 01:14:06'),
(9, 3, 'Direccion de casa', 'LIMA', 'LIMA', 'LOS OLIVOS', 'Jr Las Azucenas', '3935', 'dpto 201', NULL, NULL, 1, '2025-06-20 01:13:18', '2025-06-20 01:14:58');

INSERT INTO `order_items` (`id`, `order_id`, `variant_id`, `product_name`, `variant_sku`, `variant_attributes`, `quantity`, `unit_price`, `total_price`, `discount_amount`) VALUES
(1, 1, 3, 'iPhone 16 Pro Max', 'IPHONE-16-PROMAX-BLACK-128GB', '{\"color\": \"Titanio Negro\", \"storage\": \"128GB\"}', 1, 1299.99, 1299.99, 0.00),
(2, 2, 9, 'Smartwatch Huawei Watch FIT 3 Sport 1.82\" AMOLED - Negro', 'SKU-9', '{}', 1, 320.00, 320.00, 0.00),
(3, 3, 9, 'Smartwatch Huawei Watch FIT 3 Sport 1.82\" AMOLED - Negro', 'SKU-9', '{}', 1, 320.00, 320.00, 0.00),
(4, 4, 10, 'Smartwatch Huawei Watch FIT 3 Sport 1.82\" AMOLED - Blanco', 'SKU-10', '{}', 1, 399.99, 399.99, 0.00),
(5, 5, 9, 'Smartwatch Huawei Watch FIT 3 Sport 1.82\" AMOLED - Negro', 'SKU-9', '{}', 4, 320.00, 1280.00, 0.00),
(6, 6, 7, 'Auriculares Inalámbricos Pro - Negro', 'SKU-7', '{}', 1, 249.99, 249.99, 0.00),
(7, 6, 3, 'IPhone 16 Pro Max - Titanio Negro - 128GB RAM', 'SKU-3', '{}', 1, 1299.99, 1299.99, 0.00),
(8, 6, 6, 'IPhone 16 Pro Max - Titanio Blanco - 256GB RAM', 'SKU-6', '{}', 1, 1699.99, 1699.99, 0.00);

INSERT INTO `order_tracking` (`id`, `order_id`, `tracking_number`, `courier_company`, `status`, `current_location`, `shipped_at`, `delivered_at`, `delivered_to`, `delivery_notes`, `created_at`, `updated_at`) VALUES
(1, 1, 'OLVA2025123456', 'Olva Courier', 'shipped', NULL, NULL, NULL, NULL, NULL, '2025-06-18 19:34:16', '2025-06-18 19:34:16');

INSERT INTO `orders` (`id`, `customer_id`, `order_number`, `status`, `created_at`, `updated_at`, `subtotal`, `discount_amount`, `shipping_cost`, `tax_amount`, `total_amount`, `shipping_address_id`, `shipping_method`, `estimated_delivery`, `payment_method`, `payment_status`, `paid_at`, `customer_notes`, `admin_notes`) VALUES
(1, 3, 'ORD-2025-000001', 'processing', '2025-06-18 19:34:16', '2025-06-18 19:34:16', 1299.99, 0.00, 25.00, 234.00, 1558.99, 8, 'standard', NULL, 'credit_card', 'paid', NULL, NULL, NULL),
(2, 3, 'ORD-2025-1750387654753-60T4', 'pending', '2025-06-20 02:47:34', '2025-06-20 02:47:34', 320.00, 0.00, 0.00, 57.60, 377.60, 9, 'Envío Estándar', '2025-06-24', 'cash_on_delivery', 'pending', NULL, NULL, NULL),
(3, 3, 'ORD-2025-1750388155920-ECL4', 'processing', '2025-06-20 02:55:55', '2025-06-20 04:07:56', 320.00, 0.00, 0.00, 57.60, 377.60, 9, 'Envío Estándar', '2025-06-24', 'cash_on_delivery', 'paid', '2025-06-19 23:07:57', NULL, 'Pago confirmado - Procesando pedido'),
(4, 3, 'ORD-2025-1750392685156-IZDI', 'processing', '2025-06-20 04:11:25', '2025-06-20 04:11:41', 399.99, 0.00, 0.00, 72.00, 471.99, 9, 'Envío Estándar', '2025-06-24', 'cash_on_delivery', 'paid', '2025-06-19 23:11:41', NULL, 'Pago confirmado - Procesando pedido'),
(5, 3, 'ORD-2025-1750396869592-GSE9', 'pending', '2025-06-20 05:21:09', '2025-06-20 05:21:43', 1280.00, 0.00, 0.00, 230.40, 1510.40, 9, 'Envío Estándar', '2025-06-25', 'bank_transfer', 'failed', NULL, NULL, NULL),
(6, 3, 'ORD-2026-1767400896334-I1EY', 'processing', '2026-01-03 00:41:36', '2026-01-03 00:41:55', 3249.97, 0.00, 0.00, 584.99, 3834.96, 9, 'Envío Estándar', '2026-01-07', 'credit_card', 'paid', '2026-01-02 19:41:55', NULL, 'Pago confirmado - Procesando pedido');

INSERT INTO `payment_methods` (`id`, `name`, `code`, `description`, `icon_url`, `processing_fee_type`, `processing_fee_value`, `min_amount`, `max_amount`, `is_active`, `requires_verification`, `display_order`, `settings`, `created_at`, `updated_at`) VALUES
(1, 'Tarjeta de Crédito/Débito', 'credit_card', 'Visa, Mastercard, American Express', NULL, 'percentage', 3.5000, 10.00, 5000.00, 1, 0, 1, '{\"accepted_cards\": [\"visa\", \"mastercard\", \"amex\"]}', '2025-06-18 23:09:17', '2025-06-18 23:09:17'),
(2, 'Yape', 'yape', 'Pago mediante código QR de Yape', NULL, 'fixed', 2.0000, 5.00, 1000.00, 1, 0, 2, '{\"qr_timeout\": 300}', '2025-06-18 23:09:17', '2025-06-18 23:09:17'),
(3, 'Plin', 'plin', 'Pago mediante código QR de Plin', NULL, 'fixed', 2.0000, 5.00, 1000.00, 1, 0, 3, '{\"qr_timeout\": 300}', '2025-06-18 23:09:17', '2025-06-18 23:09:17'),
(4, 'Transferencia Bancaria', 'bank_transfer', 'Transferencia a cuenta bancaria', NULL, 'fixed', 5.0000, 50.00, 10000.00, 1, 0, 4, '{\"verification_required\": true}', '2025-06-18 23:09:17', '2025-06-18 23:09:17'),
(5, 'Pago Contra Entrega', 'cash_on_delivery', 'Paga cuando recibas tu pedido', NULL, 'fixed', 5.0000, 20.00, 500.00, 1, 0, 5, '{\"max_amount\": 500}', '2025-06-18 23:09:17', '2025-06-18 23:09:17');

INSERT INTO `payment_transactions` (`id`, `order_id`, `payment_method_id`, `transaction_id`, `reference_number`, `amount`, `processing_fee`, `net_amount`, `currency`, `status`, `payment_data`, `gateway_response`, `processed_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 2, 5, '1', 'TXN-1750387654797-GFCRGY', 377.60, 5.00, 372.60, 'PEN', 'pending', NULL, NULL, NULL, NULL, '2025-06-19 21:47:35', '2025-06-20 03:50:44'),
(2, 3, 5, 'TXN_1750392476856_pq9bzalqr', 'TXN-1750388155947-0ZPT0C', 377.60, 5.00, 372.60, 'PEN', 'completed', NULL, '{\"method\": \"cash_on_delivery\", \"reason\": null, \"gateway\": \"Payment Gateway\", \"approved\": true, \"authCode\": \"AUTH_8i5nfcol5\", \"errorCode\": null, \"processedAt\": \"2025-06-20T04:07:55.929Z\"}', '2025-06-19 23:07:57', NULL, '2025-06-19 21:55:56', '2025-06-19 23:07:57'),
(3, 4, 5, 'TXN_1750392701225_4iyrglg3u', 'TXN-1750392685185-6CPPD6', 471.99, 5.00, 466.99, 'PEN', 'completed', NULL, '{\"method\": \"cash_on_delivery\", \"reason\": null, \"gateway\": \"Payment Gateway\", \"approved\": true, \"authCode\": \"AUTH_cx1e4iq8b\", \"errorCode\": null, \"processedAt\": \"2025-06-20T04:11:41.066Z\"}', '2025-06-19 23:11:41', NULL, '2025-06-19 23:11:25', '2025-06-19 23:11:41'),
(4, 5, 4, NULL, 'TXN-1750396869616-1NQ6E7', 1510.40, 5.00, 1505.40, 'PEN', 'failed', NULL, '{\"method\": \"bank_transfer\", \"reason\": \"Fondos insuficientes\", \"gateway\": \"Manual Transfer System\", \"approved\": false, \"authCode\": null, \"errorCode\": \"INSUFFICIENT_FUNDS\", \"processedAt\": \"2025-06-20T05:21:43.200Z\"}', '2025-06-20 00:21:44', NULL, '2025-06-20 00:21:10', '2025-06-20 00:21:44'),
(5, 6, 1, 'TXN_1767400915252_pqd6f9tes', 'TXN-1767400896378-5QWI3I', 3834.96, 134.22, 3700.74, 'PEN', 'completed', NULL, '{\"method\": \"credit_card\", \"reason\": null, \"gateway\": \"Payment Gateway\", \"approved\": true, \"authCode\": \"AUTH_g1b5p6bs1\", \"errorCode\": null, \"processedAt\": \"2026-01-03T00:41:54.754Z\"}', '2026-01-02 19:41:55', NULL, '2026-01-02 19:41:36', '2026-01-02 19:41:55');

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
(5, 4);

INSERT INTO `product_variants` (`id`, `product_id`, `sku`, `price`, `stock`, `created_at`, `updated_at`) VALUES
(1, 1, 'LAPTOP-PRO-15-8GB-BLACK', 3499.99, 10, '2025-05-21 06:04:54', '2025-05-30 21:23:37'),
(2, 1, 'LAPTOP-PRO-15-16GB', 3999.99, 5, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(3, 2, 'IPHONE-16-PROMAX-BLACK-128GB', 1299.99, 19, '2025-05-21 06:04:54', '2026-01-03 00:41:36'),
(4, 2, 'IPHONE-16-PROMAX-WHITE-128GB', 1299.99, 3, '2025-05-21 06:04:54', '2025-06-20 01:00:20'),
(6, 2, 'IPHONE-16-PROMAX-WHITE-256GB', 1899.99, 11, '2025-05-21 06:04:54', '2026-01-03 00:41:36'),
(7, 3, 'HEADPHONES-PRO-BLACK', 249.99, 29, '2025-05-21 06:04:54', '2026-01-03 00:41:36'),
(8, 3, 'HEADPHONES-PRO-WHITE', 249.99, 25, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(9, 4, 'SMARTWATCH-5-BLACK', 399.99, 0, '2025-05-21 06:04:54', '2025-06-20 05:21:09'),
(10, 4, 'SMARTWATCH-5-SILVER', 399.99, 21, '2025-05-21 06:04:54', '2025-06-20 04:11:25'),
(11, 1, 'LAPTOP-PRO-15-8GB-WHITE', 3499.99, 13, '2025-05-30 21:25:05', '2025-05-30 21:25:05');

INSERT INTO `products` (`id`, `name`, `description`, `brand_id`, `created_at`, `updated_at`, `base_price`) VALUES
(1, 'Laptop Ultrabook Pro', 'Laptop ultradelgada con procesador de última generación', 1, '2025-01-15 10:00:00', '2025-01-15 10:00:00', 3499.99),
(2, 'IPhone 16 Pro Max', 'Imponente diseño de titanio. Control de la Cámara. 4K Dolby Vision a 120 cps. Y el chip A18 Pro.', 2, '2025-01-20 11:30:00', '2025-06-02 18:07:49', 1299.99),
(3, 'Auriculares Inalámbricos Pro', 'Auriculares con cancelación de ruido y alta fidelidad', 3, '2025-02-05 09:15:00', '2025-02-05 09:15:00', 249.99),
(4, 'Smartwatch Huawei Watch FIT 3 Sport 1.82\" AMOLED', 'Reloj inteligente con monitor de salud y GPS', 4, '2025-02-10 14:45:00', '2025-06-02 18:06:22', 399.99),
(5, 'iPhone 16 Pro Max', 'El iPhone más avanzado con pantalla Super Retina XDR de 6.9 pulgadas', 1, '2025-06-02 22:33:23', '2025-06-02 22:33:23', 1199.99);

INSERT INTO `promotion_variants` (`promotion_id`, `variant_id`, `promotion_price`, `stock_limit`, `created_at`) VALUES
(1, 1, 2999.99, 5, '2025-05-30 17:41:53'),
(1, 7, 212.49, 10, '2025-05-30 17:41:53'),
(2, 3, 1039.99, 2, '2025-05-30 17:41:53'),
(2, 4, 1039.99, 7, '2025-05-30 17:41:53'),
(2, 9, 320.00, 5, '2025-06-17 02:46:01'),
(3, 6, 1699.99, 3, '2025-05-30 17:41:53');

INSERT INTO `promotions` (`id`, `name`, `description`, `start_date`, `end_date`, `discount_type`, `discount_value`, `min_purchase_amount`, `is_active`, `created_at`, `updated_at`, `type`, `image_url`, `display_order`) VALUES
(1, 'Ofertas del Día', 'Descuentos especiales por 24 horas', '2025-06-18 00:00:00', '2026-06-28 00:00:00', 'percentage', 15.00, NULL, 1, '2025-05-30 17:41:53', '2026-01-03 00:36:26', 'oferta', '/images/promotions/promotion-sales.webp', 0),
(2, 'Cyber Week', 'Grandes descuentos en tecnología', '2025-06-21 00:00:00', '2026-06-29 23:59:59', 'percentage', 20.00, NULL, 1, '2025-05-30 17:41:53', '2026-01-03 00:38:56', 'cyber', '/images/promotions/promotion-tecnology.webp', 1),
(3, 'Liquidación Smartphones', 'Precios especiales en smartphones seleccionados', '2025-06-17 00:00:00', '2026-06-27 23:59:59', 'fixed_amount', 200.00, NULL, 1, '2025-05-30 17:41:53', '2026-01-03 00:38:56', 'liquidacion', '/images/promotions/promotion-smatphones.webp', 2);

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
(106, 1, 1),
(107, 9, 1);

INSERT INTO `sections` (`id`, `name`, `url`, `image`, `display_order`) VALUES
(1, 'banners', '/banners', 'Image', 1),
(2, 'services', '/services', 'HandPlatter', 3),
(3, 'projects', '/projects', 'FolderKanban', 4),
(4, 'pages', '/pages', 'StickyNote', 2),
(5, 'gallery', '/gallery', 'GalleryHorizontal', 5),
(6, 'profile', '/profile', 'UserPen', 6),
(7, 'users', '/users', 'Users', 7),
(8, 'roles', '/roles', 'SlidersHorizontal', 8),
(9, 'categories', '/categories', 'Category', 9);

INSERT INTO `shipping_methods` (`id`, `name`, `description`, `base_cost`, `free_shipping_threshold`, `estimated_days_min`, `estimated_days_max`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 'Envío Estándar', 'Entrega en 3-5 días laborables', 15.00, 100.00, 3, 5, 1, 1, '2025-06-18 23:09:17', '2025-06-18 23:09:17'),
(2, 'Envío Express', 'Entrega en 1-2 días laborables', 35.00, 200.00, 1, 2, 1, 2, '2025-06-18 23:09:17', '2025-06-18 23:09:17'),
(3, 'Recojo en Tienda', 'Recoge tu pedido en nuestras tiendas', 0.00, 0.00, 0, 1, 1, 3, '2025-06-18 23:09:17', '2025-06-18 23:09:17');

INSERT INTO `shipping_zone_methods` (`id`, `shipping_method_id`, `shipping_zone_id`, `cost`, `free_shipping_threshold`, `estimated_days_min`, `estimated_days_max`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 10.00, 80.00, 2, 3, 1, '2025-06-18 23:09:17', '2025-06-18 23:09:17'),
(2, 1, 2, 15.00, 100.00, 3, 4, 1, '2025-06-18 23:09:17', '2025-06-20 01:44:44'),
(3, 1, 3, 15.00, 100.00, 3, 4, 1, '2025-06-18 23:09:17', '2025-06-18 23:09:17'),
(4, 1, 4, 20.00, 120.00, 3, 5, 1, '2025-06-18 23:09:17', '2025-06-18 23:09:17'),
(5, 1, 5, 10.00, 80.00, 2, 3, 1, '2025-06-18 23:09:17', '2025-06-18 23:09:17'),
(6, 2, 1, 25.00, 150.00, 1, 1, 1, '2025-06-18 23:09:17', '2025-06-18 23:09:17'),
(7, 2, 2, 35.00, 200.00, 1, 2, 1, '2025-06-18 23:09:17', '2025-06-18 23:09:17'),
(8, 2, 3, 35.00, 200.00, 1, 2, 1, '2025-06-18 23:09:17', '2025-06-18 23:09:17'),
(9, 2, 4, 45.00, 250.00, 1, 2, 1, '2025-06-18 23:09:17', '2025-06-18 23:09:17'),
(10, 2, 5, 25.00, 150.00, 1, 1, 1, '2025-06-18 23:09:17', '2025-06-18 23:09:17'),
(11, 3, 1, 0.00, 0.00, 0, 1, 1, '2025-06-18 23:09:17', '2025-06-18 23:09:17'),
(12, 3, 2, 0.00, 0.00, 0, 1, 1, '2025-06-18 23:09:17', '2025-06-18 23:09:17'),
(13, 3, 3, 0.00, 0.00, 0, 1, 1, '2025-06-18 23:09:17', '2025-06-18 23:09:17'),
(14, 3, 4, 0.00, 0.00, 0, 1, 1, '2025-06-18 23:09:17', '2025-06-18 23:09:17'),
(15, 3, 5, 0.00, 0.00, 0, 1, 1, '2025-06-18 23:09:17', '2025-06-18 23:09:17');

INSERT INTO `shipping_zones` (`id`, `name`, `districts`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Lima Centro', '[\"LIMA\", \"CERCADO DE LIMA\", \"BREÑA\", \"LA VICTORIA\", \"RIMAC\"]', 1, '2025-06-18 23:09:17', '2025-06-18 23:09:17'),
(2, 'Lima Norte', '[\"COMAS\", \"INDEPENDENCIA\", \"LOS OLIVOS\", \"PUENTE PIEDRA\", \"SAN MARTIN DE PORRES\"]', 1, '2025-06-18 23:09:17', '2025-06-18 23:09:17'),
(3, 'Lima Este', '[\"ATE\", \"CHACLACAYO\", \"CIENEGUILLA\", \"EL AGUSTINO\", \"LURIGANCHO\", \"SAN JUAN DE LURIGANCHO\", \"SANTA ANITA\"]', 1, '2025-06-18 23:09:17', '2025-06-18 23:09:17'),
(4, 'Lima Sur', '[\"CHORRILLOS\", \"LURÍN\", \"PACHACAMAC\", \"PUCUSANA\", \"PUNTA HERMOSA\", \"PUNTA NEGRA\", \"SAN BARTOLO\", \"SAN JUAN DE MIRAFLORES\", \"SANTA MARÍA DEL MAR\", \"VILLA EL SALVADOR\", \"VILLA MARÍA DEL TRIUNFO\"]', 1, '2025-06-18 23:09:17', '2025-06-18 23:09:17'),
(5, 'Lima Moderna', '[\"BARRANCO\", \"JESÚS MARÍA\", \"LA MOLINA\", \"LINCE\", \"MAGDALENA DEL MAR\", \"MIRAFLORES\", \"PUEBLO LIBRE\", \"SAN BORJA\", \"SAN ISIDRO\", \"SAN MIGUEL\", \"SANTIAGO DE SURCO\", \"SURQUILLO\"]', 1, '2025-06-18 23:09:17', '2025-06-18 23:09:17');

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role_id`, `is_active`, `created_at`, `updated_at`, `lastname`, `photo`) VALUES
(3, 'Jhonnatan', 'admin@techstore.com', '$2b$12$jMi5XEnLsw70nHr6uFccvufU29hRsAHw68dIRS/gDiSZa.W/rhnsC', 1, 1, '2024-08-16 02:41:34', '2025-08-12 19:41:53', 'Castro', '/uploads/1732925134811-802344022.jpeg'),
(13, 'Derek', 'test@example.com', '$2a$10$yZd0FgII.5BMqj0p3o9eWOgKRppXAfOo/efab7NxFiBHCfyMYD3qa', 2, 1, '2024-08-16 03:41:19', '2024-10-29 00:36:55', 'Vito2', NULL);

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `order_summary` AS select `o`.`id` AS `id`,`o`.`order_number` AS `order_number`,`o`.`customer_id` AS `customer_id`,concat(`c`.`name`,' ',`c`.`lastname`) AS `customer_name`,`c`.`email` AS `customer_email`,`o`.`status` AS `status`,`o`.`payment_status` AS `payment_status`,`o`.`total_amount` AS `total_amount`,`o`.`created_at` AS `created_at`,`o`.`estimated_delivery` AS `estimated_delivery`,count(`oi`.`id`) AS `total_items`,sum(`oi`.`quantity`) AS `total_quantity`,`ot`.`tracking_number` AS `tracking_number`,`ot`.`courier_company` AS `courier_company` from (((`orders` `o` left join `customers` `c` on((`o`.`customer_id` = `c`.`id`))) left join `order_items` `oi` on((`o`.`id` = `oi`.`order_id`))) left join `order_tracking` `ot` on((`o`.`id` = `ot`.`order_id`))) group by `o`.`id`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `product_rating_summary` AS select `pv`.`product_id` AS `product_id`,count(`vr`.`id`) AS `total_ratings`,avg(`vr`.`rating`) AS `average_rating`,sum((case when (`vr`.`rating` = 5) then 1 else 0 end)) AS `five_star`,sum((case when (`vr`.`rating` = 4) then 1 else 0 end)) AS `four_star`,sum((case when (`vr`.`rating` = 3) then 1 else 0 end)) AS `three_star`,sum((case when (`vr`.`rating` = 2) then 1 else 0 end)) AS `two_star`,sum((case when (`vr`.`rating` = 1) then 1 else 0 end)) AS `one_star`,sum((case when (`vr`.`verified_purchase` = 1) then 1 else 0 end)) AS `verified_purchases` from (`product_variants` `pv` left join `variant_ratings` `vr` on((`pv`.`id` = `vr`.`variant_id`))) group by `pv`.`product_id`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `variant_rating_summary` AS select `variant_ratings`.`variant_id` AS `variant_id`,count(0) AS `total_ratings`,avg(`variant_ratings`.`rating`) AS `average_rating`,sum((case when (`variant_ratings`.`rating` = 5) then 1 else 0 end)) AS `five_star`,sum((case when (`variant_ratings`.`rating` = 4) then 1 else 0 end)) AS `four_star`,sum((case when (`variant_ratings`.`rating` = 3) then 1 else 0 end)) AS `three_star`,sum((case when (`variant_ratings`.`rating` = 2) then 1 else 0 end)) AS `two_star`,sum((case when (`variant_ratings`.`rating` = 1) then 1 else 0 end)) AS `one_star`,sum((case when (`variant_ratings`.`verified_purchase` = 1) then 1 else 0 end)) AS `verified_purchases` from `variant_ratings` group by `variant_ratings`.`variant_id`;


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;