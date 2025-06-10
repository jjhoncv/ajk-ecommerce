import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const filePath = path.join(__dirname, '../src/types/database/index.d.ts')

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8')

  // Extraer tipos y enums básicos
  const typeRegex = /export type (\w+) =[\s\S]*?;/g
  const interfaceRegex = /export interface (\w+) \{([\s\S]*?)\}/g

  const uniqueTypes = new Map()
  const uniqueInterfaces = new Map()

  // Extraer tipos básicos únicos (excluyendo Args e Input)
  let typeMatch
  while ((typeMatch = typeRegex.exec(content)) !== null) {
    const typeName = typeMatch[1]
    if (!typeName.includes('Args') && !typeName.includes('Input')) {
      // Solo agregar si no existe ya
      if (!uniqueTypes.has(typeName)) {
        uniqueTypes.set(typeName, typeMatch[0].trim())
      }
    }
  }

  // Procesar interfaces únicas
  let interfaceMatch
  while ((interfaceMatch = interfaceRegex.exec(content)) !== null) {
    const interfaceName = interfaceMatch[1]
    const interfaceBody = interfaceMatch[2]

    // Saltar Query, Mutation, Scalars duplicados y tipos de input/args
    if (
      interfaceName === 'Query' ||
      interfaceName === 'Mutation' ||
      interfaceName === 'Scalars' ||
      interfaceName.includes('Args') ||
      interfaceName.includes('Input') ||
      interfaceName.includes('OrderBy') ||
      interfaceName.includes('Where') ||
      interfaceName.includes('Insert') ||
      interfaceName.includes('Update') ||
      uniqueInterfaces.has(interfaceName)
    ) {
      continue
    }

    // Limpiar y formatear campos
    const lines = interfaceBody.split('\n')
    const cleanFields = []

    for (const line of lines) {
      const trimmed = line.trim()

      // Saltar líneas vacías, comentarios sueltos y campos de relaciones
      if (
        !trimmed ||
        trimmed === '}' ||
        trimmed.includes('Args') ||
        trimmed.includes('Maybe<Array<') ||
        trimmed.includes('Array<Maybe<') ||
        trimmed.includes('limit?:') ||
        trimmed.includes('offset?:') ||
        trimmed.includes('orderBy?:') ||
        trimmed.includes('where?:') ||
        trimmed.startsWith('delete') ||
        trimmed.startsWith('insert') ||
        trimmed.startsWith('update') ||
        trimmed.startsWith('count') ||
        // Remover campos que son claramente relaciones (nombres de otras tablas en plural o singular)
        /^\w+\??: Maybe<Array</.test(trimmed) ||
        /^\w+\??: Array</.test(trimmed) ||
        // Campos que terminan con nombres de otras entidades
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

      // Si la línea no termina con ; agregarla
      if (
        !cleanLine.endsWith(';') &&
        !cleanLine.startsWith('/**') &&
        !cleanLine.startsWith('*/')
      ) {
        cleanLine += ';'
      }

      cleanFields.push('  ' + cleanLine)
    }

    if (cleanFields.length > 0) {
      // Agregar comentario si existe
      let interfaceComment = ''
      const commentMatch = content.match(
        new RegExp(`/\\*\\*[\\s\\S]*?\\*/\\s*export interface ${interfaceName}`)
      )
      if (commentMatch) {
        interfaceComment =
          commentMatch[0]
            .replace(`export interface ${interfaceName}`, '')
            .trim() + '\n'
      }

      const cleanInterface = `${interfaceComment}export interface ${interfaceName} {\n${cleanFields.join('\n')}\n}`
      uniqueInterfaces.set(interfaceName, cleanInterface)
    }
  }

  // Reconstruir el contenido con header completo
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

  // Combinar todo
  const typesArray = Array.from(uniqueTypes.values())
  const interfacesArray = Array.from(uniqueInterfaces.values())

  content =
    header +
    typesArray.join('\n\n') +
    '\n\n' +
    interfacesArray.join('\n\n') +
    '\n'

  // Escribir el archivo limpio
  fs.writeFileSync(filePath, content)
  console.log('✅ Tipos de base de datos limpiados correctamente')
  console.log(`📊 Tipos únicos: ${typesArray.length}`)
  console.log(`📊 Interfaces únicas: ${interfacesArray.length}`)
} else {
  console.log('❌ Archivo de tipos de base de datos no encontrado')
}
