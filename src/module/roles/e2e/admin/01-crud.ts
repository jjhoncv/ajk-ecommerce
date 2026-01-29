/**
 * Roles E2E - Admin CRUD Tests
 *
 * Tests TC-ROLE-001 to TC-ROLE-007
 * Note: Roles are displayed in cards, not a table
 * System roles (id <= 2) cannot be deleted
 */

import { TEST_ROLES } from '../data'
import {
  log,
  wait,
  goto,
  getPage,
  takeScreenshot,
  fillRoleForm,
  submitRoleForm,
  roleExistsInList,
  clickRoleEditButton,
  clickRoleDeleteButton,
  clickRoleDeleteButtonAndCancel,
  getRoleSectionCount
} from '../utils'

const ADMIN_ROLES_URL = '/admin/roles'
const NEW_ROLE_URL = '/admin/roles/new'

export async function runAdminCrudTests(): Promise<{
  passed: number
  failed: number
  skipped: number
}> {
  const results = { passed: 0, failed: 0, skipped: 0 }

  log('🧪 Admin CRUD Tests')
  log('='.repeat(50))

  // TC-ROLE-001: Navigate to module
  try {
    log('\nTC-ROLE-001: Navegación al módulo')
    await goto(ADMIN_ROLES_URL)
    await wait(2000)

    const page = getPage()

    // Check URL
    const currentUrl = page.url()
    if (!currentUrl.includes('/admin/roles')) {
      throw new Error(`No navegó a /admin/roles. URL actual: ${currentUrl}`)
    }

    // Check page content
    const pageText = await page.evaluate(() => document.body.innerText)
    if (pageText.toLowerCase().includes('roles') || pageText.toLowerCase().includes('rol')) {
      log('  ✓ Página de roles cargada correctamente')
      results.passed++
    } else {
      throw new Error(`Página no contiene "roles". Texto visible: ${pageText.slice(0, 200)}`)
    }

    await takeScreenshot('01-role-list', 'roles')
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('01-role-list-error', 'roles')
    results.failed++
  }

  // TC-ROLE-002: Create role
  try {
    log('\nTC-ROLE-002: Crear rol')

    await goto(NEW_ROLE_URL)
    await wait(1500) // Wait for sections to load

    // Fill form with name and select some sections
    await fillRoleForm({
      name: TEST_ROLES.role.name,
      selectAllSections: false,
      toggleSectionByName: ['Productos', 'Categorías', 'Marcas'] // Select catalog sections
    })

    await takeScreenshot('02-role-form-filled', 'roles')

    // Submit form
    await submitRoleForm()
    await wait(2000)

    // Verify redirect to list
    const page = getPage()
    const currentUrl = page.url()

    if (currentUrl.includes('/admin/roles') && !currentUrl.includes('/new')) {
      // Check if role appears in list
      const exists = await roleExistsInList(TEST_ROLES.role.name)
      if (!exists) {
        throw new Error('El rol no aparece en la lista')
      }

      log('  ✓ Rol creado y visible en lista')
      await takeScreenshot('02-role-created', 'roles')
      results.passed++
    } else {
      throw new Error(`No redirigió correctamente. URL: ${currentUrl}`)
    }
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('02-role-create-error', 'roles')
    results.failed++
  }

  // TC-ROLE-003: Edit role
  try {
    log('\nTC-ROLE-003: Editar rol')

    await goto(ADMIN_ROLES_URL)
    await wait(1500)

    // Click edit button on our role card
    const editClicked = await clickRoleEditButton(TEST_ROLES.role.name)
    if (!editClicked) {
      throw new Error('No se encontró el botón de editar')
    }

    // Wait for navigation to edit page
    const page = getPage()
    let onEditPage = false
    for (let i = 0; i < 10; i++) {
      await wait(500)
      const currentUrl = page.url()
      if (currentUrl.includes('/admin/roles/') && !currentUrl.includes('/new') && currentUrl !== 'http://localhost:3000/admin/roles') {
        onEditPage = true
        break
      }
    }

    if (!onEditPage) {
      throw new Error(`No navegó a página de edición. URL: ${page.url()}`)
    }

    // Update the name
    await fillRoleForm({
      name: TEST_ROLES.roleEdited.name
    })

    await takeScreenshot('03-role-edit-form', 'roles')

    // Submit
    await submitRoleForm()
    await wait(2000)

    // Navigate to list and verify
    await goto(ADMIN_ROLES_URL)
    await wait(1500)

    const exists = await roleExistsInList(TEST_ROLES.roleEdited.name)
    if (!exists) {
      throw new Error('El nombre actualizado no aparece en la lista')
    }

    log('  ✓ Rol editado correctamente')
    await takeScreenshot('03-role-edited', 'roles')
    results.passed++
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('03-role-edit-error', 'roles')
    results.failed++
  }

  // TC-ROLE-004: Delete role
  try {
    log('\nTC-ROLE-004: Eliminar rol')

    // First create a role to delete
    await goto(NEW_ROLE_URL)
    await wait(1500)

    await fillRoleForm({
      name: TEST_ROLES.roleForDelete.name,
      toggleSectionByName: ['Banners']
    })

    await submitRoleForm()
    await wait(2000)

    // Go to list
    await goto(ADMIN_ROLES_URL)
    await wait(1500)

    // Click delete button (will auto-accept confirm dialog)
    const deleteClicked = await clickRoleDeleteButton(TEST_ROLES.roleForDelete.name)
    if (!deleteClicked) {
      throw new Error('No se encontró el botón de eliminar')
    }

    await wait(2000)

    // Refresh and verify role is gone
    await goto(ADMIN_ROLES_URL)
    await wait(1500)

    const exists = await roleExistsInList(TEST_ROLES.roleForDelete.name)
    if (exists) {
      throw new Error('El rol todavía aparece en la lista')
    }

    log('  ✓ Rol eliminado correctamente')
    await takeScreenshot('04-role-deleted', 'roles')
    results.passed++
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('04-role-delete-error', 'roles')
    results.failed++
  }

  // TC-ROLE-005: Cancel deletion
  try {
    log('\nTC-ROLE-005: Cancelar eliminación')

    await goto(ADMIN_ROLES_URL)
    await wait(1500)

    // Click delete button but cancel (will dismiss confirm dialog)
    const deleteClicked = await clickRoleDeleteButtonAndCancel(TEST_ROLES.roleEdited.name)
    if (!deleteClicked) {
      throw new Error('No se encontró el botón de eliminar')
    }

    await wait(1000)

    // Verify role still exists
    const exists = await roleExistsInList(TEST_ROLES.roleEdited.name)
    if (!exists) {
      throw new Error('El rol desapareció después de cancelar')
    }

    log('  ✓ Cancelación funcionó correctamente')
    await takeScreenshot('05-role-cancel-success', 'roles')
    results.passed++
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('05-role-cancel-error', 'roles')
    results.failed++
  }

  // TC-ROLE-006: Validation - empty name
  try {
    log('\nTC-ROLE-006: Validación nombre vacío')

    await goto(NEW_ROLE_URL)
    await wait(1500)

    // Try to submit form without name
    await submitRoleForm()
    await wait(1000)

    const page = getPage()

    // Check if we stayed on the form (validation prevented submit)
    const currentUrl = page.url()
    if (currentUrl.includes('/new')) {
      // Check for error message
      const hasError = await page.evaluate(() => {
        return document.body.innerText.includes('requerido') ||
          document.body.innerText.includes('nombre') ||
          document.body.innerText.includes('Error')
      })

      if (hasError) {
        log('  ✓ Validación de nombre vacío funcionó (mostró error)')
      } else {
        log('  ✓ Validación de nombre vacío funcionó (no envió formulario)')
      }
      results.passed++
    } else {
      throw new Error('El formulario se envió sin validación')
    }

    await takeScreenshot('06-role-validation', 'roles')
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('06-role-validation-error', 'roles')
    results.failed++
  }

  // TC-ROLE-007: Edit system role sections
  try {
    log('\nTC-ROLE-007: Editar secciones de rol del sistema')

    await goto(ADMIN_ROLES_URL)
    await wait(1500)

    // Get initial section count for admin role
    const initialCount = await getRoleSectionCount('admin')
    log(`  Initial sections for admin: ${initialCount}`)

    // Click edit on "admin" role (system role id=2)
    const editClicked = await clickRoleEditButton('admin')
    if (!editClicked) {
      throw new Error('No se encontró el rol admin')
    }

    await wait(1500)

    const page = getPage()

    // Verify we see the system role warning
    const pageText = await page.evaluate(() => document.body.innerText)
    if (!pageText.includes('Rol del sistema') && !pageText.includes('solo')) {
      throw new Error('No se muestra el aviso de rol del sistema')
    }

    // Verify name field is not visible (system roles can't change name)
    const nameInput = await page.$('input[placeholder*="Editor"], input[placeholder*="Vendedor"]')
    if (nameInput) {
      throw new Error('El campo nombre no debería estar visible para roles del sistema')
    }

    await takeScreenshot('07-role-system-edit', 'roles')

    log('  ✓ Edición de rol del sistema muestra advertencia correctamente')
    results.passed++
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('07-role-system-error', 'roles')
    results.failed++
  }

  return results
}
