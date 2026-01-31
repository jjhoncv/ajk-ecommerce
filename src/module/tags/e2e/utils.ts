/**
 * Tags E2E - Module Utilities
 */

import fs from 'fs'
import path from 'path'
import { getPage } from '../../../../tests/e2e/utils'

// Paths del modulo
const MODULE_DIR = path.join(__dirname)
export const SCREENSHOTS_DIR = path.join(MODULE_DIR, 'screenshots')

// Crear carpeta de screenshots si no existe
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
}

/**
 * Screenshot con path del modulo
 */
export async function takeScreenshot(
  name: string,
  _subFolder?: string
): Promise<string> {
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
  initBrowser,
  closeBrowser,
  getPage,
  goto,
  wait,
  log,
  waitAndClick,
  clearAndType,
  waitForText,
  // Table actions
  findRowByContent,
  openRowActionsMenu,
  clickMenuAction,
  confirmDeleteModal,
  cancelDeleteModal,
  isModalVisible,
  itemExistsInTable,
  // Form helpers
  fillTextField,
  fillTextArea,
  submitForm,
  hasValidationError,
  clearAndFillField,
  selectOption
} from '../../../../tests/e2e/utils'
