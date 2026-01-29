/**
 * E2E Test utilities for Roles module
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
 * Fill role form fields
 * This handles the RoleForm component
 */
export async function fillRoleForm(data: {
  name?: string
  selectAllSections?: boolean
  deselectAllSections?: boolean
  toggleSectionByName?: string[]
}): Promise<void> {
  const page = getPage()

  // Fill name
  if (data.name) {
    const nameInput = await page.$('input[placeholder*="Editor"], input[placeholder*="Vendedor"]')
    if (nameInput) {
      await nameInput.click({ clickCount: 3 })
      await nameInput.type(data.name)
    }
  }

  // Select all sections
  if (data.selectAllSections) {
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const selectAllBtn = buttons.find(btn => btn.textContent?.includes('Seleccionar todas'))
      if (selectAllBtn) {
        selectAllBtn.click()
      }
    })
    await new Promise(resolve => setTimeout(resolve, 300))
  }

  // Deselect all sections
  if (data.deselectAllSections) {
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const deselectAllBtn = buttons.find(btn => btn.textContent?.includes('Deseleccionar todas'))
      if (deselectAllBtn) {
        deselectAllBtn.click()
      }
    })
    await new Promise(resolve => setTimeout(resolve, 300))
  }

  // Toggle specific sections by name
  if (data.toggleSectionByName && data.toggleSectionByName.length > 0) {
    for (const sectionName of data.toggleSectionByName) {
      await page.evaluate((name) => {
        const labels = Array.from(document.querySelectorAll('label'))
        for (const label of labels) {
          if (label.textContent?.includes(name)) {
            label.click()
            break
          }
        }
      }, sectionName)
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }
}

/**
 * Click the "Crear rol" or "Actualizar rol" button
 */
export async function submitRoleForm(): Promise<void> {
  const page = getPage()

  // Find button with text "Crear rol" or "Actualizar rol"
  const button = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button[type="submit"]'))
    return buttons.find(btn =>
      btn.textContent?.includes('Crear rol') ||
      btn.textContent?.includes('Actualizar rol')
    )
  })

  if (button) {
    await (button as any).click()
  } else {
    throw new Error('No se encontró el botón de guardar')
  }
}

/**
 * Check if role exists in the cards list by name
 */
export async function roleExistsInList(name: string): Promise<boolean> {
  const page = getPage()
  const pageText = await page.evaluate(() => document.body.innerText)
  return pageText.includes(name)
}

/**
 * Click edit button on a role card
 */
export async function clickRoleEditButton(roleName: string): Promise<boolean> {
  const page = getPage()

  return await page.evaluate((searchName) => {
    // Find all h3 elements with role names
    const roleNames = Array.from(document.querySelectorAll('h3'))
    for (const h3 of roleNames) {
      // Use includes for partial match since names have timestamps
      if (h3.textContent?.includes(searchName) || h3.textContent?.trim() === searchName) {
        // Navigate up to find the card container and then the edit link
        let parent = h3.parentElement
        while (parent && !parent.classList.contains('p-6')) {
          parent = parent.parentElement
        }
        if (parent) {
          // Find any link in this card area
          const editLink = parent.querySelector('a[href*="/admin/roles/"]') as HTMLElement
          if (editLink) {
            editLink.click()
            return true
          }
        }
      }
    }
    return false
  }, roleName)
}

/**
 * Click delete button on a role card
 * Note: Only works for non-system roles (id > 2)
 */
export async function clickRoleDeleteButton(roleName: string): Promise<boolean> {
  const page = getPage()

  // Setup dialog handler to auto-accept confirm()
  page.once('dialog', async (dialog) => {
    await dialog.accept()
  })

  return await page.evaluate((searchName) => {
    // Find all h3 elements with role names
    const roleNames = Array.from(document.querySelectorAll('h3'))
    for (const h3 of roleNames) {
      // Use includes for partial match
      if (h3.textContent?.includes(searchName) || h3.textContent?.trim() === searchName) {
        // Navigate up to find the card container
        let parent = h3.parentElement
        while (parent && !parent.classList.contains('p-6')) {
          parent = parent.parentElement
        }
        if (parent) {
          // Find delete button (has title="Eliminar rol")
          const deleteBtn = parent.querySelector('button[title="Eliminar rol"]') as HTMLElement
          if (deleteBtn) {
            deleteBtn.click()
            return true
          }
        }
      }
    }
    return false
  }, roleName)
}

/**
 * Click delete button but dismiss the confirm dialog
 */
export async function clickRoleDeleteButtonAndCancel(roleName: string): Promise<boolean> {
  const page = getPage()

  // Setup dialog handler to dismiss confirm()
  page.once('dialog', async (dialog) => {
    await dialog.dismiss()
  })

  return await page.evaluate((searchName) => {
    // Find all h3 elements with role names
    const roleNames = Array.from(document.querySelectorAll('h3'))
    for (const h3 of roleNames) {
      // Use includes for partial match
      if (h3.textContent?.includes(searchName) || h3.textContent?.trim() === searchName) {
        // Navigate up to find the card container
        let parent = h3.parentElement
        while (parent && !parent.classList.contains('p-6')) {
          parent = parent.parentElement
        }
        if (parent) {
          // Find delete button
          const deleteBtn = parent.querySelector('button[title="Eliminar rol"]') as HTMLElement
          if (deleteBtn) {
            deleteBtn.click()
            return true
          }
        }
      }
    }
    return false
  }, roleName)
}

/**
 * Get the number of sections assigned to a role
 */
export async function getRoleSectionCount(roleName: string): Promise<number> {
  const page = getPage()

  return await page.evaluate((searchName) => {
    // Find all h3 elements with role names
    const roleNames = Array.from(document.querySelectorAll('h3'))
    for (const h3 of roleNames) {
      // Use includes for partial match
      if (h3.textContent?.includes(searchName) || h3.textContent?.trim() === searchName) {
        // Navigate up to find the card container
        let parent = h3.parentElement
        while (parent && !parent.classList.contains('p-6')) {
          parent = parent.parentElement
        }
        if (parent) {
          // Find the section count text "X secciones asignadas"
          const match = parent.textContent?.match(/(\d+) secciones? asignadas?/)
          if (match) {
            return parseInt(match[1])
          }
        }
      }
    }
    return 0
  }, roleName)
}
