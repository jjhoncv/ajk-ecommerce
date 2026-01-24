/**
 * Utilidad para procesar imágenes antes de subirlas
 * - Redimensiona a máximo 600x600 manteniendo proporción
 * - Comprime a máximo 100KB
 * - Valida formatos permitidos
 */

const MAX_WIDTH = 600
const MAX_HEIGHT = 600
const MAX_SIZE_KB = 100
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export interface ProcessedImage {
  base64: string
  preview: string
  name: string
  originalSize: number
  processedSize: number
  width: number
  height: number
}

export interface ProcessingProgress {
  current: number
  total: number
  fileName: string
  status: 'processing' | 'done' | 'error'
}

/**
 * Valida el tipo de archivo
 */
export function isValidImageType(file: File): boolean {
  return ALLOWED_TYPES.includes(file.type)
}

/**
 * Obtiene las dimensiones de una imagen desde un File
 */
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
      URL.revokeObjectURL(img.src)
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Calcula las nuevas dimensiones manteniendo la proporción
 */
function calculateNewDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height }
  }

  const ratio = Math.min(maxWidth / width, maxHeight / height)
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio)
  }
}

/**
 * Redimensiona y comprime una imagen
 */
async function resizeAndCompress(
  file: File,
  maxWidth: number,
  maxHeight: number,
  maxSizeKB: number
): Promise<{ base64: string; width: number; height: number; size: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      // Calcular nuevas dimensiones
      const { width, height } = calculateNewDimensions(
        img.width,
        img.height,
        maxWidth,
        maxHeight
      )

      // Crear canvas
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('No se pudo obtener el contexto del canvas'))
        return
      }

      // Dibujar imagen redimensionada
      ctx.drawImage(img, 0, 0, width, height)

      // Comprimir iterativamente hasta alcanzar el tamaño objetivo
      let quality = 0.9
      let base64 = canvas.toDataURL('image/jpeg', quality)
      let size = Math.round((base64.length * 3) / 4 / 1024) // Tamaño aproximado en KB

      while (size > maxSizeKB && quality > 0.1) {
        quality -= 0.1
        base64 = canvas.toDataURL('image/jpeg', quality)
        size = Math.round((base64.length * 3) / 4 / 1024)
      }

      URL.revokeObjectURL(img.src)
      resolve({ base64, width, height, size })
    }

    img.onerror = () => {
      URL.revokeObjectURL(img.src)
      reject(new Error('Error al cargar la imagen'))
    }

    img.src = URL.createObjectURL(file)
  })
}

/**
 * Procesa una imagen: valida, redimensiona y comprime
 */
export async function processImage(file: File): Promise<ProcessedImage> {
  // Validar tipo
  if (!isValidImageType(file)) {
    throw new Error(`Formato no válido. Usa: JPG, PNG o WebP`)
  }

  // Procesar imagen
  const { base64, width, height, size } = await resizeAndCompress(
    file,
    MAX_WIDTH,
    MAX_HEIGHT,
    MAX_SIZE_KB
  )

  return {
    base64,
    preview: base64, // Usamos el mismo base64 como preview
    name: file.name,
    originalSize: Math.round(file.size / 1024),
    processedSize: size,
    width,
    height
  }
}

/**
 * Procesa múltiples imágenes con callback de progreso
 */
export async function processImages(
  files: File[],
  onProgress?: (progress: ProcessingProgress) => void
): Promise<ProcessedImage[]> {
  const results: ProcessedImage[] = []
  const total = files.length

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    onProgress?.({
      current: i + 1,
      total,
      fileName: file.name,
      status: 'processing'
    })

    try {
      const processed = await processImage(file)
      results.push(processed)

      onProgress?.({
        current: i + 1,
        total,
        fileName: file.name,
        status: 'done'
      })
    } catch (error) {
      onProgress?.({
        current: i + 1,
        total,
        fileName: file.name,
        status: 'error'
      })
      // Continuar con las siguientes imágenes
      console.error(`Error procesando ${file.name}:`, error)
    }
  }

  return results
}

/**
 * Formatos permitidos como string para mostrar al usuario
 */
export const ALLOWED_FORMATS_TEXT = 'JPG, PNG, WebP'
export const MAX_DIMENSIONS_TEXT = `${MAX_WIDTH}x${MAX_HEIGHT}px`
export const MAX_SIZE_TEXT = `${MAX_SIZE_KB}KB`
