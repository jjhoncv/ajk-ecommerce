#!/usr/bin/env npx tsx
/**
 * TAGS E2E Test Runner
 *
 * EJECUCION:
 *   npx tsx src/module/tags/e2e/index.ts
 *   npx tsx src/module/tags/e2e/index.ts --integration  # Run only integration tests
 */

import fs from 'fs'
import {
  initBrowser, closeBrowser, log, wait,
  takeScreenshot, SCREENSHOTS_DIR, login
} from './utils'
import { runTagTests } from './admin/01-crud'
import { runIntegrationTests } from './admin/02-integration'

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

    // Check for --integration flag
    const runOnlyIntegration = process.argv.includes('--integration')

    let adminResults = { passed: 0, failed: 0 }
    let integrationResults = { passed: 0, failed: 0 }

    if (!runOnlyIntegration) {
      // Ejecutar tests de admin CRUD (FASE 1)
      adminResults = await runTagTests()
    }

    // Ejecutar tests de integracion (FASE 2)
    integrationResults = await runIntegrationTests()

    // Resumen total
    const totalPassed = adminResults.passed + integrationResults.passed
    const totalFailed = adminResults.failed + integrationResults.failed

    // Resumen
    console.log('\n' + '='.repeat(50))
    console.log('RESUMEN DE PRUEBAS')
    console.log('='.repeat(50))
    if (!runOnlyIntegration) {
      console.log(`  FASE 1 (Admin CRUD): ${adminResults.passed}/${adminResults.passed + adminResults.failed}`)
    }
    console.log(`  FASE 2 (Integration): ${integrationResults.passed}/${integrationResults.passed + integrationResults.failed}`)
    console.log(`  Total Passed: ${totalPassed}`)
    console.log(`  Total Failed: ${totalFailed}`)
    console.log(`  Screenshots: ${SCREENSHOTS_DIR}`)

    if (totalFailed > 0) {
      console.log('\nHAY FALLAS - Revisar screenshots para diagnostico')
    } else {
      console.log('\nTODAS LAS PRUEBAS PASARON')
    }

    process.exit(totalFailed > 0 ? 1 : 0)
  } catch (error: any) {
    log(`Error fatal: ${error.message}`)
    await takeScreenshot('ERROR-fatal')
    process.exit(1)
  } finally {
    await closeBrowser()
  }
}

main()
