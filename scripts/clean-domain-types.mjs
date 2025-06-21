#!/usr/bin/env node

// Script para limpiar tipos innecesarios del archivo generado
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DOMAIN_TYPES_PATH = path.join(
  __dirname,
  '../src/types/domain/domain.d.ts'
)

// Tipos que queremos omitir
const unwantedSuffixes = [
  'Input',
  'Args',
  'OrderByInput',
  'WhereInput',
  'UpdateInput',
  'InsertInput',
  'Payload'
]

const unwantedTypes = ['Query', 'Mutation', 'Subscription']

function shouldSkipType(typeName) {
  return (
    unwantedSuffixes.some((suffix) => typeName.endsWith(suffix)) ||
    unwantedTypes.includes(typeName)
  )
}

function cleanTypesFile() {
  try {
    // Leer el archivo generado
    const content = fs.readFileSync(DOMAIN_TYPES_PATH, 'utf8')

    // Dividir en bloques por export
    const blocks = content.split(/(?=export\s+(?:interface|type|enum))/g)
    const cleanedBlocks = []

    // Procesar cada bloque
    for (const block of blocks) {
      const trimmedBlock = block.trim()
      if (!trimmedBlock) continue

      // Verificar si es un bloque que queremos mantener
      const exportMatch = trimmedBlock.match(
        /^export\s+(?:interface|type|enum)\s+(\w+)/
      )

      if (exportMatch) {
        const typeName = exportMatch[1]

        // Saltar tipos no deseados
        if (shouldSkipType(typeName)) {
          continue
        }

        // Limpiar el bloque de fragmentos rotos
        let cleanBlock = trimmedBlock

        // Eliminar campos createdAt y updatedAt
        cleanBlock = cleanBlock.replace(
          /^\s*createdAt: Scalars\['Timestamp'\]\['output'\];\s*$/gm,
          ''
        )
        cleanBlock = cleanBlock.replace(
          /^\s*updatedAt: Scalars\['Timestamp'\]\['output'\];\s*$/gm,
          ''
        )

        // Eliminar líneas sueltas que no pertenecen a la interface
        cleanBlock = cleanBlock.replace(
          /^\s*[a-zA-Z_][a-zA-Z0-9_]*\?\:\s*InputMaybe.*$/gm,
          ''
        )
        cleanBlock = cleanBlock.replace(/^\s*where\?\:\s*InputMaybe.*$/gm, '')
        cleanBlock = cleanBlock.replace(/^\s*orderBy\?\:\s*InputMaybe.*$/gm, '')
        cleanBlock = cleanBlock.replace(/^\s*offset\?\:\s*InputMaybe.*$/gm, '')
        cleanBlock = cleanBlock.replace(/^\s*limit\?\:\s*InputMaybe.*$/gm, '')

        // Limpiar líneas que solo tienen comentarios sin contenido
        cleanBlock = cleanBlock.replace(/^\s*\/\*\*.*\*\/\s*$/gm, '')

        // Limpiar líneas vacías múltiples
        cleanBlock = cleanBlock.replace(/\n\s*\n\s*\n/g, '\n\n')

        // Asegurar que las interfaces estén bien cerradas
        if (cleanBlock.includes('{') && !cleanBlock.includes('}')) {
          cleanBlock += '\n}'
        }

        cleanedBlocks.push(cleanBlock)
      } else if (
        trimmedBlock.includes(
          '// ============================================================================'
        )
      ) {
        // Mantener comentarios de encabezado
        cleanedBlocks.push(trimmedBlock)
      }
    }

    // Unir bloques limpios
    let cleanedContent = cleanedBlocks.join('\n\n')

    // Limpieza final
    cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, '\n\n')
    cleanedContent = cleanedContent.replace(/^\s*$/gm, '')
    cleanedContent = cleanedContent.replace(/\n\n+/g, '\n\n')

    // Asegurar que termine con una línea nueva
    if (!cleanedContent.endsWith('\n')) {
      cleanedContent += '\n'
    }

    // Escribir el archivo limpio
    fs.writeFileSync(DOMAIN_TYPES_PATH, cleanedContent, 'utf8')

    console.log('✅ Tipos limpiados exitosamente')
    console.log(`📁 Archivo: ${DOMAIN_TYPES_PATH}`)

    // Mostrar estadísticas
    const originalLines = content.split('\n').length
    const cleanedLines = cleanedContent.split('\n').length
    const removedLines = originalLines - cleanedLines

    console.log(`📊 Líneas originales: ${originalLines}`)
    console.log(`📊 Líneas finales: ${cleanedLines}`)
    console.log(`🗑️  Líneas removidas: ${removedLines}`)
  } catch (error) {
    console.error('❌ Error al limpiar tipos:', error.message)
    process.exit(1)
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanTypesFile()
}

export { cleanTypesFile }
