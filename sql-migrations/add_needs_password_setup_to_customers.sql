-- Agregar campo para indicar si el usuario necesita configurar su contraseña
ALTER TABLE customers
ADD COLUMN needs_password_setup TINYINT(1) DEFAULT 0 COMMENT '1 = usuario necesita crear contraseña'
AFTER is_active;

-- Hacer name y lastname opcionales para el nuevo flujo de registro
ALTER TABLE customers
MODIFY COLUMN name VARCHAR(255) DEFAULT '' COMMENT 'Nombre del cliente',
MODIFY COLUMN lastname VARCHAR(255) DEFAULT '' COMMENT 'Apellido del cliente';
