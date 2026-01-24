-- Migration: Add category page customization fields
-- Date: 2026-01-23
-- Description: Adds fields for category page banner, CTA, and SEO

ALTER TABLE categories
  ADD COLUMN banner_image VARCHAR(255) NULL COMMENT 'Banner image for desktop',
  ADD COLUMN banner_image_mobile VARCHAR(255) NULL COMMENT 'Banner image for mobile',
  ADD COLUMN banner_title VARCHAR(255) NULL COMMENT 'Banner title (defaults to category name if empty)',
  ADD COLUMN banner_subtitle VARCHAR(255) NULL COMMENT 'Banner subtitle',
  ADD COLUMN banner_description TEXT NULL COMMENT 'Banner description text',
  ADD COLUMN banner_cta_text VARCHAR(100) NULL COMMENT 'Call to action button text',
  ADD COLUMN banner_cta_link VARCHAR(255) NULL COMMENT 'Call to action button link',
  ADD COLUMN meta_title VARCHAR(255) NULL COMMENT 'SEO meta title',
  ADD COLUMN meta_description TEXT NULL COMMENT 'SEO meta description';

-- Add indexes for potential queries
ALTER TABLE categories ADD INDEX idx_categories_parent_show_nav (parent_id, show_nav);
