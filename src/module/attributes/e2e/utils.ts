/**
 * E2E Test utilities for Attributes module
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
 * Fill the attribute form
 */
export async function fillAttributeForm(data: {
  name?: string
  displayType?: string
}): Promise<void> {
  const page = getPage()

  // Fill name field
  if (data.name !== undefined) {
    const nameInput = await page.$('input[name="name"]')
    if (nameInput) {
      await nameInput.click({ clickCount: 3 })
      await nameInput.type(data.name)
    }
  }

  // Select display type
  if (data.displayType !== undefined) {
    const selectEl = await page.$('select[name="display_type"]')
    if (selectEl) {
      await selectEl.select(data.displayType)
    }
  }
}

/**
 * Submit the attribute form
 */
export async function submitAttributeForm(): Promise<void> {
  const page = getPage()
  const submitBtn = await page.$('button[type="submit"]')
  if (submitBtn) {
    await submitBtn.click()
  }
}

/**
 * Check if an attribute exists in the list by name
 */
export async function attributeExistsInList(name: string): Promise<boolean> {
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
 * Open the actions menu for an attribute
 */
export async function openAttributeActionsMenu(attributeName: string): Promise<boolean> {
  const page = getPage()

  // Find the row with the attribute name and click its action button
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
  }, attributeName)

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
      if (link.textContent?.includes('Editar')) {
        link.click()
        return true
      }
    }
    return false
  })
}

/**
 * Click the delete action in the popup menu
 */
export async function clickDeleteAction(): Promise<boolean> {
  const page = getPage()

  // Try to find and click the delete option using puppeteer's click
  const deleteEl = await page.$('#popup-table-menu div.text-red-600')
  if (deleteEl) {
    await deleteEl.click()
    await new Promise(resolve => setTimeout(resolve, 500))
    return true
  }

  // Fallback: try to find by text content
  const clicked = await page.evaluate(() => {
    const popup = document.querySelector('#popup-table-menu')
    if (!popup) return false

    // Look for any clickable element with delete-related text
    const elements = popup.querySelectorAll('button, a, div')
    for (const el of elements) {
      const text = el.textContent?.toLowerCase() || ''
      if (text.includes('delete') || text.includes('eliminar') || text.includes('borrar')) {
        // Use dispatchEvent to ensure React handler fires
        el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
        return true
      }
    }
    return false
  })

  if (clicked) {
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  return clicked
}

/**
 * Confirm the delete alert
 */
export async function confirmAttributeDelete(): Promise<void> {
  const page = getPage()

  // Wait for modal to appear (fixed overlay with z-index)
  await page.waitForFunction(() => {
    // Look for the modal title "Confirmar eliminación"
    const pageText = document.body.innerText
    return pageText.includes('Confirmar eliminación') || pageText.includes('confirmar')
  }, { timeout: 5000 })

  await new Promise(resolve => setTimeout(resolve, 500))

  // Click confirm button (red "Eliminar" button)
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('button')
    for (const btn of buttons) {
      const text = btn.textContent?.toLowerCase() || ''
      // Look for red delete button (has bg-red in className)
      if (text.includes('eliminar') && (btn.className.includes('red') || btn.className.includes('bg-red'))) {
        btn.click()
        return
      }
    }
    // Fallback: find any button with eliminar
    for (const btn of buttons) {
      const text = btn.textContent?.toLowerCase() || ''
      if (text.includes('eliminar')) {
        btn.click()
        return
      }
    }
  })
}

/**
 * Cancel the delete alert
 */
export async function cancelAttributeDelete(): Promise<void> {
  const page = getPage()

  // Wait for modal to appear
  await page.waitForFunction(() => {
    const pageText = document.body.innerText
    return pageText.includes('Confirmar eliminación') || pageText.includes('confirmar')
  }, { timeout: 5000 })

  await new Promise(resolve => setTimeout(resolve, 500))

  // Click cancel button
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('button')
    for (const btn of buttons) {
      const text = btn.textContent?.toLowerCase() || ''
      if (text.includes('cancelar')) {
        btn.click()
        return
      }
    }
  })
}

/**
 * Get the count of attributes in the table
 */
export async function getAttributesCount(): Promise<number> {
  const page = getPage()
  return await page.evaluate(() => {
    const rows = document.querySelectorAll('tbody tr')
    return rows.length
  })
}

/**
 * Check if the page shows empty state message
 */
export async function hasEmptyAttributesMessage(): Promise<boolean> {
  const page = getPage()
  const pageText = await page.evaluate(() => document.body.innerText)
  return pageText.includes('No se encontraron atributos')
}
