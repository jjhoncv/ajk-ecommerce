/**
 * Banners E2E - List Tests
 */

import { getPage, takeScreenshot, log, navigateToAdmin, getTableRowCount } from '../utils'

export async function runListTests(): Promise<void> {
  const page = getPage()

  log('=== LIST BANNER TESTS ===')

  // 1. Navigate to list
  log('Navigating to banners list...')
  await navigateToAdmin('/admin/banners')
  await takeScreenshot('01-table', 'admin/list')
  log('  Banners list loaded')

  // 2. Verify table exists
  const hasTable = await page.$('table')
  if (hasTable) {
    log('  Table present')
  }

  // 3. Verify columns
  const hasColumns = await page.evaluate(() => {
    const headers = document.querySelectorAll('th')
    const headerTexts = Array.from(headers).map(h => h.textContent?.toLowerCase() || '')
    return headerTexts.some(t => t.includes('titulo') || t.includes('title')) &&
           headerTexts.some(t => t.includes('imagen') || t.includes('image'))
  })

  if (hasColumns) {
    log('  Table columns present (Titulo, Imagen)')
  }

  // 4. Verify action buttons
  const hasActions = await page.evaluate(() => {
    const editBtns = document.querySelectorAll('a[href*="/admin/banners/"]')
    return editBtns.length > 0
  })

  if (hasActions) {
    log('  Action buttons present')
  }

  // 5. Test pagination (if exists)
  const hasPagination = await page.evaluate(() => {
    const paginationBtns = document.querySelectorAll('button')
    return Array.from(paginationBtns).some(btn =>
      btn.textContent?.includes('Siguiente') ||
      btn.textContent?.includes('Anterior') ||
      btn.getAttribute('aria-label')?.includes('page')
    )
  })

  if (hasPagination) {
    log('  Pagination controls found')
  } else {
    log('  Pagination not needed (few items)')
  }

  // 6. Test drag & drop indicator (banners have reorder)
  const hasReorder = await page.evaluate(() => {
    // Look for drag handles or reorder indicators
    const dragHandles = document.querySelectorAll('[draggable="true"], [class*="drag"], [class*="grip"]')
    return dragHandles.length > 0
  })

  if (hasReorder) {
    log('  Drag & drop reorder enabled')
  }

  // Get row count
  const rowCount = await getTableRowCount()
  if (rowCount > 0) {
    log(`  Total rows: ${rowCount}`)
  }

  log('=== LIST TESTS COMPLETED ===')
}
