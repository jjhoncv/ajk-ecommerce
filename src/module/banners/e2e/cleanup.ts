#!/usr/bin/env npx tsx
/**
 * Banners E2E - Cleanup Script
 *
 * Elimina banners de test directamente en Docker MySQL.
 *
 * Usage:
 *   npx tsx src/module/banners/e2e/cleanup.ts 2026-01-26
 *   npx tsx src/module/banners/e2e/cleanup.ts all
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
const TABLE_NAME = 'banner'
const NAME_COLUMN = 'title'

const args = process.argv.slice(2)
const dateArg = args[0]

if (!dateArg) {
  console.log(`
Elimina banners de test de la base de datos.

Uso:
  npx tsx src/module/banners/e2e/cleanup.ts <fecha>
  npx tsx src/module/banners/e2e/cleanup.ts all

Ejemplos:
  npx tsx src/module/banners/e2e/cleanup.ts 2026-01-26
  npx tsx src/module/banners/e2e/cleanup.ts all
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

console.log(`\n🧹 Banners E2E Cleanup`)
console.log(`   Eliminando: ${description}`)
console.log(`   Pattern: ${pattern}\n`)

// 1. Show what will be deleted
console.log(`📋 Banners a eliminar:`)
const selectResult = runSQL(`SELECT id, ${NAME_COLUMN} FROM ${TABLE_NAME} WHERE ${NAME_COLUMN} LIKE '${pattern}'`)
const hasData = selectResult.trim().length > 0
if (hasData) {
  console.log(selectResult)
} else {
  console.log(`   (ninguno encontrado)`)
}

// 2. Delete banners (if any)
if (hasData) {
  console.log(`🗑️  Eliminando banners...`)
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

// 4. Delete E2E upload folder
const dateForFolder = dateArg === 'all' ? '' : dateArg.replace(/-/g, '')
if (dateForFolder) {
  const uploadFolder = path.join(process.cwd(), 'public', 'uploads', 'e2e', dateForFolder)
  console.log(`🗑️  Eliminando uploads de E2E...`)
  if (fs.existsSync(uploadFolder)) {
    fs.rmSync(uploadFolder, { recursive: true, force: true })
    console.log(`   Uploads eliminados: /public/uploads/e2e/${dateForFolder}`)
  } else {
    console.log(`   (no hay uploads de E2E)`)
  }
} else {
  // If 'all', delete entire e2e folder
  const e2eFolder = path.join(process.cwd(), 'public', 'uploads', 'e2e')
  console.log(`🗑️  Eliminando TODOS los uploads de E2E...`)
  if (fs.existsSync(e2eFolder)) {
    fs.rmSync(e2eFolder, { recursive: true, force: true })
    console.log(`   Uploads eliminados: /public/uploads/e2e/`)
  } else {
    console.log(`   (no hay uploads de E2E)`)
  }
}

// 5. Verify
if (hasData) {
  const verifyResult = runSQL(`SELECT COUNT(*) as remaining FROM ${TABLE_NAME} WHERE ${NAME_COLUMN} LIKE '${pattern}'`)
  const remaining = verifyResult.match(/\d+/)?.[0] || '0'

  if (remaining === '0') {
    console.log(`\n✅ Limpieza completada. Data de test, screenshots y uploads eliminados.`)
  } else {
    console.log(`\n⚠️  Quedan ${remaining} banners. Verifica manualmente.`)
  }
} else {
  console.log(`\n✅ Screenshots y uploads eliminados. No había data de test.`)
}
