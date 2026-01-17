-- Agregar sección de órdenes para el panel de administración
INSERT INTO `sections` (`name`, `url`, `image`, `display_order`) VALUES
('orders', '/orders', 'ShoppingCart', 15)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Asignar la sección de órdenes al superadmin (rol 1)
INSERT INTO `roles_sections` (`id_section`, `id_rol`)
SELECT s.id, 1 FROM sections s WHERE s.url = '/orders'
ON DUPLICATE KEY UPDATE `id_section` = VALUES(`id_section`);
