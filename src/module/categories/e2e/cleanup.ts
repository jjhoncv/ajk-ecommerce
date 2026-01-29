#!/usr/bin/env npx tsx
/**
 * Categories E2E - Cleanup Script
 *
 * Elimina categorías de test directamente en Docker MySQL.
 *
 * Usage:
 *   npx tsx src/module/categories/e2e/cleanup.ts 2026-01-26    # Borrar data de esta fecha
 *   npx tsx src/module/categories/e2e/cleanup.ts all           # Borrar TODA la data de test
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

const args = process.argv.slice(2)
const dateArg = args[0]

if (!dateArg) {
  console.log(`
Elimina categorías de test de la base de datos.

Uso:
  npx tsx src/module/categories/e2e/cleanup.ts <fecha>
  npx tsx src/module/categories/e2e/cleanup.ts all

Ejemplos:
  npx tsx src/module/categories/e2e/cleanup.ts 2026-01-26   # Borrar del 26 de enero
  npx tsx src/module/categories/e2e/cleanup.ts all          # Borrar TODA la data de test
`)
  process.exit(1)
}

// Build the pattern
let pattern: string
let description: string

if (dateArg === 'all') {
  pattern = '%-test-%'
  description = 'TODA la data de test'
} else {
  // Convert 2026-01-26 to 20260126
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

console.log(`\n🧹 Categories E2E Cleanup`)
console.log(`   Eliminando: ${description}`)
console.log(`   Pattern: ${pattern}\n`)

// 1. Show what will be deleted
console.log(`📋 Categorías a eliminar:`)
const selectResult = runSQL(`SELECT id, name, parent_id FROM categories WHERE name LIKE '${pattern}'`)
if (selectResult.trim()) {
  console.log(selectResult)
} else {
  console.log(`   (ninguna encontrada)\n`)
  console.log(`✅ No hay data de test para eliminar.`)
  process.exit(0)
}

// 2. Delete subcategories first (have parent_id)
console.log(`🗑️  Eliminando subcategorías...`)
runSQL(`DELETE FROM categories WHERE name LIKE '${pattern}' AND parent_id IS NOT NULL`)

// 3. Delete parent categories
console.log(`🗑️  Eliminando categorías padre...`)
runSQL(`DELETE FROM categories WHERE name LIKE '${pattern}'`)

// 4. Verify
const verifyResult = runSQL(`SELECT COUNT(*) as remaining FROM categories WHERE name LIKE '${pattern}'`)
const remaining = verifyResult.match(/\d+/)?.[0] || '0'

// 5. Delete screenshots
console.log(`🗑️  Eliminando screenshots...`)
if (fs.existsSync(SCREENSHOTS_DIR)) {
  fs.rmSync(SCREENSHOTS_DIR, { recursive: true, force: true })
  console.log(`   Screenshots eliminados`)
} else {
  console.log(`   (no hay screenshots)`)
}

// 6. Delete E2E upload folder
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

if (remaining === '0') {
  console.log(`\n✅ Limpieza completada. Data de test, screenshots y uploads eliminados.`)
} else {
  console.log(`\n⚠️  Quedan ${remaining} categorías. Verifica manualmente.`)
}
