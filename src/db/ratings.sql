-- Tabla para gestionar valoraciones de productos
DROP TABLE IF EXISTS `variant_ratings`;
CREATE TABLE `variant_ratings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `variant_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `rating` tinyint(1) NOT NULL DEFAULT '5', -- Valoración de 1 a 5 estrellas
  `review` text, -- Comentario opcional
  `title` varchar(255), -- Título opcional para la reseña
  `verified_purchase` tinyint(1) NOT NULL DEFAULT '0', -- Si el cliente compró el producto
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_customer_variant` (`customer_id`, `variant_id`), -- Un cliente solo puede valorar una vez cada variante
  KEY `idx_variant` (`variant_id`),
  KEY `idx_customer` (`customer_id`),
  CONSTRAINT `fk_rating_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rating_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Tabla para gestionar imágenes de valoraciones
DROP TABLE IF EXISTS `rating_images`;
CREATE TABLE `rating_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rating_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_rating` (`rating_id`),
  CONSTRAINT `fk_rating_image` FOREIGN KEY (`rating_id`) REFERENCES `variant_ratings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Vista para calcular el promedio de valoraciones por variante
DROP VIEW IF EXISTS `variant_rating_summary`;
CREATE VIEW `variant_rating_summary` AS
SELECT 
  `variant_id`,
  COUNT(*) as `total_ratings`,
  AVG(`rating`) as `average_rating`,
  SUM(CASE WHEN `rating` = 5 THEN 1 ELSE 0 END) as `five_star`,
  SUM(CASE WHEN `rating` = 4 THEN 1 ELSE 0 END) as `four_star`,
  SUM(CASE WHEN `rating` = 3 THEN 1 ELSE 0 END) as `three_star`,
  SUM(CASE WHEN `rating` = 2 THEN 1 ELSE 0 END) as `two_star`,
  SUM(CASE WHEN `rating` = 1 THEN 1 ELSE 0 END) as `one_star`,
  SUM(CASE WHEN `verified_purchase` = 1 THEN 1 ELSE 0 END) as `verified_purchases`
FROM `variant_ratings`
GROUP BY `variant_id`;

-- Vista para calcular el promedio de valoraciones por producto (todas sus variantes)
DROP VIEW IF EXISTS `product_rating_summary`;
CREATE VIEW `product_rating_summary` AS
SELECT 
  pv.`product_id`,
  COUNT(vr.`id`) as `total_ratings`,
  AVG(vr.`rating`) as `average_rating`,
  SUM(CASE WHEN vr.`rating` = 5 THEN 1 ELSE 0 END) as `five_star`,
  SUM(CASE WHEN vr.`rating` = 4 THEN 1 ELSE 0 END) as `four_star`,
  SUM(CASE WHEN vr.`rating` = 3 THEN 1 ELSE 0 END) as `three_star`,
  SUM(CASE WHEN vr.`rating` = 2 THEN 1 ELSE 0 END) as `two_star`,
  SUM(CASE WHEN vr.`rating` = 1 THEN 1 ELSE 0 END) as `one_star`,
  SUM(CASE WHEN vr.`verified_purchase` = 1 THEN 1 ELSE 0 END) as `verified_purchases`
FROM `product_variants` pv
LEFT JOIN `variant_ratings` vr ON pv.`id` = vr.`variant_id`
GROUP BY pv.`product_id`;

-- Datos de ejemplo para valoraciones
INSERT INTO `variant_ratings` (`variant_id`, `customer_id`, `rating`, `review`, `title`, `verified_purchase`) VALUES
(1, 3, 5, 'Excelente laptop, muy rápida y con buena duración de batería.', 'Compra perfecta', 1),
(1, 4, 4, 'Buena laptop, pero un poco pesada para llevar a todos lados.', 'Buen producto', 1),
(2, 3, 5, 'La memoria adicional hace una gran diferencia en el rendimiento.', 'Vale la pena pagar más', 1),
(3, 4, 4, 'Buen teléfono, la cámara es excelente pero la batería podría durar más.', 'Muy satisfecho', 1),
(4, 3, 3, 'El color blanco se ensucia fácilmente, pero funciona bien.', 'Funcional pero requiere cuidado', 0),
(7, 3, 5, 'La cancelación de ruido es impresionante, perfectos para viajar.', 'Los mejores auriculares', 1),
(8, 4, 4, 'Buena calidad de sonido, pero un poco incómodos después de varias horas.', 'Buenos pero mejorables', 1),
(9, 3, 5, 'Monitorea perfectamente mi actividad física y las notificaciones son útiles.', 'Excelente smartwatch', 1),
(10, 4, 4, 'Buena duración de batería y diseño elegante.', 'Recomendado', 0);

-- Datos de ejemplo para imágenes de valoraciones
INSERT INTO `rating_images` (`rating_id`, `image_url`) VALUES
(1, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Review-Image-1'),
(1, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Review-Image-2'),
(3, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Review-Image-3'),
(7, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Review-Image-4'),
(9, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Review-Image-5');
