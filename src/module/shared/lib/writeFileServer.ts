import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'

/**
 * Guarda una imagen base64 en el servidor
 */
export const writeBase64Image = async (
  uploadDir: string,
  base64Data: string,
  prefix: string = 'img'
): Promise<string> => {
  // Extraer el tipo de imagen y los datos base64
  const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/)
  if (!matches) {
    throw new Error('Formato de imagen base64 inválido')
  }

  const extension = matches[1]
  const data = matches[2]
  const buffer = Buffer.from(data, 'base64')

  // Crear nombre único
  const timestamp = Date.now()
  const randomSuffix = Math.round(Math.random() * 1e9)
  const uniqueFileName = `${prefix}-${timestamp}-${randomSuffix}.${extension}`

  // Crear el directorio si no existe
  await mkdir(uploadDir, { recursive: true })

  // Guardar el archivo
  const filePath = join(uploadDir, uniqueFileName)
  await writeFile(filePath, buffer)

  // Calcular la URL pública
  const publicIndex = uploadDir.indexOf('public')
  if (publicIndex !== -1) {
    const relativePath = uploadDir.substring(publicIndex + 'public'.length)
    return `${relativePath}/${uniqueFileName}`.replace(/\\/g, '/')
  }

  return `/uploads/ratings/${uniqueFileName}`
}

export const writeFileServer = async (
  uploadDir: string,
  file: File,
  customName?: string
): Promise<string> => {
  // Obtener metadata adicional
  const fileName = file.name

  // Convertir el archivo a Buffer
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Crear un nombre de archivo único
  const timestamp = Date.now()
  const fileExtension = fileName.split('.').pop()

  // Si hay nombre personalizado, usarlo; si no, generar uno aleatorio
  let uniqueFileName: string
  if (customName?.trim()) {
    // Sanitizar el nombre personalizado
    const safeName = customName.trim().replace(/[^a-zA-Z0-9_-]/g, '-')
    uniqueFileName = `${safeName}-${timestamp}.${fileExtension}`
  } else {
    const randomSuffix = Math.round(Math.random() * 1e9)
    uniqueFileName = `${timestamp}-${randomSuffix}.${fileExtension}`
  }

  // Crear el directorio si no existe
  await mkdir(uploadDir, { recursive: true })

  // Definir la ruta donde se guardará el archivo
  const filePath = join(uploadDir, uniqueFileName)

  // Guardar el archivo
  await writeFile(filePath, buffer)

  // Calcular la URL pública del archivo
  // Extraer la parte después de /public/ para la URL
  const publicIndex = uploadDir.indexOf('public')
  if (publicIndex !== -1) {
    const relativePath = uploadDir.substring(publicIndex + 'public'.length)
    const fileUrl = `${relativePath}/${uniqueFileName}`.replace(/\\/g, '/')
    return fileUrl
  }

  // Fallback (por si acaso)
  const fileUrl = `/uploads/${uniqueFileName}`
  return fileUrl
}
