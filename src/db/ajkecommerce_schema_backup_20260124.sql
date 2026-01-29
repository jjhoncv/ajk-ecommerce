-- MySQL dump 10.13  Distrib 5.7.44, for Linux (x86_64)
--
-- Host: localhost    Database: ajkecommerce
-- ------------------------------------------------------
-- Server version	5.7.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary table structure for view `active_offers`
--

DROP TABLE IF EXISTS `active_offers`;
/*!50001 DROP VIEW IF EXISTS `active_offers`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `active_offers` AS SELECT 
 1 AS `id`,
 1 AS `name`,
 1 AS `title`,
 1 AS `description`,
 1 AS `offer_type`,
 1 AS `discount_type`,
 1 AS `discount_value`,
 1 AS `start_date`,
 1 AS `end_date`,
 1 AS `max_uses`,
 1 AS `max_uses_per_customer`,
 1 AS `current_uses`,
 1 AS `min_quantity`,
 1 AS `min_purchase_amount`,
 1 AS `badge_text`,
 1 AS `badge_color`,
 1 AS `show_countdown`,
 1 AS `show_stock_indicator`,
 1 AS `show_savings`,
 1 AS `image_url`,
 1 AS `priority`,
 1 AS `is_active`,
 1 AS `is_featured`,
 1 AS `created_at`,
 1 AS `updated_at`,
 1 AS `total_variants`,
 1 AS `total_sold`,
 1 AS `min_price`,
 1 AS `max_discount_percent`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `attribute_options`
--

DROP TABLE IF EXISTS `attribute_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attribute_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `attribute_id` int(11) NOT NULL,
  `value` varchar(255) NOT NULL,
  `additional_cost` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `idx_attribute` (`attribute_id`),
  CONSTRAINT `attribute_options_ibfk_1` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `attributes`
--

DROP TABLE IF EXISTS `attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attributes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `display_type` enum('radio','pills','select','color','custom') NOT NULL DEFAULT 'select',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_attributes_created_by` (`created_by`),
  KEY `idx_attributes_updated_by` (`updated_by`),
  CONSTRAINT `fk_attributes_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_attributes_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `banner`
--

DROP TABLE IF EXISTS `banner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_banner_created_by` (`created_by`),
  KEY `idx_banner_updated_by` (`updated_by`),
  CONSTRAINT `fk_banner_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_banner_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `brands` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_brands_created_by` (`created_by`),
  KEY `idx_brands_updated_by` (`updated_by`),
  CONSTRAINT `fk_brands_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_brands_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `parent_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `show_nav` int(11) DEFAULT '0',
  `display_order` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `banner_image` varchar(255) DEFAULT NULL COMMENT 'Banner image for desktop',
  `banner_image_mobile` varchar(255) DEFAULT NULL COMMENT 'Banner image for mobile',
  `banner_title` varchar(255) DEFAULT NULL COMMENT 'Banner title (defaults to category name if empty)',
  `banner_subtitle` varchar(255) DEFAULT NULL COMMENT 'Banner subtitle',
  `banner_description` text COMMENT 'Banner description text',
  `banner_cta_text` varchar(100) DEFAULT NULL COMMENT 'Call to action button text',
  `banner_cta_link` varchar(255) DEFAULT NULL COMMENT 'Call to action button link',
  `meta_title` varchar(255) DEFAULT NULL COMMENT 'SEO meta title',
  `meta_description` text COMMENT 'SEO meta description',
  `slug` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_parent` (`parent_id`),
  KEY `idx_categories_created_by` (`created_by`),
  KEY `idx_categories_updated_by` (`updated_by`),
  KEY `idx_categories_parent_show_nav` (`parent_id`,`show_nav`),
  KEY `idx_categories_slug` (`slug`),
  CONSTRAINT `fk_categories_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_categories_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `coupon_usage`
--

DROP TABLE IF EXISTS `coupon_usage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code_active` (`code`,`is_active`),
  KEY `idx_dates_active` (`start_date`,`end_date`,`is_active`),
  KEY `fk_coupons_created_by` (`created_by`),
  KEY `fk_coupons_updated_by` (`updated_by`),
  CONSTRAINT `fk_coupons_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_coupons_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `needs_password_setup` tinyint(1) DEFAULT '0' COMMENT '1 = usuario necesita crear contraseÃ±a',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastname` varchar(255) DEFAULT '' COMMENT 'Apellido del cliente',
  `photo` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT '' COMMENT 'Nombre del cliente',
  `phone` varchar(9) DEFAULT NULL COMMENT 'numero de celular',
  `dni` varchar(8) DEFAULT NULL COMMENT 'Documento de identidad ',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customers_addresses`
--

DROP TABLE IF EXISTS `customers_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customers_addresses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_customer` int(11) NOT NULL,
  `alias` varchar(100) NOT NULL COMMENT 'Nombre de la dirección (Casa, Oficina, etc.)',
  `department` varchar(100) NOT NULL DEFAULT 'LIMA',
  `province` varchar(100) NOT NULL DEFAULT 'LIMA',
  `district` varchar(100) NOT NULL,
  `district_id` int(10) unsigned DEFAULT NULL,
  `street_name` varchar(255) NOT NULL COMMENT 'Nombre de la avenida/calle/jirón',
  `street_number` varchar(50) NOT NULL COMMENT 'Número de la dirección',
  `apartment` varchar(100) DEFAULT NULL COMMENT 'Dpto/Interior/Piso/Lote/Bloque (opcional)',
  `reference` varchar(200) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL COMMENT 'Latitud GPS',
  `longitude` decimal(11,8) DEFAULT NULL COMMENT 'Longitud GPS',
  `is_default` tinyint(1) DEFAULT '0' COMMENT '1 = dirección por defecto',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_customer` (`id_customer`),
  KEY `idx_default` (`id_customer`,`is_default`),
  KEY `idx_coordinates` (`latitude`,`longitude`),
  KEY `idx_ca_district` (`district_id`),
  CONSTRAINT `customers_addresses_ibfk_1` FOREIGN KEY (`id_customer`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ca_district` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `districts`
--

DROP TABLE IF EXISTS `districts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `districts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'CÃ³digo INEI del distrito',
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `zone` enum('lima_centro','lima_norte','lima_sur','lima_este','callao') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Zona geogrÃ¡fica',
  `is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Si tiene cobertura de delivery',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_district_code` (`code`),
  KEY `idx_district_zone` (`zone`),
  KEY `idx_district_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `offer_categories`
--

DROP TABLE IF EXISTS `offer_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `offer_categories` (
  `offer_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`offer_id`,`category_id`),
  KEY `fk_offer_categories_category` (`category_id`),
  CONSTRAINT `fk_offer_categories_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_offer_categories_offer` FOREIGN KEY (`offer_id`) REFERENCES `offers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='CategorÃ­as completas en oferta';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `offer_usage`
--

DROP TABLE IF EXISTS `offer_usage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `offer_usage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `offer_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT '1',
  `original_price` decimal(10,2) NOT NULL,
  `offer_price` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL COMMENT 'Ahorro total',
  `used_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_offer` (`offer_id`),
  KEY `idx_customer` (`customer_id`),
  KEY `idx_order` (`order_id`),
  KEY `idx_customer_offer` (`customer_id`,`offer_id`),
  CONSTRAINT `fk_offer_usage_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_offer_usage_offer` FOREIGN KEY (`offer_id`) REFERENCES `offers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_offer_usage_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Historial de uso de ofertas';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `offer_variants`
--

DROP TABLE IF EXISTS `offer_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `offer_variants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `offer_id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL,
  `offer_price` decimal(10,2) NOT NULL COMMENT 'Precio final de la oferta',
  `original_price` decimal(10,2) NOT NULL COMMENT 'Precio original al momento de crear',
  `stock_limit` int(11) DEFAULT NULL COMMENT 'Stock mÃ¡ximo para esta oferta (NULL = sin lÃ­mite)',
  `sold_count` int(11) DEFAULT '0' COMMENT 'Unidades vendidas en esta oferta',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_offer_variant` (`offer_id`,`variant_id`),
  KEY `idx_variant` (`variant_id`),
  KEY `idx_offer` (`offer_id`),
  CONSTRAINT `fk_offer_variants_offer` FOREIGN KEY (`offer_id`) REFERENCES `offers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_offer_variants_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COMMENT='Variantes incluidas en cada oferta';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `offers`
--

DROP TABLE IF EXISTS `offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `offers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT 'Nombre interno de la oferta',
  `title` varchar(255) NOT NULL COMMENT 'TÃ­tulo visible para el cliente',
  `description` text,
  `offer_type` enum('flash_sale','daily_deal','clearance','bundle','volume_discount','seasonal') NOT NULL DEFAULT 'flash_sale',
  `discount_type` enum('percentage','fixed_amount','fixed_price') NOT NULL DEFAULT 'percentage',
  `discount_value` decimal(10,2) NOT NULL COMMENT 'Valor del descuento (% o monto fijo)',
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `max_uses` int(11) DEFAULT NULL COMMENT 'MÃ¡ximo de usos totales (NULL = ilimitado)',
  `max_uses_per_customer` int(11) DEFAULT '1' COMMENT 'MÃ¡ximo por cliente',
  `current_uses` int(11) DEFAULT '0' COMMENT 'Contador de usos actuales',
  `min_quantity` int(11) DEFAULT '1' COMMENT 'Cantidad mÃ­nima para aplicar',
  `min_purchase_amount` decimal(10,2) DEFAULT NULL COMMENT 'Monto mÃ­nimo de compra',
  `badge_text` varchar(50) DEFAULT NULL COMMENT 'Texto del badge (FLASH, -50%, HOT)',
  `badge_color` varchar(20) DEFAULT 'red' COMMENT 'Color del badge',
  `show_countdown` tinyint(1) DEFAULT '0' COMMENT 'Mostrar contador regresivo',
  `show_stock_indicator` tinyint(1) DEFAULT '0' COMMENT 'Mostrar indicador de stock',
  `show_savings` tinyint(1) DEFAULT '1' COMMENT 'Mostrar cuÃ¡nto ahorra',
  `image_url` varchar(255) DEFAULT NULL,
  `priority` int(11) DEFAULT '0' COMMENT 'Mayor nÃºmero = mayor prioridad',
  `is_active` tinyint(1) DEFAULT '1',
  `is_featured` tinyint(1) DEFAULT '0' COMMENT 'Destacar en home/landing',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_offer_type` (`offer_type`),
  KEY `idx_dates_active` (`start_date`,`end_date`,`is_active`),
  KEY `idx_featured` (`is_featured`,`is_active`),
  KEY `idx_priority` (`priority`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='Ofertas y descuentos especiales';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COMMENT='Items/productos de cada orden';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `calculate_item_total` 
BEFORE INSERT ON `order_items` 
FOR EACH ROW 
BEGIN
    SET NEW.total_price = (NEW.quantity * NEW.unit_price) - NEW.discount_amount;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `update_item_total` 
BEFORE UPDATE ON `order_items` 
FOR EACH ROW 
BEGIN
    SET NEW.total_price = (NEW.quantity * NEW.unit_price) - NEW.discount_amount;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Temporary table structure for view `order_summary`
--

DROP TABLE IF EXISTS `order_summary`;
/*!50001 DROP VIEW IF EXISTS `order_summary`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `order_summary` AS SELECT 
 1 AS `id`,
 1 AS `order_number`,
 1 AS `customer_id`,
 1 AS `customer_name`,
 1 AS `customer_email`,
 1 AS `status`,
 1 AS `payment_status`,
 1 AS `total_amount`,
 1 AS `created_at`,
 1 AS `estimated_delivery`,
 1 AS `total_items`,
 1 AS `total_quantity`,
 1 AS `tracking_number`,
 1 AS `courier_company`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `order_tracking`
--

DROP TABLE IF EXISTS `order_tracking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Seguimiento de envíos';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COMMENT='Órdenes principales del ecommerce';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `generate_order_number` 
BEFORE INSERT ON `orders` 
FOR EACH ROW 
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        SET NEW.order_number = CONCAT('ORD-', YEAR(NOW()), '-', LPAD(NEW.id, 6, '0'));
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `password_setup_tokens`
--

DROP TABLE IF EXISTS `password_setup_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_setup_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `password_setup_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payment_transactions`
--

DROP TABLE IF EXISTS `payment_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_attribute_option_images`
--

DROP TABLE IF EXISTS `product_attribute_option_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_attribute_option_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_attribute_option_id` int(11) NOT NULL COMMENT 'ID de la opciÃ³n especÃ­fica del producto',
  `image_type` enum('front','back','left','right','top','bottom','detail','lifestyle','packaging') NOT NULL DEFAULT 'front',
  `display_order` int(11) DEFAULT '0',
  `image_url_thumb` varchar(255) NOT NULL COMMENT 'Imagen thumbnail 140x140',
  `image_url_normal` varchar(255) NOT NULL COMMENT 'Imagen normal 600x800',
  `image_url_zoom` varchar(255) NOT NULL COMMENT 'Imagen zoom 1200x1200',
  `alt_text` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_primary` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_option_type` (`product_attribute_option_id`,`image_type`),
  KEY `idx_product_attribute_option` (`product_attribute_option_id`),
  CONSTRAINT `product_attribute_option_images_ibfk_1` FOREIGN KEY (`product_attribute_option_id`) REFERENCES `product_attribute_options` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1 COMMENT='ImÃ¡genes para opciones de atributos especÃ­ficas del producto';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_attribute_options`
--

DROP TABLE IF EXISTS `product_attribute_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_attribute_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL COMMENT 'ID del producto al que pertenece esta opciÃ³n',
  `attribute_id` int(11) NOT NULL COMMENT 'ID del atributo (Color, Almacenamiento, etc.)',
  `value` varchar(255) NOT NULL COMMENT 'Valor de la opciÃ³n (ej: "Titanio Negro", "128GB")',
  `display_order` int(11) DEFAULT '0' COMMENT 'Orden de visualizaciÃ³n',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_product_attr_value` (`product_id`,`attribute_id`,`value`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_attribute_id` (`attribute_id`),
  CONSTRAINT `product_attribute_options_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_attribute_options_ibfk_2` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1 COMMENT='Opciones de atributos especÃ­ficas de cada producto';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_categories`
--

DROP TABLE IF EXISTS `product_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_categories` (
  `product_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`category_id`),
  KEY `idx_category` (`category_id`),
  CONSTRAINT `fk_product_categories_category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_product_categories_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary table structure for view `product_rating_summary`
--

DROP TABLE IF EXISTS `product_rating_summary`;
/*!50001 DROP VIEW IF EXISTS `product_rating_summary`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `product_rating_summary` AS SELECT 
 1 AS `product_id`,
 1 AS `total_ratings`,
 1 AS `average_rating`,
 1 AS `five_star`,
 1 AS `four_star`,
 1 AS `three_star`,
 1 AS `two_star`,
 1 AS `one_star`,
 1 AS `verified_purchases`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `sku` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `image_attribute_id` int(11) DEFAULT NULL COMMENT 'ID del atributo que controla las imágenes de esta variante (NULL = usar variant_images)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_product` (`product_id`),
  KEY `idx_image_attribute` (`image_attribute_id`),
  KEY `idx_product_variants_slug` (`slug`),
  CONSTRAINT `fk_variant_image_attribute` FOREIGN KEY (`image_attribute_id`) REFERENCES `attributes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_variant_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `brand_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `base_price` decimal(10,2) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_brand` (`brand_id`),
  KEY `idx_products_created_by` (`created_by`),
  KEY `idx_products_updated_by` (`updated_by`),
  CONSTRAINT `fk_products_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_products_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_products_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `promotion_variants`
--

DROP TABLE IF EXISTS `promotion_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `promotions`
--

DROP TABLE IF EXISTS `promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `promotions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
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
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `fk_promotions_created_by` (`created_by`),
  KEY `fk_promotions_updated_by` (`updated_by`),
  KEY `idx_promotions_slug` (`slug`),
  CONSTRAINT `fk_promotions_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_promotions_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rating_images`
--

DROP TABLE IF EXISTS `rating_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rating_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rating_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_rating` (`rating_id`),
  CONSTRAINT `fk_rating_image` FOREIGN KEY (`rating_id`) REFERENCES `variant_ratings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roles_sections`
--

DROP TABLE IF EXISTS `roles_sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles_sections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_section` int(11) DEFAULT NULL,
  `id_rol` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_rol` (`id_rol`) USING BTREE,
  KEY `id_section` (`id_section`) USING BTREE,
  CONSTRAINT `roles_sections_ibfk_1` FOREIGN KEY (`id_section`) REFERENCES `sections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `roles_sections_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sections`
--

DROP TABLE IF EXISTS `sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `display_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `services_images`
--

DROP TABLE IF EXISTS `services_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shipping_methods`
--

DROP TABLE IF EXISTS `shipping_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shipping_zone_districts`
--

DROP TABLE IF EXISTS `shipping_zone_districts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shipping_zone_districts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `zone_id` int(11) NOT NULL,
  `district_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_zone_district` (`zone_id`,`district_id`),
  KEY `idx_szd_zone` (`zone_id`),
  KEY `idx_szd_district` (`district_id`),
  CONSTRAINT `fk_szd_district` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_szd_zone` FOREIGN KEY (`zone_id`) REFERENCES `shipping_zones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shipping_zone_methods`
--

DROP TABLE IF EXISTS `shipping_zone_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shipping_zones`
--

DROP TABLE IF EXISTS `shipping_zones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shipping_zones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `districts` json NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary table structure for view `variant_active_offers`
--

DROP TABLE IF EXISTS `variant_active_offers`;
/*!50001 DROP VIEW IF EXISTS `variant_active_offers`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `variant_active_offers` AS SELECT 
 1 AS `variant_id`,
 1 AS `offer_id`,
 1 AS `offer_price`,
 1 AS `original_price`,
 1 AS `stock_limit`,
 1 AS `sold_count`,
 1 AS `remaining_stock`,
 1 AS `offer_name`,
 1 AS `offer_title`,
 1 AS `offer_type`,
 1 AS `discount_type`,
 1 AS `discount_value`,
 1 AS `start_date`,
 1 AS `end_date`,
 1 AS `badge_text`,
 1 AS `badge_color`,
 1 AS `show_countdown`,
 1 AS `show_stock_indicator`,
 1 AS `show_savings`,
 1 AS `priority`,
 1 AS `discount_percent`,
 1 AS `savings_amount`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `variant_attribute_options`
--

DROP TABLE IF EXISTS `variant_attribute_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `variant_attribute_options` (
  `variant_id` int(11) NOT NULL,
  `product_attribute_option_id` int(11) NOT NULL COMMENT 'ID de la opciÃ³n especÃ­fica del producto',
  `additional_cost` decimal(10,2) DEFAULT '0.00' COMMENT 'Costo adicional para esta variante',
  PRIMARY KEY (`variant_id`,`product_attribute_option_id`),
  KEY `idx_variant` (`variant_id`),
  KEY `idx_product_attribute_option` (`product_attribute_option_id`),
  CONSTRAINT `variant_attribute_options_ibfk_1` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `variant_attribute_options_ibfk_2` FOREIGN KEY (`product_attribute_option_id`) REFERENCES `product_attribute_options` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='AsociaciÃ³n entre variantes y opciones de atributos del producto';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `variant_images`
--

DROP TABLE IF EXISTS `variant_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COMMENT='Imágenes de variantes con múltiples tamaños y tipos';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary table structure for view `variant_rating_summary`
--

DROP TABLE IF EXISTS `variant_rating_summary`;
/*!50001 DROP VIEW IF EXISTS `variant_rating_summary`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `variant_rating_summary` AS SELECT 
 1 AS `variant_id`,
 1 AS `total_ratings`,
 1 AS `average_rating`,
 1 AS `five_star`,
 1 AS `four_star`,
 1 AS `three_star`,
 1 AS `two_star`,
 1 AS `one_star`,
 1 AS `verified_purchases`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `variant_ratings`
--

DROP TABLE IF EXISTS `variant_ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `reviewed_by` int(11) DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_customer_variant` (`customer_id`,`variant_id`),
  KEY `idx_variant` (`variant_id`),
  KEY `idx_customer` (`customer_id`),
  KEY `idx_variant_ratings_status` (`status`),
  KEY `fk_variant_ratings_reviewed_by` (`reviewed_by`),
  CONSTRAINT `fk_rating_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rating_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_variant_ratings_reviewed_by` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `verification_codes`
--

DROP TABLE IF EXISTS `verification_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `verification_codes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('verification','password_reset') COLLATE utf8mb4_unicode_ci DEFAULT 'verification',
  `expires_at` datetime NOT NULL,
  `used_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_expires_at` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Final view structure for view `active_offers`
--

/*!50001 DROP VIEW IF EXISTS `active_offers`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `active_offers` AS select `o`.`id` AS `id`,`o`.`name` AS `name`,`o`.`title` AS `title`,`o`.`description` AS `description`,`o`.`offer_type` AS `offer_type`,`o`.`discount_type` AS `discount_type`,`o`.`discount_value` AS `discount_value`,`o`.`start_date` AS `start_date`,`o`.`end_date` AS `end_date`,`o`.`max_uses` AS `max_uses`,`o`.`max_uses_per_customer` AS `max_uses_per_customer`,`o`.`current_uses` AS `current_uses`,`o`.`min_quantity` AS `min_quantity`,`o`.`min_purchase_amount` AS `min_purchase_amount`,`o`.`badge_text` AS `badge_text`,`o`.`badge_color` AS `badge_color`,`o`.`show_countdown` AS `show_countdown`,`o`.`show_stock_indicator` AS `show_stock_indicator`,`o`.`show_savings` AS `show_savings`,`o`.`image_url` AS `image_url`,`o`.`priority` AS `priority`,`o`.`is_active` AS `is_active`,`o`.`is_featured` AS `is_featured`,`o`.`created_at` AS `created_at`,`o`.`updated_at` AS `updated_at`,count(`ov`.`variant_id`) AS `total_variants`,sum(`ov`.`sold_count`) AS `total_sold`,min(`ov`.`offer_price`) AS `min_price`,max((case when (`o`.`discount_type` = 'percentage') then `o`.`discount_value` else round((((`ov`.`original_price` - `ov`.`offer_price`) / `ov`.`original_price`) * 100),0) end)) AS `max_discount_percent` from (`offers` `o` left join `offer_variants` `ov` on((`o`.`id` = `ov`.`offer_id`))) where ((`o`.`is_active` = 1) and (now() between `o`.`start_date` and `o`.`end_date`) and (isnull(`o`.`max_uses`) or (`o`.`current_uses` < `o`.`max_uses`))) group by `o`.`id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `order_summary`
--

/*!50001 DROP VIEW IF EXISTS `order_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `order_summary` AS select `o`.`id` AS `id`,`o`.`order_number` AS `order_number`,`o`.`customer_id` AS `customer_id`,concat(`c`.`name`,' ',`c`.`lastname`) AS `customer_name`,`c`.`email` AS `customer_email`,`o`.`status` AS `status`,`o`.`payment_status` AS `payment_status`,`o`.`total_amount` AS `total_amount`,`o`.`created_at` AS `created_at`,`o`.`estimated_delivery` AS `estimated_delivery`,count(`oi`.`id`) AS `total_items`,sum(`oi`.`quantity`) AS `total_quantity`,`ot`.`tracking_number` AS `tracking_number`,`ot`.`courier_company` AS `courier_company` from (((`orders` `o` left join `customers` `c` on((`o`.`customer_id` = `c`.`id`))) left join `order_items` `oi` on((`o`.`id` = `oi`.`order_id`))) left join `order_tracking` `ot` on((`o`.`id` = `ot`.`order_id`))) group by `o`.`id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `product_rating_summary`
--

/*!50001 DROP VIEW IF EXISTS `product_rating_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `product_rating_summary` AS select `pv`.`product_id` AS `product_id`,count(`vr`.`id`) AS `total_ratings`,round(avg(`vr`.`rating`),1) AS `average_rating`,sum((case when (`vr`.`rating` = 5) then 1 else 0 end)) AS `five_star`,sum((case when (`vr`.`rating` = 4) then 1 else 0 end)) AS `four_star`,sum((case when (`vr`.`rating` = 3) then 1 else 0 end)) AS `three_star`,sum((case when (`vr`.`rating` = 2) then 1 else 0 end)) AS `two_star`,sum((case when (`vr`.`rating` = 1) then 1 else 0 end)) AS `one_star`,sum((case when (`vr`.`verified_purchase` = 1) then 1 else 0 end)) AS `verified_purchases` from (`product_variants` `pv` left join `variant_ratings` `vr` on(((`pv`.`id` = `vr`.`variant_id`) and (`vr`.`status` = 'approved')))) group by `pv`.`product_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `variant_active_offers`
--

/*!50001 DROP VIEW IF EXISTS `variant_active_offers`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `variant_active_offers` AS select `ov`.`variant_id` AS `variant_id`,`ov`.`offer_id` AS `offer_id`,`ov`.`offer_price` AS `offer_price`,`ov`.`original_price` AS `original_price`,`ov`.`stock_limit` AS `stock_limit`,`ov`.`sold_count` AS `sold_count`,(`ov`.`stock_limit` - `ov`.`sold_count`) AS `remaining_stock`,`o`.`name` AS `offer_name`,`o`.`title` AS `offer_title`,`o`.`offer_type` AS `offer_type`,`o`.`discount_type` AS `discount_type`,`o`.`discount_value` AS `discount_value`,`o`.`start_date` AS `start_date`,`o`.`end_date` AS `end_date`,`o`.`badge_text` AS `badge_text`,`o`.`badge_color` AS `badge_color`,`o`.`show_countdown` AS `show_countdown`,`o`.`show_stock_indicator` AS `show_stock_indicator`,`o`.`show_savings` AS `show_savings`,`o`.`priority` AS `priority`,round((((`ov`.`original_price` - `ov`.`offer_price`) / `ov`.`original_price`) * 100),0) AS `discount_percent`,(`ov`.`original_price` - `ov`.`offer_price`) AS `savings_amount` from (`offer_variants` `ov` join `offers` `o` on((`ov`.`offer_id` = `o`.`id`))) where ((`o`.`is_active` = 1) and (now() between `o`.`start_date` and `o`.`end_date`) and (isnull(`o`.`max_uses`) or (`o`.`current_uses` < `o`.`max_uses`)) and (isnull(`ov`.`stock_limit`) or (`ov`.`sold_count` < `ov`.`stock_limit`))) order by `o`.`priority` desc,`o`.`end_date` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `variant_rating_summary`
--

/*!50001 DROP VIEW IF EXISTS `variant_rating_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `variant_rating_summary` AS select `variant_ratings`.`variant_id` AS `variant_id`,count(0) AS `total_ratings`,round(avg(`variant_ratings`.`rating`),1) AS `average_rating`,sum((case when (`variant_ratings`.`rating` = 5) then 1 else 0 end)) AS `five_star`,sum((case when (`variant_ratings`.`rating` = 4) then 1 else 0 end)) AS `four_star`,sum((case when (`variant_ratings`.`rating` = 3) then 1 else 0 end)) AS `three_star`,sum((case when (`variant_ratings`.`rating` = 2) then 1 else 0 end)) AS `two_star`,sum((case when (`variant_ratings`.`rating` = 1) then 1 else 0 end)) AS `one_star`,sum((case when (`variant_ratings`.`verified_purchase` = 1) then 1 else 0 end)) AS `verified_purchases` from `variant_ratings` where (`variant_ratings`.`status` = 'approved') group by `variant_ratings`.`variant_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-24 22:43:07
