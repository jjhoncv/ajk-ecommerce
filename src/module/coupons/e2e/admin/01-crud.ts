/**
 * Coupons E2E - Admin CRUD Tests
 *
 * Tests TC-COUPON-001 to TC-COUPON-007
 * Note: Coupons module uses a custom form, not FormCreate
 */

import { TEST_COUPONS } from '../data'
import {
  log,
  wait,
  goto,
  getPage,
  takeScreenshot,
  fillCouponForm,
  submitCouponForm,
  clickGenerateCode,
  getCodeValue,
  couponExistsInList
} from '../utils'

const ADMIN_COUPONS_URL = '/admin/coupons'
const NEW_COUPON_URL = '/admin/coupons/new'

export async function runAdminCrudTests(): Promise<{
  passed: number
  failed: number
  skipped: number
}> {
  const results = { passed: 0, failed: 0, skipped: 0 }

  log('🧪 Admin CRUD Tests')
  log('='.repeat(50))

  // TC-COUPON-001: Navigate to module
  try {
    log('\nTC-COUPON-001: Navegación al módulo')
    await goto(ADMIN_COUPONS_URL)
    await wait(2000)

    const page = getPage()

    // Check URL
    const currentUrl = page.url()
    if (!currentUrl.includes('/admin/coupons')) {
      throw new Error(`No navegó a /admin/coupons. URL actual: ${currentUrl}`)
    }

    // Check page content
    const pageText = await page.evaluate(() => document.body.innerText)
    if (pageText.toLowerCase().includes('cupón') || pageText.toLowerCase().includes('cupones')) {
      log('  ✓ Página de cupones cargada correctamente')
      results.passed++
    } else {
      throw new Error(`Página no contiene "cupón". Texto visible: ${pageText.slice(0, 200)}`)
    }

    await takeScreenshot('01-coupon-list', 'coupons')
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('01-coupon-list-error', 'coupons')
    results.failed++
  }

  // TC-COUPON-002: Create coupon
  try {
    log('\nTC-COUPON-002: Crear cupón')

    await goto(NEW_COUPON_URL)
    await wait(1000)

    // Fill form
    await fillCouponForm({
      name: TEST_COUPONS.coupon.name,
      code: TEST_COUPONS.coupon.code,
      discountType: TEST_COUPONS.coupon.discountType,
      discountValue: TEST_COUPONS.coupon.discountValue,
      startDate: TEST_COUPONS.coupon.startDate,
      endDate: TEST_COUPONS.coupon.endDate,
      minPurchaseAmount: TEST_COUPONS.coupon.minPurchaseAmount,
      usageLimit: TEST_COUPONS.coupon.usageLimit,
      usageLimitPerCustomer: TEST_COUPONS.coupon.usageLimitPerCustomer,
      isActive: true
    })

    await takeScreenshot('02-coupon-form-filled', 'coupons')

    // Submit form
    await submitCouponForm()
    await wait(2000)

    // Verify redirect or coupon created
    const page = getPage()
    const currentUrl = page.url()

    // Could redirect to list or stay on detail page
    if (currentUrl.includes('/admin/coupons')) {
      // Navigate to list to verify
      await goto(ADMIN_COUPONS_URL)
      await wait(1000)

      const exists = await couponExistsInList(TEST_COUPONS.coupon.name)
      if (!exists) {
        throw new Error('El cupón no aparece en la lista')
      }

      log('  ✓ Cupón creado y visible en lista')
      await takeScreenshot('02-coupon-created', 'coupons')
      results.passed++
    } else {
      throw new Error(`No redirigió correctamente. URL: ${currentUrl}`)
    }
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('02-coupon-create-error', 'coupons')
    results.failed++
  }

  // TC-COUPON-003: Edit coupon
  try {
    log('\nTC-COUPON-003: Editar cupón')

    await goto(ADMIN_COUPONS_URL)
    await wait(1000)

    const page = getPage()

    // Find and click edit button for our coupon
    const editClicked = await page.evaluate((couponName) => {
      const rows = Array.from(document.querySelectorAll('tr'))
      for (const row of rows) {
        if (row.textContent?.includes(couponName)) {
          const editBtn = row.querySelector('a[href*="/admin/coupons/"]')
          if (editBtn) {
            (editBtn as HTMLElement).click()
            return true
          }
        }
      }
      return false
    }, TEST_COUPONS.coupon.name)

    if (!editClicked) {
      throw new Error('No se encontró el botón de editar')
    }

    await wait(1500)

    // Verify we're on edit page
    const currentUrl = page.url()
    if (!currentUrl.includes('/admin/coupons/')) {
      throw new Error(`No navegó a página de edición. URL: ${currentUrl}`)
    }

    // Update the name
    const nameInput = await page.$('input[placeholder*="Nombre"], input[placeholder*="nombre"], input[placeholder*="bienvenida"]')
    if (nameInput) {
      await nameInput.click({ clickCount: 3 })
      await nameInput.type(TEST_COUPONS.couponEdited.name)
    }

    await takeScreenshot('03-coupon-edit-form', 'coupons')

    // Submit
    await submitCouponForm()
    await wait(2000)

    // Navigate to list and verify
    await goto(ADMIN_COUPONS_URL)
    await wait(1000)

    const exists = await couponExistsInList(TEST_COUPONS.couponEdited.name)
    if (!exists) {
      throw new Error('El nombre actualizado no aparece en la lista')
    }

    log('  ✓ Cupón editado correctamente')
    await takeScreenshot('03-coupon-edited', 'coupons')
    results.passed++
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('03-coupon-edit-error', 'coupons')
    results.failed++
  }

  // TC-COUPON-004: Delete coupon
  try {
    log('\nTC-COUPON-004: Eliminar cupón')

    // First create a coupon to delete
    await goto(NEW_COUPON_URL)
    await wait(1000)

    await fillCouponForm({
      name: TEST_COUPONS.couponForDelete.name,
      code: TEST_COUPONS.couponForDelete.code,
      discountType: TEST_COUPONS.couponForDelete.discountType,
      discountValue: TEST_COUPONS.couponForDelete.discountValue,
      startDate: TEST_COUPONS.couponForDelete.startDate,
      endDate: TEST_COUPONS.couponForDelete.endDate,
      isActive: true
    })

    await submitCouponForm()
    await wait(2000)

    // Go to list
    await goto(ADMIN_COUPONS_URL)
    await wait(1000)

    const page = getPage()

    // Setup dialog handler to auto-confirm
    page.once('dialog', async (dialog) => {
      await dialog.accept()
    })

    // Find and click delete button
    const deleteClicked = await page.evaluate((couponName) => {
      const rows = Array.from(document.querySelectorAll('tr'))
      for (const row of rows) {
        if (row.textContent?.includes(couponName)) {
          const deleteBtn = row.querySelector('button[title="Eliminar"]')
          if (deleteBtn) {
            (deleteBtn as HTMLElement).click()
            return true
          }
        }
      }
      return false
    }, TEST_COUPONS.couponForDelete.name)

    if (!deleteClicked) {
      throw new Error('No se encontró el botón de eliminar')
    }

    await wait(2000)

    // Verify coupon is gone
    const exists = await couponExistsInList(TEST_COUPONS.couponForDelete.name)
    if (exists) {
      throw new Error('El cupón todavía aparece en la lista')
    }

    log('  ✓ Cupón eliminado correctamente')
    await takeScreenshot('04-coupon-deleted', 'coupons')
    results.passed++
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('04-coupon-delete-error', 'coupons')
    results.failed++
  }

  // TC-COUPON-005: Cancel deletion
  try {
    log('\nTC-COUPON-005: Cancelar eliminación')

    await goto(ADMIN_COUPONS_URL)
    await wait(1000)

    const page = getPage()

    // Setup dialog handler to cancel
    page.once('dialog', async (dialog) => {
      await dialog.dismiss()
    })

    // Find and click delete button for edited coupon
    const deleteClicked = await page.evaluate((couponName) => {
      const rows = Array.from(document.querySelectorAll('tr'))
      for (const row of rows) {
        if (row.textContent?.includes(couponName)) {
          const deleteBtn = row.querySelector('button[title="Eliminar"]')
          if (deleteBtn) {
            (deleteBtn as HTMLElement).click()
            return true
          }
        }
      }
      return false
    }, TEST_COUPONS.couponEdited.name)

    if (!deleteClicked) {
      throw new Error('No se encontró el botón de eliminar')
    }

    await wait(1000)

    // Verify coupon still exists
    const exists = await couponExistsInList(TEST_COUPONS.couponEdited.name)
    if (!exists) {
      throw new Error('El cupón desapareció después de cancelar')
    }

    log('  ✓ Cancelación funcionó correctamente')
    await takeScreenshot('05-coupon-cancel-success', 'coupons')
    results.passed++
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('05-coupon-cancel-error', 'coupons')
    results.failed++
  }

  // TC-COUPON-006: Validation - empty required fields
  try {
    log('\nTC-COUPON-006: Validación campos vacíos')

    await goto(NEW_COUPON_URL)
    await wait(1000)

    // Try to submit empty form
    await submitCouponForm()
    await wait(1000)

    const page = getPage()

    // Check if we stayed on the form (validation prevented submit)
    const currentUrl = page.url()
    if (currentUrl.includes('/new')) {
      // Check for error message
      const hasError = await page.evaluate(() => {
        return document.body.innerText.includes('Por favor completa') ||
          document.body.innerText.includes('requerido') ||
          document.body.innerText.includes('required')
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

    await takeScreenshot('06-coupon-validation', 'coupons')
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('06-coupon-validation-error', 'coupons')
    results.failed++
  }

  // TC-COUPON-007: Generate coupon code
  try {
    log('\nTC-COUPON-007: Generar código de cupón')

    await goto(NEW_COUPON_URL)
    await wait(1000)

    // Fill name first (code generator might use it)
    await fillCouponForm({ name: 'Test Code Gen' })
    await wait(300)

    // Get initial code value
    const initialCode = await getCodeValue()

    // Click generate button
    await clickGenerateCode()
    await wait(500)

    // Get new code value
    const newCode = await getCodeValue()

    if (!newCode) {
      throw new Error('No se generó ningún código')
    }

    if (newCode === initialCode && initialCode !== '') {
      throw new Error('El código no cambió después de generar')
    }

    log(`  ✓ Código generado: ${newCode}`)
    await takeScreenshot('07-coupon-code-generated', 'coupons')
    results.passed++
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('07-coupon-code-error', 'coupons')
    results.failed++
  }

  return results
}
