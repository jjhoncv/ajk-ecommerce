import { type FileOptions } from '@/module/shared/components/FormCreate/types/fileManagement'

/**
 * Opciones de validación para imágenes de variantes de productos
 *
 * Requisitos:
 * - Formatos: JPEG, JPG, PNG, WEBP
 * - Tamaño máximo: 2MB
 * - Dimensiones mínimas: 400x400 píxeles
 * - Dimensiones máximas: 2000x2000 píxeles
 */
export const VariantImageFileOptions: FileOptions = {
  maxFileSize: 2 * 1024 * 1024, // 2MB
  dimensions: {
    min: { width: 400, height: 400 },
    max: { width: 2000, height: 2000 }
  },
  acceptImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}
