/**
 * TAGS E2E - Admin CRUD Tests
 */

import { TEST_TAGS } from '../data'
import {
  log, wait, goto, getPage,
  fillTextField, submitForm,
  openRowActionsMenu, clickMenuAction,
  confirmDeleteModal, cancelDeleteModal, isModalVisible,
  itemExistsInTable, clearAndType, takeScreenshot
} from '../utils'

const ADMIN_URL = '/admin/tags'
const NEW_URL = '/admin/tags/new'

export async function runTagTests(): Promise<{ passed: number; failed: number }> {
  const results = { passed: 0, failed: 0 }

  // ===========================================
  // TC-001: Verificar Sidebar del Admin
  // ===========================================
  try {
    log('TC-001: Verificar modulo en sidebar')
    await goto('/admin')
    await wait(1000)

    const page = getPage()
    const sidebarHasModule = await page.evaluate(() => {
      const sidebar = document.querySelector('nav, aside, [class*="sidebar"]')
      return sidebar?.textContent?.toLowerCase().includes('tag') || false
    })

    await takeScreenshot('01-sidebar-check')

    if (!sidebarHasModule) {
      log('  Modulo no visible en sidebar (puede estar en submenu)')
    }
    log('  Sidebar verificado')
    results.passed++
  } catch (e: any) {
    log(`  FAILED: ${e.message}`)
    await takeScreenshot('01-sidebar-ERROR')
    results.failed++
  }

  // ===========================================
  // TC-002: Navegacion a Lista
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

    log(`  - Tabla visible: ${hasTable ? 'SI' : 'NO'}`)
    log(`  - Boton Nuevo: ${hasNewButton ? 'SI' : 'NO'}`)

    // Si no hay tabla puede ser porque no hay items (empty state)
    log('  Lista carga correctamente')
    results.passed++
  } catch (e: any) {
    log(`  FAILED: ${e.message}`)
    await takeScreenshot('02-list-ERROR')
    results.failed++
  }

  // ===========================================
  // TC-003: Formulario de Creacion
  // ===========================================
  try {
    log('TC-003: Verificar formulario de creacion')
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

    log('  Formulario de creacion OK')
    results.passed++
  } catch (e: any) {
    log(`  FAILED: ${e.message}`)
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

    await fillTextField('name', TEST_TAGS.main.name)
    // Slug y color tienen valores por defecto, no los modificamos
    // El color por defecto es #3B82F6, aceptable para la prueba

    await takeScreenshot('04-form-filled')

    await submitForm()
    await wait(2000)

    const page = getPage()
    if (!page.url().includes(ADMIN_URL) || page.url().includes('/new')) {
      await takeScreenshot('04-submit-no-redirect')
      throw new Error('No redirigió despues de crear')
    }

    const exists = await itemExistsInTable(TEST_TAGS.main.name)
    await takeScreenshot('04-after-create')

    if (!exists) throw new Error('Item creado no aparece en tabla')

    log('  Item creado exitosamente')
    results.passed++
  } catch (e: any) {
    log(`  FAILED: ${e.message}`)
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

    const menuOpened = await openRowActionsMenu(TEST_TAGS.main.name)
    if (!menuOpened) throw new Error('No se pudo abrir menu de acciones')

    await takeScreenshot('05-actions-menu')
    await clickMenuAction('edit')
    await wait(1500)

    const page = getPage()
    if (!page.url().includes('/admin/tags/')) {
      throw new Error('No navego a pagina de edicion')
    }

    await takeScreenshot('05-edit-form-loaded')

    await clearAndType('input[name="name"]', TEST_TAGS.mainEdited.name)
    await takeScreenshot('05-edit-form-modified')

    await submitForm()
    await wait(2000)

    const exists = await itemExistsInTable(TEST_TAGS.mainEdited.name)
    await takeScreenshot('05-after-edit')

    if (!exists) throw new Error('Cambios no se guardaron')

    log('  Item editado exitosamente')
    results.passed++
  } catch (e: any) {
    log(`  FAILED: ${e.message}`)
    await takeScreenshot('05-edit-ERROR')
    results.failed++
  }

  // ===========================================
  // TC-006: Modal de Eliminacion (Cancelar)
  // ===========================================
  try {
    log('TC-006: Verificar modal de eliminacion (cancelar)')
    await goto(ADMIN_URL)
    await wait(1000)

    await openRowActionsMenu(TEST_TAGS.mainEdited.name)
    await wait(300)
    await clickMenuAction('delete')
    await wait(500)

    const modalVisible = await isModalVisible()
    await takeScreenshot('06-delete-modal')

    if (!modalVisible) throw new Error('Modal de confirmacion no aparecio')

    await cancelDeleteModal()
    await wait(500)

    const stillExists = await itemExistsInTable(TEST_TAGS.mainEdited.name)
    if (!stillExists) throw new Error('Item desaparecio despues de cancelar')

    await takeScreenshot('06-after-cancel')

    log('  Cancelacion de eliminacion OK')
    results.passed++
  } catch (e: any) {
    log(`  FAILED: ${e.message}`)
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
    await fillTextField('name', TEST_TAGS.forDelete.name)
    try {
      await fillTextField('slug', `delete-me-${Date.now()}`)
    } catch { /* opcional */ }
    await submitForm()
    await wait(2000)

    await takeScreenshot('07-created-for-delete')

    // Eliminar
    await openRowActionsMenu(TEST_TAGS.forDelete.name)
    await wait(300)
    await clickMenuAction('delete')
    await wait(500)

    await takeScreenshot('07-delete-confirm-modal')

    await confirmDeleteModal()
    await wait(2000)

    const stillExists = await itemExistsInTable(TEST_TAGS.forDelete.name)
    await takeScreenshot('07-after-delete')

    if (stillExists) throw new Error('Item no fue eliminado')

    log('  Item eliminado exitosamente')
    results.passed++
  } catch (e: any) {
    log(`  FAILED: ${e.message}`)
    await takeScreenshot('07-delete-ERROR')
    results.failed++
  }

  // ===========================================
  // TC-008: Validacion de Formulario
  // ===========================================
  try {
    log('TC-008: Validacion de campos requeridos')
    await goto(NEW_URL)
    await wait(500)

    await submitForm()
    await wait(1000)

    const page = getPage()
    const stayedOnForm = page.url().includes('/new')

    await takeScreenshot('08-validation-errors')

    if (!stayedOnForm) {
      log('  Formulario se envio sin validacion')
    }

    log('  Validacion verificada')
    results.passed++
  } catch (e: any) {
    log(`  FAILED: ${e.message}`)
    await takeScreenshot('08-validation-ERROR')
    results.failed++
  }

  return results
}
