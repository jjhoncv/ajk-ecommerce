-- Migration: Add coupons section to admin
-- Date: 2026-01-17

-- Add coupons section for admin panel
INSERT INTO `sections` (`name`, `url`, `image`, `display_order`) VALUES
('coupons', '/coupons', 'Ticket', 6)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Grant access to superadmin role (role_id = 1)
INSERT INTO `roles_sections` (`role_id`, `section_id`)
SELECT 1, id FROM `sections` WHERE `url` = '/coupons'
ON DUPLICATE KEY UPDATE `role_id` = VALUES(`role_id`);
