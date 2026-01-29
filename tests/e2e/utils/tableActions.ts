/**
 * E2E Shared Utilities - Table Actions
 *
 * Common functions for interacting with DynamicTable component.
 * Reusable across all admin modules (categories, banners, products, etc.)
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
 * Error with suggestion for fixing
 */
interface ActionError {
  success: false
  error: string
  suggestion: string
  debug?: Record<string, unknown>
}

interface ActionSuccess {
  success: true
}

type ActionResult = ActionSuccess | ActionError

/**
 * Find a table row by its content (title/name)
 * Returns the row index within tbody or -1 if not found
 * Note: DynamicTable has both desktop (lg:block) and mobile (lg:hidden) views
 * We specifically target the desktop table's tbody to avoid index mismatches
 */
export async function findRowByContent(content: string): Promise<number> {
  const page = getPage()

  return page.evaluate((searchContent: string) => {
    // Target the desktop table specifically (inside the lg:block container)
    // DynamicTable structure: CardContent > div.hidden.lg:block > DragDropContext > table > tbody > tr
    const desktopTable = document.querySelector('.lg\\:block table tbody')
    if (!desktopTable) {
      // Fallback to any tbody
      const anyTbody = document.querySelector('tbody')
      if (!anyTbody) return -1
      const rows = Array.from(anyTbody.querySelectorAll('tr'))
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].textContent?.includes(searchContent)) {
          return i
        }
      }
      return -1
    }

    const rows = Array.from(desktopTable.querySelectorAll('tr'))
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].textContent?.includes(searchContent)) {
        return i
      }
    }
    return -1
  }, content)
}

/**
 * Open the actions menu (...) for a specific row by content
 * The DynamicTable uses a popup portal for actions
 */
export async function openRowActionsMenu(rowContent: string): Promise<boolean> {
  const page = getPage()

  // Close any existing popup by refreshing the page state
  // The popup component uses toggle, so we need to ensure clean state
  const currentUrl = page.url()
  if (currentUrl.includes('?')) {
    // Remove query params to close any alert modal
    await page.goto(currentUrl.split('?')[0])
    await wait(500)
  }

  // Press Escape to close any remaining popup
  await page.keyboard.press('Escape')
  await wait(200)

  const rowIndex = await findRowByContent(rowContent)
  if (rowIndex < 0) {
    log(`  ⚠️ ERROR: Row not found for "${rowContent}"`)
    log(`  💡 SUGERENCIA: Verifica que:`)
    log(`     1. El item existe en la tabla (¿se creó correctamente?)`)
    log(`     2. El nombre coincide exactamente (incluyendo sufijo -test-YYYYMMDD)`)
    log(`     3. Estás en la página correcta del admin`)

    // Debug: show available rows in desktop table
    const availableRows = await page.evaluate(() => {
      const desktopTable = document.querySelector('.lg\\:block table tbody')
      const tbody = desktopTable || document.querySelector('tbody')
      if (!tbody) return []
      const rows = tbody.querySelectorAll('tr')
      return Array.from(rows).map(r => r.textContent?.substring(0, 50) || '').slice(0, 5)
    })
    if (availableRows.length > 0) {
      log(`  📋 Rows disponibles: ${JSON.stringify(availableRows)}`)
    }

    return false
  }

  // Click the action button - target the desktop table's tbody specifically
  const clickResult = await page.evaluate((idx: number) => {
    // Target the desktop table specifically (inside the lg:block container)
    const desktopTable = document.querySelector('.lg\\:block table tbody')
    const tbody = desktopTable || document.querySelector('tbody')
    if (!tbody) return { clicked: false, reason: 'no_tbody' }

    const rows = tbody.querySelectorAll('tr')
    const row = rows[idx]
    if (!row) return { clicked: false, reason: 'row_not_found' }

    // Find the actions button (usually has an SVG icon or "...")
    const buttons = row.querySelectorAll('button')
    for (const btn of buttons) {
      if (btn.querySelector('svg') || btn.textContent?.includes('...') || btn.textContent?.trim() === '') {
        btn.click()
        return { clicked: true }
      }
    }
    return { clicked: false, reason: 'no_action_button' }
  }, rowIndex)

  if (!clickResult.clicked) {
    log(`  ⚠️ ERROR: No se encontró botón de acciones en la fila`)
    log(`  💡 SUGERENCIA: Verifica que:`)
    log(`     1. La tabla tiene columna de acciones`)
    log(`     2. El botón "..." existe en la fila`)
    log(`     3. DynamicTable está configurado con actions`)
    return false
  }

  // Wait for React state to update and popup to render
  await wait(600)

  return true
}

