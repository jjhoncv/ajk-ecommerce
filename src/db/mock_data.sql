-- Datos de ejemplo para marcas
INSERT INTO `brands` (`id`, `name`) VALUES
(1, 'TechPro'),
(2, 'GalaxyTech'),
(3, 'SoundMaster'),
(4, 'SmartLife');

-- Datos de ejemplo para categorías
INSERT INTO `categories` (`id`, `name`, `description`, `parent_id`, `image_url`) VALUES
(1, 'Electrónicos', 'Productos electrónicos de alta calidad', NULL, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Electrónicos'),
(2, 'Computadoras', 'Laptops y computadoras de escritorio', 1, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Computadoras'),
(3, 'Laptops', 'Computadoras portátiles', 2, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Laptops'),
(4, 'Smartphones', 'Teléfonos inteligentes', 1, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Smartphones'),
(5, 'Audio', 'Dispositivos de audio', 1, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Audio'),
(6, 'Auriculares', 'Auriculares y audífonos', 5, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Auriculares'),
(7, 'Wearables', 'Dispositivos vestibles', 1, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Wearables'),
(8, 'Smartwatches', 'Relojes inteligentes', 7, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Smartwatches');

-- Datos de ejemplo para productos
INSERT INTO `products` (`id`, `name`, `description`, `brand_id`, `base_price`, `created_at`, `updated_at`) VALUES
(1, 'Laptop Ultrabook Pro', 'Laptop ultradelgada con procesador de última generación', 1, 3499.99, '2025-01-15 10:00:00', '2025-01-15 10:00:00'),
(2, 'Smartphone Galaxy X', 'Smartphone con pantalla AMOLED y cámara de alta resolución', 2, 1299.99, '2025-01-20 11:30:00', '2025-01-20 11:30:00'),
(3, 'Auriculares Inalámbricos Pro', 'Auriculares con cancelación de ruido y alta fidelidad', 3, 249.99, '2025-02-05 09:15:00', '2025-02-05 09:15:00'),
(4, 'Smartwatch Series 5', 'Reloj inteligente con monitor de salud y GPS', 4, 399.99, '2025-02-10 14:45:00', '2025-02-10 14:45:00');

-- Datos de ejemplo para relaciones producto-categoría
INSERT INTO `product_categories` (`product_id`, `category_id`) VALUES
(1, 2), -- Laptop en Computadoras
(1, 3), -- Laptop en Laptops
(2, 1), -- Smartphone en Electrónicos
(2, 4), -- Smartphone en Smartphones
(3, 1), -- Auriculares en Electrónicos
(3, 5), -- Auriculares en Audio
(3, 6), -- Auriculares en Auriculares
(4, 1), -- Smartwatch en Electrónicos
(4, 7), -- Smartwatch en Wearables
(4, 8); -- Smartwatch en Smartwatches

-- Datos de ejemplo para atributos
INSERT INTO `attributes` (`id`, `name`) VALUES
(1, 'Color'),
(2, 'Tamaño'),
(3, 'Almacenamiento');

-- Datos de ejemplo para opciones de atributos
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

-- Datos de ejemplo para relaciones variante-atributo-opción
INSERT INTO `variant_attribute_options` (`variant_id`, `attribute_option_id`) VALUES
-- Laptop Variante 1: 15", 8GB RAM, Negro
(1, 1), -- Negro
(1, 6), -- 15 pulgadas
(1, 12), -- 8GB RAM

-- Laptop Variante 2: 15", 16GB RAM, Negro
(2, 1), -- Negro
(2, 6), -- 15 pulgadas
(2, 13), -- 16GB RAM

-- Smartphone Variante 1: Negro, 128GB
(3, 1), -- Negro
(3, 8), -- 128GB

-- Smartphone Variante 2: Blanco, 128GB
(4, 2), -- Blanco
(4, 8), -- 128GB

-- Smartphone Variante 3: Negro, 256GB
(5, 1), -- Negro
(5, 9), -- 256GB

-- Smartphone Variante 4: Blanco, 256GB
(6, 2), -- Blanco
(6, 9), -- 256GB

-- Auriculares Variante 1: Negro
(7, 1), -- Negro

-- Auriculares Variante 2: Blanco
(8, 2), -- Blanco

-- Smartwatch Variante 1: Negro
(9, 1), -- Negro

-- Smartwatch Variante 2: Plata
(10, 3); -- Plata

-- Datos de ejemplo para imágenes de variantes
INSERT INTO `variant_images` (`id`, `variant_id`, `image_url`, `is_primary`) VALUES
-- Imágenes para Laptop Variante 1
(1, 1, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Laptop-Negro-8GB', 1),
(2, 1, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Laptop-Negro-8GB-2', 0),

-- Imágenes para Laptop Variante 2
(3, 2, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Laptop-Negro-16GB', 1),

-- Imágenes para Smartphone Variante 1
(4, 3, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Phone-Negro-128GB', 1),
(5, 3, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Phone-Negro-128GB-2', 0),

-- Imágenes para Smartphone Variante 2
(6, 4, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Phone-Blanco-128GB', 1),

-- Imágenes para Smartphone Variante 3
(7, 5, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Phone-Negro-256GB', 1),

-- Imágenes para Smartphone Variante 4
(8, 6, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Phone-Blanco-256GB', 1),

-- Imágenes para Auriculares Variante 1
(9, 7, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Auriculares-Negro', 1),

-- Imágenes para Auriculares Variante 2
(10, 8, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Auriculares-Blanco', 1),

-- Imágenes para Smartwatch Variante 1
(11, 9, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Smartwatch-Negro', 1),

-- Imágenes para Smartwatch Variante 2
(12, 10, 'https://placehold.co/600x400/e2e8f0/1e293b?text=Smartwatch-Plata', 1);
