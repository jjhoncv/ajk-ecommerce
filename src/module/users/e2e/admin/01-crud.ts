/**
 * Users E2E - Admin CRUD Tests
 *
 * Tests TC-USER-001 to TC-USER-007
 * Note: Users module uses custom UserForm component
 */

import { TEST_USERS } from '../data'
import {
  log,
  wait,
  goto,
  getPage,
  takeScreenshot,
  fillUserForm,
  submitUserForm,
  userExistsInList,
  openUserActionsMenu,
  clickEditAction,
  clickDeleteAction,
  confirmUserDelete,
  cancelUserDelete
} from '../utils'

const ADMIN_USERS_URL = '/admin/users'
const NEW_USER_URL = '/admin/users/new'

export async function runAdminCrudTests(): Promise<{
  passed: number
  failed: number
  skipped: number
}> {
  const results = { passed: 0, failed: 0, skipped: 0 }

  log('🧪 Admin CRUD Tests')
  log('='.repeat(50))

  // TC-USER-001: Navigate to module
  try {
    log('\nTC-USER-001: Navegación al módulo')
    await goto(ADMIN_USERS_URL)
    await wait(2000)

    const page = getPage()

    // Check URL
    const currentUrl = page.url()
    if (!currentUrl.includes('/admin/users')) {
      throw new Error(`No navegó a /admin/users. URL actual: ${currentUrl}`)
    }

    // Check page content
    const pageText = await page.evaluate(() => document.body.innerText)
    if (pageText.toLowerCase().includes('usuario') || pageText.toLowerCase().includes('usuarios')) {
      log('  ✓ Página de usuarios cargada correctamente')
      results.passed++
    } else {
      throw new Error(`Página no contiene "usuario". Texto visible: ${pageText.slice(0, 200)}`)
    }

    await takeScreenshot('01-user-list', 'users')
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('01-user-list-error', 'users')
    results.failed++
  }

  // TC-USER-002: Create user
  try {
    log('\nTC-USER-002: Crear usuario')

    await goto(NEW_USER_URL)
    await wait(1500) // Wait for roles to load

    // Fill form
    await fillUserForm({
      name: TEST_USERS.user.name,
      lastname: TEST_USERS.user.lastname,
      email: TEST_USERS.user.email,
      roleId: TEST_USERS.user.roleId
    })

    await takeScreenshot('02-user-form-filled', 'users')

    // Submit form
    await submitUserForm()

    // Wait for email to be sent and redirect (can take 5-10 seconds)
    const page = getPage()
    let redirected = false
    for (let i = 0; i < 15; i++) {
      await wait(1000)
      const currentUrl = page.url()
      if (currentUrl.includes('/admin/users') && !currentUrl.includes('/new')) {
        redirected = true
        break
      }
    }

    if (!redirected) {
      // Check if there was an error
      const pageText = await page.evaluate(() => document.body.innerText)
      if (pageText.includes('Error') || pageText.includes('error')) {
        throw new Error(`Error al crear usuario: ${pageText.slice(0, 200)}`)
      }
      // Navigate to list anyway to check if user was created
      await goto(ADMIN_USERS_URL)
      await wait(1500)
    }

    // Verify user in list
    const exists = await userExistsInList(TEST_USERS.user.name)
    if (!exists) {
      throw new Error('El usuario no aparece en la lista')
    }

    log('  ✓ Usuario creado y visible en lista')
    await takeScreenshot('02-user-created', 'users')
    results.passed++
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('02-user-create-error', 'users')
    results.failed++
  }

  // TC-USER-003: Edit user
  try {
    log('\nTC-USER-003: Editar usuario')

    await goto(ADMIN_USERS_URL)
    await wait(1500)

    const page = getPage()

    // Open actions menu for our user (search by original name)
    const menuOpened = await openUserActionsMenu(TEST_USERS.user.name)
    if (!menuOpened) {
      throw new Error('No se pudo abrir el menú de acciones')
    }

    await wait(500)

    // Click edit
    const editClicked = await clickEditAction()
    if (!editClicked) {
      throw new Error('No se encontró la opción de editar')
    }

    await wait(2000)

    // Verify we're on edit page
    const currentUrl = page.url()
    if (!currentUrl.includes('/admin/users/') || currentUrl.includes('/new')) {
      throw new Error(`No navegó a página de edición. URL: ${currentUrl}`)
    }

    // Update the name and lastname
    await fillUserForm({
      name: TEST_USERS.userEdited.name,
      lastname: TEST_USERS.userEdited.lastname
    })

    await takeScreenshot('03-user-edit-form', 'users')

    // Submit
    await submitUserForm()

    // Wait for redirect
    for (let i = 0; i < 10; i++) {
      await wait(500)
      const url = page.url()
      if (url === 'http://localhost:3000/admin/users' || url.endsWith('/admin/users')) {
        break
      }
    }

    await wait(1000)

    // Navigate to list and verify
    await goto(ADMIN_USERS_URL)
    await wait(1500)

    // Check for edited name (just the first part since display format is "name lastname")
    const exists = await userExistsInList(TEST_USERS.userEdited.name)
    if (!exists) {
      throw new Error('El nombre actualizado no aparece en la lista')
    }

    log('  ✓ Usuario editado correctamente')
    await takeScreenshot('03-user-edited', 'users')
    results.passed++
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('03-user-edit-error', 'users')
    results.failed++
  }

  // TC-USER-004: Delete user
  try {
    log('\nTC-USER-004: Eliminar usuario')

    // First create a user to delete
    await goto(NEW_USER_URL)
    await wait(1500)

    await fillUserForm({
      name: TEST_USERS.userForDelete.name,
      lastname: TEST_USERS.userForDelete.lastname,
      email: TEST_USERS.userForDelete.email,
      roleId: TEST_USERS.userForDelete.roleId
    })

    await submitUserForm()

    // Wait for creation to complete
    for (let i = 0; i < 15; i++) {
      await wait(1000)
      const page = getPage()
      const currentUrl = page.url()
      if (currentUrl.includes('/admin/users') && !currentUrl.includes('/new')) {
        break
      }
    }

    // Go to list
    await goto(ADMIN_USERS_URL)
    await wait(1500)

    const page = getPage()

    // Open actions menu for the user to delete
    const menuOpened = await openUserActionsMenu(TEST_USERS.userForDelete.name)
    if (!menuOpened) {
      throw new Error('No se pudo abrir el menú de acciones')
    }

    await wait(800)

    // Click delete
    const deleteClicked = await clickDeleteAction()
    if (!deleteClicked) {
      throw new Error('No se encontró la opción de eliminar')
    }

    // Wait for URL to include action=alert
    await wait(1500)
    const urlAfterDelete = page.url()
    if (!urlAfterDelete.includes('action=alert')) {
      throw new Error(`URL no cambió a alert. URL: ${urlAfterDelete}`)
    }

    // Confirm deletion
    await confirmUserDelete()
    await wait(2000)

    // Refresh list
    await goto(ADMIN_USERS_URL)
    await wait(1500)

    // Verify user is gone
    const exists = await userExistsInList(TEST_USERS.userForDelete.name)
    if (exists) {
      throw new Error('El usuario todavía aparece en la lista')
    }

    log('  ✓ Usuario eliminado correctamente')
    await takeScreenshot('04-user-deleted', 'users')
    results.passed++
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('04-user-delete-error', 'users')
    results.failed++
  }

  // TC-USER-005: Cancel deletion
  try {
    log('\nTC-USER-005: Cancelar eliminación')

    await goto(ADMIN_USERS_URL)
    await wait(1500)

    const page = getPage()

    // Open actions menu for edited user
    const menuOpened = await openUserActionsMenu(TEST_USERS.userEdited.name)
    if (!menuOpened) {
      throw new Error('No se pudo abrir el menú de acciones')
    }

    await wait(800)

    // Click delete
    const deleteClicked = await clickDeleteAction()
    if (!deleteClicked) {
      throw new Error('No se encontró la opción de eliminar')
    }

    // Wait for URL to include action=alert
    await wait(1500)
    const urlAfterDelete = page.url()
    if (!urlAfterDelete.includes('action=alert')) {
      throw new Error(`URL no cambió a alert. URL: ${urlAfterDelete}`)
    }

    // Cancel deletion
    await cancelUserDelete()
    await wait(1500)

    // Verify user still exists
    const exists = await userExistsInList(TEST_USERS.userEdited.name)
    if (!exists) {
      throw new Error('El usuario desapareció después de cancelar')
    }

    log('  ✓ Cancelación funcionó correctamente')
    await takeScreenshot('05-user-cancel-success', 'users')
    results.passed++
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('05-user-cancel-error', 'users')
    results.failed++
  }

  // TC-USER-006: Validation - empty required fields
  try {
    log('\nTC-USER-006: Validación campos vacíos')

    await goto(NEW_USER_URL)
    await wait(1500)

    // Try to submit empty form
    await submitUserForm()
    await wait(1000)

    const page = getPage()

    // Check if we stayed on the form (validation prevented submit)
    const currentUrl = page.url()
    if (currentUrl.includes('/new')) {
      // Check for error message
      const hasError = await page.evaluate(() => {
        return document.body.innerText.includes('requerido') ||
          document.body.innerText.includes('required') ||
          document.body.innerText.includes('campos son requeridos')
      })

      if (hasError) {
        log('  ✓ Validación de campos vacíos funcionó (mostró error)')
      } else {
        log('  ✓ Validación de campos vacíos funcionó (no envió formulario)')
      }
      results.passed++
    } else {
      throw new Error('El formulario se envió sin validación')
    }

    await takeScreenshot('06-user-validation', 'users')
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('06-user-validation-error', 'users')
    results.failed++
  }

  // TC-USER-007: Validation - invalid email
  try {
    log('\nTC-USER-007: Validación email inválido')

    await goto(NEW_USER_URL)
    await wait(1500)

    // Fill form with invalid email
    await fillUserForm({
      name: 'Test',
      lastname: 'User',
      email: 'invalid-email',
      roleId: 2
    })

    await submitUserForm()
    await wait(1000)

    const page = getPage()

    // Check if we stayed on the form
    const currentUrl = page.url()
    if (currentUrl.includes('/new')) {
      // Check for email error message
      const hasError = await page.evaluate(() => {
        return document.body.innerText.includes('email no es válido') ||
          document.body.innerText.includes('email') ||
          document.body.innerText.includes('correo')
      })

      if (hasError) {
        log('  ✓ Validación de email funcionó (mostró error)')
      } else {
        log('  ✓ Validación de email funcionó (no envió formulario)')
      }
      results.passed++
    } else {
      throw new Error('El formulario se envió con email inválido')
    }

    await takeScreenshot('07-user-email-validation', 'users')
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('07-user-email-validation-error', 'users')
    results.failed++
  }

  return results
}
