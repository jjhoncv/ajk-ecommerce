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
    log('TC-001: Navegacion al modulo tags')
    await goto(ADMIN_URL)
    await wait(2000)
    const page = getPage()
    const url = page.url()
    if (!url.includes('/admin/tags')) throw new Error(`URL incorrecta: ${url}`)
    log('  ✓ Navegacion correcta')
    await takeScreenshot('01-list-page')
    results.passed++
  } catch (e: unknown) {
    const error = e as Error
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('01-list-page-ERROR')
    results.failed++
  }

  // TC-002: Ir a formulario de creacion
  try {
    log('TC-002: Ir a formulario de creacion')
    await goto(NEW_URL)
    await wait(1000)
    const page = getPage()
    if (!page.url().includes('/new')) throw new Error('No navego a /new')
    log('  ✓ Formulario de creacion cargado')
    await takeScreenshot('02-new-form-empty')
    results.passed++
  } catch (e: unknown) {
    const error = e as Error
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('02-new-form-ERROR')
    results.failed++
  }

  // TC-003: Crear tag
  try {
    log('TC-003: Crear tag')
    await goto(NEW_URL)
    await wait(1000)

    // Llenar formulario
    await fillTextField('name', TEST_TAGS.main.name)
    await wait(300)

    // Llenar color
    const page = getPage()
    const colorInput = await page.$('input[name="color"]')
    if (colorInput) {
      await colorInput.click({ clickCount: 3 })
      await colorInput.type(TEST_TAGS.main.color)
    }
    await wait(300)

    await takeScreenshot('03-form-filled')

    // Enviar formulario
    await submitForm()
    await wait(2000)

    // Verificar que se creo
    const exists = await itemExistsInTable(TEST_TAGS.main.name)
    if (!exists) throw new Error('Tag no aparece en tabla despues de crear')

    log('  ✓ Tag creado correctamente')
    await takeScreenshot('03-tag-created')
    results.passed++
  } catch (e: unknown) {
    const error = e as Error
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('03-create-ERROR')
    results.failed++
  }

  // TC-004: Editar tag
  try {
    log('TC-004: Editar tag')
    await goto(ADMIN_URL)
    await wait(1500)

    // Abrir menu de acciones
    await openRowActionsMenu(TEST_TAGS.main.name)
    await wait(500)

    // Click en Editar
    await clickMenuAction('edit')
    await wait(1500)

    // Verificar que estamos en pagina de edicion
    const page = getPage()
    if (!page.url().includes('/admin/tags/')) {
      throw new Error('No navego a pagina de edicion')
    }

    await takeScreenshot('04-edit-form')

    // Editar nombre
    await clearAndType('input[name="name"]', TEST_TAGS.mainEdited.name)
    await wait(300)

    // Editar color
    const colorInput = await page.$('input[name="color"]')
    if (colorInput) {
      await colorInput.click({ clickCount: 3 })
      await colorInput.type(TEST_TAGS.mainEdited.color)
    }

    // Guardar
    await submitForm()
    await wait(2000)

    // Verificar que se edito
    const exists = await itemExistsInTable(TEST_TAGS.mainEdited.name)
    if (!exists) throw new Error('Nombre editado no aparece en tabla')

    log('  ✓ Tag editado correctamente')
    await takeScreenshot('04-tag-edited')
    results.passed++
  } catch (e: unknown) {
    const error = e as Error
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('04-edit-ERROR')
    results.failed++
  }

  // TC-005: Crear tag para eliminar
  try {
    log('TC-005: Crear tag para eliminar')
    await goto(NEW_URL)
    await wait(1000)

    await fillTextField('name', TEST_TAGS.forDelete.name)
    await wait(300)

    await submitForm()
    await wait(2000)

    const exists = await itemExistsInTable(TEST_TAGS.forDelete.name)
    if (!exists) throw new Error('Tag para eliminar no se creo')

    log('  ✓ Tag para eliminar creado')
    results.passed++
  } catch (e: unknown) {
    const error = e as Error
    log(`  ✗ FAILED: ${error.message}`)
    results.failed++
  }

  // TC-006: Eliminar tag
  try {
    log('TC-006: Eliminar tag')
    await goto(ADMIN_URL)
    await wait(2000)

    // Abrir menu
    await openRowActionsMenu(TEST_TAGS.forDelete.name)
    await wait(500)

    // Click en Eliminar
    await clickMenuAction('delete')
    await wait(1500)

    // Verificar modal
    const modalVisible = await isModalVisible()
    if (!modalVisible) throw new Error('Modal de confirmacion no aparecio')

    await takeScreenshot('06-delete-modal')

    // Confirmar eliminacion
    await confirmDeleteModal()

    // Esperar mas tiempo para que el refresh se complete
    await wait(4000)

    // Recargar la pagina para asegurar que vemos el estado actual
    await goto(ADMIN_URL)
    await wait(2000)

    // Verificar que se elimino
    const exists = await itemExistsInTable(TEST_TAGS.forDelete.name)
    if (exists) throw new Error('Tag no fue eliminado')

    log('  ✓ Tag eliminado correctamente')
    await takeScreenshot('06-tag-deleted')
    results.passed++
  } catch (e: unknown) {
    const error = e as Error
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('06-delete-ERROR')
    results.failed++
  }

  // TC-007: Cancelar eliminacion
  try {
    log('TC-007: Cancelar eliminacion')
    await goto(ADMIN_URL)
    await wait(1500)

    // Abrir menu del tag editado
    await openRowActionsMenu(TEST_TAGS.mainEdited.name)
    await wait(500)

    // Click en Eliminar
    await clickMenuAction('delete')
    await wait(1000)

    // Cancelar
    await cancelDeleteModal()
    await wait(1000)

    // Verificar que sigue existiendo
    const exists = await itemExistsInTable(TEST_TAGS.mainEdited.name)
    if (!exists) throw new Error('Tag desaparecio despues de cancelar')

    log('  ✓ Cancelacion de eliminacion funciono')
    await takeScreenshot('07-delete-cancelled')
    results.passed++
  } catch (e: unknown) {
    const error = e as Error
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('07-cancel-ERROR')
    results.failed++
  }

  // TC-008: Validacion de campo vacio
  try {
    log('TC-008: Validacion de campo vacio')
    await goto(NEW_URL)
    await wait(1000)

    // Intentar enviar sin llenar
    await submitForm()
    await wait(1000)

    // Verificar que hay error o seguimos en /new
    const page = getPage()
    const hasError = await hasValidationError('name')
    const stillOnNew = page.url().includes('/new')

    if (!hasError && !stillOnNew) {
      throw new Error('Formulario se envio sin validacion')
    }

    log('  ✓ Validacion de campo vacio funciono')
    await takeScreenshot('08-validation-error')
    results.passed++
  } catch (e: unknown) {
    const error = e as Error
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('08-validation-ERROR')
    results.failed++
  }

  return results
}
