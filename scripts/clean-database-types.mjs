import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const filePath = path.join(__dirname, '../src/types/database/database.d.ts')

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8')

  // Extraer solo las interfaces principales de entidades (sin relaciones)
  const entityInterfaces = new Map()
  const enumTypes = new Map()

  // Buscar enums
  const enumRegex = /export type (\w+) =\s*\n\s*\|[^;]+;/g
  let enumMatch
  while ((enumMatch = enumRegex.exec(content)) !== null) {
    const enumName = enumMatch[1]
    if (
      !enumName.includes('Input') &&
      !enumName.includes('Args') &&
      !enumName.includes('OrderBy') &&
      !enumName.includes('Where')
    ) {
      enumTypes.set(enumName, enumMatch[0].trim())
    }
  }

  // Buscar interfaces principales de entidades
  const interfaceRegex = /export interface (\w+) \{([^}]+)\}/g
  let interfaceMatch
  while ((interfaceMatch = interfaceRegex.exec(content)) !== null) {
    const interfaceName = interfaceMatch[1]
    const interfaceBody = interfaceMatch[2]

    // Solo procesar interfaces de entidades principales (sin Input, Args, etc.)
    if (
      interfaceName === 'Scalars' ||
      interfaceName === 'Query' ||
      interfaceName === 'Mutation' ||
      interfaceName.includes('Input') ||
      interfaceName.includes('Args') ||
      interfaceName.includes('OrderBy') ||
      interfaceName.includes('Where') ||
      interfaceName.includes('Insert') ||
      interfaceName.includes('Update') ||
      entityInterfaces.has(interfaceName)
    ) {
      continue
    }

    // Limpiar campos de relaciones
    const lines = interfaceBody.split('\n')
    const cleanFields = []

    for (const line of lines) {
      const trimmed = line.trim()

      // Saltar líneas vacías y campos de relaciones
      if (
        !trimmed ||
        trimmed.includes('Maybe<Array<') ||
        trimmed.includes('Array<Maybe<') ||
        trimmed.includes('limit?:') ||
        trimmed.includes('offset?:') ||
        trimmed.includes('orderBy?:') ||
        trimmed.includes('where?:') ||
        // Campos específicos de relaciones
        trimmed.includes('products?:') ||
        trimmed.includes('brands?:') ||
        trimmed.includes('categories?:') ||
        trimmed.includes('customers?:') ||
        trimmed.includes('users?:') ||
        trimmed.includes('roles?:') ||
        trimmed.includes('sections?:') ||
        trimmed.includes('permissions?:') ||
        trimmed.includes('attributeOptions?:') ||
        trimmed.includes('attributeOptionImages?:') ||
        trimmed.includes('productVariants?:') ||
        trimmed.includes('variantImages?:') ||
        trimmed.includes('variantRatings?:') ||
        trimmed.includes('variantAttributeOptions?:') ||
        trimmed.includes('promotionVariants?:') ||
        trimmed.includes('promotions?:') ||
        trimmed.includes('ratingImages?:') ||
        trimmed.includes('customersAddresses?:') ||
        trimmed.includes('rolesSections?:') ||
        trimmed.includes('servicesImages?:') ||
        trimmed.includes('services?:')
      ) {
        continue
      }

      // Limpiar formato de línea
      let cleanLine = trimmed

      // Convertir solo el nombre del campo de camelCase a snake_case, manteniendo los tipos
      if (cleanLine.includes(':')) {
        const [fieldPart, typePart] = cleanLine.split(':', 2)
        const fieldName = fieldPart.trim()
        const snakeFieldName = fieldName
          .replace(/([a-z])([A-Z])/g, '$1_$2')
          .toLowerCase()
        cleanLine = `${snakeFieldName}:${typePart}`
      }

      // Remover punto y coma si ya existe para evitar duplicados
      if (cleanLine.endsWith(';')) {
        cleanLine = cleanLine.slice(0, -1)
      }

      // Agregar punto y coma solo si la línea no está vacía y no es un comentario
      if (
        cleanLine.length > 0 &&
        !cleanLine.startsWith('/*') &&
        !cleanLine.startsWith('*') &&
        !cleanLine.startsWith('//')
      ) {
        cleanLine += ';'
      }

      if (cleanLine.length > 0) {
        cleanFields.push('  ' + cleanLine)
      }
    }

    if (cleanFields.length > 0) {
      const cleanInterface = `export interface ${interfaceName} {\n${cleanFields.join('\n')}\n}`
      entityInterfaces.set(interfaceName, cleanInterface)
    }
  }

  // Reconstruir el contenido
  const header = `// ============================================================================
// TIPOS DE BASE DE DATOS - SIN RELACIONES
// ============================================================================
// Nombres tal como están en la base de datos
// Para uso directo con consultas SQL
// ============================================================================

export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };

/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The \`BigInt\` scalar type represents non-fractional signed whole numeric values. */
  BigInt: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the \`date-time\` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: Date; output: Date; }
  /** The javascript \`Date\` as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: { input: Date; output: Date; }
}

`

  // Combinar enums y interfaces
  const enumsArray = Array.from(enumTypes.values())
  const interfacesArray = Array.from(entityInterfaces.values())

  const finalContent =
    header +
    enumsArray.join('\n\n') +
    '\n\n' +
    interfacesArray.join('\n\n') +
    '\n'

  // Escribir el archivo limpio
  fs.writeFileSync(filePath, finalContent)
  console.log('✅ Tipos de base de datos limpiados correctamente (v2)')
  console.log(`📊 Enums únicos: ${enumsArray.length}`)
  console.log(`📊 Interfaces únicas: ${interfacesArray.length}`)
  console.log(`📏 Líneas totales: ${finalContent.split('\n').length}`)
} else {
  console.log('❌ Archivo de tipos de base de datos no encontrado')
}
