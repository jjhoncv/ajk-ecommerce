#!/usr/bin/env npx tsx
/**
 * __MODULE__ E2E - Cleanup
 *
 * INSTRUCCIONES:
 * 1. Copiar a: src/module/__module__/e2e/cleanup.ts
 * 2. Reemplazar __module__ con nombre de la tabla en BD
 *
 * EJECUCIÓN:
 *   npx tsx src/module/__module__/e2e/cleanup.ts 2026-01-29
 *   npx tsx src/module/__module__/e2e/cleanup.ts all
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots')
const DOCKER_CONTAINER = 'ajk-ecommerce'
const TABLE_NAME = '__module__'  // Nombre de la tabla en BD

const dateArg = process.argv[2]
if (!dateArg) {
  console.log('Uso: npx tsx cleanup.ts <fecha|all>')
  console.log('  Ejemplo: npx tsx cleanup.ts 2026-01-29')
  console.log('  Ejemplo: npx tsx cleanup.ts all')
  process.exit(1)
}

const pattern = dateArg === 'all'
  ? '%-test-%'
  : `%-test-${dateArg.replace(/-/g, '')}-%`

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

console.log(`🧹 Limpiando datos de test: ${pattern}`)

// Mostrar y eliminar registros
const items = runSQL(`SELECT id, name FROM ${TABLE_NAME} WHERE name LIKE '${pattern}'`)
if (items.trim()) {
  console.log('Registros a eliminar:')
  console.log(items)
  runSQL(`DELETE FROM ${TABLE_NAME} WHERE name LIKE '${pattern}'`)
  console.log('✓ Registros eliminados de BD')
}

// Eliminar screenshots (opcional - se mantienen como evidencia)
// Descomentar si quieres limpiar screenshots también:
/*
if (fs.existsSync(SCREENSHOTS_DIR)) {
  const files = fs.readdirSync(SCREENSHOTS_DIR)
  const pngFiles = files.filter(f => f.endsWith('.png'))
  if (pngFiles.length > 0) {
    fs.rmSync(SCREENSHOTS_DIR, { recursive: true, force: true })
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
    console.log(`✓ ${pngFiles.length} screenshots eliminados`)
  }
}
*/

// Limpiar uploads E2E
const uploadPath = dateArg === 'all'
  ? path.join(process.cwd(), 'public/uploads/e2e')
  : path.join(process.cwd(), 'public/uploads/e2e', dateArg.replace(/-/g, ''))

if (fs.existsSync(uploadPath)) {
  fs.rmSync(uploadPath, { recursive: true, force: true })
  console.log('✓ Uploads E2E eliminados')
}

console.log('✅ Limpieza completada')
