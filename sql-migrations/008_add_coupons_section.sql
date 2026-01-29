-- Migration: Add coupons section to admin
-- Date: 2026-01-17
-- Fixed: 2026-01-28 - Corrected column names (id_rol, id_section)

-- Add coupons section for admin panel
INSERT INTO `sections` (`name`, `url`, `image`, `display_order`) VALUES
('Cupones', '/coupons', 'Ticket', 6)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Grant access to superadmin role (id_rol = 1)
INSERT INTO `roles_sections` (`id_rol`, `id_section`)
SELECT 1, id FROM `sections` WHERE `url` = '/coupons'
ON DUPLICATE KEY UPDATE `id_rol` = VALUES(`id_rol`);
