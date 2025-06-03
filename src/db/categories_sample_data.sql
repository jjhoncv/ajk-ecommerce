-- Insertar categorías de ejemplo para el ecommerce
-- Primero eliminamos las categorías existentes para evitar conflictos
DELETE FROM categories;

-- Categorías principales (nivel 1)
INSERT INTO categories (id, name, description, parent_id, image_url) VALUES
(1, 'Electrónicos', 'Dispositivos electrónicos y tecnología', NULL, 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=200&fit=crop'),
(2, 'Ropa y Moda', 'Vestimenta y accesorios de moda', NULL, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop'),
(3, 'Hogar y Jardín', 'Artículos para el hogar y jardín', NULL, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=200&fit=crop'),
(4, 'Deportes', 'Equipos y accesorios deportivos', NULL, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop'),
(5, 'Salud y Belleza', 'Productos de cuidado personal', NULL, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=200&fit=crop');

-- Subcategorías de Electrónicos (nivel 2)
INSERT INTO categories (id, name, description, parent_id, image_url) VALUES
(6, 'Smartphones', 'Teléfonos inteligentes y accesorios', 1, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=200&fit=crop'),
(7, 'Computadoras', 'Laptops, PCs y accesorios', 1, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=200&fit=crop'),
(8, 'Audio', 'Auriculares, parlantes y equipos de audio', 1, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=200&fit=crop'),
(9, 'Gaming', 'Consolas, videojuegos y accesorios', 1, 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=200&fit=crop'),
(10, 'Wearables', 'Smartwatches y dispositivos vestibles', 1, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=200&fit=crop');

-- Subcategorías de Smartphones (nivel 3)
INSERT INTO categories (id, name, description, parent_id, image_url) VALUES
(11, 'iPhone', 'Smartphones Apple iPhone', 6, 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&h=200&fit=crop'),
(12, 'Samsung Galaxy', 'Smartphones Samsung Galaxy', 6, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=200&fit=crop'),
(13, 'Xiaomi', 'Smartphones Xiaomi', 6, 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=200&fit=crop'),
(14, 'Accesorios Móviles', 'Fundas, cargadores y accesorios', 6, 'https://images.unsplash.com/photo-1601593346740-925612772716?w=400&h=200&fit=crop');

-- Subcategorías de Computadoras (nivel 3)
INSERT INTO categories (id, name, description, parent_id, image_url) VALUES
(15, 'Laptops', 'Computadoras portátiles', 7, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=200&fit=crop'),
(16, 'PCs de Escritorio', 'Computadoras de escritorio', 7, 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&h=200&fit=crop'),
(17, 'Componentes PC', 'Procesadores, RAM, tarjetas gráficas', 7, 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=200&fit=crop'),
(18, 'Periféricos', 'Teclados, ratones, monitores', 7, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=200&fit=crop');

-- Subcategorías de Ropa y Moda (nivel 2)
INSERT INTO categories (id, name, description, parent_id, image_url) VALUES
(19, 'Ropa Hombre', 'Vestimenta masculina', 2, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop'),
(20, 'Ropa Mujer', 'Vestimenta femenina', 2, 'https://images.unsplash.com/photo-1494790108755-2616c9c0e4b5?w=400&h=200&fit=crop');

-- Reiniciar el auto_increment para evitar problemas futuros
ALTER TABLE categories AUTO_INCREMENT = 21;
