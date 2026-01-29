#!/usr/bin/env npx tsx
/**
 * Orders E2E Test Runner
 *
 * Ejecuta todos los tests E2E del módulo Orders.
 *
 * Usage:
 *   npx tsx src/module/orders/e2e/index.ts
 */

import fs from 'fs'
import path from 'path'
import { initBrowser, closeBrowser, log, goto, wait, getPage, takeScreenshot, SCREENSHOTS_DIR } from './utils'
import { runAdminCrudTests } from './admin/01-crud'

/**
 * Clean up screenshots folder before running tests
 */
function cleanupScreenshots(): void {
  if (fs.existsSync(SCREENSHOTS_DIR)) {
    const files = fs.readdirSync(SCREENSHOTS_DIR)
    let cleaned = 0
    for (const file of files) {
      if (file.endsWith('.png')) {
        fs.unlinkSync(path.join(SCREENSHOTS_DIR, file))
        cleaned++
      }
    }
    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} previous screenshots`)
    }
  }
}

interface TestResults {
  passed: number
  failed: number
  skipped: number
}

async function main(): Promise<void> {
  console.log('\n' + '='.repeat(60))
  console.log('🧪 ORDERS E2E TESTS')
  console.log('='.repeat(60))
  console.log('Testing order management functionality.\n')

  // Clean up previous screenshots
  cleanupScreenshots()

  const totalResults: TestResults = { passed: 0, failed: 0, skipped: 0 }

  try {
    // Initialize browser
    log('Iniciando browser...')
    await initBrowser()

    // Login as admin
    log('Iniciando sesión como admin...')
    const page = getPage()

    await goto('/admin')
    await wait(2000)

    // Get all inputs and fill them
    const inputs = await page.$$('input')
    if (inputs.length >= 2) {
      await inputs[0].type('admin@ajk.com')
      await inputs[1].type('Admin123!')
      log('  Credentials entered: admin@ajk.com')
    } else {
      throw new Error('Could not find login inputs')
    }

    await page.click('button[type="submit"]')
    await wait(4000) // Wait for login redirect and page load
    log('Login exitoso')

    // Wait for sidebar to be fully loaded
    await wait(1000)

    log('')
    await takeScreenshot('login-success', 'orders')

    // Run Admin tests
    console.log('\n' + '─'.repeat(60))
    console.log('📦 ADMIN ORDERS TESTS')
    console.log('─'.repeat(60))

    const crudResults = await runAdminCrudTests()
    totalResults.passed += crudResults.passed
    totalResults.failed += crudResults.failed
    totalResults.skipped += crudResults.skipped

  } catch (error: any) {
    log(`Error fatal: ${error.message}`)
    console.error(error)
  } finally {
    // Close browser
    await closeBrowser()
  }

  // Print summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 RESUMEN FINAL')
  console.log('='.repeat(60))
  console.log(`  ✓ Passed:  ${totalResults.passed}`)
  console.log(`  ✗ Failed:  ${totalResults.failed}`)
  console.log(`  ○ Skipped: ${totalResults.skipped}`)
  console.log('─'.repeat(60))

  const total = totalResults.passed + totalResults.failed + totalResults.skipped
  const successRate = total > 0 ? ((totalResults.passed / total) * 100).toFixed(1) : '0'
  console.log(`  Total: ${total} tests, ${successRate}% passed`)

  if (totalResults.failed > 0) {
    console.log('\n⚠️  Algunos tests fallaron. Revisa los screenshots para más detalles.')
  }

  console.log('='.repeat(60) + '\n')

  // Exit with error code if any test failed
  process.exit(totalResults.failed > 0 ? 1 : 0)
}

main().catch(console.error)
