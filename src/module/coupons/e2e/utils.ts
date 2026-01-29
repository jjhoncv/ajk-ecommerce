/**
 * E2E Test utilities for Coupons module
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
 * Fill coupon form fields
 * This handles the custom form used by CouponDetailAdmin
 */
export async function fillCouponForm(data: {
  name?: string
  code?: string
  description?: string
  discountType?: 'percentage' | 'fixed_amount'
  discountValue?: string
  startDate?: string
  endDate?: string
  minPurchaseAmount?: string
  maxDiscountAmount?: string
  usageLimit?: string
  usageLimitPerCustomer?: string
  isActive?: boolean
}): Promise<void> {
  const page = getPage()

  // Fill name
  if (data.name) {
    const nameInput = await page.$('input[placeholder*="Nombre"], input[placeholder*="nombre"], input[placeholder*="bienvenida"]')
    if (nameInput) {
      await nameInput.click({ clickCount: 3 })
      await nameInput.type(data.name)
    }
  }

  // Fill code
  if (data.code) {
    const codeInput = await page.$('input[placeholder*="BIENVENIDO"], input.font-mono')
    if (codeInput) {
      await codeInput.click({ clickCount: 3 })
      await codeInput.type(data.code)
    }
  }

  // Fill description
  if (data.description) {
    const descInput = await page.$('textarea')
    if (descInput) {
      await descInput.click({ clickCount: 3 })
      await descInput.type(data.description)
    }
  }

  // Select discount type
  if (data.discountType) {
    const selectValue = data.discountType === 'percentage' ? 'percentage' : 'fixed_amount'
    const selects = await page.$$('select')
    if (selects.length > 0) {
      await selects[0].select(selectValue)
    }
  }

  // Fill discount value
  if (data.discountValue) {
    const valueInputs = await page.$$('input[type="number"]')
    if (valueInputs.length > 0) {
      await valueInputs[0].click({ clickCount: 3 })
      await valueInputs[0].type(data.discountValue)
    }
  }

  // Fill dates using JavaScript with proper React event triggering
  if (data.startDate) {
    await page.evaluate((dateValue) => {
      const dateInputs = document.querySelectorAll('input[type="datetime-local"]')
      if (dateInputs.length > 0) {
        const input = dateInputs[0] as HTMLInputElement
        // Set value via native setter to trigger React's onChange
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(input, dateValue)
        }
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.dispatchEvent(new Event('change', { bubbles: true }))
      }
    }, data.startDate)
  }

  if (data.endDate) {
    await page.evaluate((dateValue) => {
      const dateInputs = document.querySelectorAll('input[type="datetime-local"]')
      if (dateInputs.length > 1) {
        const input = dateInputs[1] as HTMLInputElement
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(input, dateValue)
        }
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.dispatchEvent(new Event('change', { bubbles: true }))
      }
    }, data.endDate)
  }

  // Fill usage limits (these are in the sidebar)
  if (data.usageLimit) {
    const numberInputs = await page.$$('input[type="number"][placeholder="Sin límite"]')
    if (numberInputs.length > 0) {
      await numberInputs[0].click({ clickCount: 3 })
      await numberInputs[0].type(data.usageLimit)
    }
  }

  if (data.usageLimitPerCustomer) {
    const numberInputs = await page.$$('input[type="number"][placeholder="Sin límite"]')
    if (numberInputs.length > 1) {
      await numberInputs[1].click({ clickCount: 3 })
      await numberInputs[1].type(data.usageLimitPerCustomer)
    }
  }

  // Fill min purchase amount
  if (data.minPurchaseAmount) {
    const amountInputs = await page.$$('input[type="number"][placeholder="0.00"]')
    if (amountInputs.length > 0) {
      await amountInputs[0].click({ clickCount: 3 })
      await amountInputs[0].type(data.minPurchaseAmount)
    }
  }

  // Toggle active status
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
 * Click the "Crear cupón" or "Guardar cambios" button
 */
export async function submitCouponForm(): Promise<void> {
  const page = getPage()

  // Find button with Save icon or text "Crear" or "Guardar"
  const button = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    return buttons.find(btn =>
      btn.textContent?.includes('Crear cupón') ||
      btn.textContent?.includes('Guardar cambios') ||
      btn.querySelector('svg.lucide-save')
    )
  })

  if (button) {
    await (button as any).click()
  } else {
    throw new Error('No se encontró el botón de guardar')
  }
}

/**
 * Click generate code button
 */
export async function clickGenerateCode(): Promise<void> {
  const page = getPage()

  // Find the refresh/generate button next to code input
  const refreshBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    return buttons.find(btn => btn.querySelector('svg.lucide-refresh-cw'))
  })

  if (refreshBtn) {
    await (refreshBtn as any).click()
  }
}

/**
 * Get the generated code value
 */
export async function getCodeValue(): Promise<string> {
  const page = getPage()
  const codeInput = await page.$('input.font-mono')
  if (codeInput) {
    return await codeInput.evaluate((el: HTMLInputElement) => el.value)
  }
  return ''
}

/**
 * Check if coupon exists in the list by name
 */
export async function couponExistsInList(name: string): Promise<boolean> {
  const page = getPage()
  const pageText = await page.evaluate(() => document.body.innerText)
  return pageText.includes(name)
}
