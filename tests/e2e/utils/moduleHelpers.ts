/**
 * E2E Shared Utilities - Module Helpers
 *
 * Factory functions to create module-specific utilities.
 * Each module can use these to get configured helpers for screenshots, paths, etc.
 */

import path from 'path'
import fs from 'fs'
import { getPage } from './browser'

export interface ModuleConfig {
  /** Module name (e.g., 'banners', 'categories') */
  name: string
  /** Base directory of the module's e2e tests */
  baseDir: string
}

/**
 * Create a screenshot function configured for a specific module
 */
export function createScreenshotHelper(config: ModuleConfig) {
  const screenshotsDir = path.join(config.baseDir, 'screenshots')

  return async function takeScreenshot(name: string, subFolder: string): Promise<string> {
    const page = getPage()
    const screenshotDir = path.join(screenshotsDir, subFolder)

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
}

/**
 * Create path helpers configured for a specific module
 */
export function createPathHelpers(config: ModuleConfig) {
  return {
    fixturesDir: path.join(config.baseDir, 'fixtures'),
    screenshotsDir: path.join(config.baseDir, 'screenshots'),
    getFixturePath: (filename: string) => path.join(config.baseDir, 'fixtures', filename)
  }
}

/**
 * Log with timestamp
 */
export function log(message: string): void {
  const timestamp = new Date().toISOString().slice(11, 19)
  console.log(`[${timestamp}] ${message}`)
}

/**
 * Wait helper
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Generate a unique test suffix based on current timestamp
 * Format: -test-YYYYMMDD-HHMMSS
 */
export function generateTestSuffix(): string {
  const now = new Date()
  return `-test-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
}

/**
 * Navigate to an admin page and wait for it to load
 */
export async function navigateToAdmin(path: string): Promise<void> {
  const page = getPage()
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'

  await page.goto(`${baseUrl}${path}`)
  await wait(2000)
}

/**
 * Check if current URL matches expected path
 */
export async function isOnPage(expectedPath: string): Promise<boolean> {
  const page = getPage()
  const url = page.url()
  return url.includes(expectedPath)
}

/**
 * Get current URL
 */
export async function getCurrentUrl(): Promise<string> {
  const page = getPage()
  return page.url()
}

/**
 * Check if a toast/notification with specific text is visible
 */
export async function hasToastMessage(text: string): Promise<boolean> {
  const page = getPage()

  return page.evaluate((searchText: string) => {
    const toasts = document.querySelectorAll(
      '[class*="toast"], [class*="Toastify"], [role="alert"], [class*="notification"]'
    )
    for (const toast of toasts) {
      if (toast.textContent?.toLowerCase().includes(searchText.toLowerCase())) {
        return true
      }
    }
    return false
  }, text)
}

/**
 * Wait for page to navigate away from current URL
 */
export async function waitForNavigation(timeout = 5000): Promise<boolean> {
  const page = getPage()
  const originalUrl = page.url()

  const startTime = Date.now()
  while (Date.now() - startTime < timeout) {
    await wait(100)
    if (page.url() !== originalUrl) {
      return true
    }
  }
  return false
}
