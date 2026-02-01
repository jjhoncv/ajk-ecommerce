#!/usr/bin/env npx tsx
/**
 * TAGS E2E Test Runner
 *
 * EJECUCION:
 *   npx tsx src/module/tags/e2e/index.ts
 */

import fs from 'fs'
import {
  initBrowser, closeBrowser, log, wait,
  takeScreenshot, SCREENSHOTS_DIR, login
} from './utils'
import { runTagTests } from './admin/01-crud'

/**
 * Preparar carpeta de screenshots
 */
function prepareScreenshotsDir(): void {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
    console.log('Carpeta de screenshots creada')
  } else {
    const files = fs.readdirSync(SCREENSHOTS_DIR).filter(f => f.endsWith('.png'))
    if (files.length > 0) {
      console.log(`Screenshots existentes: ${files.length} (se mantienen como evidencia)`)
    }
  }
}

async function main(): Promise<void> {
  console.log('TAGS E2E EXPLORATORY TESTS')
  console.log('='.repeat(50))

  prepareScreenshotsDir()

  try {
    log('Iniciando browser...')
    await initBrowser()

    // Login como admin - CREDENCIALES REALES
    log('Login como admin...')
    await login('admin@ajk.com', 'Admin123!')
    await wait(2000)
    log('Login exitoso')

    // Screenshot del dashboard
    await takeScreenshot('00-dashboard-after-login')

    // Ejecutar tests exploratorios
    const results = await runTagTests()

    // Resumen
    console.log('\n' + '='.repeat(50))
    console.log('RESUMEN DE PRUEBAS EXPLORATORIAS')
    console.log('='.repeat(50))
    console.log(`  Passed: ${results.passed}`)
    console.log(`  Failed: ${results.failed}`)
    console.log(`  Screenshots: ${SCREENSHOTS_DIR}`)

    if (results.failed > 0) {
      console.log('\nHAY FALLAS - Revisar screenshots para diagnostico')
    } else {
      console.log('\nTODAS LAS PRUEBAS PASARON')
    }

    process.exit(results.failed > 0 ? 1 : 0)
  } catch (error: any) {
    log(`Error fatal: ${error.message}`)
    await takeScreenshot('ERROR-fatal')
    process.exit(1)
  } finally {
    await closeBrowser()
  }
}

main()
