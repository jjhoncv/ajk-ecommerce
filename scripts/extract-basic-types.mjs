import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prismaTypesFile = path.join(__dirname, '../src/types/database/index.d.ts')
const outputFile = path.join(__dirname, '../src/types/prisma-basic.ts')

console.log('🔧 Extrayendo tipos básicos de Prisma...')

if (!fs.existsSync(prismaTypesFile)) {
  console.error('❌ No se encontró el archivo de tipos de Prisma')
  console.log('Ejecuta primero: pnpm prisma-generate')
  process.exit(1)
}

const content = fs.readFileSync(prismaTypesFile, 'utf8')

// Extraer solo los tipos de modelos (interfaces básicas)
const modelTypeRegex = /export type (\w+) = \{[^}]+\}/g
const enumRegex = /export const (\w+): \{[^}]+\}/g

const modelTypes = []
const enums = []

let match

// Extraer tipos de modelos
while ((match = modelTypeRegex.exec(content)) !== null) {
  const typeName = match[1]

  // Solo incluir tipos que corresponden a modelos de la base de datos
  // Excluir tipos auxiliares como OrderBy, WhereInput, etc.
  if (
    !typeName.includes('OrderBy') &&
    !typeName.includes('WhereInput') &&
    !typeName.includes('WhereUniqueInput') &&
    !typeName.includes('CreateInput') &&
    !typeName.includes('UpdateInput') &&
    !typeName.includes('UpsertArgs') &&
    !typeName.includes('FindArgs') &&
    !typeName.includes('AggregateArgs') &&
    !typeName.includes('GroupByArgs') &&
    !typeName.includes('CountArgs') &&
    !typeName.includes('Select') &&
    !typeName.includes('Include') &&
    !typeName.includes('Payload') &&
    !typeName.includes('GetPayload') &&
    !typeName.includes('Delegate') &&
    !typeName.includes('Client') &&
    !typeName.includes('Transaction') &&
    !typeName.includes('Runtime') &&
    !typeName.includes('Extensions') &&
    !typeName.includes('Metrics') &&
    !typeName.includes('Validator') &&
    !typeName.includes('Subset') &&
    !typeName.includes('Exact') &&
    !typeName.includes('AtLeast') &&
    !typeName.includes('AtMost') &&
    !typeName.includes('Prisma') &&
    !typeName.includes('$') &&
    typeName !== 'Decimal' &&
    typeName !== 'JsonValue' &&
    typeName !== 'JsonArray' &&
    typeName !== 'JsonObject' &&
    typeName !== 'InputJsonValue' &&
    typeName !== 'NullableJsonNullValueInput' &&
    typeName !== 'JsonNullValueFilter' &&
    typeName !== 'SortOrder' &&
    typeName !== 'SortOrderInput' &&
    typeName !== 'NullsOrder' &&
    typeName !== 'QueryMode' &&
    typeName !== 'TransactionIsolationLevel'
  ) {
    modelTypes.push(match[0])
  }
}

// Extraer enums
const enumPattern = /export const (\w+): \{[\s\S]*?\n\}/g
while ((match = enumPattern.exec(content)) !== null) {
  const enumName = match[1]
  if (
    enumName.endsWith('_image_type') ||
    enumName.endsWith('_display_type') ||
    enumName.endsWith('_discount_type')
  ) {
    enums.push(
      match[0]
        .replace('export const', 'export enum')
        .replace(/: \{/, ' {')
        .replace(/: "(\w+)"/g, ' = "$1"')
    )
  }
}

// Crear contenido del archivo
const basicTypesContent = `/**
 * Tipos básicos extraídos de Prisma
 * Solo modelos e interfaces principales - Sin tipos auxiliares
 */

// ============================================
// MODELOS DE BASE DE DATOS
// ============================================

${modelTypes.join('\n\n')}

// ============================================
// ENUMS
// ============================================

${enums.join('\n\n')}

// ============================================
// TIPOS DE UTILIDAD BÁSICOS
// ============================================

export type DatabaseModel = 
  | attribute_option_images
  | attribute_options
  | attributes
  | banner
  | brands
  | categories
  | customers
  | customers_addresses
  | permissions
  | product_categories
  | product_variants
  | products
  | promotion_variants
  | promotions
  | rating_images
  | roles
  | roles_sections
  | sections
  | services
  | services_images
  | users
  | variant_attribute_options
  | variant_images
  | variant_ratings

export type ModelName = 
  | 'attribute_option_images'
  | 'attribute_options'
  | 'attributes'
  | 'banner'
  | 'brands'
  | 'categories'
  | 'customers'
  | 'customers_addresses'
  | 'permissions'
  | 'product_categories'
  | 'product_variants'
  | 'products'
  | 'promotion_variants'
  | 'promotions'
  | 'rating_images'
  | 'roles'
  | 'roles_sections'
  | 'sections'
  | 'services'
  | 'services_images'
  | 'users'
  | 'variant_attribute_options'
  | 'variant_images'
  | 'variant_ratings'
`

fs.writeFileSync(outputFile, basicTypesContent)

console.log('✅ Tipos básicos extraídos exitosamente!')
console.log(`📁 Archivo creado: ${outputFile}`)
console.log(
  `📊 Tipos extraídos: ${modelTypes.length} modelos, ${enums.length} enums`
)
console.log('📝 Importa con: import type { ... } from "@/types/prisma-basic"')
