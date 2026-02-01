#!/usr/bin/env npx tsx
/**
 * Tags E2E Test Runner
 */

import fs from 'fs'
import path from 'path'
import {
  initBrowser,
  closeBrowser,
  log,
  goto,
  wait,
  getPage,
  SCREENSHOTS_DIR
} from './utils'
import { runTagsTests } from './admin/01-crud'

/**
 * IMPORTANTE: Limpiar screenshots anteriores antes de ejecutar
 */
function cleanupScreenshots(): void {
  if (fs.existsSync(SCREENSHOTS_DIR)) {
    const items = fs.readdirSync(SCREENSHOTS_DIR)
    let totalCleaned = 0
    for (const item of items) {
      const itemPath = path.join(SCREENSHOTS_DIR, item)
      if (fs.statSync(itemPath).isDirectory()) {
        const files = fs.readdirSync(itemPath)
        for (const file of files) {
          if (file.endsWith('.png')) {
            fs.unlinkSync(path.join(itemPath, file))
            totalCleaned++
          }
        }
      } else if (item.endsWith('.png')) {
        fs.unlinkSync(itemPath)
        totalCleaned++
      }
    }
    if (totalCleaned > 0) {
      console.log(`🧹 Cleaned up ${totalCleaned} previous screenshots`)
    }
  }
}

async function main(): Promise<void> {
  console.log('🧪 TAGS E2E TESTS')
  console.log('='.repeat(50))

  // SIEMPRE limpiar screenshots al inicio
  cleanupScreenshots()

  try {
    log('Iniciando browser...')
    await initBrowser()

    // Login
    log('Login como admin...')
    const page = getPage()
    await goto('/admin')
    await wait(2000)

    // Buscar inputs de login
    const inputs = await page.$$('input')
    if (inputs.length >= 2) {
      await inputs[0].type('admin@ajk.com')
      await inputs[1].type('Admin123!')
    }

    // Click en submit
    await page.click('button[type="submit"]')
    await wait(3000)

    log('Login exitoso')

    // Ejecutar tests de Admin CRUD
    console.log('\n📋 ADMIN CRUD TESTS')
    console.log('-'.repeat(40))
    const crudResults = await runTagsTests()

    // Resumen
    console.log('\n' + '='.repeat(50))
    console.log('📊 RESUMEN FINAL')
    console.log('='.repeat(50))
    console.log(`  ✓ Passed: ${crudResults.passed}`)
    console.log(`  ✗ Failed: ${crudResults.failed}`)
    console.log(`  Total: ${crudResults.passed + crudResults.failed}`)

    const successRate = Math.round(
      (crudResults.passed / (crudResults.passed + crudResults.failed)) * 100
    )
    console.log(`  Success Rate: ${successRate}%`)

    if (crudResults.failed > 0) {
      console.log('\n⚠️  Algunos tests fallaron. Revisar screenshots con sufijo -ERROR')
    } else {
      console.log('\n✅ Todos los tests pasaron!')
    }

    process.exit(crudResults.failed > 0 ? 1 : 0)
  } catch (error: unknown) {
    const err = error as Error
    log(`Error fatal: ${err.message}`)
    console.error(err.stack)
    process.exit(1)
  } finally {
    await closeBrowser()
  }
}

main()
