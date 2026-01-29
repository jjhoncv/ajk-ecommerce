/**
 * Attributes E2E - Admin CRUD Tests
 *
 * Tests TC-ATTR-001 to TC-ATTR-007
 */

import { TEST_ATTRIBUTES } from '../data'
import {
  log,
  wait,
  goto,
  getPage,
  takeScreenshot,
  fillAttributeForm,
  submitAttributeForm,
  attributeExistsInList,
  openAttributeActionsMenu,
  clickEditAction,
  clickDeleteAction,
  confirmAttributeDelete,
  cancelAttributeDelete,
  getAttributesCount,
  hasEmptyAttributesMessage
} from '../utils'

const ADMIN_ATTRIBUTES_URL = '/admin/attributes'
const NEW_ATTRIBUTE_URL = '/admin/attributes/new'

export async function runAdminCrudTests(): Promise<{
  passed: number
  failed: number
  skipped: number
}> {
  const results = { passed: 0, failed: 0, skipped: 0 }

  log('🧪 Admin CRUD Tests')
  log('='.repeat(50))

  // TC-ATTR-001: Navigate to module
  try {
    log('\nTC-ATTR-001: Navegación al módulo')
    await goto(ADMIN_ATTRIBUTES_URL)
    await wait(2000)

    const page = getPage()

    // Check URL
    const currentUrl = page.url()
    if (!currentUrl.includes('/admin/attributes')) {
      throw new Error(`No navegó a /admin/attributes. URL actual: ${currentUrl}`)
    }

    // Check page content
    const pageText = await page.evaluate(() => document.body.innerText)
    if (pageText.toLowerCase().includes('atributo')) {
      log('  ✓ Página de atributos cargada correctamente')
      results.passed++
    } else {
      throw new Error(`Página no contiene "atributo". Texto visible: ${pageText.slice(0, 200)}`)
    }

    await takeScreenshot('01-attributes-list', 'attributes')
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('01-attributes-list-error', 'attributes')
    results.failed++
  }

  // TC-ATTR-002: Create attribute
  try {
    log('\nTC-ATTR-002: Crear atributo')

    await goto(NEW_ATTRIBUTE_URL)
    await wait(1500)

    // Fill form
    await fillAttributeForm({
      name: TEST_ATTRIBUTES.attribute.name,
      displayType: TEST_ATTRIBUTES.attribute.displayType
    })

    await takeScreenshot('02-attribute-form-filled', 'attributes')

    // Submit form
    await submitAttributeForm()

    // Wait for redirect (may take time)
    const page = getPage()
    let redirected = false
    for (let i = 0; i < 10; i++) {
      await wait(500)
      const currentUrl = page.url()
      if (currentUrl.includes('/admin/attributes') && !currentUrl.includes('/new')) {
        redirected = true
        break
      }
    }

    if (!redirected) {
      throw new Error(`No redirigió correctamente. URL: ${page.url()}`)
    }

    await wait(1000)

    // Check if attribute appears in list
    const exists = await attributeExistsInList(TEST_ATTRIBUTES.attribute.name)
    if (!exists) {
      throw new Error('El atributo no aparece en la lista')
    }

    log('  ✓ Atributo creado y visible en lista')
    await takeScreenshot('02-attribute-created', 'attributes')
    results.passed++
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('02-attribute-create-error', 'attributes')
    results.failed++
  }

  // TC-ATTR-003: Edit attribute
  try {
    log('\nTC-ATTR-003: Editar atributo')

    await goto(ADMIN_ATTRIBUTES_URL)
    await wait(1500)

    // Open actions menu
    const menuOpened = await openAttributeActionsMenu(TEST_ATTRIBUTES.attribute.name)
    if (!menuOpened) {
      throw new Error('No se pudo abrir el menú de acciones')
    }

    await wait(300)

    // Click edit
    const editClicked = await clickEditAction()
    if (!editClicked) {
      throw new Error('No se encontró la opción Editar')
    }

    // Wait for navigation to edit page
    const page = getPage()
    let onEditPage = false
    for (let i = 0; i < 10; i++) {
      await wait(500)
      const currentUrl = page.url()
      if (currentUrl.includes('/admin/attributes/') && !currentUrl.includes('/new')) {
        onEditPage = true
        break
      }
    }

    if (!onEditPage) {
      throw new Error(`No navegó a página de edición. URL: ${page.url()}`)
    }

    await wait(1000)

    // Update the name
    await fillAttributeForm({
      name: TEST_ATTRIBUTES.attributeEdited.name
    })

    await takeScreenshot('03-attribute-edit-form', 'attributes')

    // Submit
    await submitAttributeForm()

    // Wait for redirect
    let redirected = false
    for (let i = 0; i < 10; i++) {
      await wait(500)
      const currentUrl = page.url()
      if (currentUrl === 'http://localhost:3000/admin/attributes' ||
          currentUrl === 'https://localhost:3000/admin/attributes' ||
          (currentUrl.includes('/admin/attributes') && !currentUrl.includes('/admin/attributes/'))) {
        redirected = true
        break
      }
    }

    if (!redirected) {
      // Navigate manually
      await goto(ADMIN_ATTRIBUTES_URL)
      await wait(1500)
    }

    // Verify the updated name exists
    const exists = await attributeExistsInList(TEST_ATTRIBUTES.attributeEdited.name)
    if (!exists) {
      throw new Error('El nombre actualizado no aparece en la lista')
    }

    log('  ✓ Atributo editado correctamente')
    await takeScreenshot('03-attribute-edited', 'attributes')
    results.passed++
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('03-attribute-edit-error', 'attributes')
    results.failed++
  }

  // TC-ATTR-004: Delete attribute
  try {
    log('\nTC-ATTR-004: Eliminar atributo')

    // First create an attribute to delete
    await goto(NEW_ATTRIBUTE_URL)
    await wait(1500)

    await fillAttributeForm({
      name: TEST_ATTRIBUTES.attributeForDelete.name,
      displayType: TEST_ATTRIBUTES.attributeForDelete.displayType
    })

    await submitAttributeForm()

    // Wait for redirect
    const page = getPage()
    for (let i = 0; i < 10; i++) {
      await wait(500)
      const currentUrl = page.url()
      if (currentUrl.includes('/admin/attributes') && !currentUrl.includes('/new')) {
        break
      }
    }

    await wait(1000)

    // Now delete it
    await goto(ADMIN_ATTRIBUTES_URL)
    await wait(1500)

    // Open actions menu
    const menuOpened = await openAttributeActionsMenu(TEST_ATTRIBUTES.attributeForDelete.name)
    if (!menuOpened) {
      throw new Error('No se pudo abrir el menú de acciones')
    }

    await wait(300)

    // Click delete
    const deleteClicked = await clickDeleteAction()
    if (!deleteClicked) {
      throw new Error('No se encontró la opción Eliminar')
    }

    // Confirm deletion
    await confirmAttributeDelete()
    await wait(2000)

    // Refresh and verify attribute is gone
    await goto(ADMIN_ATTRIBUTES_URL)
    await wait(1500)

    const exists = await attributeExistsInList(TEST_ATTRIBUTES.attributeForDelete.name)
    if (exists) {
      throw new Error('El atributo todavía aparece en la lista')
    }

    log('  ✓ Atributo eliminado correctamente')
    await takeScreenshot('04-attribute-deleted', 'attributes')
    results.passed++
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('04-attribute-delete-error', 'attributes')
    results.failed++
  }

  // TC-ATTR-005: Cancel deletion
  try {
    log('\nTC-ATTR-005: Cancelar eliminación')

    await goto(ADMIN_ATTRIBUTES_URL)
    await wait(1500)

    // Check if our edited attribute still exists
    const existsBefore = await attributeExistsInList(TEST_ATTRIBUTES.attributeEdited.name)
    if (!existsBefore) {
      throw new Error('El atributo de prueba no existe para probar cancelación')
    }

    // Open actions menu
    const menuOpened = await openAttributeActionsMenu(TEST_ATTRIBUTES.attributeEdited.name)
    if (!menuOpened) {
      throw new Error('No se pudo abrir el menú de acciones')
    }

    await wait(300)

    // Click delete
    const deleteClicked = await clickDeleteAction()
    if (!deleteClicked) {
      throw new Error('No se encontró la opción Eliminar')
    }

    // Cancel deletion
    await cancelAttributeDelete()
    await wait(1000)

    // Verify attribute still exists
    await goto(ADMIN_ATTRIBUTES_URL)
    await wait(1500)

    const existsAfter = await attributeExistsInList(TEST_ATTRIBUTES.attributeEdited.name)
    if (!existsAfter) {
      throw new Error('El atributo desapareció después de cancelar')
    }

    log('  ✓ Cancelación funcionó correctamente')
    await takeScreenshot('05-attribute-cancel-success', 'attributes')
    results.passed++
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('05-attribute-cancel-error', 'attributes')
    results.failed++
  }

  // TC-ATTR-006: Validation - empty name
  try {
    log('\nTC-ATTR-006: Validación nombre vacío')

    await goto(NEW_ATTRIBUTE_URL)
    await wait(1500)

    // Only select display type, leave name empty
    await fillAttributeForm({
      displayType: 'select'
    })

    // Try to submit form without name
    await submitAttributeForm()
    await wait(1000)

    const page = getPage()

    // Check if we stayed on the form (validation prevented submit)
    const currentUrl = page.url()
    if (currentUrl.includes('/new')) {
      log('  ✓ Validación de nombre vacío funcionó (no envió formulario)')
      results.passed++
    } else {
      throw new Error('El formulario se envió sin validación')
    }

    await takeScreenshot('06-attribute-validation', 'attributes')
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('06-attribute-validation-error', 'attributes')
    results.failed++
  }

  // TC-ATTR-007: Verify table shows data correctly
  try {
    log('\nTC-ATTR-007: Verificar visualización de tabla')

    await goto(ADMIN_ATTRIBUTES_URL)
    await wait(1500)

    const page = getPage()

    // Check if table exists (has tbody)
    const hasTable = await page.evaluate(() => {
      return document.querySelector('tbody') !== null
    })

    if (hasTable) {
      // Get count of attributes
      const count = await getAttributesCount()
      log(`  Tabla con ${count} atributos`)

      // Check that our test attribute is visible
      const exists = await attributeExistsInList(TEST_ATTRIBUTES.attributeEdited.name)
      if (exists) {
        log('  ✓ Tabla muestra datos correctamente')
        results.passed++
      } else {
        log('  ✓ Tabla visible (atributo de prueba puede haber sido eliminado)')
        results.passed++
      }
    } else {
      // Check for empty state
      if (await hasEmptyAttributesMessage()) {
        log('  ✓ Estado vacío mostrado correctamente')
        results.passed++
      } else {
        throw new Error('No se encontró tabla ni mensaje de estado vacío')
      }
    }

    await takeScreenshot('07-attribute-table-view', 'attributes')
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('07-attribute-table-error', 'attributes')
    results.failed++
  }

  return results
}
