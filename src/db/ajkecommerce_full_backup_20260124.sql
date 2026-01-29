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
-- Dumping data for table `attribute_options`
--

LOCK TABLES `attribute_options` WRITE;
/*!40000 ALTER TABLE `attribute_options` DISABLE KEYS */;
INSERT INTO `attribute_options` VALUES (1,1,'Negro',0.00),(2,1,'Blanco',0.00),(3,1,'Plata',0.00),(4,1,'Azul granito',0.00),(5,2,'13 pulgadas',0.00),(6,2,'15 pulgadas',0.00),(7,2,'17 pulgadas',0.00),(8,3,'128GB RAM',0.00),(9,3,'256GB RAM',0.00),(10,3,'512GB RAM',0.00),(11,3,'1TB RAM',0.00),(12,3,'8GB RAM',0.00),(13,3,'16GB RAM',0.00),(14,3,'32GB RAM',0.00),(25,4,'Plástico',0.00),(26,4,'Aluminio',500.00),(27,4,'Fibra de Carbono',1000.00),(28,1,'Titanio Blanco',0.00),(29,1,'Titanio Negro',0.00),(30,1,'Titanio Natural',0.00),(31,1,'Titanio Desierto',0.00),(32,3,'256GB RAM',0.00),(33,3,'512GB RAM',200.00),(34,3,'1TB RAM',500.00),(35,1,'Negro',0.00),(36,1,'Blanco',0.00),(37,1,'Negro',0.00),(38,1,'Blanco',0.00),(39,4,'Aluminio',0.00),(40,1,'Titanio Rojo',0.00),(41,1,'marron camello 2',0.00),(42,2,'Largo',0.00),(43,1,'amarillo hoja',0.00);
/*!40000 ALTER TABLE `attribute_options` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `attributes`
--

LOCK TABLES `attributes` WRITE;
/*!40000 ALTER TABLE `attributes` DISABLE KEYS */;
INSERT INTO `attributes` VALUES (1,'Color','color','2026-01-19 05:31:05','2026-01-19 05:31:05',NULL,NULL),(2,'Tamaño','radio','2026-01-19 05:31:05','2026-01-19 05:31:05',NULL,NULL),(3,'Almacenamiento','pills','2026-01-19 05:31:05','2026-01-19 05:31:05',NULL,NULL),(4,'Material','pills','2026-01-19 05:31:05','2026-01-19 05:31:05',NULL,NULL);
/*!40000 ALTER TABLE `attributes` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `banner`
--

LOCK TABLES `banner` WRITE;
/*!40000 ALTER TABLE `banner` DISABLE KEYS */;
INSERT INTO `banner` VALUES (1,'mueboes baratos','No te pierdas las ofertas increíbles','Aprovecha nuestras ofertas especiales en tecnología','2025-06-23 17:52:06','2026-01-19 05:26:53',9999,'http:///www.com','/uploads/muebles/banner-1768593157556.png','Comprar Ahora',NULL,NULL),(2,'Ahorra hasta S/1,200','Descuentos en Tecnología','Los mejores smartphones y laptops con precios especiales','2025-06-23 17:52:59','2026-01-19 05:26:48',9999,'http://localhost:3000/promotions','/images/banners/banner2.webp','Ver Ofertas',NULL,NULL);
/*!40000 ALTER TABLE `banner` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (1,'TechPro','2026-01-19 05:31:06','2026-01-19 05:31:06',NULL,NULL),(2,'Apple','2026-01-19 05:31:06','2026-01-19 05:31:06',NULL,NULL),(3,'SoundMaster','2026-01-19 05:31:06','2026-01-19 05:31:06',NULL,NULL),(4,'SmartLife','2026-01-19 05:31:06','2026-01-19 05:31:06',NULL,NULL);
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Electrónicos','Dispositivos electrónicos y tecnología',NULL,'/uploads/1755045098102-869152374.webp',1,1,'2026-01-19 05:28:17','2026-01-24 16:30:22',NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'electronicos'),(2,'Ropa y Moda','Vestimenta y accesorios de moda',NULL,'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop',1,11,'2026-01-19 05:28:17','2026-01-24 16:30:20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ropa-y-moda'),(3,'Hogar y Jardín','Artículos para el hogar y jardín',NULL,'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=200&fit=crop',0,9,'2026-01-19 05:28:17','2026-01-24 16:30:20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'hogar-y-jardin'),(4,'Deportes','Equipos y accesorios deportivos',NULL,'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',0,8,'2026-01-19 05:28:17','2026-01-24 16:30:20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'deportes'),(5,'Salud y Belleza','Productos de cuidado personal',NULL,'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=200&fit=crop',0,12,'2026-01-19 05:28:17','2026-01-24 16:30:20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'salud-y-belleza'),(6,'Smartphones','Teléfonos inteligentes y accesorios',1,'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=200&fit=crop',0,6,'2026-01-19 05:28:17','2026-01-23 06:53:24',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'smartphones'),(7,'Computadoras','Laptops, PCs y accesorios',NULL,'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=200&fit=crop',1,7,'2026-01-19 05:28:17','2026-01-24 16:30:20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'computadoras'),(10,'Wearables2','Smartwatches y dispositivos vestibles',1,'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=200&fit=crop',0,9,'2026-01-19 05:28:17','2026-01-23 06:53:24',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'wearables2'),(11,'iPhone3','Smartphones Apple iPhone',6,'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&h=200&fit=crop',0,14,'2026-01-19 05:28:17','2026-01-23 06:53:24',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'iphone3'),(12,'Samsung Galaxy','Smartphones Samsung Galaxy',6,'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=200&fit=crop',0,19,'2026-01-19 05:28:17','2026-01-23 06:53:24',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'samsung-galaxy'),(13,'Xiaomi','Smartphones Xiaomi',6,'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=200&fit=crop',0,11,'2026-01-19 05:28:17','2026-01-23 06:53:24',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'xiaomi'),(14,'Accesorios Móviles','Fundas, cargadores y accesorios',6,'https://images.unsplash.com/photo-1601593346740-925612772716?w=400&h=200&fit=crop',0,18,'2026-01-19 05:28:17','2026-01-23 07:13:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'accesorios-moviles'),(15,'Laptops2','Computadoras portátiles',NULL,'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=200&fit=crop',0,10,'2026-01-19 05:28:17','2026-01-24 16:30:20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'laptops2'),(16,'PCs de Escritorio','Computadoras de escritorio',7,'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&h=200&fit=crop',0,13,'2026-01-19 05:28:17','2026-01-23 06:53:24',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'pcs-de-escritorio'),(17,'Componentes PC','Procesadores, RAM, tarjetas gráficas',NULL,'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=200&fit=crop',0,3,'2026-01-19 05:28:17','2026-01-24 16:30:22',NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'componentes-pc'),(18,'Periféricos','Teclados, ratones, monitores',NULL,'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=200&fit=crop',0,5,'2026-01-19 05:28:17','2026-01-24 16:30:20',NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'perifericos'),(19,'Ropa Hombre','Vestimenta masculina',2,'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop',0,5,'2026-01-19 05:28:17','2026-01-23 06:53:24',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ropa-hombre'),(20,'Ropa Mujer','Vestimenta femenina',2,'https://images.unsplash.com/photo-1494790108755-2616c9c0e4b5?w=400&h=200&fit=crop',1,4,'2026-01-19 05:28:17','2026-01-23 06:53:24',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ropa-mujer'),(21,'xx','xx',NULL,NULL,1,6,'2026-01-19 05:34:11','2026-01-24 16:30:20',3,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'xx'),(22,'bb','bb',NULL,NULL,1,2,'2026-01-19 05:37:44','2026-01-24 16:30:22',3,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'bb'),(23,'lacteos','categorias de lacteos',NULL,'/uploads/1755040412311-626359976.webp',1,4,'2026-01-23 07:11:32','2026-01-24 16:30:20',3,3,'/uploads/categoria lacteos/Banner-1920x500-1-1769151743029.png','/uploads/categoria lacteos/Banner-_-800-X-400-1769152222334.jpg','banner lacteo','solo promociones inteligentes','este banenr ayudara a vender mas lacteros','ir a lacteos','http://localhost:3000/lacteos','lacteos','meta desciepcion de lacteos','lacteos');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `coupon_usage`
--

LOCK TABLES `coupon_usage` WRITE;
/*!40000 ALTER TABLE `coupon_usage` DISABLE KEYS */;
INSERT INTO `coupon_usage` VALUES (1,1,3,12,200.00,'2026-01-17 19:34:55'),(2,2,12,16,204.00,'2026-01-20 05:37:53'),(3,2,13,17,204.00,'2026-01-20 05:44:00');
/*!40000 ALTER TABLE `coupon_usage` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` VALUES (1,'BIENVENIDO20','Descuento de bienvenida','descuento por tu primera compra','percentage',25.0000,1000.00,200.00,20,5,1,'2026-01-17 00:24:00','2026-01-20 00:24:00',1,'products',NULL,'2026-01-18 00:25:11','2026-01-18 00:34:55',NULL,NULL),(2,'DESC-D1VEUH','Descuento de navidad','cupon por navidad','percentage',12.0000,200.00,300.00,4,2,2,'2026-01-20 00:36:00','2026-01-22 00:36:00',1,'all',NULL,'2026-01-20 05:37:20','2026-01-20 05:43:59',NULL,NULL);
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (3,'jjhoncv2@gmail.com','$2b$12$jMi5XEnLsw70nHr6uFccvufU29hRsAHw68dIRS/gDiSZa.W/rhnsC',1,1,0,'2024-08-16 02:41:34','2026-01-20 04:41:45','Castro','','Jhonnatan','',''),(4,'asd@asd.com','$2b$10$RwSQFjp0aF8IcAVGqymgWO7fB6WyMr4VJmc2L5aHOuEAuvS2IU3Ee',NULL,1,0,'2025-05-21 04:49:46','2025-05-21 04:49:46','asd',NULL,'asd','',''),(11,'jjhoncv4@gmail.com','$2b$10$e65hiKbvGi1zpVDE/oWUGOzQ7aBQooB5A7DJpEcLP7IASw7HBeTV6',NULL,1,1,'2026-01-20 05:24:18','2026-01-20 05:33:27','',NULL,'jjhoncv',NULL,NULL),(12,'jjhoncv1@gmail.com','$2b$10$Pm2acuIHiNnBXtJ6Ph4iy.pOSxF42DBOo9efHC1tmgKIOxZuo4NgK',NULL,1,1,'2026-01-20 05:34:32','2026-01-20 05:42:02','',NULL,'jjhoncv',NULL,NULL),(13,'jjhoncv+67@gmail.com','$2b$10$ubqhVlXPcYVQOqj4S13ixu/zXiaCkEU5wXg2at/PK7zFSzL7k6efO',NULL,1,1,'2026-01-20 05:42:31','2026-01-23 04:43:47','Castro',NULL,'Jhonnatan','962235498','34534534'),(14,'jjhoncv+24@gmail.com','$2b$10$FVe9mr37H8qOquE/MWxMdu6QPB/0ZbvL3mZSruB6lG31qFLvIscGm',NULL,1,1,'2026-01-21 03:49:11','2026-01-21 03:49:11','',NULL,'jjhoncv+24',NULL,NULL),(15,'jjhoncv+333@gmail.com','$2b$10$J6yfbLkI0yVU0y/h72.CbulaMG.lTWcJBwKNB.M.4o4zR3UmroNdi',NULL,1,1,'2026-01-21 04:13:39','2026-01-21 04:13:39','',NULL,'jjhoncv+333',NULL,NULL),(16,'jjhoncv@gmail.com','$2b$10$SuUEE1dNyZCrcvCwjbqUmenxDW3D2tHwcASB.4Vo1Iap2iTSqNKWy',NULL,1,0,'2026-01-23 04:43:56','2026-01-23 05:14:38','Castro',NULL,'Jhonnatan',NULL,NULL),(17,'jjhoncv@hotmail.com','$2b$10$NrOgfkoIzW9Aft588.HPTuVUJENdkJdoUniMHkFJk8zHL2mAbuwOi',NULL,1,0,'2026-01-23 05:40:58','2026-01-23 05:40:58','Castro Vilela',NULL,'Jhonnatan',NULL,NULL);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `customers_addresses`
--

LOCK TABLES `customers_addresses` WRITE;
/*!40000 ALTER TABLE `customers_addresses` DISABLE KEYS */;
INSERT INTO `customers_addresses` VALUES (8,3,'Direccion de trabajo','LIMA','LIMA','JESÚS MARÍA',NULL,'Jr Arona','3935','piso 5/ unidad UND',NULL,NULL,NULL,0,'2025-06-18 19:19:47','2025-06-20 01:14:06'),(9,3,'Direccion de casa','LIMA','LIMA','LOS OLIVOS',NULL,'Jr Las Azucenas','3935','dpto 201',NULL,NULL,NULL,1,'2025-06-20 01:13:18','2025-06-20 01:14:58'),(12,11,'sdfsdf','LIMA','LIMA','JESÚS MARÍA',NULL,'awdwad','23','wefewfew ',NULL,NULL,NULL,0,'2026-01-20 05:24:53','2026-01-20 05:24:53'),(13,12,'Mi Casa','LIMA','LIMA','JESÚS MARÍA',NULL,'f ewfef','545','t54t45t t45',NULL,NULL,NULL,0,'2026-01-20 05:34:56','2026-01-20 05:34:56'),(14,13,'Mi Casa','LIMA','LIMA','Jesús María',4,'Av. Nueva Toledo','123','Casa A-6','',NULL,NULL,0,'2026-01-20 05:42:51','2026-01-21 03:31:07'),(15,14,'Casa de mama','Lima','Lima','Los Olivos',21,'Jr. Las Azucenas','3935','Dpto 201 ','Por la municipalidad de los olivos',-11.98940143,-77.07536817,0,'2026-01-21 03:49:43','2026-01-21 04:12:31'),(16,17,'Mi Casa','Lima','Lima','Jesús María',4,'Av. Nueva Toledo','123','Dpto 201 ','Por la municipalidad de los olivos',NULL,NULL,1,'2026-01-23 05:58:03','2026-01-23 06:01:07');
/*!40000 ALTER TABLE `customers_addresses` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `districts`
--

LOCK TABLES `districts` WRITE;
/*!40000 ALTER TABLE `districts` DISABLE KEYS */;
INSERT INTO `districts` VALUES (1,'150101','Cercado de Lima','lima_centro',1,'2026-01-21 02:57:41'),(2,'150104','Barranco','lima_centro',1,'2026-01-21 02:57:41'),(3,'150105','Breña','lima_centro',1,'2026-01-21 02:57:41'),(4,'150113','Jesús María','lima_centro',1,'2026-01-21 02:57:41'),(5,'150115','La Victoria','lima_centro',1,'2026-01-21 02:57:41'),(6,'150116','Lince','lima_centro',1,'2026-01-21 02:57:41'),(7,'150120','Magdalena del Mar','lima_centro',1,'2026-01-21 02:57:41'),(8,'150121','Pueblo Libre','lima_centro',1,'2026-01-21 02:57:41'),(9,'150122','Miraflores','lima_centro',1,'2026-01-21 02:57:41'),(10,'150128','Rímac','lima_centro',1,'2026-01-21 02:57:41'),(11,'150130','San Borja','lima_centro',1,'2026-01-21 02:57:41'),(12,'150131','San Isidro','lima_centro',1,'2026-01-21 02:57:41'),(13,'150134','San Luis','lima_centro',1,'2026-01-21 02:57:41'),(14,'150136','San Miguel','lima_centro',1,'2026-01-21 02:57:41'),(15,'150140','Santiago de Surco','lima_centro',1,'2026-01-21 02:57:41'),(16,'150141','Surquillo','lima_centro',1,'2026-01-21 02:57:41'),(17,'150102','Ancón','lima_norte',1,'2026-01-21 02:57:41'),(18,'150106','Carabayllo','lima_norte',1,'2026-01-21 02:57:41'),(19,'150110','Comas','lima_norte',1,'2026-01-21 02:57:41'),(20,'150112','Independencia','lima_norte',1,'2026-01-21 02:57:41'),(21,'150117','Los Olivos','lima_norte',1,'2026-01-21 02:57:41'),(22,'150125','Puente Piedra','lima_norte',1,'2026-01-21 02:57:41'),(23,'150135','San Martín de Porres','lima_norte',1,'2026-01-21 02:57:41'),(24,'150139','Santa Rosa','lima_norte',1,'2026-01-21 02:57:41'),(25,'150108','Chorrillos','lima_sur',1,'2026-01-21 02:57:41'),(26,'150119','Lurín','lima_sur',1,'2026-01-21 02:57:41'),(27,'150123','Pachacámac','lima_sur',1,'2026-01-21 02:57:41'),(28,'150124','Pucusana','lima_sur',1,'2026-01-21 02:57:41'),(29,'150126','Punta Hermosa','lima_sur',1,'2026-01-21 02:57:41'),(30,'150127','Punta Negra','lima_sur',1,'2026-01-21 02:57:41'),(31,'150129','San Bartolo','lima_sur',1,'2026-01-21 02:57:41'),(32,'150133','San Juan de Miraflores','lima_sur',1,'2026-01-21 02:57:41'),(33,'150138','Santa María del Mar','lima_sur',1,'2026-01-21 02:57:41'),(34,'150142','Villa El Salvador','lima_sur',1,'2026-01-21 02:57:41'),(35,'150143','Villa María del Triunfo','lima_sur',1,'2026-01-21 02:57:41'),(36,'150103','Ate','lima_este',1,'2026-01-21 02:57:41'),(37,'150107','Chaclacayo','lima_este',1,'2026-01-21 02:57:41'),(38,'150109','Cieneguilla','lima_este',1,'2026-01-21 02:57:41'),(39,'150111','El Agustino','lima_este',1,'2026-01-21 02:57:41'),(40,'150114','La Molina','lima_este',1,'2026-01-21 02:57:41'),(41,'150118','Lurigancho','lima_este',1,'2026-01-21 02:57:41'),(42,'150132','San Juan de Lurigancho','lima_este',1,'2026-01-21 02:57:41'),(43,'150137','Santa Anita','lima_este',1,'2026-01-21 02:57:41'),(44,'070101','Callao','callao',1,'2026-01-21 02:57:41'),(45,'070102','Bellavista','callao',1,'2026-01-21 02:57:41'),(46,'070103','Carmen de la Legua Reynoso','callao',1,'2026-01-21 02:57:41'),(47,'070104','La Perla','callao',1,'2026-01-21 02:57:41'),(48,'070105','La Punta','callao',1,'2026-01-21 02:57:41'),(49,'070106','Ventanilla','callao',1,'2026-01-21 02:57:41'),(50,'070107','Mi Perú','callao',1,'2026-01-21 02:57:41');
/*!40000 ALTER TABLE `districts` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `offer_categories`
--

LOCK TABLES `offer_categories` WRITE;
/*!40000 ALTER TABLE `offer_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `offer_categories` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `offer_usage`
--

LOCK TABLES `offer_usage` WRITE;
/*!40000 ALTER TABLE `offer_usage` DISABLE KEYS */;
/*!40000 ALTER TABLE `offer_usage` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `offer_variants`
--

LOCK TABLES `offer_variants` WRITE;
/*!40000 ALTER TABLE `offer_variants` DISABLE KEYS */;
INSERT INTO `offer_variants` VALUES (4,2,9,319.99,399.99,10,0,'2026-01-24 20:09:21'),(5,3,7,162.49,249.99,NULL,0,'2026-01-24 20:09:21'),(6,3,8,162.49,249.99,NULL,0,'2026-01-24 20:09:21'),(8,4,1,2974.99,3499.99,NULL,0,'2026-01-24 20:09:21'),(9,4,2,3399.99,3999.99,NULL,0,'2026-01-24 20:09:21'),(10,4,11,2974.99,3499.99,NULL,0,'2026-01-24 20:09:21'),(11,4,12,2975.00,3500.00,NULL,0,'2026-01-24 20:09:21'),(12,4,13,377.40,444.00,NULL,0,'2026-01-24 20:09:21'),(13,4,14,28.90,34.00,NULL,0,'2026-01-24 20:09:21'),(27,1,3,974.99,1299.99,5,0,'2026-01-24 20:34:53'),(28,1,4,974.99,1299.99,5,0,'2026-01-24 20:34:53');
/*!40000 ALTER TABLE `offer_variants` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `offers`
--

LOCK TABLES `offers` WRITE;
/*!40000 ALTER TABLE `offers` DISABLE KEYS */;
INSERT INTO `offers` VALUES (1,'Flash Sale iPhone','Flash Sale - Solo 3 horas','Aprovecha este descuento exclusivo por tiempo limitado','flash_sale','percentage',25.00,'2026-01-23 18:30:00','2026-01-27 02:09:00',20,1,0,1,NULL,'FLASH -25%','red',1,1,1,NULL,100,1,1,'2026-01-24 20:09:21','2026-01-24 20:48:09'),(2,'Oferta del Día - Smartwatch','Oferta del Día','Nuevo producto en oferta cada dÃ­a','daily_deal','fixed_amount',80.00,'2026-01-24 00:00:00','2026-01-25 00:00:00',NULL,1,0,1,NULL,'HOY -S/80','orange',1,0,1,NULL,90,1,1,'2026-01-24 20:09:21','2026-01-24 20:13:08'),(3,'Liquidación Audífonos','Últimas Unidades','Stock limitado - Â¡No te quedes sin el tuyo!','clearance','percentage',35.00,'2026-01-24 15:09:21','2026-02-23 15:09:21',NULL,1,0,1,NULL,'ÚLTIMAS!','purple',0,1,1,NULL,80,1,0,'2026-01-24 20:09:21','2026-01-24 20:13:16'),(4,'Compra 2 y Ahorra','Compra 2 o más y obtén 15% OFF','Descuento aplicable al comprar 2 o mÃ¡s unidades','volume_discount','percentage',15.00,'2026-01-24 15:09:21','2026-03-25 15:09:21',NULL,1,0,2,NULL,'2+ = 15%OFF','green',0,0,1,NULL,70,1,0,'2026-01-24 20:09:21','2026-01-24 20:13:08');
/*!40000 ALTER TABLE `offers` ENABLE KEYS */;
UNLOCK TABLES;

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

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,'Laptop Ultrabook Pro','SKU-1','{}',1,2999.99,2999.99,0.00),(2,1,3,'IPhone 16 Pro Max Negro 128 GB Aluminio','SKU-3','{}',1,1039.99,1039.99,0.00),(3,2,3,'IPhone 16 Pro Max Negro 128 GB Aluminio','SKU-3','{}',1,1039.99,1039.99,0.00),(4,3,3,'IPhone 16 Pro Max Negro 128 GB Aluminio','SKU-3','{}',1,1039.99,1039.99,0.00),(5,4,3,'IPhone 16 Pro Max Negro 128 GB Aluminio','SKU-3','{}',1,1039.99,1039.99,0.00),(6,5,3,'IPhone 16 Pro Max Negro 128 GB Aluminio','SKU-3','{}',1,1039.99,1039.99,0.00),(7,6,3,'IPhone 16 Pro Max Negro 128 GB Aluminio','SKU-3','{}',1,1039.99,1039.99,0.00),(8,7,3,'IPhone 16 Pro Max Negro 128 GB Aluminio','SKU-3','{}',1,1039.99,1039.99,0.00),(9,8,4,'IPhone 16 Pro Max Blanco 256 GB Aluminio','SKU-4','{}',1,1039.99,1039.99,0.00),(10,9,1,'Laptop Ultrabook Pro','SKU-1','{}',1,2999.99,2999.99,0.00),(11,10,1,'Laptop Ultrabook Pro','SKU-1','{}',1,2999.99,2999.99,0.00),(12,11,1,'Laptop Ultrabook Pro','SKU-1','{}',1,2999.99,2999.99,0.00),(13,12,3,'IPhone 16 Pro Max Negro 128 GB Aluminio','SKU-3','{}',1,1039.99,1039.99,0.00),(14,13,3,'IPhone 16 Pro Max Negro 128 GB Aluminio','SKU-3','{}',1,1039.99,1039.99,0.00),(15,14,3,'IPhone 16 Pro Max Negro 128 GB Aluminio','SKU-3','{}',1,1039.99,1039.99,0.00),(16,15,3,'IPhone 16 Pro Max Negro 128 GB Aluminio','SKU-3','{}',1,1039.99,1039.99,0.00),(17,15,6,'IPhone 16 Pro Max Blanco','SKU-6','{}',1,1699.99,1699.99,0.00),(18,16,6,'IPhone 16 Pro Max Blanco','SKU-6','{}',1,1699.99,1699.99,0.00),(19,17,6,'IPhone 16 Pro Max Blanco','SKU-6','{}',1,1699.99,1699.99,0.00),(20,18,4,'IPhone 16 Pro Max Blanco 256 GB Aluminio','SKU-4','{}',1,1039.99,1039.99,0.00),(21,18,3,'IPhone 16 Pro Max Negro 128 GB Aluminio','SKU-3','{}',1,1039.99,1039.99,0.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;
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
-- Dumping data for table `order_tracking`
--

LOCK TABLES `order_tracking` WRITE;
/*!40000 ALTER TABLE `order_tracking` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_tracking` ENABLE KEYS */;
UNLOCK TABLES;

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

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,3,'ORD-2026-1768690103720-Z278','pending','2026-01-17 22:48:23','2026-01-17 22:48:23',4039.98,0.00,120.00,748.80,4908.78,9,'Envio Estandar','2026-01-22','bank_transfer','pending',NULL,NULL,NULL),(2,3,'ORD-2026-1768690181931-GAO3','pending','2026-01-17 22:49:41','2026-01-17 22:49:41',1039.99,0.00,120.00,208.80,1368.79,9,'Envio Estandar','2026-01-22','bank_transfer','pending',NULL,NULL,NULL),(3,3,'ORD-2026-1768690631331-7TPM','pending','2026-01-17 22:57:11','2026-01-17 22:57:11',1039.99,0.00,120.00,208.80,1368.79,9,'Envio Estandar','2026-01-22','bank_transfer','pending',NULL,NULL,NULL),(4,3,'ORD-2026-1768690645724-9XY8','pending','2026-01-17 22:57:25','2026-01-17 22:57:25',1039.99,0.00,120.00,208.80,1368.79,9,'Envio Estandar','2026-01-22','bank_transfer','pending',NULL,NULL,NULL),(5,3,'ORD-2026-1768690657299-YRYM','pending','2026-01-17 22:57:37','2026-01-17 22:57:37',1039.99,0.00,120.00,208.80,1368.79,9,'Envio Estandar','2026-01-22','bank_transfer','pending',NULL,NULL,NULL),(6,3,'ORD-2026-1768690711472-DDEB','pending','2026-01-17 22:58:31','2026-01-17 22:58:31',1039.99,0.00,120.00,208.80,1368.79,9,'Envio Estandar','2026-01-22','bank_transfer','pending',NULL,NULL,NULL),(7,3,'ORD-2026-1768692064554-CC1P','processing','2026-01-17 23:21:04','2026-01-17 23:21:21',1039.99,0.00,120.00,208.80,1368.79,9,'Envio Estandar','2026-01-22','bank_transfer','paid','2026-01-17 18:21:22',NULL,'Pago confirmado - Procesando pedido'),(8,3,'ORD-2026-1768692621871-CVPY','processing','2026-01-17 23:30:21','2026-01-17 23:30:41',1039.99,0.00,120.00,208.80,1368.79,9,'Envio Estandar','2026-01-22','bank_transfer','paid','2026-01-17 18:30:41',NULL,'Pago confirmado - Procesando pedido'),(9,3,'ORD-2026-1768692759731-IGT9','processing','2026-01-17 23:32:39','2026-01-17 23:32:45',2999.99,0.00,120.00,561.60,3681.59,9,'Envio Estandar','2026-01-22','bank_transfer','paid','2026-01-17 18:32:45',NULL,'Pago confirmado - Procesando pedido'),(10,3,'ORD-2026-1768692846105-LIGH','processing','2026-01-17 23:34:06','2026-01-17 23:34:22',2999.99,0.00,120.00,561.60,3681.59,9,'Envio Estandar','2026-01-22','bank_transfer','paid','2026-01-17 18:34:22',NULL,'Pago confirmado - Procesando pedido'),(11,3,'ORD-2026-1768692932597-7WE3','processing','2026-01-17 23:35:32','2026-01-17 23:35:41',2999.99,0.00,120.00,561.60,3681.59,9,'Envio Estandar','2026-01-22','bank_transfer','paid','2026-01-17 18:35:41',NULL,'Pago confirmado - Procesando pedido'),(12,3,'ORD-2026-1768696495235-VE3C','processing','2026-01-18 00:34:55','2026-01-18 00:35:04',1039.99,200.00,120.00,172.80,1132.79,9,'Envio Estandar','2026-01-22','bank_transfer','paid','2026-01-17 19:35:05',NULL,'Pago confirmado - Procesando pedido'),(13,3,'ORD-2026-1768704384678-ZNVV','processing','2026-01-18 02:46:24','2026-01-18 02:46:30',1039.99,0.00,120.00,208.80,1368.79,9,'Envio Estandar','2026-01-22','bank_transfer','paid','2026-01-17 21:46:31',NULL,'Pago confirmado - Procesando pedido'),(14,3,'ORD-2026-1768754276289-EX1T','pending','2026-01-18 16:37:56','2026-01-18 16:38:02',1039.99,0.00,120.00,208.80,1368.79,9,'Envio Estandar','2026-01-23','bank_transfer','failed',NULL,NULL,NULL),(15,11,'ORD-2026-1768886726561-MIYT','processing','2026-01-20 05:25:26','2026-01-20 05:25:44',2739.98,0.00,150.00,520.20,3410.18,12,'Envio Estandar','2026-01-25','bank_transfer','paid','2026-01-20 05:25:45',NULL,'Pago confirmado - Procesando pedido'),(16,12,'ORD-2026-1768887472915-A4D7','processing','2026-01-20 05:37:52','2026-01-20 05:38:01',1699.99,204.00,150.00,296.28,1942.27,13,'Envio Estandar','2026-01-25','bank_transfer','paid','2026-01-20 05:38:02',NULL,'Pago confirmado - Procesando pedido'),(17,13,'ORD-2026-1768887839714-SPUI','processing','2026-01-20 05:43:59','2026-01-20 05:44:08',1699.99,204.00,150.00,296.28,1942.27,14,'Envio Estandar','2026-01-25','bank_transfer','paid','2026-01-20 05:44:09',NULL,'Pago confirmado - Procesando pedido'),(18,14,'ORD-2026-1768967419115-340L','processing','2026-01-21 03:50:19','2026-01-21 03:51:43',2079.98,0.00,150.00,401.40,2631.38,15,'Envio Estandar','2026-01-25','card','paid','2026-01-21 03:51:44',NULL,'Pago confirmado - Procesando pedido');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
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
-- Dumping data for table `password_setup_tokens`
--

