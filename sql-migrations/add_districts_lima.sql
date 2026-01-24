-- Migration: Add districts table for Lima Metropolitan area
-- Run date: 2026-01-20
-- Simplified ubigeo: Only Lima Metro districts (43 Lima + 7 Callao = 50 districts)

-- =====================================================
-- 1. CREATE DISTRICTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS `districts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(6) NOT NULL COMMENT 'Código INEI del distrito',
  `name` VARCHAR(100) NOT NULL,
  `zone` ENUM('lima_centro', 'lima_norte', 'lima_sur', 'lima_este', 'callao') NOT NULL COMMENT 'Zona geográfica',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Si tiene cobertura de delivery',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_district_code` (`code`),
  KEY `idx_district_zone` (`zone`),
  KEY `idx_district_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. INSERT LIMA METROPOLITAN DISTRICTS (50)
-- =====================================================

-- Lima Centro (13 distritos)
INSERT INTO `districts` (`code`, `name`, `zone`) VALUES
('150101', 'Cercado de Lima', 'lima_centro'),
('150104', 'Barranco', 'lima_centro'),
('150105', 'Breña', 'lima_centro'),
('150113', 'Jesús María', 'lima_centro'),
('150115', 'La Victoria', 'lima_centro'),
('150116', 'Lince', 'lima_centro'),
('150120', 'Magdalena del Mar', 'lima_centro'),
('150121', 'Pueblo Libre', 'lima_centro'),
('150122', 'Miraflores', 'lima_centro'),
('150128', 'Rímac', 'lima_centro'),
('150130', 'San Borja', 'lima_centro'),
('150131', 'San Isidro', 'lima_centro'),
('150134', 'San Luis', 'lima_centro'),
('150136', 'San Miguel', 'lima_centro'),
('150140', 'Santiago de Surco', 'lima_centro'),
('150141', 'Surquillo', 'lima_centro');

-- Lima Norte (8 distritos)
INSERT INTO `districts` (`code`, `name`, `zone`) VALUES
('150102', 'Ancón', 'lima_norte'),
('150106', 'Carabayllo', 'lima_norte'),
('150110', 'Comas', 'lima_norte'),
('150112', 'Independencia', 'lima_norte'),
('150117', 'Los Olivos', 'lima_norte'),
('150125', 'Puente Piedra', 'lima_norte'),
('150135', 'San Martín de Porres', 'lima_norte'),
('150139', 'Santa Rosa', 'lima_norte');

-- Lima Sur (12 distritos)
INSERT INTO `districts` (`code`, `name`, `zone`) VALUES
('150108', 'Chorrillos', 'lima_sur'),
('150119', 'Lurín', 'lima_sur'),
('150123', 'Pachacámac', 'lima_sur'),
('150124', 'Pucusana', 'lima_sur'),
('150126', 'Punta Hermosa', 'lima_sur'),
('150127', 'Punta Negra', 'lima_sur'),
('150129', 'San Bartolo', 'lima_sur'),
('150133', 'San Juan de Miraflores', 'lima_sur'),
('150138', 'Santa María del Mar', 'lima_sur'),
('150142', 'Villa El Salvador', 'lima_sur'),
('150143', 'Villa María del Triunfo', 'lima_sur');

-- Lima Este (7 distritos)
INSERT INTO `districts` (`code`, `name`, `zone`) VALUES
('150103', 'Ate', 'lima_este'),
('150107', 'Chaclacayo', 'lima_este'),
('150109', 'Cieneguilla', 'lima_este'),
('150111', 'El Agustino', 'lima_este'),
('150114', 'La Molina', 'lima_este'),
('150118', 'Lurigancho', 'lima_este'),
('150132', 'San Juan de Lurigancho', 'lima_este'),
('150137', 'Santa Anita', 'lima_este');

-- Callao (7 distritos)
INSERT INTO `districts` (`code`, `name`, `zone`) VALUES
('070101', 'Callao', 'callao'),
('070102', 'Bellavista', 'callao'),
('070103', 'Carmen de la Legua Reynoso', 'callao'),
('070104', 'La Perla', 'callao'),
('070105', 'La Punta', 'callao'),
('070106', 'Ventanilla', 'callao'),
('070107', 'Mi Perú', 'callao');

-- =====================================================
-- 3. CREATE SHIPPING ZONE DISTRICTS (pivot table)
-- =====================================================

CREATE TABLE IF NOT EXISTS `shipping_zone_districts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `zone_id` INT NOT NULL,
  `district_id` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_zone_district` (`zone_id`, `district_id`),
  KEY `idx_szd_zone` (`zone_id`),
  KEY `idx_szd_district` (`district_id`),
  CONSTRAINT `fk_szd_zone` FOREIGN KEY (`zone_id`) REFERENCES `shipping_zones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_szd_district` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. MODIFY CUSTOMERS_ADDRESSES to use district_id
-- =====================================================

ALTER TABLE `customers_addresses`
ADD COLUMN `district_id` INT UNSIGNED NULL AFTER `district`,
ADD KEY `idx_ca_district` (`district_id`),
ADD CONSTRAINT `fk_ca_district` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE SET NULL;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- SELECT zone, COUNT(*) as count FROM districts GROUP BY zone;
-- SELECT * FROM districts WHERE is_active = 1 ORDER BY zone, name;
-- SELECT COUNT(*) as total FROM districts;
