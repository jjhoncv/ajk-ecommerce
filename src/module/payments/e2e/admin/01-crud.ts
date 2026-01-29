/**
 * Payments Admin CRUD E2E Tests
 *
 * Tests for:
 * 1. Page access and initial load
 * 2. List display (methods)
 * 3. Table columns
 * 4. Empty state
 * 5. Search functionality
 */

import {
  log,
  wait,
  goto,
  getPage,
  takeScreenshot,
  hasEmptyPaymentMethodsMessage,
  getPaymentMethodsCount,
  searchPaymentMethods
} from '../utils'

interface TestResults {
  passed: number
  failed: number
  skipped: number
}

/**
 * Test 1: Verify page access and title
 */
async function testPageAccess(): Promise<boolean> {
  log('Test 1: Verificando acceso a la página de métodos de pago...')

  try {
    await goto('/admin/payments/methods')
    await wait(2000)

    const page = getPage()
    const pageText = await page.evaluate(() => document.body.innerText)

    if (pageText.includes('Métodos de Pago') && pageText.includes('Gestiona los métodos')) {
      log('  ✓ Página de métodos de pago cargada correctamente')
      return true
    }

    log('  ✗ No se encontró el contenido esperado de la página')
    await takeScreenshot('page-access-failed', 'payments')
    return false
  } catch (error: any) {
    log(`  ✗ Error: ${error.message}`)
    return false
  }
}

/**
 * Test 2: List display
 */
async function testListDisplay(): Promise<{ passed: boolean; skipped: boolean }> {
  log('Test 2: Verificando lista de métodos de pago...')

  try {
    const isEmpty = await hasEmptyPaymentMethodsMessage()

    if (isEmpty) {
      log('  ○ SKIPPED: Lista vacía, no hay métodos de pago')
      await takeScreenshot('list-empty', 'payments')
      return { passed: false, skipped: true }
    }

    const page = getPage()

    // Check table exists
    const hasTable = await page.evaluate(() => {
      return document.querySelector('table') !== null
    })

    if (!hasTable) {
      log('  ✗ No se encontró la tabla')
      return { passed: false, skipped: false }
    }

    const methodsCount = await getPaymentMethodsCount()
    log(`  - Se encontraron ${methodsCount} métodos de pago`)

    log('  ✓ Lista de métodos mostrada correctamente')
    await takeScreenshot('list-success', 'payments')
    return { passed: true, skipped: false }
  } catch (error: any) {
    log(`  ✗ Error: ${error.message}`)
    return { passed: false, skipped: false }
  }
}

/**
 * Test 3: Table columns
 */
async function testTableColumns(): Promise<{ passed: boolean; skipped: boolean }> {
  log('Test 3: Verificando columnas de la tabla...')

  try {
    const isEmpty = await hasEmptyPaymentMethodsMessage()

    if (isEmpty) {
      log('  ○ SKIPPED: No hay datos para verificar columnas')
      return { passed: false, skipped: true }
    }

    const page = getPage()

    const tableHeaders = await page.evaluate(() => {
      const headers = document.querySelectorAll('thead th')
      return Array.from(headers).map(h => h.textContent?.trim().toLowerCase())
    })

    const expectedColumns = ['método', 'comisión', 'estado']
    const hasRequiredColumns = expectedColumns.every(col =>
      tableHeaders.some(th => th?.includes(col))
    )

    if (hasRequiredColumns) {
      log('  ✓ Columnas de tabla correctas')
      return { passed: true, skipped: false }
    }

    log('  ✗ Faltan columnas en la tabla')
    await takeScreenshot('columns-failed', 'payments')
    return { passed: false, skipped: false }
  } catch (error: any) {
    log(`  ✗ Error: ${error.message}`)
    return { passed: false, skipped: false }
  }
}

/**
 * Test 4: Empty state or data state
 */
async function testEmptyState(): Promise<boolean> {
  log('Test 4: Verificando estado vacío o con datos...')

  try {
    const page = getPage()
    const isEmpty = await hasEmptyPaymentMethodsMessage()

    if (isEmpty) {
      const pageText = await page.evaluate(() => document.body.innerText)
      if (pageText.includes('No hay métodos de pago')) {
        log('  ✓ Estado vacío muestra mensaje correcto')
        await takeScreenshot('empty-state', 'payments')
        return true
      }
      log('  ✗ Estado vacío sin mensaje esperado')
      return false
    }

    const methodsCount = await getPaymentMethodsCount()
    if (methodsCount > 0) {
      log(`  ✓ Lista contiene ${methodsCount} métodos de pago`)
      return true
    }

    log('  ✗ Estado inconsistente')
    return false
  } catch (error: any) {
    log(`  ✗ Error: ${error.message}`)
    return false
  }
}

/**
 * Test 5: Search functionality
 */
async function testSearch(): Promise<{ passed: boolean; skipped: boolean }> {
  log('Test 5: Verificando búsqueda...')

  try {
    const isEmpty = await hasEmptyPaymentMethodsMessage()

    if (isEmpty) {
      log('  ○ SKIPPED: No hay datos para probar búsqueda')
      return { passed: false, skipped: true }
    }

    const page = getPage()

    // Check if search input exists
    const hasSearch = await page.evaluate(() => {
      return document.querySelector('input[placeholder*="Buscar"]') !== null
    })

    if (hasSearch) {
      await searchPaymentMethods('test')
      await wait(500)
      log('  ✓ Búsqueda funcionando')
      await takeScreenshot('search-success', 'payments')
      return { passed: true, skipped: false }
    }

    log('  ✗ Campo de búsqueda no encontrado')
    return { passed: false, skipped: false }
  } catch (error: any) {
    log(`  ✗ Error: ${error.message}`)
    return { passed: false, skipped: false }
  }
}

/**
 * Run all payment methods admin tests
 */
export async function runAdminCrudTests(): Promise<TestResults> {
  const results: TestResults = { passed: 0, failed: 0, skipped: 0 }

  log('')
  log('Running Payment Methods Admin Tests...')
  log('')

  // Test 1: Page access
  if (await testPageAccess()) {
    results.passed++
  } else {
    results.failed++
  }

  // Test 2: List display
  const listResult = await testListDisplay()
  if (listResult.skipped) {
    results.skipped++
  } else if (listResult.passed) {
    results.passed++
  } else {
    results.failed++
  }

  // Test 3: Table columns
  const columnsResult = await testTableColumns()
  if (columnsResult.skipped) {
    results.skipped++
  } else if (columnsResult.passed) {
    results.passed++
  } else {
    results.failed++
  }

  // Test 4: Empty state
  if (await testEmptyState()) {
    results.passed++
  } else {
    results.failed++
  }

  // Test 5: Search
  const searchResult = await testSearch()
  if (searchResult.skipped) {
    results.skipped++
  } else if (searchResult.passed) {
    results.passed++
  } else {
    results.failed++
  }

  log('')
  log(`Payment Methods Admin Tests: ${results.passed} passed, ${results.failed} failed, ${results.skipped} skipped`)

  return results
}
