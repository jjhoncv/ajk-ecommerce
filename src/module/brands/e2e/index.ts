#!/usr/bin/env npx tsx
/**
 * Brands E2E Test Runner
 *
 * Ejecuta todos los tests E2E del módulo Brands.
 *
 * Usage:
 *   npx tsx src/module/brands/e2e/index.ts
 *
 * TDD Approach:
 *   Los tests definen el comportamiento esperado.
 *   Fallarán hasta que la UI de Admin sea implementada.
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
    for (const file of files) {
      if (file.endsWith('.png')) {
        fs.unlinkSync(path.join(SCREENSHOTS_DIR, file))
      }
    }
    console.log(`🧹 Cleaned up ${files.length} previous screenshots`)
  }
}

interface TestResults {
  passed: number
  failed: number
  skipped: number
}

async function main(): Promise<void> {
  console.log('\n' + '='.repeat(60))
  console.log('🧪 BRANDS E2E TESTS')
  console.log('='.repeat(60))
  console.log('TDD Approach: Tests define expected behavior.')
  console.log('Some tests will FAIL until Admin UI is implemented.\n')

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
    await wait(3000)
    log('Login exitoso')

    // Verificar si Marcas está en el sidebar, si no, hacer re-login
    const hasBrandsInSidebar = await page.evaluate(() => {
      return document.body.innerText.includes('Marcas')
    })

    if (!hasBrandsInSidebar) {
      log('  Sección Marcas no visible, haciendo re-login para refrescar permisos...')

      // Hacer click en "Cerrar Sesión" usando evaluate
      await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a, button'))
        const logoutLink = links.find(el => el.textContent?.includes('Cerrar Sesión'))
        if (logoutLink) (logoutLink as HTMLElement).click()
      })
      await wait(2000)

      // Re-login
      await goto('/admin')
      await wait(2000)
      const inputs2 = await page.$$('input')
      if (inputs2.length >= 2) {
        await inputs2[0].type('admin@ajk.com')
        await inputs2[1].type('Admin123!')
      }
      await page.click('button[type="submit"]')
      await wait(3000)
      log('  Re-login completado')
    }

    log('')
    await takeScreenshot('login-success', 'brands')

    // Run Admin CRUD tests
    console.log('\n' + '─'.repeat(60))
    console.log('📦 ADMIN CRUD TESTS')
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
    console.log('\n⚠️  TDD: Los tests que fallaron indican funcionalidad pendiente.')
    console.log('   Implementa la UI en src/app/admin/brands/ para que pasen.')
  }

  console.log('='.repeat(60) + '\n')

  // Exit with error code if any test failed
  process.exit(totalResults.failed > 0 ? 1 : 0)
}

main().catch(console.error)
