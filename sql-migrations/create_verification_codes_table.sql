-- Tabla para almacenar códigos de verificación temporales
CREATE TABLE IF NOT EXISTS verification_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Limpiar códigos expirados (ejecutar periódicamente)
-- DELETE FROM verification_codes WHERE expires_at < NOW();
