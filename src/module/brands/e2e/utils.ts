/**
 * E2E Test utilities for Brands module
 * Re-exports shared utilities with module-specific overrides
 */

import fs from 'fs'
import path from 'path'
import { getPage } from '../../../../tests/e2e/utils'

// Module-specific paths
const MODULE_DIR = path.join(__dirname)
export const FIXTURES_DIR = path.join(MODULE_DIR, 'fixtures')
export const SCREENSHOTS_DIR = path.join(MODULE_DIR, 'screenshots')

// Test images for brands
export const TEST_IMAGES = {
  logo: path.join(FIXTURES_DIR, 'test-brand-logo-400x400.jpg')
}

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
 * Upload brand logo image
 * Uploads to /public/uploads/e2e/{date}/brands/
 */
export async function uploadBrandLogo(imagePath: string): Promise<boolean> {
  const { uploadImageToField, getTestDate } = await import('../../../../tests/e2e/utils')
  const uploadPath = `e2e/${getTestDate()}/brands`
  return uploadImageToField('Logo', imagePath, {
    filePattern: 'logo',
    uploadWaitTime: 3000,
    uploadPath
  })
}
