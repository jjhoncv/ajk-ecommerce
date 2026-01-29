/**
 * E2E Shared Utilities - Form Helpers
 *
 * Common functions for interacting with forms.
 * Reusable across all admin modules.
 *
 * Includes error handling with fix suggestions.
 */

import { getPage } from './browser'

/**
 * Wait helper
 */
function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Log with timestamp
 */
function log(message: string): void {
  const timestamp = new Date().toISOString().slice(11, 19)
  console.log(`[${timestamp}] ${message}`)
}

/**
 * Fill a text input field by name attribute
 */
export async function fillTextField(name: string, value: string): Promise<boolean> {
  const page = getPage()

  const input = await page.$(`input[name="${name}"]`)
  if (input) {
    await input.type(value)
    return true
  }

  // Error with suggestion
  log(`  ⚠️ ERROR: Campo input[name="${name}"] no encontrado`)
  log(`  💡 SUGERENCIA: Verifica que:`)
  log(`     1. El nombre del campo es correcto (revisa el schema Zod o el componente)`)
  log(`     2. El formulario está cargado completamente`)
  log(`     3. El campo no es un textarea (usa fillTextArea en ese caso)`)

  // Debug: list available inputs
  const availableInputs = await page.evaluate(() => {
    const inputs = document.querySelectorAll('input[name]')
    return Array.from(inputs).map(i => (i as HTMLInputElement).name).slice(0, 10)
  })
  if (availableInputs.length > 0) {
    log(`  📋 Inputs disponibles: ${JSON.stringify(availableInputs)}`)
  }

  return false
}

/**
 * Fill a textarea by name attribute
 */
export async function fillTextArea(name: string, value: string): Promise<boolean> {
  const page = getPage()

  const textarea = await page.$(`textarea[name="${name}"]`)
  if (textarea) {
    await textarea.type(value)
    return true
  }

  log(`  ⚠️ ERROR: Campo textarea[name="${name}"] no encontrado`)
  log(`  💡 SUGERENCIA: Verifica que:`)
  log(`     1. El nombre del campo es correcto`)
  log(`     2. El campo es un textarea y no un input`)

  return false
}

/**
 * Clear and fill a text input field
 */
export async function clearAndFillField(name: string, value: string): Promise<boolean> {
  const page = getPage()

  const input = await page.$(`input[name="${name}"]`)
  if (input) {
    await input.click({ clickCount: 3 }) // Select all
    await input.type(value)
    return true
  }

  log(`  ⚠️ ERROR: Campo input[name="${name}"] no encontrado para limpiar`)
  return false
}

/**
 * Clear and fill a textarea
 */
export async function clearAndFillTextArea(name: string, value: string): Promise<boolean> {
  const page = getPage()

  const textarea = await page.$(`textarea[name="${name}"]`)
  if (textarea) {
    await textarea.click({ clickCount: 3 }) // Select all
    await textarea.type(value)
    return true
  }

  log(`  ⚠️ ERROR: Campo textarea[name="${name}"] no encontrado para limpiar`)
  return false
}

/**
 * Submit the form by clicking the submit button
 */
export async function submitForm(): Promise<boolean> {
  const page = getPage()

  // Scroll to bottom to ensure submit button is visible
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await wait(300)

  const submitBtn = await page.$('button[type="submit"]')
  if (submitBtn) {
    await submitBtn.click()
    await wait(3000)
    return true
  }

  log(`  ⚠️ ERROR: Botón submit no encontrado`)
  log(`  💡 SUGERENCIA: Verifica que:`)
  log(`     1. Existe un <button type="submit"> en el formulario`)
  log(`     2. El botón no está deshabilitado o invisible`)
  log(`     3. No hay un dialog/modal bloqueando el botón`)

  // Debug: list visible buttons
  const buttons = await page.evaluate(() => {
    const btns = document.querySelectorAll('button')
    return Array.from(btns).map(b => ({
      type: b.type,
      text: b.textContent?.substring(0, 20),
      disabled: b.disabled
    })).slice(0, 5)
  })
  log(`  📋 Botones encontrados: ${JSON.stringify(buttons)}`)

  return false
}

/**
 * Get the value of an input field
 */
export async function getFieldValue(name: string): Promise<string> {
  const page = getPage()

  const value = await page.evaluate((fieldName: string) => {
    const input = document.querySelector(`input[name="${fieldName}"]`) as HTMLInputElement
    return input?.value || ''
  }, name)

  if (!value) {
    log(`  ℹ️ INFO: Campo "${name}" está vacío o no existe`)
  }

  return value
}

/**
 * Get the value of a textarea
 */
export async function getTextAreaValue(name: string): Promise<string> {
  const page = getPage()

  return page.evaluate((fieldName: string) => {
    const textarea = document.querySelector(`textarea[name="${fieldName}"]`) as HTMLTextAreaElement
    return textarea?.value || ''
  }, name)
}

/**
 * Check if a validation error is visible for a field
 */
export async function hasValidationError(fieldName?: string): Promise<boolean> {
  const page = getPage()

  return page.evaluate((name?: string) => {
    if (name) {
      // Look for error near specific field
      const field = document.querySelector(`input[name="${name}"], textarea[name="${name}"]`)
      if (field) {
        const parent = field.closest('.flex.flex-col') || field.parentElement
        if (parent) {
          const error = parent.querySelector('[class*="text-red"], [class*="error"]')
          return error !== null
        }
      }
    }

    // Look for any validation error on page
    const errors = document.querySelectorAll('[class*="text-red"], [class*="error"]')
    return errors.length > 0
  }, fieldName)
}

/**
 * Fill multiple fields at once
 */
export async function fillFormFields(fields: Record<string, string>): Promise<void> {
  for (const [name, value] of Object.entries(fields)) {
    const filled = await fillTextField(name, value)
    if (!filled) {
      await fillTextArea(name, value)
    }
  }
}

/**
 * Select an option from a select/dropdown by name and value
 */
export async function selectOption(name: string, value: string): Promise<boolean> {
  const page = getPage()

  const result = await page.evaluate(
    (selectName: string, optionValue: string) => {
      const select = document.querySelector(`select[name="${selectName}"]`) as HTMLSelectElement
      if (select) {
        // Check if value exists
        const option = Array.from(select.options).find(o => o.value === optionValue)
        if (!option) {
          return { success: false, reason: 'option_not_found', availableOptions: Array.from(select.options).map(o => o.value) }
        }
        select.value = optionValue
        select.dispatchEvent(new Event('change', { bubbles: true }))
        return { success: true }
      }
      return { success: false, reason: 'select_not_found' }
    },
    name,
    value
  )

  if (!result.success) {
    log(`  ⚠️ ERROR: No se pudo seleccionar "${value}" en select[name="${name}"]`)
    if (result.reason === 'select_not_found') {
      log(`  💡 SUGERENCIA: No existe un <select name="${name}">`)
    } else if (result.reason === 'option_not_found') {
      log(`  💡 SUGERENCIA: El valor "${value}" no existe en el select`)
      log(`  📋 Opciones disponibles: ${JSON.stringify(result.availableOptions)}`)
    }
    return false
  }

  return true
}

/**
 * Toggle a checkbox by name
 */
export async function toggleCheckbox(name: string): Promise<boolean> {
  const page = getPage()

  const checkbox = await page.$(`input[name="${name}"][type="checkbox"]`)
  if (checkbox) {
    await checkbox.click()
    return true
  }

  log(`  ⚠️ ERROR: Checkbox "${name}" no encontrado`)
  log(`  💡 SUGERENCIA: Verifica que existe input[name="${name}"][type="checkbox"]`)
  return false
}
