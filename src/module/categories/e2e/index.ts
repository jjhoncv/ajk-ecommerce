/**
 * Categories Module - E2E Tests Entry Point
 *
 * Run all tests: npx ts-node src/module/categories/e2e/index.ts
 *
 * Tests:
 * - Admin (6): create, create-child, update, delete, list, validation
 * - Ecommerce (3): navigation, category-page, not-found
 */

import fs from 'fs'
import path from 'path'
import { initBrowser, closeBrowser, getPage, goto, takeScreenshot, wait, log, SCREENSHOTS_DIR } from './utils'
import { TEST_CATEGORIES } from './data'

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

// Admin tests
import runCreateTests from './admin/create.test'
import runListTests from './admin/list.test'
import runCreateChildTests from './admin/create-child.test'
import runUpdateTests from './admin/update.test'
import runDeleteTests from './admin/delete.test'
import runValidationTests from './admin/validation.test'

// Ecommerce tests
import runNavigationTests from './ecommerce/navigation.test'
import runCategoryPageTests from './ecommerce/category-page.test'
import runNotFoundTests from './ecommerce/not-found.test'

// Test credentials (from environment or defaults)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ajk.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!'

/**
 * Custom login function that handles the admin login form
 */
async function loginToAdmin(): Promise<void> {
  const page = getPage()

  log('Navigating to admin login...')
  await goto('/admin')
  await wait(2000)

  // Get all inputs and fill them
  const inputs = await page.$$('input')
  if (inputs.length >= 2) {
    await inputs[0].type(ADMIN_EMAIL)
    await inputs[1].type(ADMIN_PASSWORD)
    log(`  Credentials entered: ${ADMIN_EMAIL}`)
  } else {
    throw new Error('Could not find login inputs')
  }

  // Submit
  await page.click('button[type="submit"]')
  log('  Submitting login...')

  await wait(3000)

  // Verify logged in
  const currentUrl = page.url()
  if (currentUrl.includes('/admin') && !currentUrl.includes('login')) {
    log('  Login successful!')
  } else {
    // Check if we're on dashboard
    const pageContent = await page.content()
    if (pageContent.includes('Dashboard') || pageContent.includes('Categorías')) {
      log('  Login successful!')
    } else {
      log('  Warning: Login may have failed')
    }
  }

  await takeScreenshot('login-success', 'admin')
}

/**
 * Run all category E2E tests
 */
async function runAllTests(): Promise<void> {
  console.log('╔════════════════════════════════════════════╗')
  console.log('║  CATEGORIES MODULE - E2E TESTS             ║')
  console.log('╚════════════════════════════════════════════╝')
  console.log('')

  // Clean up previous screenshots
  cleanupScreenshots()

  try {
    // Initialize browser
    console.log('Initializing browser...')
    await initBrowser()

    // Login to admin
    console.log('Logging in to admin...')
    await loginToAdmin()

    console.log(`\nTest data uses unique suffix: ${TEST_CATEGORIES.parent.name.match(/-test-.*$/)?.[0] || ''}`)
    console.log(`To cleanup after: npx tsx src/module/categories/e2e/cleanup.ts <date>`)

    // =====================
    // ADMIN TESTS
    // =====================
    console.log('\n┌────────────────────────────────────────────┐')
    console.log('│  ADMIN TESTS                               │')
    console.log('└────────────────────────────────────────────┘\n')

    // 1. Create parent category
    await runCreateTests()

    // 2. List categories
    await runListTests()

    // 3. Create child category
    await runCreateChildTests()

    // 4. Update category
    await runUpdateTests()

    // 5. Delete category
    await runDeleteTests()

    // 6. Validation tests
    await runValidationTests()

    // =====================
    // ECOMMERCE TESTS
    // =====================
    console.log('\n┌────────────────────────────────────────────┐')
    console.log('│  ECOMMERCE TESTS                           │')
    console.log('└────────────────────────────────────────────┘\n')

    // 7. Navigation
    await runNavigationTests()

    // 8. Category page
    await runCategoryPageTests()

    // 9. Not found
    await runNotFoundTests()

    // =====================
    // SUMMARY
    // =====================
    console.log('\n╔════════════════════════════════════════════╗')
    console.log('║  ALL TESTS COMPLETED                       ║')
    console.log('╚════════════════════════════════════════════╝')
    console.log('')
    console.log('Screenshots saved to: src/module/categories/e2e/screenshots/')

  } catch (error) {
    console.error('\n❌ Test failed:', error)
    throw error
  } finally {
    await closeBrowser()
  }
}

// Export individual test runners for selective execution
export {
  runCreateTests,
  runListTests,
  runCreateChildTests,
  runUpdateTests,
  runDeleteTests,
  runValidationTests,
  runNavigationTests,
  runCategoryPageTests,
  runNotFoundTests
}

// Run if executed directly
if (require.main === module) {
  runAllTests().catch(console.error)
}

export default runAllTests