/**
 * Click an action from the dropdown menu
 * Actions: 'edit', 'delete', 'images' (gallery)
 *
 * The popup has class "w-48 rounded-lg border bg-white" and contains Edit/Delete links.
 */
export async function clickMenuAction(action: 'edit' | 'delete' | 'images'): Promise<boolean> {
  const page = getPage()

  const actionTexts: Record<string, string[]> = {
    edit: ['Edit', 'Editar'],
    delete: ['Delete Entry', 'Delete', 'Eliminar'],
    images: ['Images', 'Imágenes', 'Gallery', 'Galería']
  }

  const searchTexts = actionTexts[action] || []

  const result = await page.evaluate((texts: string[]) => {
    // Find the popup by ID
    const popup = document.getElementById('popup-table-menu')

    if (!popup) {
      return { clicked: false, reason: 'popup_not_found' }
    }

    // Search within the popup for the action
    const elements = popup.querySelectorAll('a, div')
    for (const el of elements) {
      const text = el.textContent?.trim() || ''
      for (const searchText of texts) {
        if (text === searchText || text.toLowerCase() === searchText.toLowerCase()) {
          (el as HTMLElement).click()
          return { clicked: true }
        }
      }
    }

    return { clicked: false, reason: 'action_not_found' }
  }, searchTexts)

  if (!result.clicked) {
    log(`  ⚠️ ERROR: Acción "${action}" no encontrada`)
    return false
  }

  await wait(500)
  return true
}

/**
 * Confirm the delete action in the Alert modal
 * The modal has "Cancelar" and "Eliminar" buttons
 */
export async function confirmDeleteModal(): Promise<boolean> {
  const page = getPage()

  await wait(500)

  const result = await page.evaluate(() => {
    // Find the Alert modal - it has a centered fixed div with bg-white and shadow-xl
    // Alert structure: outer div > backdrop (fixed inset-0 bg-black/30) + modal (fixed centered bg-white shadow-xl)
    const allFixedDivs = document.querySelectorAll('div.fixed')
    let modal: Element | null = null

    for (const div of allFixedDivs) {
      const classList = div.className
      // Alert modal has: left-1/2 top-1/2, bg-white, shadow-xl, rounded-lg
      if (classList.includes('bg-white') && classList.includes('shadow-xl')) {
        modal = div
        break
      }
    }

    // Fallback to standard selectors
    if (!modal) {
      modal = document.querySelector('[role="dialog"], [class*="modal"], [class*="AlertDialog"]')
    }

    if (modal) {
      const buttons = modal.querySelectorAll('button')
      const buttonTexts: string[] = []

      for (const btn of buttons) {
        const text = btn.textContent?.toLowerCase() || ''
        buttonTexts.push(text)

        // Look for confirm button (not cancel)
        if ((text.includes('eliminar') || text.includes('delete') ||
             text.includes('confirmar') || text.includes('sí') || text.includes('aceptar')) &&
            !text.includes('cancel')) {
          btn.click()
          return { confirmed: true }
        }
      }
      return { confirmed: false, reason: 'no_confirm_button', buttonTexts, hasModal: true }
    }

    // Fallback: look for any red/destructive button
    const allButtons = document.querySelectorAll('button')
    for (const btn of allButtons) {
      const text = btn.textContent?.toLowerCase() || ''
      const hasDestructiveStyle = btn.classList.contains('bg-red-500') ||
                                  btn.classList.contains('bg-red-600') ||
                                  btn.classList.contains('destructive')
      if (hasDestructiveStyle && (text.includes('eliminar') || text.includes('delete'))) {
        btn.click()
        return { confirmed: true }
      }
    }

    return { confirmed: false, reason: 'no_modal', hasModal: false }
  })

  if (!result.confirmed) {
    log(`  ⚠️ ERROR: No se pudo confirmar la eliminación`)
    if (!result.hasModal) {
      log(`  💡 SUGERENCIA: El modal no está visible. Verifica que:`)
      log(`     1. Ejecutaste clickMenuAction('delete') antes`)
      log(`     2. El modal de confirmación se abrió correctamente`)
      log(`     3. Hay suficiente tiempo de espera después de clickMenuAction`)
    } else {
      log(`  💡 SUGERENCIA: Modal visible pero botón no encontrado:`)
      log(`     1. Botones encontrados: ${JSON.stringify(result.buttonTexts)}`)
      log(`     2. Busca botón con texto: "Eliminar", "Delete", "Confirmar"`)
    }
    return false
  }

  await wait(2000)
  return true
}

