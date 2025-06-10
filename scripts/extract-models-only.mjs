import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prismaTypesFile = path.join(__dirname, '../src/types/database/index.d.ts')
const outputFile = path.join(__dirname, '../src/types/models.ts')

console.log('🔧 Extrayendo solo tipos de modelos...')

if (!fs.existsSync(prismaTypesFile)) {
  console.error('❌ No se encontró el archivo de tipos de Prisma')
  console.log('Ejecuta primero: pnpm prisma-generate')
  process.exit(1)
}

const content = fs.readFileSync(prismaTypesFile, 'utf8')

// Lista exacta de modelos de la base de datos según el schema
const modelNames = [
  'attribute_option_images',
  'attribute_options',
  'attributes',
  'banner',
  'brands',
  'categories',
  'customers',
  'customers_addresses',
  'permissions',
  'product_categories',
  'product_variants',
  'products',
  'promotion_variants',
  'promotions',
  'rating_images',
  'roles',
  'roles_sections',
  'sections',
  'services',
  'services_images',
  'users',
  'variant_attribute_options',
  'variant_images',
  'variant_ratings'
]

// Lista exacta de enums según el schema
const enumNames = [
  'attribute_option_images_image_type',
  'attributes_display_type',
  'variant_images_image_type',
  'promotions_discount_type'
]

const extractedTypes = []
const extractedEnums = []

// Extraer tipos de modelos específicos
modelNames.forEach((modelName) => {
  const regex = new RegExp(
    `export type ${modelName} = \\{[\\s\\S]*?\\n\\}`,
    'g'
  )
  const match = regex.exec(content)
  if (match) {
    extractedTypes.push(match[0])
  }
})

// Extraer enums específicos
enumNames.forEach((enumName) => {
  const regex = new RegExp(`export const ${enumName}: \\{[\\s\\S]*?\\n\\}`, 'g')
  const match = regex.exec(content)
  if (match) {
    // Convertir de const a enum
    const enumType = match[0]
      .replace('export const', 'export enum')
      .replace(/: \{/, ' {')
      .replace(/: "(\w+)"/g, ' = "$1"')
    extractedEnums.push(enumType)
  }
})

// Crear contenido del archivo
const modelsContent = `/**
 * Tipos de modelos de base de datos
 * Extraídos directamente del schema de Prisma
 * Solo interfaces de modelos y enums - Sin tipos auxiliares
 */

// ============================================
// MODELOS DE BASE DE DATOS
// ============================================

${extractedTypes.join('\n\n')}

// ============================================
// ENUMS
// ============================================

${extractedEnums.join('\n\n')}

// ============================================
// TIPOS DE UTILIDAD
// ============================================

export type DatabaseModel = 
${modelNames.map((name) => `  | ${name}`).join('\n')}

export type ModelName = 
${modelNames.map((name) => `  | '${name}'`).join('\n')}

export type ImageType = 
  | attribute_option_images_image_type
  | variant_images_image_type

export type DisplayType = attributes_display_type

export type DiscountType = promotions_discount_type
`

fs.writeFileSync(outputFile, modelsContent)

console.log('✅ Tipos de modelos extraídos exitosamente!')
console.log(`📁 Archivo creado: ${outputFile}`)
console.log(
  `📊 Extraídos: ${extractedTypes.length} modelos, ${extractedEnums.length} enums`
)
console.log('📝 Importa con: import type { ... } from "@/types/models"')
