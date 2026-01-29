-- Migration: Add missing admin sections
-- Date: 2026-01-28
-- Purpose: Add sections for banners, categories, shippings, and payments modules

-- Add banners section
INSERT INTO `sections` (`name`, `url`, `image`, `display_order`, `section_group`) VALUES
('Banners', '/banners', 'image', 12, 'marketing')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Add categories section
INSERT INTO `sections` (`name`, `url`, `image`, `display_order`, `section_group`) VALUES
('Categorías', '/categories', 'folder-tree', 4, 'catalog')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Add shippings section
INSERT INTO `sections` (`name`, `url`, `image`, `display_order`, `section_group`) VALUES
('Envíos', '/shippings', 'truck', 15, 'sales')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Add payments section
INSERT INTO `sections` (`name`, `url`, `image`, `display_order`, `section_group`) VALUES
('Pagos', '/payments', 'credit-card', 16, 'sales')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Assign all new sections to superadmin (role id=1)
INSERT INTO `roles_sections` (`id_section`, `id_rol`)
SELECT s.id, 1 FROM `sections` s WHERE s.url IN ('/banners', '/categories', '/shippings', '/payments')
ON DUPLICATE KEY UPDATE `id_section` = VALUES(`id_section`);
