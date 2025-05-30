-- Agregar campo display_type a la tabla attributes
ALTER TABLE `attributes` 
ADD COLUMN `display_type` ENUM('radio', 'pills', 'select', 'color', 'custom') NOT NULL DEFAULT 'select' AFTER `name`;

-- Agregar campo additional_cost a la tabla attribute_options
ALTER TABLE `attribute_options` 
ADD COLUMN `additional_cost` DECIMAL(10,2) DEFAULT 0.00 AFTER `value`;

-- Actualizar los atributos existentes con tipos de visualización apropiados
UPDATE `attributes` SET `display_type` = 'color' WHERE `name` = 'Color';
UPDATE `attributes` SET `display_type` = 'radio' WHERE `name` = 'Tamaño';
UPDATE `attributes` SET `display_type` = 'pills' WHERE `name` = 'Almacenamiento';

-- Agregar un nuevo atributo para Material con costos adicionales
INSERT INTO `attributes` (`name`, `display_type`) VALUES ('Material', 'pills');

-- Agregar opciones para el atributo Material con costos adicionales
INSERT INTO `attribute_options` (`attribute_id`, `value`, `additional_cost`) VALUES 
((SELECT id FROM attributes WHERE name = 'Material'), 'Plástico', 0.00),
((SELECT id FROM attributes WHERE name = 'Material'), 'Aluminio', 500.00),
((SELECT id FROM attributes WHERE name = 'Material'), 'Fibra de Carbono', 1000.00);
