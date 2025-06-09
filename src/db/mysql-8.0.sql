-- -------------------------------------------------------------
-- -------------------------------------------------------------
-- TablePlus 1.2.2
--
-- https://tableplus.com/
--
-- Database: mysql
-- Generation Time: 2025-06-09 17:39:46.594723
-- -------------------------------------------------------------

CREATE TABLE `attribute_option_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `attribute_option_id` int NOT NULL,
  `image_type` enum('front','back','left','right','top','bottom','detail','lifestyle','packaging') NOT NULL DEFAULT 'front',
  `display_order` int DEFAULT '0',
  `image_url_thumb` varchar(255) NOT NULL COMMENT 'Imagen thumbnail 140x140 para selector de atributo',
  `image_url_normal` varchar(255) DEFAULT NULL COMMENT 'Imagen normal 600x800 (opcional)',
  `image_url_zoom` varchar(255) DEFAULT NULL COMMENT 'Imagen zoom 1200x1200 (opcional)',
  `alt_text` varchar(255) DEFAULT NULL COMMENT 'Texto alternativo',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_attribute_option_type` (`attribute_option_id`,`image_type`),
  KEY `idx_attribute_option` (`attribute_option_id`),
  CONSTRAINT `fk_aoi_attribute_option` FOREIGN KEY (`attribute_option_id`) REFERENCES `attribute_options` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Imágenes para opciones de atributos (colores, materiales, etc.)';

