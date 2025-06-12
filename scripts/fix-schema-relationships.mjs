#!/usr/bin/env node

/**
 * Corrector automático de relaciones 1:N en schemas GraphQL
 *
 * Este script corrige automáticamente:
 * - Relaciones Many-to-Many incorrectas → One-to-Many correctas
 * - Limpia directivas problemáticas de MySQL/Mesh
 * - Detecta foreign keys automáticamente
 *
 * Uso: node scripts/fix-schema-relationships.mjs
 */

import fs from 'fs'

const SCHEMA_FILE = 'schema-domain.graphql'

console.log('🔧 Corrigiendo relaciones 1:N automáticamente...')

try {
  let corrections = 0
  let schema = fs.readFileSync(SCHEMA_FILE, 'utf8')

  console.log('🔍 Analizando y limpiando schema...')

  // 1. Limpieza inicial de directivas problemáticas
  schema = cleanProblematicDirectives(schema)

  // 2. Detectar foreign keys automáticamente
  const foreignKeys = detectForeignKeys(schema)

  // 3. Corregir cada relación de Many-to-Many → One-to-Many
  foreignKeys.forEach((fk) => {
    const incorrectPattern = new RegExp(
      `(\\s+)${fk.pluralField}\\s*\\([^)]*\\)\\s*:\\s*\\[${fk.entityType}\\]`,
      'g'
    )

    if (schema.match(incorrectPattern)) {
      schema = schema.replace(
        incorrectPattern,
        `$1${fk.singularField}: ${fk.entityType}`
      )
      corrections++
      console.log(
        `  ✅ ${fk.pluralField}(...): [${fk.entityType}] → ${fk.singularField}: ${fk.entityType}`
      )
    }
  })

  // 4. Limpieza final
  schema = finalCleanup(schema)

  // 5. Guardar schema corregido
  fs.writeFileSync(SCHEMA_FILE, schema)

  // 6. Reporte final
  if (corrections > 0) {
    console.log(`🎯 ${corrections} relaciones corregidas automáticamente`)
  } else {
    console.log('ℹ️  No se encontraron relaciones que corregir')
  }

  console.log('✅ Schema limpiado y corregido exitosamente')
} catch (error) {
  console.error('❌ Error al corregir schema:', error.message)
  process.exit(1)
}

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

function detectForeignKeys(schema) {
  const foreignKeyPattern = /(\w+)Id\s*:\s*Int/g
  const foreignKeys = []
  let match

  while ((match = foreignKeyPattern.exec(schema)) !== null) {
    const entityName = match[1]
    foreignKeys.push({
      idField: `${entityName}Id`,
      singularField: entityName,
      pluralField: `${entityName}s`,
      entityType: capitalize(entityName) + 's'
    })
  }

  return foreignKeys
}

function cleanProblematicDirectives(schema) {
  // Remover directivas que causan errores en GraphQL Code Generator
  return schema
    .replace(/directive\s+\w+.*$/gm, '')
    .replace(/directive\s+repeatable\s+on\s+\w+/g, '')
    .replace(/^\s*repeatable\s+on\s+\w+.*$/gm, '')
    .replace(/@mysql\w+(\([^)]*\))?/g, '')
    .replace(/@\w+(\([^)]*\))?/g, '')
    .replace(/^\s*(repeatable|directive)\s+.*$/gm, '')
}

function finalCleanup(schema) {
  // Normalizar espacios y líneas vacías
  schema = schema
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/^\s*$/gm, '')
    .replace(/\n+/g, '\n\n')

  // Asegurar que tenga escalares básicos
  if (!schema.includes('scalar Timestamp')) {
    schema = 'scalar Timestamp\nscalar DateTime\n\n' + schema
  }

  return schema
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
