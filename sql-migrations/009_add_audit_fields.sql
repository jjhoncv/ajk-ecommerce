-- ============================================================================
-- Migration: Add audit fields (created_by, updated_by, created_at, updated_at)
-- Description: Adds tracking for who created/updated records and when
-- ============================================================================

-- ============================================================================
-- CATEGORIES - Add all audit fields
-- ============================================================================
ALTER TABLE categories
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
ADD COLUMN created_by INT NULL,
ADD COLUMN updated_by INT NULL;

-- Add foreign keys
ALTER TABLE categories
ADD CONSTRAINT fk_categories_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_categories_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

-- ============================================================================
-- BANNER - Add created_by and updated_by (already has timestamps)
-- ============================================================================
ALTER TABLE banner
ADD COLUMN created_by INT NULL,
ADD COLUMN updated_by INT NULL;

ALTER TABLE banner
ADD CONSTRAINT fk_banner_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_banner_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

-- ============================================================================
-- PRODUCTS - Add created_by and updated_by (already has timestamps)
-- ============================================================================
ALTER TABLE products
ADD COLUMN created_by INT NULL,
ADD COLUMN updated_by INT NULL;

ALTER TABLE products
ADD CONSTRAINT fk_products_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_products_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

-- ============================================================================
-- ATTRIBUTES - Add all audit fields
-- ============================================================================
ALTER TABLE attributes
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
ADD COLUMN created_by INT NULL,
ADD COLUMN updated_by INT NULL;

ALTER TABLE attributes
ADD CONSTRAINT fk_attributes_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_attributes_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

-- ============================================================================
-- BRANDS - Add all audit fields
-- ============================================================================
ALTER TABLE brands
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
ADD COLUMN created_by INT NULL,
ADD COLUMN updated_by INT NULL;

ALTER TABLE brands
ADD CONSTRAINT fk_brands_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_brands_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

-- ============================================================================
-- COUPONS - Add created_by and updated_by (already has timestamps)
-- ============================================================================
ALTER TABLE coupons
ADD COLUMN created_by INT NULL,
ADD COLUMN updated_by INT NULL;

ALTER TABLE coupons
ADD CONSTRAINT fk_coupons_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_coupons_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

-- ============================================================================
-- PROMOTIONS - Add created_by and updated_by (check if has timestamps first)
-- ============================================================================
ALTER TABLE promotions
ADD COLUMN created_by INT NULL,
ADD COLUMN updated_by INT NULL;

ALTER TABLE promotions
ADD CONSTRAINT fk_promotions_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_promotions_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

-- ============================================================================
-- Create indexes for better query performance
-- ============================================================================
CREATE INDEX idx_categories_created_by ON categories(created_by);
CREATE INDEX idx_categories_updated_by ON categories(updated_by);
CREATE INDEX idx_banner_created_by ON banner(created_by);
CREATE INDEX idx_banner_updated_by ON banner(updated_by);
CREATE INDEX idx_products_created_by ON products(created_by);
CREATE INDEX idx_products_updated_by ON products(updated_by);
