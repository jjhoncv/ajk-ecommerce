/**
 * E2E Test utilities for Categories module
 * Re-exports shared utilities with category-specific functions
 */

import path from 'path'
import fs from 'fs'

// Re-export all shared utilities
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

import { getPage } from '../../../../tests/e2e/utils'

// Module-specific paths
const MODULE_DIR = path.join(__dirname)
export const FIXTURES_DIR = path.join(MODULE_DIR, 'fixtures')
export const SCREENSHOTS_DIR = path.join(MODULE_DIR, 'screenshots')

// Test images for categories
export const TEST_IMAGES = {
  category: path.join(FIXTURES_DIR, 'test-category-400x400.jpg'),
  bannerDesktop: path.join(FIXTURES_DIR, 'test-banner-desktop-1400x400.jpg'),
  bannerMobile: path.join(FIXTURES_DIR, 'test-banner-mobile-700x350.jpg')
}

/**
 * Take screenshot with module-specific path
 */
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
 * Upload category image using shared upload utility
 * Wrapper that specifies category-specific options
 * Uploads to /public/uploads/e2e/{date}/categories/
 */
export async function uploadCategoryImage(imagePath: string): Promise<boolean> {
  const { uploadImageToField, getTestDate } = await import('../../../../tests/e2e/utils')
  const uploadPath = `e2e/${getTestDate()}/categories`
  return uploadImageToField('Imagen de la categoría', imagePath, {
    filePattern: 'category',
    uploadWaitTime: 3000,
    uploadPath
  })
}

/**
 * Upload banner desktop image
 * Uploads to /public/uploads/e2e/{date}/categories/
 */
export async function uploadBannerDesktop(imagePath: string): Promise<boolean> {
  const { uploadImageToField, getTestDate } = await import('../../../../tests/e2e/utils')
  const uploadPath = `e2e/${getTestDate()}/categories`
  return uploadImageToField('Banner Desktop', imagePath, {
    filePattern: 'desktop',
    uploadWaitTime: 3000,
    uploadPath
  })
}

/**
 * Upload banner mobile image
 * Uploads to /public/uploads/e2e/{date}/categories/
 */
export async function uploadBannerMobile(imagePath: string): Promise<boolean> {
  const { uploadImageToField, getTestDate } = await import('../../../../tests/e2e/utils')
  const uploadPath = `e2e/${getTestDate()}/categories`
  return uploadImageToField('Banner Móvil', imagePath, {
    filePattern: 'mobile',
    uploadWaitTime: 3000,
    uploadPath
  })
}
