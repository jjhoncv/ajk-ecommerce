-- Migration: Add reference column to customers_addresses
-- Date: 2026-01-20
-- Description: Adds a reference field for location hints (e.g., "Frente al parque")

ALTER TABLE customers_addresses
ADD COLUMN reference VARCHAR(200) NULL AFTER apartment;
