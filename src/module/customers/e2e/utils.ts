/**
 * E2E Test utilities for Customers module
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
export async function hasEmptyCustomersMessage(): Promise<boolean> {
  const page = getPage()
  const pageText = await page.evaluate(() => document.body.innerText)
  return pageText.includes('No hay clientes registrados')
}

/**
 * Get the count of customers in the table
 */
export async function getCustomersCount(): Promise<number> {
  const page = getPage()
  return await page.evaluate(() => {
    const rows = document.querySelectorAll('tbody tr')
    return rows.length
  })
}

/**
 * Check if a customer exists in the list by email
 */
export async function customerExistsInList(email: string): Promise<boolean> {
  const page = getPage()
  return await page.evaluate((searchEmail) => {
    const rows = document.querySelectorAll('tbody tr')
    for (const row of rows) {
      if (row.textContent?.includes(searchEmail)) {
        return true
      }
    }
    return false
  }, email)
}

/**
 * Open the actions menu for a customer
 */
export async function openCustomerActionsMenu(customerName: string): Promise<boolean> {
  const page = getPage()

  const clicked = await page.evaluate((searchName) => {
    const rows = document.querySelectorAll('tbody tr')
    for (const row of rows) {
      if (row.textContent?.includes(searchName)) {
        const actionBtn = row.querySelector('button')
        if (actionBtn) {
          actionBtn.click()
          return true
        }
      }
    }
    return false
  }, customerName)

  if (clicked) {
    await new Promise(resolve => setTimeout(resolve, 300))
  }

  return clicked
}

/**
 * Click the edit action in the popup menu
 */
export async function clickEditAction(): Promise<boolean> {
  const page = getPage()

  return await page.evaluate(() => {
    const popup = document.querySelector('#popup-table-menu')
    if (!popup) return false

    const links = popup.querySelectorAll('a')
    for (const link of links) {
      if (link.textContent?.includes('Edit')) {
        link.click()
        return true
      }
    }
    return false
  })
}

/**
 * Search customers in the table
 */
export async function searchCustomers(term: string): Promise<void> {
  const page = getPage()

  const searchInput = await page.$('input[placeholder*="Buscar"]')
  if (searchInput) {
    await searchInput.click({ clickCount: 3 })
    await searchInput.type(term)
    await new Promise(resolve => setTimeout(resolve, 500))
  }
}

/**
 * Clear the search input
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
 * Check if customer detail page shows customer info
 */
export async function isOnCustomerDetailPage(): Promise<boolean> {
  const page = getPage()
  const currentUrl = page.url()
  return currentUrl.includes('/admin/customers/') && !currentUrl.endsWith('/customers/')
}
