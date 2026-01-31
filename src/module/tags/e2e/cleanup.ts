#!/usr/bin/env npx tsx
/**
 * Tags E2E - Cleanup
 *
 * Usage:
 *   npx tsx src/module/tags/e2e/cleanup.ts 2026-01-31
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
  console.log('Ejemplos:')
  console.log('  npx tsx cleanup.ts 2026-01-31')
  console.log('  npx tsx cleanup.ts all')
  process.exit(1)
}

const pattern =
  dateArg === 'all' ? '%-test-%' : `%-test-${dateArg.replace(/-/g, '')}-%`

function runSQL(sql: string): string {
  try {
    return execSync(
      `docker exec ${DOCKER_CONTAINER} mysql -uroot -p12345678 ajkecommerce -e "${sql}"`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    )
  } catch (e: any) {
    return e.stdout || ''
  }
}

console.log(`🧹 Cleanup Tags: ${pattern}`)

// Mostrar y eliminar registros
const items = runSQL(
  `SELECT id, name FROM ${TABLE_NAME} WHERE name LIKE '${pattern}'`
)
if (items.trim()) {
  console.log('Registros encontrados:')
  console.log(items)
  runSQL(`DELETE FROM ${TABLE_NAME} WHERE name LIKE '${pattern}'`)
  console.log('Registros eliminados')
} else {
  console.log('No se encontraron registros de test')
}

// Eliminar screenshots
if (fs.existsSync(SCREENSHOTS_DIR)) {
  const files = fs.readdirSync(SCREENSHOTS_DIR)
  if (files.length > 0) {
    fs.rmSync(SCREENSHOTS_DIR, { recursive: true, force: true })
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
    console.log('Screenshots eliminados')
  }
}

console.log('✅ Limpieza completada')
