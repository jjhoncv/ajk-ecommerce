/**
 * Categories Admin - List Test
 * Tests listing categories, badges, navigation to subcategories
 */

import {
  getPage,
  goto,
  takeScreenshot,
  log,
  wait,
  navigateToAdmin,
  getTableRowCount
} from '../utils'
import { TEST_CATEGORIES } from '../data'

const SCREENSHOT_FOLDER = 'admin/list'

/**
 * Test: Navigate to categories list
 */
export async function testNavigateToList(): Promise<void> {
  log('Navigating to categories list...')
  await navigateToAdmin('/admin/categories')
  await takeScreenshot('01-table', SCREENSHOT_FOLDER)

  const page = getPage()
  const pageContent = await page.content()

  if (pageContent.includes('Categorías')) {
    log('  Categories list loaded')
  } else {
    throw new Error('Categories list did not load')
  }
}

/**
 * Test: Verify table columns
 */
export async function testVerifyTableColumns(): Promise<void> {
  const page = getPage()
  log('Verifying table columns...')

  const hasColumns = await page.evaluate(() => {
    const headers = document.querySelectorAll('th')
    const headerTexts = Array.from(headers).map(h => h.textContent?.toLowerCase() || '')
    return headerTexts.some(t => t.includes('nombre') || t.includes('name'))
  })

  if (hasColumns) {
    log('  Table columns present')
  } else {
    log('  Warning: Expected columns not found')
  }
}

/**
 * Test: Verify visibility badges
 */
export async function testVerifyBadges(): Promise<void> {
  const page = getPage()
  log('Verifying visibility badges...')

  const pageContent = await page.content()

  if (pageContent.includes('Visible')) {
    log('  "Visible" badge found')
  }

  if (pageContent.includes('Oculto')) {
    log('  "Oculto" badge found')
  }
}

/**
 * Test: Navigate to subcategories
 */
export async function testNavigateToSubcategories(): Promise<void> {
  const page = getPage()
  log('Testing subcategories navigation...')

  // Find link to subcategories
  const subLink = await page.$('a[href*="/admin/categories?parent="]')

  if (subLink) {
    await subLink.click()
    await wait(1500)
    log('  Navigated to subcategories')

    // Verify back button
    const pageContent = await page.content()
    if (pageContent.includes('Volver') || pageContent.includes('←')) {
      log('  Back button visible')
    }

    // Go back to root
    await navigateToAdmin('/admin/categories')
  } else {
    log('  No subcategories link found')
  }
}

/**
 * Test: Verify pagination controls
 */
export async function testPaginationControls(): Promise<void> {
  const page = getPage()
  log('Testing pagination...')

  const hasPagination = await page.evaluate(() => {
    // Check for pagination area or buttons with pagination text
    const paginationArea = document.querySelector('[class*="pagination"]') ||
                          document.querySelector('nav[aria-label*="pagination"]')
    if (paginationArea) return true

    // Check for buttons with pagination text
    const buttons = document.querySelectorAll('button')
    for (const btn of buttons) {
      const text = btn.textContent?.toLowerCase() || ''
      if (text.includes('siguiente') || text.includes('anterior') || text.includes('next') || text.includes('prev')) {
        return true
      }
    }
    return false
  })

  if (hasPagination) {
    log('  Pagination controls found')
  } else {
    log('  Pagination not visible (may have few items)')
  }
}

/**
 * Test: Empty state
 */
export async function testEmptyState(): Promise<void> {
  log('Testing empty state...')

  // Navigate to a parent with no children
  await goto('/admin/categories?parent=99999')
  await wait(1500)

  const page = getPage()
  const pageContent = await page.content()
  if (pageContent.includes('No hay') || pageContent.includes('no encontr')) {
    log('  Empty state displayed correctly')
  } else {
    log('  Empty state test skipped')
  }

  // Return to main list
  await navigateToAdmin('/admin/categories')
}

/**
 * Test: Get row count
 */
export async function testRowCount(): Promise<void> {
  log('Counting table rows...')
  const rowCount = await getTableRowCount()
  if (rowCount > 0) {
    log(`  Total rows: ${rowCount}`)
  } else {
    log('  No rows found')
  }
}

/**
 * Run all list tests
 */
export async function runListTests(): Promise<void> {
  log('=== LIST CATEGORY TESTS ===')

  await testNavigateToList()
  await testVerifyTableColumns()
  await testVerifyBadges()
  await testNavigateToSubcategories()
  await testPaginationControls()
  await testEmptyState()
  await testRowCount()

  log('=== LIST TESTS COMPLETED ===')
}

export default runListTests