/**
 * Cancel the delete action in the Alert modal
 */
export async function cancelDeleteModal(): Promise<boolean> {
  const page = getPage()

  const cancelled = await page.evaluate(() => {
    // Find the Alert modal first
    const allFixedDivs = document.querySelectorAll('div.fixed')
    let modal: Element | null = null

    for (const div of allFixedDivs) {
      const classList = div.className
      if (classList.includes('bg-white') && classList.includes('shadow-xl')) {
        modal = div
        break
      }
    }

    // Look for cancel button in modal
    if (modal) {
      const buttons = modal.querySelectorAll('button')
      for (const btn of buttons) {
        const text = btn.textContent?.toLowerCase() || ''
        if (text.includes('cancelar') || text.includes('cancel') || text.includes('no')) {
          btn.click()
          return true
        }
      }
    }

    // Fallback: search all buttons
    const allButtons = document.querySelectorAll('button')
    for (const btn of allButtons) {
      const text = btn.textContent?.toLowerCase() || ''
      if (text.includes('cancelar') || text.includes('cancel')) {
        btn.click()
        return true
      }
    }
    return false
  })

  if (!cancelled) {
    log(`  ⚠️ ERROR: No se encontró botón de cancelar`)
    log(`  💡 SUGERENCIA: Verifica que el modal está abierto`)
  }

  if (cancelled) {
    await wait(500)
  }

  return cancelled
}

/**
 * Check if a confirmation modal is visible
 */
export async function isModalVisible(): Promise<boolean> {
  const page = getPage()

  return page.evaluate(() => {
    // Find the Alert modal - it has a centered fixed div with bg-white and shadow-xl
    const allFixedDivs = document.querySelectorAll('div.fixed')

    for (const div of allFixedDivs) {
      const classList = div.className
      if (classList.includes('bg-white') && classList.includes('shadow-xl')) {
        return true
      }
    }

    // Fallback to standard selectors
    const modal = document.querySelector('[role="dialog"], [class*="modal"], [class*="AlertDialog"]')
    return modal !== null
  })
}

/**
 * Get the count of rows in the table (excluding header)
 */
export async function getTableRowCount(): Promise<number> {
  const page = getPage()

  const count = await page.evaluate(() => {
    // Target the desktop table specifically
    const desktopTable = document.querySelector('.lg\\:block table tbody')
    const tbody = desktopTable || document.querySelector('tbody')
    if (!tbody) return 0
    return tbody.querySelectorAll('tr').length
  })

  if (count === 0) {
    log(`  ℹ️ INFO: La tabla está vacía`)
  }

  return count
}

/**
 * Check if an item exists in the table by content
 */
export async function itemExistsInTable(content: string): Promise<boolean> {
  const page = getPage()

  return page.evaluate((searchContent: string) => {
    return document.body.textContent?.includes(searchContent) || false
  }, content)
}
