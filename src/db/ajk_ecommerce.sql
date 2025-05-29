-- -------------------------------------------------------------
-- TablePlus 6.4.2(600)
--
-- https://tableplus.com/
--
-- Database: ajk_ecommerce
-- Generation Time: 2025-05-29 17:10:13.5260
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


DROP TABLE IF EXISTS `attribute_options`;
CREATE TABLE `attribute_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `attribute_id` int(11) NOT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_attribute` (`attribute_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `attributes`;
CREATE TABLE `attributes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

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
  `image_url` varchar(255) NOT NULL,
  `is_primary` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_variant` (`variant_id`),
  CONSTRAINT `fk_vi_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

INSERT INTO `attribute_options` (`id`, `attribute_id`, `value`) VALUES
(1, 1, 'Negro'),
(2, 1, 'Blanco'),
(3, 1, 'Plata'),
(4, 1, 'Azul'),
(5, 2, '13 pulgadas'),
(6, 2, '15 pulgadas'),
(7, 2, '17 pulgadas'),
(8, 3, '128GB'),
(9, 3, '256GB'),
(10, 3, '512GB'),
(11, 3, '1TB'),
(12, 3, '8GB RAM'),
(13, 3, '16GB RAM'),
(14, 3, '32GB RAM');

INSERT INTO `attributes` (`id`, `name`) VALUES
(1, 'Color'),
(2, 'Tamaño'),
(3, 'Almacenamiento');

INSERT INTO `brands` (`id`, `name`) VALUES
(1, 'TechPro'),
(2, 'GalaxyTech'),
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
(8, 'Smartwatches', 'Relojes inteligentes', 7, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Smartwatches');

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
(4, 8);

INSERT INTO `product_variants` (`id`, `product_id`, `sku`, `price`, `stock`, `created_at`, `updated_at`) VALUES
(1, 1, 'LAPTOP-PRO-15-8GB', 3499.99, 10, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(2, 1, 'LAPTOP-PRO-15-16GB', 3999.99, 5, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(3, 2, 'PHONE-X-BLACK-128GB', 1299.99, 20, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(4, 2, 'PHONE-X-WHITE-128GB', 1299.99, 15, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(5, 2, 'PHONE-X-BLACK-256GB', 1499.99, 8, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(6, 2, 'PHONE-X-WHITE-256GB', 1499.99, 12, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(7, 3, 'HEADPHONES-PRO-BLACK', 249.99, 30, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(8, 3, 'HEADPHONES-PRO-WHITE', 249.99, 25, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(9, 4, 'SMARTWATCH-5-BLACK', 399.99, 18, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(10, 4, 'SMARTWATCH-5-SILVER', 399.99, 22, '2025-05-21 06:04:54', '2025-05-21 06:04:54');

INSERT INTO `products` (`id`, `name`, `description`, `brand_id`, `created_at`, `updated_at`, `base_price`) VALUES
(1, 'Laptop Ultrabook Pro', 'Laptop ultradelgada con procesador de última generación', 1, '2025-01-15 10:00:00', '2025-01-15 10:00:00', 3499.99),
(2, 'Smartphone Galaxy X', 'Smartphone con pantalla AMOLED y cámara de alta resolución', 2, '2025-01-20 11:30:00', '2025-01-20 11:30:00', 1299.99),
(3, 'Auriculares Inalámbricos Pro', 'Auriculares con cancelación de ruido y alta fidelidad', 3, '2025-02-05 09:15:00', '2025-02-05 09:15:00', 249.99),
(4, 'Smartwatch Series 5', 'Reloj inteligente con monitor de salud y GPS', 4, '2025-02-10 14:45:00', '2025-02-10 14:45:00', 399.99);

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
(10, 3);

INSERT INTO `variant_images` (`id`, `variant_id`, `image_url`, `is_primary`) VALUES
(1, 1, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Laptop-Negro-8GB', 1),
(2, 1, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Laptop-Negro-8GB-2', 0),
(3, 2, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Laptop-Negro-16GB', 1),
(4, 3, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Phone-Negro-128GB', 1),
(5, 3, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Phone-Negro-128GB-2', 0),
(6, 4, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Phone-Blanco-128GB', 1),
(7, 5, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Phone-Negro-256GB', 1),
(8, 6, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Phone-Blanco-256GB', 1),
(9, 7, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Auriculares-Negro', 1),
(10, 8, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Auriculares-Blanco', 1),
(11, 9, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Smartwatch-Negro', 1),
(12, 10, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Smartwatch-Plata', 1);



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;