CREATE TABLE `attribute_options` (
  `id` int NOT NULL AUTO_INCREMENT,
  `attribute_id` int NOT NULL,
  `value` varchar(255) NOT NULL,
  `additional_cost` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `idx_attribute` (`attribute_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=latin1;

CREATE TABLE `attributes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `display_type` enum('radio','pills','select','color','custom') NOT NULL DEFAULT 'select',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

CREATE TABLE `banner` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `display_order` int DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `brands` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `parent_id` int DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_parent` (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address_id` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastname` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `customers_addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `id_customer` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_customer` (`id_customer`),
  CONSTRAINT `customers_addresses_ibfk_1` FOREIGN KEY (`id_customer`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `product_categories` (
  `product_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`product_id`,`category_id`),
  KEY `idx_category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `product_variants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `sku` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  KEY `idx_product` (`product_id`),
  CONSTRAINT `fk_variant_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `brand_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `base_price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_brand` (`brand_id`),
  CONSTRAINT `fk_products_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

CREATE TABLE `promotion_variants` (
  `promotion_id` int NOT NULL,
  `variant_id` int NOT NULL,
  `promotion_price` decimal(10,2) DEFAULT NULL,
  `stock_limit` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`promotion_id`,`variant_id`),
  KEY `idx_variant` (`variant_id`),
  CONSTRAINT `fk_promotion_variants_promotion` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_promotion_variants_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `promotions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `discount_type` enum('percentage','fixed_amount') NOT NULL DEFAULT 'percentage',
  `discount_value` decimal(10,2) NOT NULL,
  `min_purchase_amount` decimal(10,2) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

CREATE TABLE `rating_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rating_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_rating` (`rating_id`),
  CONSTRAINT `fk_rating_image` FOREIGN KEY (`rating_id`) REFERENCES `variant_ratings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `roles_sections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_section` int DEFAULT NULL,
  `id_rol` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_rol` (`id_rol`) USING BTREE,
  KEY `id_section` (`id_section`) USING BTREE,
  CONSTRAINT `roles_sections_ibfk_1` FOREIGN KEY (`id_section`) REFERENCES `sections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `roles_sections_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=latin1;

CREATE TABLE `sections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `display_order` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `display_order` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `services_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `display_order` int DEFAULT NULL,
  `id_service` int DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_service` (`id_service`),
  CONSTRAINT `services_images_ibfk_1` FOREIGN KEY (`id_service`) REFERENCES `services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastname` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`) USING BTREE,
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `variant_attribute_options` (
  `variant_id` int NOT NULL,
  `attribute_option_id` int NOT NULL,
  PRIMARY KEY (`variant_id`,`attribute_option_id`),
  UNIQUE KEY `unique_variant_attribute` (`variant_id`,`attribute_option_id`),
  KEY `idx_attribute_option` (`attribute_option_id`),
  KEY `idx_variant` (`variant_id`),
  CONSTRAINT `fk_vao_attribute_option` FOREIGN KEY (`attribute_option_id`) REFERENCES `attribute_options` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_vao_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `variant_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `variant_id` int NOT NULL,
  `image_type` enum('front','back','left','right','top','bottom','detail','lifestyle','packaging') NOT NULL DEFAULT 'front',
  `image_url_thumb` varchar(255) NOT NULL COMMENT 'Imagen thumbnail 140x140',
  `image_url_normal` varchar(255) NOT NULL COMMENT 'Imagen normal 600x800',
  `image_url_zoom` varchar(255) NOT NULL COMMENT 'Imagen zoom 1200x1200',
  `is_primary` tinyint(1) DEFAULT '0' COMMENT 'Imagen principal de la variante',
  `display_order` int DEFAULT '0' COMMENT 'Orden de visualización',
  `alt_text` varchar(255) DEFAULT NULL COMMENT 'Texto alternativo para SEO',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_variant` (`variant_id`),
  KEY `idx_type_order` (`image_type`,`display_order`),
  CONSTRAINT `fk_vi_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Imágenes de variantes con múltiples tamaños y tipos';

CREATE TABLE `variant_ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `variant_id` int NOT NULL,
  `customer_id` int NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

INSERT INTO `ajkecommerce`.`attribute_option_images` (`id`, `attribute_option_id`, `image_type`, `display_order`, `image_url_thumb`, `image_url_normal`, `image_url_zoom`, `alt_text`, `created_at`, `updated_at`) VALUES 
(1, 28, 'front', 0, '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-thumb.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-default.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-front-default.webp', 'iPhone 16 Pro Max Titanio Blanco', '2025-06-02 22:33:23', '2025-06-03 08:14:20'),
(2, 29, 'front', 0, '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-front-thumb.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-front-default.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-front-default.webp', 'iPhone 16 Pro Max Titanio Negro', '2025-06-02 22:33:23', '2025-06-03 08:07:13'),
(3, 30, 'back', 0, '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-natural-back-thumb.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-natural-back-default.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-natural-back-default.webp', 'iPhone 16 Pro Max Titanio Natural', '2025-06-02 22:33:23', '2025-06-03 08:21:09'),
(4, 31, 'back', 0, '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-desierto-back-thumb.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-desierto-back-default.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-desierto-back-default.webp', 'iPhone 16 Pro Max Titanio Desierto', '2025-06-02 22:33:23', '2025-06-03 08:20:21'),
(8, 28, 'back', 1, '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-back-thumb.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-back-default.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-back-default.webp', 'iPhone 16 Pro Max Titanio Blanco - Vista Trasera', '2025-06-03 07:56:37', '2025-06-03 07:56:37'),
(9, 28, 'left', 2, '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-left-thumb.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-left-default.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-blanco-left-default.webp', 'iPhone 16 Pro Max Titanio Blanco - Vista Lateral', '2025-06-03 07:56:37', '2025-06-03 07:56:37'),
(10, 29, 'back', 1, '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-back-thumb.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-back-default.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-back-default.webp', 'iPhone 16 Pro Max Titanio Negro - Vista Trasera', '2025-06-03 07:56:37', '2025-06-03 07:56:37'),
(11, 29, 'left', 2, '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-left-thumb.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-left-default.webp', '/images/products/iphone-16/pro-max/iphone-16-prox-max-titanio-negro-left-default.webp', 'iPhone 16 Pro Max Titanio Negro - Vista Lateral', '2025-06-03 07:56:37', '2025-06-03 07:56:37'),
(12, 35, 'front', 0, '/images/products/smartwatch/smartwatch-negro-front-thumb.webp', '/images/products/smartwatch/smartwatch-negro-front-default.webp', '/images/products/smartwatch/smartwatch-negro-front-default.webp', 'Smartwatch Huawei Watch FIT 3 Sport 1.82" AMOLED - Vista Frontal', '2025-06-03 23:36:05', '2025-06-04 00:01:24'),
(13, 36, 'front', 0, '/images/products/smartwatch/smartwatch-blanco-front-thumb.webp', '/images/products/smartwatch/smartwatch-blanco-front-default.webp', '/images/products/smartwatch/smartwatch-blanco-front-default.webp', 'Smartwatch Huawei Watch FIT 3 Sport 1.82" AMOLED - Vista Frontal', '2025-06-04 00:03:36', '2025-06-04 00:07:46');

INSERT INTO `ajkecommerce`.`attribute_options` (`id`, `attribute_id`, `value`, `additional_cost`) VALUES 
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
(34, 3, '1TB', 500.00),
(35, 1, 'Negro', 0.00),
(36, 1, 'Blanco', 0.00);

INSERT INTO `ajkecommerce`.`attributes` (`id`, `name`, `display_type`) VALUES 
(1, 'Color', 'color'),
(2, 'Tamaño', 'radio'),
(3, 'Almacenamiento', 'pills'),
(4, 'Material', 'pills');

INSERT INTO `ajkecommerce`.`brands` (`id`, `name`) VALUES 
(1, 'TechPro'),
(2, 'Apple'),
(3, 'SoundMaster'),
(4, 'SmartLife');

INSERT INTO `ajkecommerce`.`categories` (`id`, `name`, `description`, `parent_id`, `image_url`) VALUES 
(1, 'Electrónicos', 'Dispositivos electrónicos y tecnología', NULL, 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=200&fit=crop'),
(2, 'Ropa y Moda', 'Vestimenta y accesorios de moda', NULL, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop'),
(3, 'Hogar y Jardín', 'Artículos para el hogar y jardín', NULL, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=200&fit=crop'),
(4, 'Deportes', 'Equipos y accesorios deportivos', NULL, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop'),
(5, 'Salud y Belleza', 'Productos de cuidado personal', NULL, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=200&fit=crop'),
(6, 'Smartphones', 'Teléfonos inteligentes y accesorios', 1, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=200&fit=crop'),
(7, 'Computadoras', 'Laptops, PCs y accesorios', 1, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=200&fit=crop'),
(8, 'Audio', 'Auriculares, parlantes y equipos de audio', 1, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=200&fit=crop'),
(9, 'Gaming', 'Consolas, videojuegos y accesorios', 1, 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=200&fit=crop'),
(10, 'Wearables', 'Smartwatches y dispositivos vestibles', 1, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=200&fit=crop'),
(11, 'iPhone', 'Smartphones Apple iPhone', 6, 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&h=200&fit=crop'),
(12, 'Samsung Galaxy', 'Smartphones Samsung Galaxy', 6, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=200&fit=crop'),
(13, 'Xiaomi', 'Smartphones Xiaomi', 6, 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=200&fit=crop'),
(14, 'Accesorios Móviles', 'Fundas, cargadores y accesorios', 6, 'https://images.unsplash.com/photo-1601593346740-925612772716?w=400&h=200&fit=crop'),
(15, 'Laptops', 'Computadoras portátiles', 7, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=200&fit=crop'),
(16, 'PCs de Escritorio', 'Computadoras de escritorio', 7, 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&h=200&fit=crop'),
(17, 'Componentes PC', 'Procesadores, RAM, tarjetas gráficas', 7, 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=200&fit=crop'),
(18, 'Periféricos', 'Teclados, ratones, monitores', 7, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=200&fit=crop'),
(19, 'Ropa Hombre', 'Vestimenta masculina', 2, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop'),
(20, 'Ropa Mujer', 'Vestimenta femenina', 2, 'https://images.unsplash.com/photo-1494790108755-2616c9c0e4b5?w=400&h=200&fit=crop');

INSERT INTO `ajkecommerce`.`customers` (`id`, `username`, `email`, `password`, `address_id`, `is_active`, `created_at`, `updated_at`, `lastname`, `photo`, `name`) VALUES 
(3, 'Jhonnatan', 'user@example.com', '$2a$10$vk7kb/OC.HsSXps.x3DbwuJrn5GjmCbkto43TX9S8G0SyUU/ofzvq', 1, 1, '2024-08-16 02:41:34', '2024-11-30 00:05:34', 'Castro', '/uploads/1732925134811-802344022.jpeg', NULL),
(4, 'asd', 'asd@asd.com', '$2b$10$RwSQFjp0aF8IcAVGqymgWO7fB6WyMr4VJmc2L5aHOuEAuvS2IU3Ee', NULL, 1, '2025-05-21 04:49:46', '2025-05-21 04:49:46', 'asd', NULL, 'asd');

INSERT INTO `ajkecommerce`.`product_categories` (`product_id`, `category_id`) VALUES 
(2, 1),
(3, 1),
(4, 1),
(1, 2),
(1, 3),
(2, 4),
(5, 4),
(3, 5),
(3, 6),
(4, 7),
(4, 8),
(5, 21);

INSERT INTO `ajkecommerce`.`product_variants` (`id`, `product_id`, `sku`, `price`, `stock`, `created_at`, `updated_at`) VALUES 
(1, 1, 'LAPTOP-PRO-15-8GB-BLACK', 3499.99, 10, '2025-05-21 06:04:54', '2025-05-30 21:23:37'),
(2, 1, 'LAPTOP-PRO-15-16GB', 3999.99, 5, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(3, 2, 'IPHONE-16-PROMAX-BLACK-128GB', 1299.99, 20, '2025-05-21 06:04:54', '2025-06-02 23:38:28'),
(4, 2, 'IPHONE-16-PROMAX-WHITE-128GB', 1299.99, 15, '2025-05-21 06:04:54', '2025-06-02 23:38:49'),
(5, 2, 'IPHONE-16-PROMAX-BLACK-256GB', 1499.99, 8, '2025-05-21 06:04:54', '2025-06-02 23:39:05'),
(6, 2, 'IPHONE-16-PROMAX-WHITE-256GB', 1499.99, 12, '2025-05-21 06:04:54', '2025-06-02 23:39:18'),
(7, 3, 'HEADPHONES-PRO-BLACK', 249.99, 30, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(8, 3, 'HEADPHONES-PRO-WHITE', 249.99, 25, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(9, 4, 'SMARTWATCH-5-BLACK', 399.99, 18, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(10, 4, 'SMARTWATCH-5-SILVER', 399.99, 22, '2025-05-21 06:04:54', '2025-05-21 06:04:54'),
(11, 1, 'LAPTOP-PRO-15-8GB-WHITE', 3499.99, 13, '2025-05-30 21:25:05', '2025-05-30 21:25:05');

INSERT INTO `ajkecommerce`.`products` (`id`, `name`, `description`, `brand_id`, `created_at`, `updated_at`, `base_price`) VALUES 
(1, 'Laptop Ultrabook Pro', 'Laptop ultradelgada con procesador de última generación', 1, '2025-01-15 10:00:00', '2025-01-15 10:00:00', 3499.99),
(2, 'IPhone 16 Pro Max', 'Imponente diseño de titanio. Control de la Cámara. 4K Dolby Vision a 120 cps. Y el chip A18 Pro.', 2, '2025-01-20 11:30:00', '2025-06-02 18:07:49', 1299.99),
(3, 'Auriculares Inalámbricos Pro', 'Auriculares con cancelación de ruido y alta fidelidad', 3, '2025-02-05 09:15:00', '2025-06-09 20:32:29', 249.99),
(4, 'Smartwatch Huawei Watch FIT 3 Sport 1.82" AMOLED', 'Reloj inteligente con monitor de salud y GPS', 4, '2025-02-10 14:45:00', '2025-06-09 20:34:20', 399.99),
(5, 'iPhone 16 Pro Max', 'El iPhone más avanzado con pantalla Super Retina XDR de 6.9 pulgadas', 1, '2025-06-02 22:33:23', '2025-06-02 22:33:23', 1199.99);

INSERT INTO `ajkecommerce`.`promotion_variants` (`promotion_id`, `variant_id`, `promotion_price`, `stock_limit`, `created_at`) VALUES 
(1, 1, 2999.99, 5, '2025-05-30 17:41:53'),
(1, 7, 199.99, 10, '2025-05-30 17:41:53'),
(2, 3, 999.99, NULL, '2025-05-30 17:41:53'),
(2, 4, 999.99, NULL, '2025-05-30 17:41:53'),
(3, 5, 1299.99, 3, '2025-05-30 17:41:53'),
(3, 6, 1299.99, 3, '2025-05-30 17:41:53');

INSERT INTO `ajkecommerce`.`promotions` (`id`, `name`, `description`, `start_date`, `end_date`, `discount_type`, `discount_value`, `min_purchase_amount`, `is_active`, `created_at`, `updated_at`) VALUES 
(1, 'Ofertas del Día', 'Descuentos especiales por 24 horas', '2025-05-30 00:00:00', '2025-05-31 00:00:00', 'percentage', 15.00, NULL, 1, '2025-05-30 17:41:53', '2025-05-30 17:41:53'),
(2, 'Cyber Week', 'Grandes descuentos en tecnología', '2025-06-01 00:00:00', '2025-06-07 23:59:59', 'percentage', 20.00, NULL, 1, '2025-05-30 17:41:53', '2025-05-30 17:41:53'),
(3, 'Liquidación Smartphones', 'Precios especiales en smartphones seleccionados', '2025-05-25 00:00:00', '2025-06-10 23:59:59', 'fixed_amount', 200.00, NULL, 1, '2025-05-30 17:41:53', '2025-05-30 17:41:53');

INSERT INTO `ajkecommerce`.`rating_images` (`id`, `rating_id`, `image_url`, `created_at`) VALUES 
(1, 1, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Review-Image-1', '2025-05-30 18:56:20'),
(2, 1, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Review-Image-2', '2025-05-30 18:56:20'),
(3, 3, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Review-Image-3', '2025-05-30 18:56:20'),
(4, 7, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Review-Image-4', '2025-05-30 18:56:20'),
(5, 9, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Review-Image-5', '2025-05-30 18:56:20');

INSERT INTO `ajkecommerce`.`roles` (`id`, `name`, `created_at`, `updated_at`) VALUES 
(1, 'superadmin', '2024-08-06 20:59:34', '2024-08-06 20:59:34'),
(2, 'admin', '2024-08-06 20:59:34', '2024-08-06 20:59:34');

INSERT INTO `ajkecommerce`.`roles_sections` (`id`, `id_section`, `id_rol`) VALUES 
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

INSERT INTO `ajkecommerce`.`sections` (`id`, `name`, `url`, `image`, `display_order`) VALUES 
(1, 'banners', '/dashboard/banners', 'Image', 1),
(2, 'services', '/dashboard/services', 'HandPlatter', 3),
(3, 'projects', '/dashboard/projects', 'FolderKanban', 4),
(4, 'pages', '/dashboard/pages', 'StickyNote', 2),
(5, 'gallery', '/dashboard/gallery', 'GalleryHorizontal', 5),
(6, 'profile', '/dashboard/profile', 'UserPen', 6),
(7, 'users', '/dashboard/users', 'Users', 7),
(8, 'roles', '/dashboard/roles', 'SlidersHorizontal', 8);

INSERT INTO `ajkecommerce`.`users` (`id`, `username`, `email`, `password`, `role_id`, `is_active`, `created_at`, `updated_at`, `lastname`, `photo`) VALUES 
(3, 'Jhonnatan', 'admin@example.com', '$2a$10$vk7kb/OC.HsSXps.x3DbwuJrn5GjmCbkto43TX9S8G0SyUU/ofzvq', 1, 1, '2024-08-16 02:41:34', '2024-11-30 00:05:34', 'Castro', '/uploads/1732925134811-802344022.jpeg'),
(13, 'Derek', 'test@example.com', '$2a$10$yZd0FgII.5BMqj0p3o9eWOgKRppXAfOo/efab7NxFiBHCfyMYD3qa', 2, 1, '2024-08-16 03:41:19', '2024-10-29 00:36:55', 'Vito2', NULL);

INSERT INTO `ajkecommerce`.`variant_attribute_options` (`variant_id`, `attribute_option_id`) VALUES 
(1, 1),
(2, 1),
(7, 1),
(8, 2),
(11, 2),
(1, 6),
(2, 6),
(11, 6),
(3, 8),
(4, 8),
(5, 9),
(6, 9),
(1, 12),
(11, 12),
(2, 13),
(4, 28),
(6, 28),
(3, 29),
(5, 29),
(9, 35),
(10, 36);

INSERT INTO `ajkecommerce`.`variant_ratings` (`id`, `variant_id`, `customer_id`, `rating`, `review`, `title`, `verified_purchase`, `created_at`, `updated_at`) VALUES 
(1, 1, 3, 5, 'Excelente laptop, muy rápida y con buena duración de batería.', 'Compra perfecta', 1, '2025-05-30 18:56:20', '2025-05-30 18:56:20'),
(2, 1, 4, 4, 'Buena laptop, pero un poco pesada para llevar a todos lados.', 'Buen producto', 1, '2025-05-30 18:56:20', '2025-05-30 18:56:20'),
(3, 2, 3, 5, 'La memoria adicional hace una gran diferencia en el rendimiento.', 'Vale la pena pagar más', 1, '2025-05-30 18:56:20', '2025-05-30 18:56:20'),
(4, 3, 4, 4, 'Buen teléfono, la cámara es excelente pero la batería podría durar más.', 'Muy satisfecho', 1, '2025-05-30 18:56:20', '2025-05-30 18:56:20'),
(5, 4, 3, 3, 'El color blanco se ensucia fácilmente, pero funciona bien.', 'Funcional pero requiere cuidado', 0, '2025-05-30 18:56:20', '2025-05-30 18:56:20'),
(6, 7, 3, 5, 'La cancelación de ruido es impresionante, perfectos para viajar.', 'Los mejores auriculares', 1, '2025-05-30 18:56:20', '2025-05-30 18:56:20'),
(7, 8, 4, 4, 'Buena calidad de sonido, pero un poco incómodos después de varias horas.', 'Buenos pero mejorables', 1, '2025-05-30 18:56:20', '2025-05-30 18:56:20'),
(8, 9, 3, 5, 'Monitorea perfectamente mi actividad física y las notificaciones son útiles.', 'Excelente smartwatch', 1, '2025-05-30 18:56:20', '2025-05-30 18:56:20'),
(9, 10, 4, 4, 'Buena duración de batería y diseño elegante.', 'Recomendado', 0, '2025-05-30 18:56:20', '2025-05-30 18:56:20');

