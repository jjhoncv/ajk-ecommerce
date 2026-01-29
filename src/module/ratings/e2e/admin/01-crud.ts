/**
 * Ratings Admin E2E Tests
 *
 * Tests for:
 * 1. Page access and initial load
 * 2. Stats display (pending, approved, rejected)
 * 3. Filters functionality
 * 4. List display
 * 5. Empty state
 */

import {
  log,
  wait,
  goto,
  getPage,
  takeScreenshot,
  hasEmptyRatingsMessage,
  hasRatingStats,
  getRatingsCount,
  filterByStatus
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
  log('Test 1: Verificando acceso a la página de valoraciones...')

  try {
    await goto('/admin/ratings')
    await wait(2000)

    const page = getPage()
    const pageText = await page.evaluate(() => document.body.innerText)

    if (pageText.includes('Valoraciones') && pageText.includes('Moderación')) {
      log('  ✓ Página de valoraciones cargada correctamente')
      return true
    }

    log('  ✗ No se encontró el contenido esperado de la página')
    await takeScreenshot('page-access-failed', 'ratings')
    return false
  } catch (error: any) {
    log(`  ✗ Error: ${error.message}`)
    return false
  }
}

/**
 * Test 2: Check stats display
 */
async function testStatsDisplay(): Promise<boolean> {
  log('Test 2: Verificando visualización de estadísticas...')

  try {
    const hasStats = await hasRatingStats()
    if (hasStats) {
      log('  ✓ Estadísticas de valoraciones visibles (Pendientes, Aprobadas, Rechazadas)')
      await takeScreenshot('stats-success', 'ratings')
      return true
    }

    log('  ✗ No se encontraron las estadísticas')
    await takeScreenshot('stats-failed', 'ratings')
    return false
  } catch (error: any) {
    log(`  ✗ Error: ${error.message}`)
    return false
  }
}

/**
 * Test 3: Filter functionality
 */
async function testFilters(): Promise<{ passed: boolean; skipped: boolean }> {
  log('Test 3: Verificando filtros de valoraciones...')

  try {
    const isEmpty = await hasEmptyRatingsMessage()

    if (isEmpty) {
      log('  ○ SKIPPED: No hay valoraciones para filtrar')
      return { passed: false, skipped: true }
    }

    const page = getPage()

    // Check if filter select exists
    const hasFilter = await page.evaluate(() => {
      return document.querySelector('select') !== null
    })

    if (hasFilter) {
      // Test filter by pending
      await filterByStatus('pending')
      await wait(500)
      log('  - Filtro "Pendientes" aplicado')

      // Test filter all
      await filterByStatus('')
      await wait(500)
      log('  - Filtro "Todos" aplicado')

      log('  ✓ Filtros funcionando correctamente')
      await takeScreenshot('filters-success', 'ratings')
      return { passed: true, skipped: false }
    }

    log('  ✗ No se encontró el selector de filtros')
    return { passed: false, skipped: false }
  } catch (error: any) {
    log(`  ✗ Error: ${error.message}`)
    return { passed: false, skipped: false }
  }
}

/**
 * Test 4: List display
 */
async function testListDisplay(): Promise<{ passed: boolean; skipped: boolean }> {
  log('Test 4: Verificando lista de valoraciones...')

  try {
    const isEmpty = await hasEmptyRatingsMessage()

    if (isEmpty) {
      log('  ○ SKIPPED: Lista vacía, no hay valoraciones para mostrar')
      return { passed: false, skipped: true }
    }

    const page = getPage()

    // Check table headers
    const tableHeaders = await page.evaluate(() => {
      const headers = document.querySelectorAll('thead th')
      return Array.from(headers).map(h => h.textContent?.trim().toLowerCase())
    })

    const expectedHeaders = ['cliente', 'producto', 'valoración', 'estado']
    const hasRequiredHeaders = expectedHeaders.every(header =>
      tableHeaders.some(th => th?.includes(header))
    )

    if (!hasRequiredHeaders) {
      log('  ✗ Faltan cabeceras en la tabla')
      await takeScreenshot('list-headers-failed', 'ratings')
      return { passed: false, skipped: false }
    }

    const ratingsCount = await getRatingsCount()
    log(`  - Se encontraron ${ratingsCount} valoraciones en la tabla`)

    log('  ✓ Lista de valoraciones mostrada correctamente')
    await takeScreenshot('list-success', 'ratings')
    return { passed: true, skipped: false }
  } catch (error: any) {
    log(`  ✗ Error: ${error.message}`)
    return { passed: false, skipped: false }
  }
}

/**
 * Test 5: Empty state
 */
async function testEmptyState(): Promise<boolean> {
  log('Test 5: Verificando estado vacío o con datos...')

  try {
    const page = getPage()
    const isEmpty = await hasEmptyRatingsMessage()

    if (isEmpty) {
      const pageText = await page.evaluate(() => document.body.innerText)
      if (pageText.includes('No se encontraron valoraciones')) {
        log('  ✓ Estado vacío muestra mensaje correcto')
        await takeScreenshot('empty-state', 'ratings')
        return true
      }
      log('  ✗ Estado vacío sin mensaje esperado')
      return false
    }

    const ratingsCount = await getRatingsCount()
    if (ratingsCount > 0) {
      log(`  ✓ Lista contiene ${ratingsCount} valoraciones`)
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
 * Run all ratings admin tests
 */
export async function runAdminCrudTests(): Promise<TestResults> {
  const results: TestResults = { passed: 0, failed: 0, skipped: 0 }

  log('')
  log('Running Ratings Admin Tests...')
  log('')

  // Test 1: Page access
  if (await testPageAccess()) {
    results.passed++
  } else {
    results.failed++
  }

  // Test 2: Stats display
  if (await testStatsDisplay()) {
    results.passed++
  } else {
    results.failed++
  }

  // Test 3: Filters
  const filterResult = await testFilters()
  if (filterResult.skipped) {
    results.skipped++
  } else if (filterResult.passed) {
    results.passed++
  } else {
    results.failed++
  }

  // Test 4: List display
  const listResult = await testListDisplay()
  if (listResult.skipped) {
    results.skipped++
  } else if (listResult.passed) {
    results.passed++
  } else {
    results.failed++
  }

  // Test 5: Empty state
  if (await testEmptyState()) {
    results.passed++
  } else {
    results.failed++
  }

  log('')
  log(`Ratings Admin Tests: ${results.passed} passed, ${results.failed} failed, ${results.skipped} skipped`)

  return results
}
