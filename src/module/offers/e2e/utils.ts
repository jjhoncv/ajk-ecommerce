/**
 * E2E Test utilities for Offers module
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
 * Check if the page shows empty state message
 */
export async function hasEmptyOffersMessage(): Promise<boolean> {
  const page = getPage()
  const pageText = await page.evaluate(() => document.body.innerText)
  return pageText.includes('No hay ofertas') ||
         pageText.includes('Crear primera oferta')
}

/**
 * Check if offers stats are visible
 */
export async function hasOfferStats(): Promise<boolean> {
  const page = getPage()
  const pageText = await page.evaluate(() => document.body.innerText)
  return pageText.includes('Total Ofertas') &&
         pageText.includes('Activas') &&
         pageText.includes('Programadas')
}

/**
 * Get the count of offers in the table
 */
export async function getOffersCount(): Promise<number> {
  const page = getPage()
  return await page.evaluate(() => {
    const rows = document.querySelectorAll('tbody tr')
    return rows.length
  })
}

/**
 * Check if an offer exists in the list by name
 */
export async function offerExistsInList(name: string): Promise<boolean> {
  const page = getPage()
  return await page.evaluate((searchName) => {
    const rows = document.querySelectorAll('tbody tr')
    for (const row of rows) {
      if (row.textContent?.includes(searchName)) {
        return true
      }
    }
    return false
  }, name)
}

/**
 * Search offers
 */
export async function searchOffers(term: string): Promise<void> {
  const page = getPage()

  const searchInput = await page.$('input[placeholder*="Buscar"]')
  if (searchInput) {
    await searchInput.click({ clickCount: 3 })
    await searchInput.type(term)
    await new Promise(resolve => setTimeout(resolve, 500))
  }
}

/**
 * Filter offers by status
 */
export async function filterByStatus(status: 'all' | 'active' | 'scheduled' | 'expired'): Promise<void> {
  const page = getPage()

  const labels: Record<string, string> = {
    all: 'Todas',
    active: 'Activas',
    scheduled: 'Programadas',
    expired: 'Expiradas'
  }

  const buttons = await page.$$('button')
  for (const button of buttons) {
    const text = await button.evaluate(el => el.textContent)
    if (text?.includes(labels[status])) {
      await button.click()
      await new Promise(resolve => setTimeout(resolve, 500))
      break
    }
  }
}
