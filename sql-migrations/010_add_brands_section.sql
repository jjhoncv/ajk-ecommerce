-- Migration: Add brands section
-- Date: 2026-01-28
-- Purpose: Add missing brands section to admin panel

-- Add brands section if not exists
INSERT INTO `sections` (`name`, `url`, `image`, `display_order`) VALUES
('Marcas', '/brands', 'BadgeCheck', 11)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Assign brands section to superadmin (role id=1)
INSERT INTO `roles_sections` (`id_section`, `id_rol`)
SELECT s.id, 1 FROM `sections` s WHERE s.url = '/brands'
ON DUPLICATE KEY UPDATE `id_section` = VALUES(`id_section`);
