-- Agregar sección de promociones para el panel de administración
INSERT INTO `sections` (`name`, `url`, `image`, `display_order`) VALUES
('promotions', '/promotions', 'Percent', 5)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Asignar la sección de promociones al superadmin (rol 1)
INSERT INTO `roles_sections` (`id_section`, `id_rol`)
SELECT s.id, 1 FROM sections s WHERE s.url = '/promotions'
ON DUPLICATE KEY UPDATE `id_section` = VALUES(`id_section`);
