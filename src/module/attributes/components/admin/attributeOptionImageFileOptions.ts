import { type FileOptions } from '@/module/shared/components/FormCreate/types/fileManagement'

/**
 * Opciones de validación para imágenes de attribute options
 *
 * Requisitos:
 * - Formatos: JPEG, JPG, PNG, WEBP
 * - Tamaño máximo: 2MB
 * - Dimensiones mínimas: 140x140 píxeles (para thumbnail en selector)
 * - Dimensiones máximas: 1200x1200 píxeles
 *
 * Nota: Las imágenes se usan principalmente como thumbnails en selectores
 * de atributos (ej: colores, patrones), por lo que no necesitan ser
 * tan grandes como las imágenes de productos.
 */
export const AttributeOptionImageFileOptions: FileOptions = {
  maxFileSize: 2 * 1024 * 1024, // 2MB
  dimensions: {
    min: { width: 140, height: 140 },
    max: { width: 1200, height: 1200 }
  },
  acceptImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}
