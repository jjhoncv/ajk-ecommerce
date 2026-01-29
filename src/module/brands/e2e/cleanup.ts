#!/usr/bin/env npx tsx
/**
 * Brands E2E - Cleanup Script
 *
 * Elimina marcas de test directamente en Docker MySQL.
 *
 * Usage:
 *   npx tsx src/module/brands/e2e/cleanup.ts 2026-01-26
 *   npx tsx src/module/brands/e2e/cleanup.ts all
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

// Paths
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots')

// Docker MySQL config
const DOCKER_CONTAINER = 'ajk-ecommerce'
const MYSQL_USER = 'root'
const MYSQL_PASSWORD = '12345678'
const MYSQL_DATABASE = 'ajkecommerce'

// Table config
const TABLE_NAME = 'brands'
const NAME_COLUMN = 'name'

const args = process.argv.slice(2)
const dateArg = args[0]

if (!dateArg) {
  console.log(`
Elimina marcas de test de la base de datos.

Uso:
  npx tsx src/module/brands/e2e/cleanup.ts <fecha>
  npx tsx src/module/brands/e2e/cleanup.ts all

Ejemplos:
  npx tsx src/module/brands/e2e/cleanup.ts 2026-01-26
  npx tsx src/module/brands/e2e/cleanup.ts all
`)
  process.exit(1)
}

// Build pattern
let pattern: string
let description: string

if (dateArg === 'all') {
  pattern = '%-test-%'
  description = 'TODA la data de test'
} else {
  const dateClean = dateArg.replace(/-/g, '')
  pattern = `%-test-${dateClean}-%`
  description = `data de test del ${dateArg}`
}

function runSQL(sql: string): string {
  const cmd = `docker exec ${DOCKER_CONTAINER} mysql -u${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} -e "${sql}"`
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] })
  } catch (error: any) {
    return error.stdout || ''
  }
}

console.log(`\n🧹 Brands E2E Cleanup`)
console.log(`   Eliminando: ${description}`)
console.log(`   Pattern: ${pattern}\n`)

// 1. Show what will be deleted
console.log(`📋 Marcas a eliminar:`)
const selectResult = runSQL(`SELECT id, ${NAME_COLUMN} FROM ${TABLE_NAME} WHERE ${NAME_COLUMN} LIKE '${pattern}'`)
const hasData = selectResult.trim().length > 0
if (hasData) {
  console.log(selectResult)
} else {
  console.log(`   (ninguna encontrada)`)
}

// 2. Delete brands (if any)
if (hasData) {
  console.log(`🗑️  Eliminando marcas...`)
  runSQL(`DELETE FROM ${TABLE_NAME} WHERE ${NAME_COLUMN} LIKE '${pattern}'`)
}

// 3. Delete screenshots
console.log(`🗑️  Eliminando screenshots...`)
if (fs.existsSync(SCREENSHOTS_DIR)) {
  fs.rmSync(SCREENSHOTS_DIR, { recursive: true, force: true })
  console.log(`   Screenshots eliminados`)
} else {
  console.log(`   (no hay screenshots)`)
}

// 4. Verify
if (hasData) {
  const verifyResult = runSQL(`SELECT COUNT(*) as remaining FROM ${TABLE_NAME} WHERE ${NAME_COLUMN} LIKE '${pattern}'`)
  const remaining = verifyResult.match(/\d+/)?.[0] || '0'

  if (remaining === '0') {
    console.log(`\n✅ Limpieza completada. Data de test y screenshots eliminados.`)
  } else {
    console.log(`\n⚠️  Quedan ${remaining} marcas. Verifica manualmente.`)
  }
} else {
  console.log(`\n✅ Screenshots eliminados. No había data de test.`)
}
