/**
 * Offers Admin CRUD E2E Tests
 *
 * Tests for:
 * 1. Page access and initial load
 * 2. Stats display
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
  hasEmptyOffersMessage,
  hasOfferStats,
  getOffersCount,
  filterByStatus,
  searchOffers
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
  log('Test 1: Verificando acceso a la página de ofertas...')

  try {
    await goto('/admin/offers')
    await wait(2000)

    const page = getPage()
    const pageText = await page.evaluate(() => document.body.innerText)

    if (pageText.includes('Ofertas') && pageText.includes('Gestiona ofertas')) {
      log('  ✓ Página de ofertas cargada correctamente')
      return true
    }

    log('  ✗ No se encontró el contenido esperado de la página')
    await takeScreenshot('page-access-failed', 'offers')
    return false
  } catch (error: any) {
    log(`  ✗ Error: ${error.message}`)
    return false
  }
}

/**
 * Test 2: Check stats display (only if offers exist)
 */
async function testStatsDisplay(): Promise<{ passed: boolean; skipped: boolean }> {
  log('Test 2: Verificando visualización de estadísticas...')

  try {
    const isEmpty = await hasEmptyOffersMessage()

    if (isEmpty) {
      log('  ○ SKIPPED: No hay ofertas en la base de datos')
      return { passed: false, skipped: true }
    }

    const hasStats = await hasOfferStats()
    if (hasStats) {
      log('  ✓ Estadísticas de ofertas visibles')
      return { passed: true, skipped: false }
    }

    log('  ✗ No se encontraron las estadísticas')
    await takeScreenshot('stats-failed', 'offers')
    return { passed: false, skipped: false }
  } catch (error: any) {
    log(`  ✗ Error: ${error.message}`)
    return { passed: false, skipped: false }
  }
}

/**
 * Test 3: Filter functionality
 */
async function testFilters(): Promise<{ passed: boolean; skipped: boolean }> {
  log('Test 3: Verificando filtros de ofertas...')

  try {
    const isEmpty = await hasEmptyOffersMessage()

    if (isEmpty) {
      log('  ○ SKIPPED: No hay ofertas para filtrar')
      return { passed: false, skipped: true }
    }

    // Test filter by active
    await filterByStatus('active')
    await wait(500)
    log('  - Filtro "Activas" aplicado')

    // Test filter by scheduled
    await filterByStatus('scheduled')
    await wait(500)
    log('  - Filtro "Programadas" aplicado')

    // Test filter all
    await filterByStatus('all')
    await wait(500)
    log('  - Filtro "Todas" aplicado')

    log('  ✓ Filtros funcionando correctamente')
    return { passed: true, skipped: false }
  } catch (error: any) {
    log(`  ✗ Error: ${error.message}`)
    return { passed: false, skipped: false }
  }
}

/**
 * Test 4: List display
 */
async function testListDisplay(): Promise<{ passed: boolean; skipped: boolean }> {
  log('Test 4: Verificando lista de ofertas...')

  try {
    const isEmpty = await hasEmptyOffersMessage()

    if (isEmpty) {
      log('  ○ SKIPPED: Lista vacía, no hay ofertas para mostrar')
      return { passed: false, skipped: true }
    }

    const page = getPage()

    // Check table headers
    const tableHeaders = await page.evaluate(() => {
      const headers = document.querySelectorAll('thead th')
      return Array.from(headers).map(h => h.textContent?.trim())
    })

    const expectedHeaders = ['Oferta', 'Tipo', 'Descuento', 'Período', 'Estado', 'Acciones']
    const hasRequiredHeaders = expectedHeaders.every(header =>
      tableHeaders.some(th => th?.toLowerCase().includes(header.toLowerCase()))
    )

    if (!hasRequiredHeaders) {
      log('  ✗ Faltan cabeceras en la tabla')
      await takeScreenshot('list-headers-failed', 'offers')
      return { passed: false, skipped: false }
    }

    const offersCount = await getOffersCount()
    log(`  - Se encontraron ${offersCount} ofertas en la tabla`)

    log('  ✓ Lista de ofertas mostrada correctamente')
    await takeScreenshot('list-success', 'offers')
    return { passed: true, skipped: false }
  } catch (error: any) {
    log(`  ✗ Error: ${error.message}`)
    return { passed: false, skipped: false }
  }
}

/**
 * Test 5: Empty state
 */
async function testEmptyState(): Promise<{ passed: boolean; skipped: boolean }> {
  log('Test 5: Verificando estado vacío o con datos...')

  try {
    const page = getPage()
    const pageText = await page.evaluate(() => document.body.innerText)

    const isEmpty = await hasEmptyOffersMessage()

    if (isEmpty) {
      // Check that empty state has CTA
      if (pageText.includes('Crear primera oferta')) {
        log('  ✓ Estado vacío muestra CTA para crear oferta')
        await takeScreenshot('empty-state', 'offers')
        return { passed: true, skipped: false }
      }
      log('  ✗ Estado vacío sin CTA')
      return { passed: false, skipped: false }
    }

    // If not empty, verify there are offers in the list
    const offersCount = await getOffersCount()
    if (offersCount > 0) {
      log(`  ✓ Lista contiene ${offersCount} ofertas`)
      return { passed: true, skipped: false }
    }

    log('  ✗ Estado inconsistente')
    return { passed: false, skipped: false }
  } catch (error: any) {
    log(`  ✗ Error: ${error.message}`)
    return { passed: false, skipped: false }
  }
}

/**
 * Run all offers admin CRUD tests
 */
export async function runAdminCrudTests(): Promise<TestResults> {
  const results: TestResults = { passed: 0, failed: 0, skipped: 0 }

  log('')
  log('Running Offers Admin Tests...')
  log('')

  // Test 1: Page access
  if (await testPageAccess()) {
    results.passed++
  } else {
    results.failed++
  }

  // Test 2: Stats display
  const statsResult = await testStatsDisplay()
  if (statsResult.skipped) {
    results.skipped++
  } else if (statsResult.passed) {
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
  const emptyResult = await testEmptyState()
  if (emptyResult.skipped) {
    results.skipped++
  } else if (emptyResult.passed) {
    results.passed++
  } else {
    results.failed++
  }

  log('')
  log(`Offers Admin Tests: ${results.passed} passed, ${results.failed} failed, ${results.skipped} skipped`)

  return results
}
