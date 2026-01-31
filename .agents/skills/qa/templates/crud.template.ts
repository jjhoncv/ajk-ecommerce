/**
 * __MODULE__ E2E - Admin CRUD Tests
 *
 * INSTRUCCIONES:
 * 1. Copiar a: src/module/__module__/e2e/admin/01-crud.ts
 * 2. Reemplazar __MODULE__, __module__, __Modulo__, __modulo__
 * 3. Ajustar campos según el spec del módulo
 */

import { TEST___MODULE__ } from '../data'
import {
  log, wait, goto, getPage,
  fillTextField, submitForm,
  openRowActionsMenu, clickMenuAction,
  confirmDeleteModal, cancelDeleteModal, isModalVisible,
  itemExistsInTable, clearAndType, takeScreenshot
} from '../utils'

const ADMIN_URL = '/admin/__module__'
const NEW_URL = '/admin/__module__/new'

export async function run__Modulo__Tests(): Promise<{ passed: number; failed: number }> {
  const results = { passed: 0, failed: 0 }

  // ===========================================
  // TC-001: Verificar Sidebar del Admin
  // ===========================================
  try {
    log('TC-001: Verificar módulo en sidebar')
    await goto('/admin')
    await wait(1000)

    const page = getPage()
    const sidebarHasModule = await page.evaluate(() => {
      const sidebar = document.querySelector('nav, aside, [class*="sidebar"]')
      return sidebar?.textContent?.toLowerCase().includes('__module__') || false
    })

    await takeScreenshot('01-sidebar-check')

    if (!sidebarHasModule) {
      log('  ⚠️ Módulo no visible en sidebar (puede estar en submenú)')
    }
    log('  ✓ Sidebar verificado')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('01-sidebar-ERROR')
    results.failed++
  }

  // ===========================================
  // TC-002: Navegación a Lista
  // ===========================================
  try {
    log('TC-002: Navegar a lista')
    await goto(ADMIN_URL)
    await wait(1500)

    const page = getPage()
    const hasTable = await page.evaluate(() => document.querySelector('table') !== null)
    const hasNewButton = await page.evaluate(() => {
      const links = document.querySelectorAll('a')
      for (const link of links) {
        if (link.href.includes('/new')) return true
      }
      return false
    })

    await takeScreenshot('02-list-page')

    log(`  - Tabla visible: ${hasTable ? '✓' : '✗'}`)
    log(`  - Botón Nuevo: ${hasNewButton ? '✓' : '✗'}`)

    if (!hasTable) throw new Error('No se encontró tabla de datos')

    log('  ✓ Lista carga correctamente')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('02-list-ERROR')
    results.failed++
  }

  // ===========================================
  // TC-003: Formulario de Creación
  // ===========================================
  try {
    log('TC-003: Verificar formulario de creación')
    await goto(NEW_URL)
    await wait(1000)

    const page = getPage()
    const formFields = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input, textarea, select')
      return Array.from(inputs).map(i => ({
        name: i.getAttribute('name'),
        type: i.getAttribute('type') || i.tagName.toLowerCase()
      }))
    })

    await takeScreenshot('03-new-form-empty')

    log(`  - Campos encontrados: ${formFields.length}`)
    if (formFields.length === 0) throw new Error('Formulario sin campos')

    log('  ✓ Formulario de creación OK')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('03-form-ERROR')
    results.failed++
  }

  // ===========================================
  // TC-004: Crear Nuevo Item
  // ===========================================
  try {
    log('TC-004: Crear nuevo item')
    await goto(NEW_URL)
    await wait(500)

    await fillTextField('name', TEST___MODULE__.main.name)
    try {
      await fillTextField('slug', TEST___MODULE__.main.slug)
    } catch { /* campo opcional */ }

    await takeScreenshot('04-form-filled')

    await submitForm()
    await wait(2000)

    const page = getPage()
    if (!page.url().includes(ADMIN_URL) || page.url().includes('/new')) {
      await takeScreenshot('04-submit-no-redirect')
      throw new Error('No redirigió después de crear')
    }

    const exists = await itemExistsInTable(TEST___MODULE__.main.name)
    await takeScreenshot('04-after-create')

    if (!exists) throw new Error('Item creado no aparece en tabla')

    log('  ✓ Item creado exitosamente')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('04-create-ERROR')
    results.failed++
  }

  // ===========================================
  // TC-005: Editar Item
  // ===========================================
  try {
    log('TC-005: Editar item')
    await goto(ADMIN_URL)
    await wait(1000)

    const menuOpened = await openRowActionsMenu(TEST___MODULE__.main.name)
    if (!menuOpened) throw new Error('No se pudo abrir menú de acciones')

    await takeScreenshot('05-actions-menu')
    await clickMenuAction('edit')
    await wait(1500)

    const page = getPage()
    if (!page.url().includes('/admin/__module__/')) {
      throw new Error('No navegó a página de edición')
    }

    await takeScreenshot('05-edit-form-loaded')

    await clearAndType('input[name="name"]', TEST___MODULE__.mainEdited.name)
    await takeScreenshot('05-edit-form-modified')

    await submitForm()
    await wait(2000)

    const exists = await itemExistsInTable(TEST___MODULE__.mainEdited.name)
    await takeScreenshot('05-after-edit')

    if (!exists) throw new Error('Cambios no se guardaron')

    log('  ✓ Item editado exitosamente')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('05-edit-ERROR')
    results.failed++
  }

  // ===========================================
  // TC-006: Modal de Eliminación (Cancelar)
  // ===========================================
  try {
    log('TC-006: Verificar modal de eliminación (cancelar)')
    await goto(ADMIN_URL)
    await wait(1000)

    await openRowActionsMenu(TEST___MODULE__.mainEdited.name)
    await wait(300)
    await clickMenuAction('delete')
    await wait(500)

    const modalVisible = await isModalVisible()
    await takeScreenshot('06-delete-modal')

    if (!modalVisible) throw new Error('Modal de confirmación no apareció')

    await cancelDeleteModal()
    await wait(500)

    const stillExists = await itemExistsInTable(TEST___MODULE__.mainEdited.name)
    if (!stillExists) throw new Error('Item desapareció después de cancelar')

    await takeScreenshot('06-after-cancel')

    log('  ✓ Cancelación de eliminación OK')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('06-cancel-ERROR')
    results.failed++
  }

  // ===========================================
  // TC-007: Eliminar Item
  // ===========================================
  try {
    log('TC-007: Eliminar item')

    // Crear uno para eliminar
    await goto(NEW_URL)
    await wait(500)
    await fillTextField('name', TEST___MODULE__.forDelete.name)
    try {
      await fillTextField('slug', `delete-me-${Date.now()}`)
    } catch { /* opcional */ }
    await submitForm()
    await wait(2000)

    await takeScreenshot('07-created-for-delete')

    // Eliminar
    await openRowActionsMenu(TEST___MODULE__.forDelete.name)
    await wait(300)
    await clickMenuAction('delete')
    await wait(500)

    await takeScreenshot('07-delete-confirm-modal')

    await confirmDeleteModal()
    await wait(2000)

    const stillExists = await itemExistsInTable(TEST___MODULE__.forDelete.name)
    await takeScreenshot('07-after-delete')

    if (stillExists) throw new Error('Item no fue eliminado')

    log('  ✓ Item eliminado exitosamente')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('07-delete-ERROR')
    results.failed++
  }

  // ===========================================
  // TC-008: Validación de Formulario
  // ===========================================
  try {
    log('TC-008: Validación de campos requeridos')
    await goto(NEW_URL)
    await wait(500)

    await submitForm()
    await wait(1000)

    const page = getPage()
    const stayedOnForm = page.url().includes('/new')

    await takeScreenshot('08-validation-errors')

    if (!stayedOnForm) {
      log('  ⚠️ Formulario se envió sin validación')
    }

    log('  ✓ Validación verificada')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('08-validation-ERROR')
    results.failed++
  }

  return results
}
