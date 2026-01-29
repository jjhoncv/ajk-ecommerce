/**
 * E2E Test utilities for Users module
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
 * Fill user form fields
 * This handles the custom form used by UserForm
 */
export async function fillUserForm(data: {
  name?: string
  lastname?: string
  email?: string
  roleId?: number
  isActive?: boolean
}): Promise<void> {
  const page = getPage()

  // Fill name - first input in the "Informacion Personal" section
  if (data.name) {
    const nameInput = await page.$('input[placeholder="Nombre"]')
    if (nameInput) {
      await nameInput.click({ clickCount: 3 })
      await nameInput.type(data.name)
    }
  }

  // Fill lastname - second input in the "Informacion Personal" section
  if (data.lastname) {
    const lastnameInput = await page.$('input[placeholder="Apellido"]')
    if (lastnameInput) {
      await lastnameInput.click({ clickCount: 3 })
      await lastnameInput.type(data.lastname)
    }
  }

  // Fill email
  if (data.email) {
    const emailInput = await page.$('input[type="email"]')
    if (emailInput) {
      await emailInput.click({ clickCount: 3 })
      await emailInput.type(data.email)
    }
  }

  // Select role
  if (data.roleId) {
    const selects = await page.$$('select')
    if (selects.length > 0) {
      await selects[0].select(data.roleId.toString())
    }
  }

  // Toggle active status (only available on edit)
  if (data.isActive !== undefined) {
    const checkbox = await page.$('input[type="checkbox"]')
    if (checkbox) {
      const isChecked = await checkbox.evaluate((el: HTMLInputElement) => el.checked)
      if (isChecked !== data.isActive) {
        await checkbox.click()
      }
    }
  }
}

/**
 * Click the "Crear usuario" or "Actualizar usuario" button
 */
export async function submitUserForm(): Promise<void> {
  const page = getPage()

  // Find button with text "Crear usuario" or "Actualizar usuario"
  const button = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button[type="submit"]'))
    return buttons.find(btn =>
      btn.textContent?.includes('Crear usuario') ||
      btn.textContent?.includes('Actualizar usuario')
    )
  })

  if (button) {
    await (button as any).click()
  } else {
    throw new Error('No se encontró el botón de guardar')
  }
}

/**
 * Check if user exists in the list by name
 */
export async function userExistsInList(name: string): Promise<boolean> {
  const page = getPage()
  const pageText = await page.evaluate(() => document.body.innerText)
  return pageText.includes(name)
}

/**
 * Open the actions menu for a user row using the 3-dot button
 */
export async function openUserActionsMenu(userName: string): Promise<boolean> {
  const page = getPage()

  const clicked = await page.evaluate((searchName) => {
    const rows = Array.from(document.querySelectorAll('tr'))
    for (const row of rows) {
      if (row.textContent?.includes(searchName)) {
        // Find the 3-dot menu button (it's the last button in the row)
        const buttons = row.querySelectorAll('button')
        const menuBtn = buttons[buttons.length - 1] as HTMLElement
        if (menuBtn) {
          menuBtn.click()
          return true
        }
      }
    }
    return false
  }, userName)

  if (clicked) {
    // Wait for popup to appear
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  return clicked
}

/**
 * Click edit action in the opened menu
 */
export async function clickEditAction(): Promise<boolean> {
  const page = getPage()

  return await page.evaluate(() => {
    // Look for edit link in the popup menu (portal rendered in body)
    const popupMenu = document.querySelector('#popup-table-menu')
    if (popupMenu) {
      const editLink = popupMenu.querySelector('a[href*="/admin/users/"]') as HTMLElement
      if (editLink) {
        editLink.click()
        return true
      }
    }
    // Fallback: look anywhere in document
    const allLinks = Array.from(document.querySelectorAll('a'))
    for (const link of allLinks) {
      if (link.textContent?.includes('Editar') || (link.href?.includes('/admin/users/') && !link.href.includes('/new'))) {
        link.click()
        return true
      }
    }
    return false
  })
}

/**
 * Click delete action in the opened menu
 */
export async function clickDeleteAction(): Promise<boolean> {
  const page = getPage()

  const clicked = await page.evaluate(() => {
    // Look for delete option in the popup menu (portal rendered in body)
    const popupMenu = document.querySelector('#popup-table-menu')
    if (popupMenu) {
      // The delete option is a div with red text and cursor-pointer
      const elements = popupMenu.querySelectorAll('div')
      for (const el of elements) {
        if (el.textContent?.trim() === 'Eliminar' ||
            (el.textContent?.includes('Eliminar') && el.classList.contains('text-red-600'))) {
          (el as HTMLElement).click()
          return true
        }
      }
    }
    return false
  })

  // Wait for URL to change and modal to appear
  await new Promise(resolve => setTimeout(resolve, 1000))

  return clicked
}

/**
 * Confirm deletion in the alert modal
 */
export async function confirmUserDelete(): Promise<void> {
  const page = getPage()

  // Wait for modal to appear by checking for the modal content (white box with shadow)
  await page.waitForFunction(() => {
    // Look for the modal by its structure: fixed overlay with white content box
    const overlay = document.querySelector('.fixed.inset-0')
    const modal = document.querySelector('.fixed.left-1\\/2.top-1\\/2')
    return overlay && modal
  }, { timeout: 5000 })

  await new Promise(resolve => setTimeout(resolve, 500))

  // Find and click the red "Eliminar" button in the modal
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const confirmBtn = buttons.find(btn =>
      btn.textContent?.trim() === 'Eliminar' &&
      (btn.classList.contains('bg-red-600') || btn.className.includes('bg-red'))
    )
    if (confirmBtn) {
      confirmBtn.click()
    }
  })
}

/**
 * Cancel deletion in the alert modal
 */
export async function cancelUserDelete(): Promise<void> {
  const page = getPage()

  // Wait for modal to appear
  await page.waitForFunction(() => {
    const overlay = document.querySelector('.fixed.inset-0')
    const modal = document.querySelector('.fixed.left-1\\/2.top-1\\/2')
    return overlay && modal
  }, { timeout: 5000 })

  await new Promise(resolve => setTimeout(resolve, 500))

  // Find and click cancel button
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const cancelBtn = buttons.find(btn =>
      btn.textContent?.trim() === 'Cancelar'
    )
    if (cancelBtn) {
      cancelBtn.click()
    }
  })
}
