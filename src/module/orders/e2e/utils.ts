/**
 * E2E Test utilities for Orders module
 * Re-exports shared utilities with module-specific overrides
 */

import fs from 'fs'
import path from 'path'
import { getPage } from '../../../../tests/e2e/utils'

// Module-specific paths
const MODULE_DIR = path.join(__dirname)
export const FIXTURES_DIR = path.join(MODULE_DIR, 'fixtures')
export const SCREENSHOTS_DIR = path.join(MODULE_DIR, 'screenshots')

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
}

/**
 * Take a screenshot and save it to this module's e2e/screenshots folder
 */
export async function takeScreenshot(name: string, _moduleName?: string): Promise<string> {
  const p = getPage()
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `${name}_${timestamp}.png`
  const filepath = path.join(SCREENSHOTS_DIR, filename)

  await p.screenshot({ path: filepath, fullPage: true })
  console.log(`  📸 Screenshot: ${filename}`)

  return filepath
}

// Re-export all shared utilities (except takeScreenshot which we override)
export {
  // Browser utilities
  initBrowser,
  closeBrowser,
  getPage,
  getBaseUrl,
  goto,
  waitAndClick,
  waitAndType,
  waitForSelector,
  getText,
  clearAndType,
  login,
  waitForText,
  // Table actions
  findRowByContent,
  openRowActionsMenu,
  clickMenuAction,
  confirmDeleteModal,
  cancelDeleteModal,
  isModalVisible,
  getTableRowCount,
  itemExistsInTable,
  // Form helpers
  fillTextField,
  fillTextArea,
  clearAndFillField,
  clearAndFillTextArea,
  submitForm,
  getFieldValue,
  getTextAreaValue,
  hasValidationError,
  fillFormFields,
  selectOption,
  toggleCheckbox,
  // Image upload
  uploadImageToField,
  fieldHasImage,
  removeImageFromField,
  getTestDate,
  // Module helpers
  log,
  wait,
  generateTestSuffix,
  navigateToAdmin,
  isOnPage,
  getCurrentUrl,
  hasToastMessage,
  waitForNavigation
} from '../../../../tests/e2e/utils'

/**
 * Check if the orders page shows the empty state message
 */
export async function hasEmptyOrdersMessage(): Promise<boolean> {
  const page = getPage()
  const pageText = await page.evaluate(() => document.body.innerText)
  return pageText.includes('No hay órdenes registradas') ||
         pageText.includes('No se encontraron órdenes')
}

/**
 * Check if the orders statistics are visible
 */
export async function hasOrderStatistics(): Promise<boolean> {
  const page = getPage()
  return await page.evaluate(() => {
    const text = document.body.innerText
    return text.includes('Pendientes') &&
           text.includes('Procesando') &&
           text.includes('Enviados') &&
           text.includes('Entregados') &&
           text.includes('Ingresos')
  })
}

/**
 * Check if the filters are visible
 */
export async function hasOrderFilters(): Promise<boolean> {
  const page = getPage()
  return await page.evaluate(() => {
    // Check for search input and filter selects
    const searchInput = document.querySelector('input[placeholder*="Buscar"]')
    const selects = document.querySelectorAll('select')
    return searchInput !== null && selects.length >= 2
  })
}

/**
 * Get the count of orders in the table
 */
export async function getOrdersCount(): Promise<number> {
  const page = getPage()
  return await page.evaluate(() => {
    const rows = document.querySelectorAll('tbody tr')
    return rows.length
  })
}

/**
 * Click on an order row to view details
 */
export async function clickViewOrderButton(orderNumber: string): Promise<boolean> {
  const page = getPage()

  return await page.evaluate((searchNumber) => {
    const rows = Array.from(document.querySelectorAll('tbody tr'))
    for (const row of rows) {
      if (row.textContent?.includes(searchNumber)) {
        const viewBtn = row.querySelector('a[href*="/admin/orders/"]') as HTMLElement
        if (viewBtn) {
          viewBtn.click()
          return true
        }
      }
    }
    return false
  }, orderNumber)
}

/**
 * Filter orders by status
 */
export async function filterByStatus(status: string): Promise<void> {
  const page = getPage()

  await page.evaluate((statusValue) => {
    const selects = document.querySelectorAll('select')
    // First select is usually the status filter
    for (const select of selects) {
      const options = select.querySelectorAll('option')
      for (const option of options) {
        if (option.value === statusValue || option.textContent === statusValue) {
          (select as HTMLSelectElement).value = option.value
          select.dispatchEvent(new Event('change', { bubbles: true }))
          return
        }
      }
    }
  }, status)

  await new Promise(resolve => setTimeout(resolve, 500))
}

/**
 * Search for orders by term
 */
export async function searchOrders(term: string): Promise<void> {
  const page = getPage()

  const searchInput = await page.$('input[placeholder*="Buscar"]')
  if (searchInput) {
    await searchInput.click({ clickCount: 3 })
    await searchInput.type(term)
    await new Promise(resolve => setTimeout(resolve, 500))
  }
}

/**
 * Clear search filter
 */
export async function clearSearch(): Promise<void> {
  const page = getPage()

  const searchInput = await page.$('input[placeholder*="Buscar"]')
  if (searchInput) {
    await searchInput.click({ clickCount: 3 })
    await page.keyboard.press('Backspace')
    await new Promise(resolve => setTimeout(resolve, 500))
  }
}

/**
 * Get a statistic value by label
 */
export async function getStatValue(label: string): Promise<string> {
  const page = getPage()

  return await page.evaluate((searchLabel) => {
    const elements = document.querySelectorAll('.rounded-lg.border')
    for (const el of elements) {
      if (el.textContent?.includes(searchLabel)) {
        const valueEl = el.querySelector('.text-xl')
        return valueEl?.textContent?.trim() || '0'
      }
    }
    return '0'
  }, label)
}
