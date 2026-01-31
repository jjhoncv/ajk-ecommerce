/**
 * Tags E2E - Admin CRUD Tests
 */

import { TEST_TAGS } from '../data'
import {
  log,
  wait,
  goto,
  getPage,
  fillTextField,
  submitForm,
  hasValidationError,
  openRowActionsMenu,
  clickMenuAction,
  confirmDeleteModal,
  cancelDeleteModal,
  isModalVisible,
  itemExistsInTable,
  clearAndType,
  takeScreenshot
} from '../utils'

const ADMIN_URL = '/admin/tags'
const NEW_URL = '/admin/tags/new'

export async function runTagsTests(): Promise<{
  passed: number
  failed: number
}> {
  const results = { passed: 0, failed: 0 }

  // TC-001: Navegacion al modulo
  try {
    log('TC-001: Navegacion al modulo')
    await goto(ADMIN_URL)
    await wait(2000)
    const page = getPage()
    if (!page.url().includes('/admin/tags')) throw new Error('URL incorrecta')
    log('  ✓ Navegacion correcta')
    await takeScreenshot('01-list')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('01-list-ERROR')
    results.failed++
  }

  // TC-002: Crear tag
  try {
    log('TC-002: Crear tag')
    await goto(NEW_URL)
    await wait(1000)
    await takeScreenshot('02-new-form-empty')

    await fillTextField('name', TEST_TAGS.main.name)
    // Color field has default value, need to clear first
    await clearAndType('input[name="color"]', TEST_TAGS.main.color)

    await takeScreenshot('02-new-form-filled')
    await submitForm()
    await wait(2000)

    // Verificar que aparece en la lista
    await goto(ADMIN_URL)
    await wait(1500)
    const exists = await itemExistsInTable(TEST_TAGS.main.name)
    if (!exists) throw new Error('Tag no aparece en tabla')
    log('  ✓ Tag creado correctamente')
    await takeScreenshot('02-created-success')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('02-create-ERROR')
    results.failed++
  }

  // TC-003: Editar tag
  try {
    log('TC-003: Editar tag')
    await goto(ADMIN_URL)
    await wait(1000)
    await openRowActionsMenu(TEST_TAGS.main.name)
    await wait(500)
    await clickMenuAction('edit')
    await wait(1500)

    await takeScreenshot('03-edit-form')
    await clearAndType('input[name="name"]', TEST_TAGS.mainEdited.name)
    await clearAndType('input[name="color"]', TEST_TAGS.mainEdited.color)

    await takeScreenshot('03-edit-form-filled')
    await submitForm()
    await wait(2000)

    // Verificar que aparece el nombre editado
    await goto(ADMIN_URL)
    await wait(1500)
    const exists = await itemExistsInTable(TEST_TAGS.mainEdited.name)
    if (!exists) throw new Error('Nombre editado no aparece')
    log('  ✓ Tag editado correctamente')
    await takeScreenshot('03-edited-success')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('03-edit-ERROR')
    results.failed++
  }

  // TC-004: Eliminar tag
  try {
    log('TC-004: Eliminar tag')
    // Crear uno para eliminar
    await goto(NEW_URL)
    await wait(1000)
    await fillTextField('name', TEST_TAGS.forDelete.name)
    // Color field has default value, need to clear first
    await clearAndType('input[name="color"]', TEST_TAGS.forDelete.color)
    await submitForm()
    await wait(2000)

    // Ir a la lista
    await goto(ADMIN_URL)
    await wait(1500)

    // Eliminar
    await openRowActionsMenu(TEST_TAGS.forDelete.name)
    await wait(500)
    await clickMenuAction('delete')
    await wait(1000)

    await takeScreenshot('04-delete-modal')
    if (!(await isModalVisible())) throw new Error('Modal no aparecio')

    await confirmDeleteModal()
    await wait(3000) // Wait longer for delete to complete and table to refresh

    // Force page refresh to ensure table is updated
    await goto(ADMIN_URL)
    await wait(1500)

    const exists = await itemExistsInTable(TEST_TAGS.forDelete.name)
    if (exists) throw new Error('Tag no fue eliminado')
    log('  ✓ Tag eliminado correctamente')
    await takeScreenshot('04-deleted-success')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('04-delete-ERROR')
    results.failed++
  }

  // TC-005: Cancelar eliminacion
  try {
    log('TC-005: Cancelar eliminacion')
    await goto(ADMIN_URL)
    await wait(1500)
    await openRowActionsMenu(TEST_TAGS.mainEdited.name)
    await wait(500)
    await clickMenuAction('delete')
    await wait(1000)

    await takeScreenshot('05-cancel-modal')
    await cancelDeleteModal()
    await wait(1000)

    const exists = await itemExistsInTable(TEST_TAGS.mainEdited.name)
    if (!exists) throw new Error('Tag desaparecio despues de cancelar')
    log('  ✓ Cancelacion funciono')
    await takeScreenshot('05-cancel-success')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('05-cancel-ERROR')
    results.failed++
  }

  // TC-006: Validacion campo vacio
  try {
    log('TC-006: Validacion campo vacio')
    await goto(NEW_URL)
    await wait(1000)
    await submitForm()
    await wait(1000)

    const hasError = await hasValidationError('name')
    const page = getPage()
    await takeScreenshot('06-validation')

    if (!hasError && !page.url().includes('/new')) {
      throw new Error('Form se envio sin validacion')
    }
    log('  ✓ Validacion funciono')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('06-validation-ERROR')
    results.failed++
  }

  return results
}
