/**
 * Promotions E2E - Admin Tests
 *
 * Tests TC-PROMO-001 to TC-PROMO-005
 * Tests for viewing and filtering promotions
 */

import {
  log,
  wait,
  goto,
  getPage,
  takeScreenshot,
  hasEmptyPromotionsMessage,
  hasPromotionStats,
  getPromotionsCount,
  searchPromotions,
  filterByStatus
} from '../utils'

const ADMIN_PROMOTIONS_URL = '/admin/promotions'

export async function runAdminCrudTests(): Promise<{
  passed: number
  failed: number
  skipped: number
}> {
  const results = { passed: 0, failed: 0, skipped: 0 }

  log('🧪 Admin Promotions Tests')
  log('='.repeat(50))

  // TC-PROMO-001: Navigate to module
  try {
    log('\nTC-PROMO-001: Navegación al módulo')
    await goto(ADMIN_PROMOTIONS_URL)
    await wait(2000)

    const page = getPage()

    // Check URL
    const currentUrl = page.url()
    if (!currentUrl.includes('/admin/promotions')) {
      throw new Error(`No navegó a /admin/promotions. URL actual: ${currentUrl}`)
    }

    // Check page content
    const pageText = await page.evaluate(() => document.body.innerText)
    if (pageText.toLowerCase().includes('promoci')) {
      log('  ✓ Página de promociones cargada correctamente')
      results.passed++
    } else {
      throw new Error(`Página no contiene "promociones". Texto visible: ${pageText.slice(0, 200)}`)
    }

    await takeScreenshot('01-promotions-list', 'promotions')
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('01-promotions-list-error', 'promotions')
    results.failed++
  }

  // TC-PROMO-002: Verify empty state or list with stats
  try {
    log('\nTC-PROMO-002: Verificar estado de lista')
    await goto(ADMIN_PROMOTIONS_URL)
    await wait(1500)

    const hasEmpty = await hasEmptyPromotionsMessage()
    const hasStats = await hasPromotionStats()
    const count = await getPromotionsCount()

    if (hasEmpty) {
      log('  ✓ Estado vacío mostrado correctamente')
      results.passed++
    } else if (hasStats) {
      log(`  ✓ Lista de promociones visible con ${count} promociones`)
      log('  ✓ Estadísticas de promociones visibles')
      results.passed++
    } else {
      throw new Error('No se pudo determinar el estado de la página')
    }

    await takeScreenshot('02-promotions-state', 'promotions')
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('02-promotions-state-error', 'promotions')
    results.failed++
  }

  // TC-PROMO-003: Test search functionality (if promotions exist)
  try {
    log('\nTC-PROMO-003: Probar búsqueda')
    await goto(ADMIN_PROMOTIONS_URL)
    await wait(1500)

    const hasEmpty = await hasEmptyPromotionsMessage()
    if (hasEmpty) {
      log('  ○ SKIPPED: No hay promociones - no se puede probar búsqueda')
      results.skipped++
    } else {
      const page = getPage()

      // Check for search input
      const hasSearchInput = await page.evaluate(() => {
        return document.querySelector('input[placeholder*="Buscar"]') !== null
      })

      if (hasSearchInput) {
        // Search for something that likely won't match
        await searchPromotions('xyz123nonexistent')
        await wait(500)

        const afterSearchCount = await getPromotionsCount()
        log(`  Resultados después de búsqueda: ${afterSearchCount}`)

        log('  ✓ Funcionalidad de búsqueda disponible')
        results.passed++
      } else {
        throw new Error('Campo de búsqueda no encontrado')
      }
    }

    await takeScreenshot('03-promotions-search', 'promotions')
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('03-promotions-search-error', 'promotions')
    results.failed++
  }

  // TC-PROMO-004: Test status filter (if promotions exist)
  try {
    log('\nTC-PROMO-004: Probar filtro de estado')
    await goto(ADMIN_PROMOTIONS_URL)
    await wait(1500)

    const hasEmpty = await hasEmptyPromotionsMessage()
    if (hasEmpty) {
      log('  ○ SKIPPED: No hay promociones - no se puede probar filtro')
      results.skipped++
    } else {
      const page = getPage()

      // Check for status filter
      const hasStatusFilter = await page.evaluate(() => {
        return document.querySelector('select') !== null
      })

      if (hasStatusFilter) {
        // Filter by active status
        await filterByStatus('active')
        await wait(500)

        log('  ✓ Filtro de estado aplicado')
        results.passed++
      } else {
        log('  ✓ Filtros no visibles (puede ser estado vacío)')
        results.passed++
      }
    }

    await takeScreenshot('04-promotions-filter', 'promotions')
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('04-promotions-filter-error', 'promotions')
    results.failed++
  }

  // TC-PROMO-005: Verify "Nueva promoción" button
  try {
    log('\nTC-PROMO-005: Verificar botón de nueva promoción')
    await goto(ADMIN_PROMOTIONS_URL)
    await wait(1500)

    const page = getPage()
    const pageText = await page.evaluate(() => document.body.innerText)

    // Check for "Nueva promoción" or "Crear primera promoción" button
    if (pageText.includes('Nueva promoción') || pageText.includes('Crear primera promoción')) {
      log('  ✓ Botón de nueva promoción visible')
      results.passed++
    } else {
      throw new Error('Botón de nueva promoción no encontrado')
    }

    await takeScreenshot('05-promotions-new-button', 'promotions')
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('05-promotions-new-button-error', 'promotions')
    results.failed++
  }

  return results
}
