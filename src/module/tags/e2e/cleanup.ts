#!/usr/bin/env npx tsx
/**
 * Tags E2E - Cleanup
 *
 * Usage:
 *   npx tsx src/module/tags/e2e/cleanup.ts 2026-02-01
 *   npx tsx src/module/tags/e2e/cleanup.ts all
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots')
const DOCKER_CONTAINER = 'ajk-ecommerce'
const TABLE_NAME = 'tags'

const dateArg = process.argv[2]
if (!dateArg) {
  console.log('Uso: npx tsx cleanup.ts <fecha|all>')
  console.log('  fecha: YYYY-MM-DD (ej: 2026-02-01)')
  console.log('  all: elimina todos los datos de test')
  process.exit(1)
}

const pattern =
  dateArg === 'all'
    ? '%-test-%'
    : `%-test-${dateArg.replace(/-/g, '')}-%`

function runSQL(sql: string): string {
  try {
    return execSync(
      `docker exec ${DOCKER_CONTAINER} mysql -uroot -p12345678 ajkecommerce -e "${sql}"`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    )
  } catch (e: unknown) {
    const error = e as { stdout?: string }
    return error.stdout || ''
  }
}

console.log(`🧹 Cleanup Tags E2E: ${pattern}`)
console.log('-'.repeat(40))

// Mostrar y eliminar registros de tags
console.log('\n📋 Eliminando tags de test...')
const items = runSQL(
  `SELECT id, name, color FROM ${TABLE_NAME} WHERE name LIKE '${pattern}'`
)
if (items.trim()) {
  console.log(items)
  runSQL(`DELETE FROM ${TABLE_NAME} WHERE name LIKE '${pattern}'`)
  console.log('✓ Tags eliminados')
} else {
  console.log('  No hay tags de test para eliminar')
}

// Eliminar asociaciones variant_tags huerfanas (por si acaso)
console.log('\n📋 Limpiando variant_tags huerfanas...')
runSQL(`DELETE FROM variant_tags WHERE tag_id NOT IN (SELECT id FROM tags)`)
console.log('✓ Asociaciones limpiadas')

// Eliminar screenshots
console.log('\n📸 Eliminando screenshots...')
if (fs.existsSync(SCREENSHOTS_DIR)) {
  const files = fs.readdirSync(SCREENSHOTS_DIR)
  let count = 0
  for (const file of files) {
    if (file.endsWith('.png')) {
      fs.unlinkSync(path.join(SCREENSHOTS_DIR, file))
      count++
    }
  }
  console.log(`✓ ${count} screenshots eliminados`)
} else {
  console.log('  No hay carpeta de screenshots')
}

console.log('\n' + '='.repeat(40))
console.log('✅ Limpieza completada')