LOCK TABLES `password_setup_tokens` WRITE;
/*!40000 ALTER TABLE `password_setup_tokens` DISABLE KEYS */;
INSERT INTO `password_setup_tokens` VALUES (2,15,'25599b2a-8720-405b-a215-634e92fd9317','2026-01-19 12:34:36',NULL,'2026-01-17 17:34:35'),(3,15,'cfbaf0a7-6c31-4172-a544-52fcf8946864','2026-01-19 12:36:43',NULL,'2026-01-17 17:36:42'),(4,15,'fddb5640-1a12-4a95-833e-76c51d38ee76','2026-01-17 17:40:13','2026-01-17 17:40:13','2026-01-17 17:39:44');
/*!40000 ALTER TABLE `password_setup_tokens` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
INSERT INTO `payment_methods` VALUES (1,'Tarjeta de Crédito/Débito','card','Visa, Mastercard, American Express',NULL,'percentage',3.5000,10.00,5000.00,1,0,1,'{\"accepted_cards\": [\"visa\", \"mastercard\", \"amex\"]}','2025-06-18 23:09:17','2026-01-17 20:41:07'),(2,'Yape','yape','Pago mediante código QR de Yape',NULL,'fixed',2.0000,5.00,1000.00,1,0,2,'{\"qr_timeout\": 300}','2025-06-18 23:09:17','2025-06-18 23:09:17'),(3,'Plin','plin','Pago mediante código QR de Plin',NULL,'fixed',2.0000,5.00,1000.00,1,0,3,'{\"qr_timeout\": 300}','2025-06-18 23:09:17','2025-06-18 23:09:17'),(4,'Transferencia Bancaria','bank_transfer','Transferencia a cuenta bancaria',NULL,'fixed',5.0000,50.00,10000.00,1,0,4,'{\"verification_required\": true}','2025-06-18 23:09:17','2025-06-18 23:09:17'),(5,'Pago Contra Entrega','cash_on_delivery','Paga cuando recibas tu pedido',NULL,'fixed',5.0000,20.00,500.00,1,0,5,'{\"max_amount\": 500}','2025-06-18 23:09:17','2026-01-17 15:34:12');
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `payment_transactions`
--

LOCK TABLES `payment_transactions` WRITE;
/*!40000 ALTER TABLE `payment_transactions` DISABLE KEYS */;
INSERT INTO `payment_transactions` VALUES (1,1,4,NULL,'TXN-1768690103771-XN5QK8',4908.78,5.00,4903.78,'PEN','pending',NULL,NULL,NULL,NULL,'2026-01-17 17:48:24','2026-01-17 17:48:24'),(2,2,4,NULL,'TXN-1768690181961-PSJE84',1368.79,5.00,1363.79,'PEN','pending',NULL,NULL,NULL,NULL,'2026-01-17 17:49:42','2026-01-17 17:49:42'),(3,6,4,NULL,'TXN-1768690711504-26F4I4',1373.79,5.00,1368.79,'PEN','pending',NULL,NULL,NULL,NULL,'2026-01-17 17:58:32','2026-01-17 17:58:32'),(4,7,4,'TXN_1768692081748_6f1pxxzae','TXN-1768692064574-LIEYIQ',1373.79,5.00,1368.79,'PEN','completed',NULL,'{\"method\": \"bank_transfer\", \"reason\": null, \"gateway\": \"Manual Transfer System\", \"approved\": true, \"authCode\": \"AUTH_dsl4dxe84\", \"errorCode\": null, \"processedAt\": \"2026-01-17T23:21:21.164Z\"}','2026-01-17 18:21:22',NULL,'2026-01-17 18:21:05','2026-01-17 18:21:22'),(5,8,4,'TXN_1768692641111_flihezkvy','TXN-1768692621901-ZPLZNH',1373.79,5.00,1368.79,'PEN','completed',NULL,'{\"method\": \"bank_transfer\", \"reason\": null, \"gateway\": \"Manual Transfer System\", \"approved\": true, \"authCode\": \"AUTH_lu6xyqw0t\", \"errorCode\": null, \"processedAt\": \"2026-01-17T23:30:40.942Z\"}','2026-01-17 18:30:41',NULL,'2026-01-17 18:30:22','2026-01-17 18:30:41'),(6,9,4,'TXN_1768692765017_rc5kuujau','TXN-1768692759750-B22FJG',3686.59,5.00,3681.59,'PEN','completed',NULL,'{\"method\": \"bank_transfer\", \"reason\": null, \"gateway\": \"Manual Transfer System\", \"approved\": true, \"authCode\": \"AUTH_hd53g7j0w\", \"errorCode\": null, \"processedAt\": \"2026-01-17T23:32:44.895Z\"}','2026-01-17 18:32:45',NULL,'2026-01-17 18:32:40','2026-01-17 18:32:45'),(7,10,4,'TXN_1768692862076_nhngakk52','TXN-1768692846130-N2O3X5',3686.59,5.00,3681.59,'PEN','completed',NULL,'{\"method\": \"bank_transfer\", \"reason\": null, \"gateway\": \"Manual Transfer System\", \"approved\": true, \"authCode\": \"AUTH_zqragz42t\", \"errorCode\": null, \"processedAt\": \"2026-01-17T23:34:21.951Z\"}','2026-01-17 18:34:22',NULL,'2026-01-17 18:34:06','2026-01-17 18:34:22'),(8,11,4,'TXN_1768692941298_zuu1xl6ub','TXN-1768692932617-BTKBUH',3686.59,5.00,3681.59,'PEN','completed',NULL,'{\"method\": \"bank_transfer\", \"reason\": null, \"gateway\": \"Manual Transfer System\", \"approved\": true, \"authCode\": \"AUTH_91vb6d19m\", \"errorCode\": null, \"processedAt\": \"2026-01-17T23:35:41.149Z\"}','2026-01-17 18:35:41',NULL,'2026-01-17 18:35:33','2026-01-17 18:35:41'),(9,12,4,'TXN_1768696504869_yxjgrgzh9','TXN-1768696495271-S81NTX',1137.79,5.00,1132.79,'PEN','completed',NULL,'{\"method\": \"bank_transfer\", \"reason\": null, \"gateway\": \"Manual Transfer System\", \"approved\": true, \"authCode\": \"AUTH_53tfymtwr\", \"errorCode\": null, \"processedAt\": \"2026-01-18T00:35:04.619Z\"}','2026-01-17 19:35:05',NULL,'2026-01-17 19:34:55','2026-01-17 19:35:05'),(10,13,4,'TXN_1768704390530_038gdyyav','TXN-1768704384698-V518DM',1373.79,5.00,1368.79,'PEN','completed',NULL,'{\"method\": \"bank_transfer\", \"reason\": null, \"gateway\": \"Manual Transfer System\", \"approved\": true, \"authCode\": \"AUTH_zvv7fpgwj\", \"errorCode\": null, \"processedAt\": \"2026-01-18T02:46:29.955Z\"}','2026-01-17 21:46:31',NULL,'2026-01-17 21:46:25','2026-01-17 21:46:31'),(11,14,4,NULL,'TXN-1768754276308-KEE9N1',1373.79,5.00,1368.79,'PEN','failed',NULL,'{\"method\": \"bank_transfer\", \"reason\": \"Fondos insuficientes\", \"gateway\": \"Manual Transfer System\", \"approved\": false, \"authCode\": null, \"errorCode\": \"INSUFFICIENT_FUNDS\", \"processedAt\": \"2026-01-18T16:38:01.929Z\"}','2026-01-18 11:38:02',NULL,'2026-01-18 11:37:56','2026-01-18 11:38:02'),(12,15,4,'TXN_1768886744946_7dzaey9nt','TXN-1768886726594-GJOS96',3415.18,5.00,3410.18,'PEN','completed',NULL,'{\"method\": \"bank_transfer\", \"reason\": null, \"gateway\": \"Manual Transfer System\", \"approved\": true, \"authCode\": \"AUTH_vpxgs9zse\", \"errorCode\": null, \"processedAt\": \"2026-01-20T05:25:43.709Z\"}','2026-01-20 05:25:45',NULL,'2026-01-20 05:25:27','2026-01-20 05:25:45'),(13,16,4,'TXN_1768887481567_ljzljxzc4','TXN-1768887472998-JUM5BT',1947.27,5.00,1942.27,'PEN','completed',NULL,'{\"method\": \"bank_transfer\", \"reason\": null, \"gateway\": \"Manual Transfer System\", \"approved\": true, \"authCode\": \"AUTH_guy7viogz\", \"errorCode\": null, \"processedAt\": \"2026-01-20T05:38:01.355Z\"}','2026-01-20 05:38:02',NULL,'2026-01-20 05:37:53','2026-01-20 05:38:02'),(14,17,4,'TXN_1768887848514_uify497f2','TXN-1768887839741-90QGI4',1947.27,5.00,1942.27,'PEN','completed',NULL,'{\"method\": \"bank_transfer\", \"reason\": null, \"gateway\": \"Manual Transfer System\", \"approved\": true, \"authCode\": \"AUTH_bi7cca3wn\", \"errorCode\": null, \"processedAt\": \"2026-01-20T05:44:08.229Z\"}','2026-01-20 05:44:09',NULL,'2026-01-20 05:44:00','2026-01-20 05:44:09'),(15,18,1,'TXN_1768967503532_qvhz0ol73','TXN-1768967419133-IPZ7NW',2723.48,92.10,2631.38,'PEN','completed',NULL,'{\"method\": \"card\", \"reason\": null, \"gateway\": \"Visa/Mastercard Gateway\", \"approved\": true, \"authCode\": \"AUTH_5aw5gctd7\", \"errorCode\": null, \"processedAt\": \"2026-01-21T03:51:42.576Z\"}','2026-01-21 03:51:44',NULL,'2026-01-21 03:50:19','2026-01-21 03:51:44');
/*!40000 ALTER TABLE `payment_transactions` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `product_attribute_option_images`
--

LOCK TABLES `product_attribute_option_images` WRITE;
/*!40000 ALTER TABLE `product_attribute_option_images` DISABLE KEYS */;
INSERT INTO `product_attribute_option_images` VALUES (3,5,'front',0,'/uploads/iphone-16-pro-max/negro/iphone-16-prox-max-titanio-negro-back-default-1768523296399.webp','/uploads/iphone-16-pro-max/negro/iphone-16-prox-max-titanio-negro-back-default-1768523296399.webp','/uploads/iphone-16-pro-max/negro/iphone-16-prox-max-titanio-negro-back-default-1768523296399.webp','iphone-16-prox-max-titanio-negro-back-default-1768523296399.webp','2026-01-16 00:28:40','2026-01-16 00:28:40',1),(5,6,'front',0,'/uploads/iphone-16-pro-max/blanco/iphone-16-prox-max-titanio-blanco-back-default-1768523523062.webp','/uploads/iphone-16-pro-max/blanco/iphone-16-prox-max-titanio-blanco-back-default-1768523523062.webp','/uploads/iphone-16-pro-max/blanco/iphone-16-prox-max-titanio-blanco-back-default-1768523523062.webp','iphone-16-prox-max-titanio-blanco-back-default-1768523523062.webp','2026-01-16 00:34:45','2026-01-16 00:34:45',1),(12,5,'back',1,'/uploads/iphone-16-pro-max/negro/imageUrl_2-1768675682277.webp','/uploads/iphone-16-pro-max/negro/imageUrl_2-1768675682277.webp','/uploads/iphone-16-pro-max/negro/imageUrl_2-1768675682277.webp','imageUrl_2-1768675682277.webp','2026-01-17 18:49:32','2026-01-17 18:49:32',0);
/*!40000 ALTER TABLE `product_attribute_option_images` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `product_attribute_options`
--

LOCK TABLES `product_attribute_options` WRITE;
/*!40000 ALTER TABLE `product_attribute_options` DISABLE KEYS */;
INSERT INTO `product_attribute_options` VALUES (5,2,1,'Negro',0,'2026-01-16 00:25:16','2026-01-16 00:25:16'),(6,2,1,'Blanco',0,'2026-01-16 00:25:22','2026-01-16 00:25:22'),(7,2,3,'128 GB',0,'2026-01-16 00:25:31','2026-01-16 00:25:31'),(8,2,3,'256 GB',0,'2026-01-16 00:25:39','2026-01-16 00:25:39'),(9,2,4,'Aluminio',0,'2026-01-16 00:25:45','2026-01-16 00:25:45'),(11,3,1,'Amarillo',0,'2026-01-19 06:42:04','2026-01-19 06:42:04'),(12,3,1,'Blanco',0,'2026-01-19 06:43:35','2026-01-19 06:43:35');
/*!40000 ALTER TABLE `product_attribute_options` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `product_categories`
--

LOCK TABLES `product_categories` WRITE;
/*!40000 ALTER TABLE `product_categories` DISABLE KEYS */;
INSERT INTO `product_categories` VALUES (2,1),(3,1),(4,1),(1,2),(2,4),(3,5),(3,6),(7,6),(4,7),(1,19);
/*!40000 ALTER TABLE `product_categories` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (1,1,'LAPTOP-PRO-15-8GB-BLACK','laptop-pro-15-8gb-black',3499.99,7,'2025-05-21 06:04:54','2026-01-23 07:34:07',NULL),(2,1,'LAPTOP-PRO-15-16GB','laptop-pro-15-16gb',3999.99,5,'2025-05-21 06:04:54','2026-01-23 07:34:07',NULL),(3,2,'IPHONE-16-PROMAX-BLACK-256GB','iphone-16-pro-max-negro-256-gb-aluminio',1299.99,9,'2025-05-21 06:04:54','2026-01-23 07:36:17',1),(4,2,'IPHONE-16-PROMAX-WHITE-128GB','iphone-16-promax-white-128gb',1299.99,1,'2025-05-21 06:04:54','2026-01-23 07:34:07',1),(6,2,'IPHONE-16-PROMAX-WHITE-256GB','iphone-16-promax-white-256gb',1899.99,8,'2025-05-21 06:04:54','2026-01-23 07:34:07',1),(7,3,'HEADPHONES-PRO-YELLOW','headphones-pro-yellow',249.99,29,'2025-05-21 06:04:54','2026-01-23 07:34:07',1),(8,3,'HEADPHONES-PRO-WHITE','headphones-pro-white',249.99,25,'2025-05-21 06:04:54','2026-01-23 07:34:07',1),(9,4,'SMARTWATCH-5-BLACK','smartwatch-5-black',399.99,0,'2025-05-21 06:04:54','2026-01-23 07:34:07',1),(10,4,'SMARTWATCH-5-SILVER','smartwatch-5-silver',399.99,21,'2025-05-21 06:04:54','2026-01-23 07:34:07',1),(11,1,'LAPTOP-PRO-15-8GB-WHITE','laptop-pro-15-8gb-white',3499.99,13,'2025-05-30 21:25:05','2026-01-23 07:34:07',NULL),(12,1,'LAPTOP-PRO-15-8GB-BLUE','laptop-pro-15-8gb-blue',3500.00,2,'2026-01-03 03:06:58','2026-01-23 07:34:07',NULL),(13,1,'xxx','xxx',444.00,2,'2026-01-03 21:54:01','2026-01-23 07:34:07',NULL),(14,1,'yyy','yyy',34.00,5,'2026-01-03 22:05:49','2026-01-23 07:34:07',NULL),(15,7,'IPHONE-15-PROMAX-BLACK-128GB','iphone-15-promax-black-128gb',3500.00,10,'2026-01-14 04:59:40','2026-01-23 07:34:07',1),(16,7,'IPHONE-15-PROMAX-BLUE-128GB','iphone-15-promax-blue-128gb',3500.00,2,'2026-01-14 05:05:24','2026-01-23 07:34:07',1);
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Laptop Ultrabook Pro','Laptop ultradelgada con procesador de última generación',2,'2025-01-15 10:00:00','2026-01-19 06:00:55',3499.99,NULL,3),(2,'IPhone 16 Pro Max','Imponente diseño de titanio. Control de la Cámara. 4K Dolby Vision a 120 cps. Y el chip A18 Pro.',2,'2025-01-20 11:30:00','2025-06-02 18:07:49',1299.99,NULL,NULL),(3,'Auriculares Inalámbricos Pro','Auriculares con cancelación de ruido y alta fidelidad',3,'2025-02-05 09:15:00','2025-02-05 09:15:00',249.99,NULL,NULL),(4,'Smartwatch Huawei Watch FIT 3 Sport 1.82\" AMOLED','Reloj inteligente con monitor de salud y GPS',4,'2025-02-10 14:45:00','2025-06-02 18:06:22',399.99,NULL,NULL),(7,'Iphone 15 pro max','',2,'2026-01-14 04:58:05','2026-01-14 04:58:05',2800.00,NULL,NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `promotion_variants`
--

LOCK TABLES `promotion_variants` WRITE;
/*!40000 ALTER TABLE `promotion_variants` DISABLE KEYS */;
INSERT INTO `promotion_variants` VALUES (1,1,2999.99,5,'2025-05-30 17:41:53'),(1,7,212.49,10,'2025-05-30 17:41:53'),(2,3,1039.99,2,'2025-05-30 17:41:53'),(2,4,1039.99,7,'2025-05-30 17:41:53'),(2,9,320.00,5,'2025-06-17 02:46:01'),(3,6,1699.99,3,'2025-05-30 17:41:53');
/*!40000 ALTER TABLE `promotion_variants` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `promotions`
--

LOCK TABLES `promotions` WRITE;
/*!40000 ALTER TABLE `promotions` DISABLE KEYS */;
INSERT INTO `promotions` VALUES (1,'Ofertas del Día','ofertas-del-dia','Descuentos especiales por 24 horas','2025-06-18 00:00:00','2026-06-28 00:00:00','percentage',15.00,NULL,1,'2025-05-30 17:41:53','2026-01-23 08:04:58','oferta','/images/promotions/promotion-sales.webp',0,NULL,NULL),(2,'Cyber Week','cyber-week','Grandes descuentos en tecnología','2025-06-21 00:00:00','2026-06-29 23:59:59','percentage',20.00,NULL,1,'2025-05-30 17:41:53','2026-01-23 08:04:46','cyber','/images/promotions/promotion-tecnology.webp',1,NULL,NULL),(3,'Liquidación Smartphones','liquidacion-smartphones','Precios especiales en smartphones seleccionados','2025-06-17 00:00:00','2026-06-27 23:59:59','fixed_amount',200.00,NULL,1,'2025-05-30 17:41:53','2026-01-23 08:04:58','liquidacion','/images/promotions/promotion-smatphones.webp',2,NULL,NULL);
/*!40000 ALTER TABLE `promotions` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `rating_images`
--

LOCK TABLES `rating_images` WRITE;
/*!40000 ALTER TABLE `rating_images` DISABLE KEYS */;
INSERT INTO `rating_images` VALUES (12,18,'/uploads/ratings/iphone-16-promax-white-128gb/rating-18-1769280793637-61061766.jpeg','2026-01-24 18:53:13'),(13,19,'/uploads/ratings/iphone-16-promax-white-256gb/rating-19-1769281427313-233417770.jpeg','2026-01-24 19:03:47'),(14,19,'/uploads/ratings/iphone-16-promax-white-256gb/rating-19-1769281427314-746087254.jpeg','2026-01-24 19:03:47'),(15,19,'/uploads/ratings/iphone-16-promax-white-256gb/rating-19-1769281427314-969687520.jpeg','2026-01-24 19:03:47'),(16,19,'/uploads/ratings/iphone-16-promax-white-256gb/rating-19-1769281427315-178207209.jpeg','2026-01-24 19:03:47'),(17,19,'/uploads/ratings/iphone-16-promax-white-256gb/rating-19-1769281427317-69166036.jpeg','2026-01-24 19:03:47');
/*!40000 ALTER TABLE `rating_images` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'superadmin','2024-08-06 20:59:34','2024-08-06 20:59:34'),(2,'admin','2024-08-06 20:59:34','2024-08-06 20:59:34'),(3,'test','2026-01-17 17:52:16','2026-01-17 17:52:16');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `roles_sections`
--

LOCK TABLES `roles_sections` WRITE;
/*!40000 ALTER TABLE `roles_sections` DISABLE KEYS */;
INSERT INTO `roles_sections` VALUES (86,1,2),(87,2,2),(88,3,2),(99,2,1),(100,3,1),(101,4,1),(102,5,1),(103,6,1),(104,7,1),(105,8,1),(106,1,1),(107,9,1),(108,10,1),(109,11,1),(117,14,1),(118,14,3),(119,10,3),(120,15,1),(121,16,1),(122,17,1),(123,18,1),(124,19,1),(125,19,2),(126,20,1),(127,21,1);
/*!40000 ALTER TABLE `roles_sections` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `sections`
--

LOCK TABLES `sections` WRITE;
/*!40000 ALTER TABLE `sections` DISABLE KEYS */;
INSERT INTO `sections` VALUES (1,'banners','/banners','Image',1),(2,'services','/services','HandPlatter',3),(3,'projects','/projects','FolderKanban',4),(4,'pages','/pages','StickyNote',2),(5,'gallery','/gallery','GalleryHorizontal',5),(6,'profile','/profile','UserPen',6),(7,'users','/users','Users',7),(8,'roles','/roles','SlidersHorizontal',8),(9,'categories','/categories','Category',9),(10,'products','/products','Product',10),(11,'attributes','/attributes','Attributes',11),(14,'orders','/orders','ShoppingCart',0),(15,'shippings','/shippings','Shippings',12),(16,'payments','/payments','Payments',13),(17,'promotions','/promotions','Promotions',14),(18,'coupons','/coupons','Coupons',15),(19,'customers','/customers','UsersRound',16),(20,'Valoraciones','/ratings',NULL,25),(21,'offers','/offers','Tag',10);
/*!40000 ALTER TABLE `sections` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `services_images`
--

LOCK TABLES `services_images` WRITE;
/*!40000 ALTER TABLE `services_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `services_images` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `shipping_methods`
--

LOCK TABLES `shipping_methods` WRITE;
/*!40000 ALTER TABLE `shipping_methods` DISABLE KEYS */;
INSERT INTO `shipping_methods` VALUES (1,'Envio Estandar','Envio mas comdo fiable, sin ningun problema',100.00,NULL,1,3,1,0,'2026-01-17 15:22:18','2026-01-17 15:22:18');
/*!40000 ALTER TABLE `shipping_methods` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `shipping_zone_districts`
--

LOCK TABLES `shipping_zone_districts` WRITE;
/*!40000 ALTER TABLE `shipping_zone_districts` DISABLE KEYS */;
INSERT INTO `shipping_zone_districts` VALUES (2,1,4,'2026-01-21 03:44:47'),(3,2,18,'2026-01-21 03:46:31'),(4,2,19,'2026-01-21 03:46:31');
/*!40000 ALTER TABLE `shipping_zone_districts` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `shipping_zone_methods`
--

LOCK TABLES `shipping_zone_methods` WRITE;
/*!40000 ALTER TABLE `shipping_zone_methods` DISABLE KEYS */;
INSERT INTO `shipping_zone_methods` VALUES (1,1,1,150.00,3999.94,1,3,1,'2026-01-17 15:22:45','2026-01-17 16:15:44'),(2,1,2,120.00,7000.00,2,4,1,'2026-01-17 21:12:00','2026-01-21 03:46:59');
/*!40000 ALTER TABLE `shipping_zone_methods` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `shipping_zones`
--

LOCK TABLES `shipping_zones` WRITE;
/*!40000 ALTER TABLE `shipping_zones` DISABLE KEYS */;
INSERT INTO `shipping_zones` VALUES (1,'Zona Premium','[{\"name\": \"JESÚS MARÍA\", \"province\": \"LIMA\", \"department\": \"LIMA\"}]',1,'2026-01-17 15:21:44','2026-01-21 03:44:48'),(2,'Lima Norte','[{\"name\": \"LOS OLIVOS\", \"province\": \"LIMA\", \"department\": \"LIMA\"}, {\"name\": \"SAN MARTÃN DE PORRES\", \"province\": \"LIMA\", \"department\": \"LIMA\"}, {\"name\": \"INDEPENDENCIA\", \"province\": \"LIMA\", \"department\": \"LIMA\"}, {\"name\": \"COMAS\", \"province\": \"LIMA\", \"department\": \"LIMA\"}]',1,'2026-01-17 21:12:00','2026-01-21 03:46:32');
/*!40000 ALTER TABLE `shipping_zones` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'Jhonnatan','admin@techstore.com','$2b$12$jMi5XEnLsw70nHr6uFccvufU29hRsAHw68dIRS/gDiSZa.W/rhnsC',1,1,'2024-08-16 02:41:34','2026-01-16 16:47:20','Castro','/uploads/profile/1768582040498-677721893.HEIC'),(13,'Derek','test@example.com','$2a$10$yZd0FgII.5BMqj0p3o9eWOgKRppXAfOo/efab7NxFiBHCfyMYD3qa',2,1,'2024-08-16 03:41:19','2024-10-29 00:36:55','Vito2',NULL),(15,'test','jjhoncv+25@gmail.com','$2b$10$AQ12ZTkUhmeJFpdtoeE0M.E2ejLQyNkvx6GryUpswZXMis.tZLXDa',3,1,'2026-01-17 17:34:35','2026-01-17 17:52:26','test',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `variant_attribute_options`
--

LOCK TABLES `variant_attribute_options` WRITE;
/*!40000 ALTER TABLE `variant_attribute_options` DISABLE KEYS */;
INSERT INTO `variant_attribute_options` VALUES (3,5,0.00),(3,8,0.00),(3,9,0.00),(4,6,0.00),(4,8,0.00),(4,9,0.00),(6,6,0.00),(7,11,0.00),(8,12,0.00);
/*!40000 ALTER TABLE `variant_attribute_options` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `variant_images`
--

LOCK TABLES `variant_images` WRITE;
/*!40000 ALTER TABLE `variant_images` DISABLE KEYS */;
INSERT INTO `variant_images` VALUES (18,1,'front','/uploads/laptop-pro-15/vivobook-4_4_1-1768439556162.jpg','/uploads/laptop-pro-15/vivobook-4_4_1-1768439556162.jpg','/uploads/laptop-pro-15/vivobook-4_4_1-1768439556162.jpg',1,0,'vivobook-4_4_1-1768439556162.jpg','2026-01-15 01:12:38','2026-01-15 01:12:38'),(22,6,'front','/uploads/iphone-16-pro-max/blanco/iphone-16-prox-max-titanio-blanco-back-default-1768523523062.webp','/uploads/iphone-16-pro-max/blanco/iphone-16-prox-max-titanio-blanco-back-default-1768523523062.webp','/uploads/iphone-16-pro-max/blanco/iphone-16-prox-max-titanio-blanco-back-default-1768523523062.webp',1,0,'iphone-16-prox-max-titanio-blanco-back-default-1768523523062.webp','2026-01-16 00:50:24','2026-01-16 00:50:24');
/*!40000 ALTER TABLE `variant_images` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `variant_ratings`
--

LOCK TABLES `variant_ratings` WRITE;
/*!40000 ALTER TABLE `variant_ratings` DISABLE KEYS */;
INSERT INTO `variant_ratings` VALUES (18,4,16,3,'3wrwr w3r w3','sefefsef',1,'2026-01-24 18:53:13','2026-01-24 18:53:21','approved',3,'2026-01-24 18:53:21'),(19,6,16,4,'we few fewf','Si a mi tb me parecio igual buen producto',1,'2026-01-24 19:03:47','2026-01-24 19:04:22','approved',3,'2026-01-24 19:04:22');
/*!40000 ALTER TABLE `variant_ratings` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `verification_codes`
--

LOCK TABLES `verification_codes` WRITE;
/*!40000 ALTER TABLE `verification_codes` DISABLE KEYS */;
INSERT INTO `verification_codes` VALUES (2,'asd2@asd.com','5238','verification','2026-01-19 23:51:05',NULL,'2026-01-20 04:41:04'),(16,'jjhoncv@gmail.com','474104','password_reset','2026-01-23 00:26:56','2026-01-23 00:13:05','2026-01-23 05:11:56'),(17,'jjhoncv@gmail.com','903584','password_reset','2026-01-23 00:29:11','2026-01-23 00:14:38','2026-01-23 05:14:11');
/*!40000 ALTER TABLE `verification_codes` ENABLE KEYS */;
UNLOCK TABLES;

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

-- Dump completed on 2026-01-24 22:43:19
