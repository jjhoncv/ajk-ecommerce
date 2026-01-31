/**
 * __MODULE__ E2E - Module Utilities
 *
 * INSTRUCCIONES:
 * 1. Copiar este archivo a: src/module/__module__/e2e/utils.ts
 * 2. Reemplazar __module__ con nombre en minúsculas
 */

import fs from 'fs'
import path from 'path'
import { getPage } from '../../../../tests/e2e/utils'

// Paths del módulo
const MODULE_DIR = path.join(__dirname)
export const FIXTURES_DIR = path.join(MODULE_DIR, 'fixtures')
export const SCREENSHOTS_DIR = path.join(MODULE_DIR, 'screenshots')

// Crear carpeta de screenshots si no existe
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
}

/**
 * Screenshot con path del módulo
 */
export async function takeScreenshot(name: string): Promise<string> {
  const p = getPage()
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `${name}_${timestamp}.png`
  const filepath = path.join(SCREENSHOTS_DIR, filename)
  await p.screenshot({ path: filepath, fullPage: true })
  console.log(`  📸 Screenshot: ${filename}`)
  return filepath
}

// Re-exportar utilidades compartidas
export {
  initBrowser, closeBrowser, getPage, goto, wait, log,
  waitAndClick, clearAndType, waitForText, login,
  // Table actions
  findRowByContent, openRowActionsMenu, clickMenuAction,
  confirmDeleteModal, cancelDeleteModal, isModalVisible, itemExistsInTable,
  // Form helpers
  fillTextField, fillTextArea, submitForm, hasValidationError,
  clearAndFillField, selectOption
} from '../../../../tests/e2e/utils'
