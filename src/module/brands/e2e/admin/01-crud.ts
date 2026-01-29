/**
 * Brands E2E - Admin CRUD Tests
 *
 * Tests TC-BRAND-001 to TC-BRAND-006
 * TDD Approach: These tests define what the Admin UI should do.
 */

import { TEST_BRANDS } from '../data'
import {
  log,
  wait,
  goto,
  getPage,
  waitAndClick,
  clearAndType,
  findRowByContent,
  openRowActionsMenu,
  clickMenuAction,
  confirmDeleteModal,
  cancelDeleteModal,
  isModalVisible,
  itemExistsInTable,
  fillTextField,
  submitForm,
  hasValidationError,
  takeScreenshot,
  uploadBrandLogo,
  TEST_IMAGES
} from '../utils'

const ADMIN_BRANDS_URL = '/admin/brands'
const NEW_BRAND_URL = '/admin/brands/new'

export async function runAdminCrudTests(): Promise<{
  passed: number
  failed: number
  skipped: number
}> {
  const results = { passed: 0, failed: 0, skipped: 0 }

  log('🧪 Admin CRUD Tests')
  log('=' .repeat(50))

  // TC-BRAND-001: Navigate to module
  try {
    log('\nTC-BRAND-001: Navegación al módulo')
    await goto(ADMIN_BRANDS_URL)
    await wait(2000) // More time for page to render

    const page = getPage()

    // Check URL first
    const currentUrl = page.url()
    if (!currentUrl.includes('/admin/brands')) {
      throw new Error(`No navegó a /admin/brands. URL actual: ${currentUrl}`)
    }

    // Try to find h1 with Marcas
    const pageText = await page.evaluate(() => document.body.innerText)
    if (pageText.toLowerCase().includes('marca')) {
      log('  ✓ Página de marcas cargada correctamente')
      results.passed++
    } else {
      throw new Error(`Página no contiene "marca". Texto visible: ${pageText.slice(0, 200)}`)
    }

    await takeScreenshot('01-brand-list', 'brands')
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('01-brand-list-error', 'brands')
    results.failed++
  }

  // TC-BRAND-002: Create brand
  try {
    log('\nTC-BRAND-002: Crear marca')

    // Click "Nueva marca" button
    await waitAndClick('a[href="/admin/brands/new"]')
    await wait(500)

    // Fill name field
    await fillTextField('name', TEST_BRANDS.brand.name)

    await takeScreenshot('02-brand-form-filled', 'brands')

    // Submit form
    await submitForm()
    await wait(1500)

    // Verify redirect to list
    const page = getPage()
    const currentUrl = page.url()
    if (!currentUrl.includes('/admin/brands')) {
      throw new Error(`No redirigió al listado. URL actual: ${currentUrl}`)
    }

    // Verify brand exists in table
    const exists = await itemExistsInTable(TEST_BRANDS.brand.name)
    if (!exists) {
      throw new Error('La marca no aparece en la tabla')
    }

    log('  ✓ Marca creada y visible en tabla')
    await takeScreenshot('02-brand-created', 'brands')
    results.passed++
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('02-brand-create-error', 'brands')
    results.failed++
  }

  // TC-BRAND-003: Edit brand
  try {
    log('\nTC-BRAND-003: Editar marca')

    // Find brand in table and open actions menu
    await openRowActionsMenu(TEST_BRANDS.brand.name)
    await wait(300)

    // Click "Editar"
    await clickMenuAction('edit')
    await wait(1000)

    // Verify we're on edit page
    const page = getPage()
    const currentUrl = page.url()
    if (!currentUrl.includes('/admin/brands/')) {
      throw new Error(`No navegó a página de edición. URL: ${currentUrl}`)
    }

    // Clear and fill with new name
    await clearAndType('input[name="name"]', TEST_BRANDS.brandEdited.name)

    await takeScreenshot('03-brand-edit-form', 'brands')

    // Submit form
    await submitForm()
    await wait(1500)

    // Verify updated name in table
    const exists = await itemExistsInTable(TEST_BRANDS.brandEdited.name)
    if (!exists) {
      throw new Error('El nombre actualizado no aparece en la tabla')
    }

    log('  ✓ Marca editada correctamente')
    await takeScreenshot('03-brand-edited', 'brands')
    results.passed++
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('03-brand-edit-error', 'brands')
    results.failed++
  }

  // TC-BRAND-004: Delete brand (need to create one first for deletion)
  try {
    log('\nTC-BRAND-004: Eliminar marca')

    // First create a brand to delete
    await goto(NEW_BRAND_URL)
    await wait(500)
    await fillTextField('name', TEST_BRANDS.brandForDelete.name)
    await submitForm()
    await wait(1500)

    // Now delete it
    await openRowActionsMenu(TEST_BRANDS.brandForDelete.name)
    await wait(300)

    await clickMenuAction('delete')
    await wait(500)

    // Confirm deletion in modal
    const modalVisible = await isModalVisible()
    if (!modalVisible) {
      throw new Error('Modal de confirmación no apareció')
    }

    await takeScreenshot('04-brand-delete-modal', 'brands')

    await confirmDeleteModal()
    await wait(1500)

    // Verify brand is gone
    const exists = await itemExistsInTable(TEST_BRANDS.brandForDelete.name)
    if (exists) {
      throw new Error('La marca todavía aparece en la tabla')
    }

    log('  ✓ Marca eliminada correctamente')
    await takeScreenshot('04-brand-deleted', 'brands')
    results.passed++
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('04-brand-delete-error', 'brands')
    results.failed++
  }

  // TC-BRAND-005: Cancel deletion
  try {
    log('\nTC-BRAND-005: Cancelar eliminación')

    // Use the edited brand for this test
    await goto(ADMIN_BRANDS_URL)
    await wait(1000)

    await openRowActionsMenu(TEST_BRANDS.brandEdited.name)
    await wait(300)

    await clickMenuAction('delete')
    await wait(500)

    const modalVisible = await isModalVisible()
    if (!modalVisible) {
      throw new Error('Modal de confirmación no apareció')
    }

    await takeScreenshot('05-brand-cancel-modal', 'brands')

    // Cancel deletion
    await cancelDeleteModal()
    await wait(500)

    // Verify modal closed
    const modalStillVisible = await isModalVisible()
    if (modalStillVisible) {
      throw new Error('El modal no se cerró')
    }

    // Verify brand still exists
    const exists = await itemExistsInTable(TEST_BRANDS.brandEdited.name)
    if (!exists) {
      throw new Error('La marca desapareció después de cancelar')
    }

    log('  ✓ Cancelación funcionó correctamente')
    await takeScreenshot('05-brand-cancel-success', 'brands')
    results.passed++
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('05-brand-cancel-error', 'brands')
    results.failed++
  }

  // TC-BRAND-006: Validation - empty name
  try {
    log('\nTC-BRAND-006: Validación campo vacío')

    await goto(NEW_BRAND_URL)
    await wait(500)

    // Try to submit empty form
    await submitForm()
    await wait(500)

    // Check for validation error
    const hasError = await hasValidationError('name')

    if (!hasError) {
      // Also check if we stayed on the form (didn't redirect)
      const page = getPage()
      const currentUrl = page.url()
      if (!currentUrl.includes('/new')) {
        throw new Error('El formulario se envió sin validación')
      }
    }

    log('  ✓ Validación de campo vacío funcionó')
    await takeScreenshot('06-brand-validation', 'brands')
    results.passed++
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('06-brand-validation-error', 'brands')
    results.failed++
  }

  // TC-BRAND-007: Create brand with logo image
  try {
    log('\nTC-BRAND-007: Crear marca con logo')

    await goto(NEW_BRAND_URL)
    await wait(500)

    // Fill name field
    const brandWithLogoName = `${TEST_BRANDS.brand.name}-with-logo`
    await fillTextField('name', brandWithLogoName)

    // Upload logo image
    const uploadSuccess = await uploadBrandLogo(TEST_IMAGES.logo)
    if (!uploadSuccess) {
      throw new Error('No se pudo subir el logo')
    }

    await wait(1000) // Wait for upload to complete
    await takeScreenshot('07-brand-with-logo-form', 'brands')

    // Submit form
    await submitForm()
    await wait(1500)

    // Verify redirect to list
    const page = getPage()
    const currentUrl = page.url()
    if (!currentUrl.includes('/admin/brands') || currentUrl.includes('/new')) {
      throw new Error(`No redirigió al listado. URL actual: ${currentUrl}`)
    }

    // Verify brand exists in table
    const exists = await itemExistsInTable(brandWithLogoName)
    if (!exists) {
      throw new Error('La marca con logo no aparece en la tabla')
    }

    log('  ✓ Marca con logo creada correctamente')
    await takeScreenshot('07-brand-with-logo-created', 'brands')
    results.passed++
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('07-brand-with-logo-error', 'brands')
    results.failed++
  }

  return results
}
