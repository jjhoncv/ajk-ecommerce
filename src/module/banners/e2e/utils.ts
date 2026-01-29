/**
 * Banners E2E - Module Utilities
 *
 * Re-exports shared utilities and provides module-specific configuration.
 */

import path from 'path'

// Re-export all shared utilities
export {
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
  // Image upload
  uploadImageToField,
  fieldHasImage,
  // Module helpers
  log,
  wait,
  generateTestSuffix,
  navigateToAdmin,
  isOnPage,
  getCurrentUrl,
  hasToastMessage,
  waitForNavigation,
  createScreenshotHelper,
  createPathHelpers
} from '../../../../tests/e2e/utils'

// Module-specific configuration
const MODULE_DIR = path.join(__dirname)

export const FIXTURES_DIR = path.join(MODULE_DIR, 'fixtures')
export const SCREENSHOTS_DIR = path.join(MODULE_DIR, 'screenshots')

// Test images specific to banners
export const TEST_IMAGES = {
  banner: path.join(FIXTURES_DIR, 'test-banner-1400x400.jpg')
}

// Create module-specific screenshot function
import { createScreenshotHelper as createHelper, getPage } from '../../../../tests/e2e/utils'
import fs from 'fs'

export async function takeScreenshot(name: string, subFolder: string): Promise<string> {
  const page = getPage()
  const screenshotDir = path.join(SCREENSHOTS_DIR, subFolder)

  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true })
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `${name}_${timestamp}.png`
  const filepath = path.join(screenshotDir, filename)

  await page.screenshot({ path: filepath, fullPage: true })
  console.log(`  Screenshot: ${subFolder}/${filename}`)

  return filepath
}

/**
 * Upload banner image - wrapper around shared uploadImageToField
 * Uses 'banner' as file pattern to select the correct file from library
 * Uploads to /public/uploads/e2e/{date}/banners/
 */
export async function uploadBannerImage(imagePath: string): Promise<boolean> {
  const { uploadImageToField: upload, log, getTestDate } = await import('../../../../tests/e2e/utils')

  const uploadPath = `e2e/${getTestDate()}/banners`
  log(`  Uploading banner image to ${uploadPath}...`)

  return upload('Imagen', imagePath, {
    filePattern: 'banner',
    uploadWaitTime: 5000,
    selectionWaitTime: 1500,
    uploadPath
  })
}
