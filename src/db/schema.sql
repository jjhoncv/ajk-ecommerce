-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS ajk_ecommerce;

-- Usar la base de datos
USE ajk_ecommerce;

-- Crear tabla de roles
CREATE TABLE IF NOT EXISTS roles (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  role_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Insertar roles por defecto si no existen
INSERT IGNORE INTO roles (id, name, description) VALUES
('1', 'admin', 'Administrador del sistema'),
('2', 'user', 'Usuario normal');

-- Insertar usuario administrador por defecto si no existe
-- Contraseña: admin123 (en una aplicación real, esto estaría hasheado)
INSERT IGNORE INTO users (id, username, email, password, name, lastname, role_id) VALUES
('1', 'admin', 'admin@ejemplo.com', '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1BD7WC', 'Admin', 'Sistema', '1');

-- Insertar usuario normal por defecto si no existe
-- Contraseña: password123 (en una aplicación real, esto estaría hasheado)
INSERT IGNORE INTO users (id, username, email, password, name, lastname, role_id) VALUES
('2', 'usuario', 'usuario@ejemplo.com', '$2a$10$Ot/qlF0Jmc0Z4z.B9XeZbOXvxnrL0Ep8Z9VeGBmOA9MxZ44f4kJVq', 'Usuario', 'Demo', '2');
