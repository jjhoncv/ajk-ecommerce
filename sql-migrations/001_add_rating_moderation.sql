-- Migración: Agregar campos de moderación a variant_ratings
-- Fecha: 2026-01-24
-- Descripción: Agrega campos status, reviewed_by y reviewed_at para el sistema de moderación de reseñas

-- Agregar campo status (pending, approved, rejected)
ALTER TABLE variant_ratings
ADD COLUMN status VARCHAR(20) DEFAULT 'pending' NOT NULL;

-- Agregar campo reviewed_by (FK a users)
ALTER TABLE variant_ratings
ADD COLUMN reviewed_by INT NULL;

-- Agregar campo reviewed_at (timestamp de revisión)
ALTER TABLE variant_ratings
ADD COLUMN reviewed_at TIMESTAMP NULL;

-- Crear índice para búsquedas por status
CREATE INDEX idx_variant_ratings_status ON variant_ratings(status);

-- Agregar foreign key para reviewed_by
ALTER TABLE variant_ratings
ADD CONSTRAINT fk_variant_ratings_reviewed_by
FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL;

-- Actualizar la vista variant_rating_summary para solo contar aprobadas
DROP VIEW IF EXISTS variant_rating_summary;

CREATE VIEW variant_rating_summary AS
SELECT
    variant_id,
    COUNT(*) AS total_ratings,
    ROUND(AVG(rating), 1) AS average_rating,
    SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS five_star,
    SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS four_star,
    SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS three_star,
    SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS two_star,
    SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS one_star,
    SUM(CASE WHEN verified_purchase = 1 THEN 1 ELSE 0 END) AS verified_purchases
FROM variant_ratings
WHERE status = 'approved'
GROUP BY variant_id;

-- Actualizar la vista product_rating_summary para solo contar aprobadas
DROP VIEW IF EXISTS product_rating_summary;

CREATE VIEW product_rating_summary AS
SELECT
    pv.product_id,
    COUNT(vr.id) AS total_ratings,
    ROUND(AVG(vr.rating), 1) AS average_rating,
    SUM(CASE WHEN vr.rating = 5 THEN 1 ELSE 0 END) AS five_star,
    SUM(CASE WHEN vr.rating = 4 THEN 1 ELSE 0 END) AS four_star,
    SUM(CASE WHEN vr.rating = 3 THEN 1 ELSE 0 END) AS three_star,
    SUM(CASE WHEN vr.rating = 2 THEN 1 ELSE 0 END) AS two_star,
    SUM(CASE WHEN vr.rating = 1 THEN 1 ELSE 0 END) AS one_star,
    SUM(CASE WHEN vr.verified_purchase = 1 THEN 1 ELSE 0 END) AS verified_purchases
FROM product_variants pv
LEFT JOIN variant_ratings vr ON pv.id = vr.variant_id AND vr.status = 'approved'
GROUP BY pv.product_id;

-- Agregar sección de ratings al admin
INSERT INTO sections (name, url, display_order, image)
VALUES ('Valoraciones', '/ratings', 25, NULL);

-- Asignar la nueva sección al rol superadmin (id = 1)
INSERT INTO roles_sections (id_rol, id_section)
SELECT 1, id FROM sections WHERE url = '/ratings';
