#!/usr/bin/env npx tsx
/**
 * Banners Module - E2E Tests
 *
 * Ejecuta todos los tests E2E del módulo de banners.
 *
 * Usage:
 *   npx tsx src/module/banners/e2e/index.ts
 */

import fs from 'fs'
import path from 'path'
import { initBrowser, closeBrowser, takeScreenshot, getPage, wait, log, goto, SCREENSHOTS_DIR } from './utils'
import { TEST_BANNERS, TEST_SUFFIX } from './data'

/**
 * Clean up screenshots folder before running tests
 */
function cleanupScreenshots(): void {
  if (fs.existsSync(SCREENSHOTS_DIR)) {
    // Clean subfolders (admin, ecommerce)
    const subfolders = fs.readdirSync(SCREENSHOTS_DIR)
    let totalCleaned = 0
    for (const subfolder of subfolders) {
      const subfolderPath = path.join(SCREENSHOTS_DIR, subfolder)
      if (fs.statSync(subfolderPath).isDirectory()) {
        const files = fs.readdirSync(subfolderPath)
        for (const file of files) {
          if (file.endsWith('.png')) {
            fs.unlinkSync(path.join(subfolderPath, file))
            totalCleaned++
          }
        }
      } else if (subfolder.endsWith('.png')) {
        fs.unlinkSync(subfolderPath)
        totalCleaned++
      }
    }
    if (totalCleaned > 0) {
      console.log(`🧹 Cleaned up ${totalCleaned} previous screenshots`)
    }
  }
}

// Import tests
import { runCreateTests } from './admin/create.test'
import { runListTests } from './admin/list.test'
import { runUpdateTests } from './admin/update.test'
import { runDeleteTests } from './admin/delete.test'
import { runValidationTests } from './admin/validation.test'
import { runHeroSliderTests } from './ecommerce/hero-slider.test'

async function main() {
  console.log(`Test suffix: ${TEST_SUFFIX}`)
  console.log(`╔════════════════════════════════════════════╗`)
  console.log(`║  BANNERS MODULE - E2E TESTS                ║`)
  console.log(`╚════════════════════════════════════════════╝`)
  console.log()

  // Clean up previous screenshots
  cleanupScreenshots()

  try {
    // Initialize
    console.log('Initializing browser...')
    await initBrowser()

    // Login
    console.log('Logging in to admin...')
    const page = getPage()

    log('Navigating to admin login...')
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

    log('  Submitting login...')
    await page.click('button[type="submit"]')
    await wait(3000)

    log('  Login successful!')
    await takeScreenshot('login-success', 'admin')

    console.log()
    console.log(`Test data uses unique suffix: ${TEST_SUFFIX}`)
    console.log(`To cleanup after: npx tsx src/module/banners/e2e/cleanup.ts <date>`)
    console.log()

    // Admin Tests
    console.log(`┌────────────────────────────────────────────┐`)
    console.log(`│  ADMIN TESTS                               │`)
    console.log(`└────────────────────────────────────────────┘`)
    console.log()

    await runCreateTests()
    await runListTests()
    await runUpdateTests()
    await runDeleteTests()
    await runValidationTests()

    // Ecommerce Tests
    console.log()
    console.log(`┌────────────────────────────────────────────┐`)
    console.log(`│  ECOMMERCE TESTS                           │`)
    console.log(`└────────────────────────────────────────────┘`)
    console.log()

    await runHeroSliderTests()

    console.log()
    console.log(`╔════════════════════════════════════════════╗`)
    console.log(`║  ALL TESTS COMPLETED                       ║`)
    console.log(`╚════════════════════════════════════════════╝`)
    console.log()
    console.log(`Screenshots saved to: src/module/banners/e2e/screenshots/`)

  } catch (error) {
    console.error('Test failed:', error)
    throw error
  } finally {
    await closeBrowser()
  }
}

main().catch(console.error)
