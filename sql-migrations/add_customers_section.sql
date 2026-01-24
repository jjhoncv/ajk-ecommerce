-- Migration: Add customers section to admin panel
-- Run date: 2026-01-20

-- Agregar sección de clientes al panel admin
INSERT INTO `sections` (`name`, `url`, `image`, `display_order`) VALUES
('customers', '/customers', 'UsersRound', 16);

-- Asignar la sección de clientes al rol superadmin (id=1) y admin (id=2)
-- Nota: El ID de la sección será 19 (o el siguiente disponible)
INSERT INTO `roles_sections` (`id_section`, `id_rol`) VALUES
(19, 1),
(19, 2);

-- Verificar
-- SELECT s.*, rs.id_rol FROM sections s LEFT JOIN roles_sections rs ON s.id = rs.id_section WHERE s.url = '/customers';
