-- Agregar secciones faltantes
INSERT INTO `sections` (`name`, `url`, `image`, `display_order`) VALUES
('products', '/products', 'Package', 0),
('attributes', '/attributes', 'SlidersVertical', 10)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Asignar las nuevas secciones al superadmin (rol 1)
INSERT INTO `roles_sections` (`id_section`, `id_rol`)
SELECT s.id, 1 FROM sections s WHERE s.url IN ('/products', '/attributes')
ON DUPLICATE KEY UPDATE `id_section` = VALUES(`id_section`);
