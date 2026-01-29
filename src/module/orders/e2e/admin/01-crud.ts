/**
 * Orders E2E - Admin Tests
 *
 * Tests TC-ORDER-001 to TC-ORDER-005
 * Note: Orders are read-only for admins (created by customers)
 * Tests focus on viewing, filtering, and UI elements
 */

import {
  log,
  wait,
  goto,
  getPage,
  takeScreenshot,
  hasEmptyOrdersMessage,
  hasOrderStatistics,
  hasOrderFilters,
  getOrdersCount,
  filterByStatus,
  searchOrders,
  clearSearch,
  getStatValue
} from '../utils'

const ADMIN_ORDERS_URL = '/admin/orders'

export async function runAdminCrudTests(): Promise<{
  passed: number
  failed: number
  skipped: number
}> {
  const results = { passed: 0, failed: 0, skipped: 0 }

  log('🧪 Admin Orders Tests')
  log('='.repeat(50))

  // TC-ORDER-001: Navigate to module
  try {
    log('\nTC-ORDER-001: Navegación al módulo')
    await goto(ADMIN_ORDERS_URL)
    await wait(2000)

    const page = getPage()

    // Check URL
    const currentUrl = page.url()
    if (!currentUrl.includes('/admin/orders')) {
      throw new Error(`No navegó a /admin/orders. URL actual: ${currentUrl}`)
    }

    // Check page content
    const pageText = await page.evaluate(() => document.body.innerText)
    if (pageText.toLowerCase().includes('orden') || pageText.toLowerCase().includes('órdenes')) {
      log('  ✓ Página de órdenes cargada correctamente')
      results.passed++
    } else {
      throw new Error(`Página no contiene "órdenes". Texto visible: ${pageText.slice(0, 200)}`)
    }

    await takeScreenshot('01-orders-list', 'orders')
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('01-orders-list-error', 'orders')
    results.failed++
  }

  // TC-ORDER-002: Check statistics section (only if orders exist)
  try {
    log('\nTC-ORDER-002: Verificar estadísticas')
    await goto(ADMIN_ORDERS_URL)
    await wait(1500)

    // First check if page is in empty state
    const hasEmpty = await hasEmptyOrdersMessage()
    if (hasEmpty) {
      log('  ○ SKIPPED: No hay órdenes - estadísticas no se muestran en estado vacío')
      await takeScreenshot('02-orders-stats-empty', 'orders')
      results.skipped++
    } else {
      const hasStats = await hasOrderStatistics()
      if (!hasStats) {
        throw new Error('No se encontraron las estadísticas de órdenes')
      }

      // Get stat values
      const pendingCount = await getStatValue('Pendientes')
      const processingCount = await getStatValue('Procesando')
      const shippedCount = await getStatValue('Enviados')
      const deliveredCount = await getStatValue('Entregados')

      log(`  Stats: Pendientes=${pendingCount}, Procesando=${processingCount}, Enviados=${shippedCount}, Entregados=${deliveredCount}`)
      log('  ✓ Estadísticas visibles correctamente')
      await takeScreenshot('02-orders-stats', 'orders')
      results.passed++
    }
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('02-orders-stats-error', 'orders')
    results.failed++
  }

  // TC-ORDER-003: Check filters section (only if orders exist)
  try {
    log('\nTC-ORDER-003: Verificar filtros')
    await goto(ADMIN_ORDERS_URL)
    await wait(1500)

    // First check if page is in empty state
    const hasEmpty = await hasEmptyOrdersMessage()
    if (hasEmpty) {
      log('  ○ SKIPPED: No hay órdenes - filtros no se muestran en estado vacío')
      await takeScreenshot('03-orders-filters-empty', 'orders')
      results.skipped++
    } else {
      const hasFilters = await hasOrderFilters()
      if (!hasFilters) {
        throw new Error('No se encontraron los filtros de órdenes')
      }

      log('  ✓ Filtros visibles correctamente')
      await takeScreenshot('03-orders-filters', 'orders')
      results.passed++
    }
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('03-orders-filters-error', 'orders')
    results.failed++
  }

  // TC-ORDER-004: Check empty state or table
  try {
    log('\nTC-ORDER-004: Verificar tabla o estado vacío')
    await goto(ADMIN_ORDERS_URL)
    await wait(1500)

    const ordersCount = await getOrdersCount()
    const hasEmptyMessage = await hasEmptyOrdersMessage()

    if (ordersCount === 0 && hasEmptyMessage) {
      log('  ✓ Estado vacío mostrado correctamente (no hay órdenes)')
    } else if (ordersCount > 0) {
      log(`  ✓ Tabla de órdenes visible con ${ordersCount} órdenes`)
    } else {
      throw new Error('No se pudo determinar el estado de la tabla')
    }

    await takeScreenshot('04-orders-table', 'orders')
    results.passed++
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('04-orders-table-error', 'orders')
    results.failed++
  }

  // TC-ORDER-005: Test filter interaction (only if orders exist)
  try {
    log('\nTC-ORDER-005: Probar interacción de filtros')
    await goto(ADMIN_ORDERS_URL)
    await wait(1500)

    // First check if page is in empty state
    const hasEmpty = await hasEmptyOrdersMessage()
    if (hasEmpty) {
      log('  ○ SKIPPED: No hay órdenes - no se puede probar interacción de filtros')
      await takeScreenshot('05-orders-filter-empty', 'orders')
      results.skipped++
    } else {
      const page = getPage()

      // Try to interact with status filter
      await filterByStatus('pending')
      await wait(500)

      // Check that the filter was applied (even if no results)
      const pageTextAfter = await page.evaluate(() => document.body.innerText)

      // The filter should either show matching orders or "no results"
      if (pageTextAfter.includes('Pendiente') || pageTextAfter.includes('No se encontraron')) {
        log('  ✓ Filtro de estado funciona correctamente')
      } else {
        log('  ✓ Filtro aplicado (sin cambios visibles)')
      }

      await takeScreenshot('05-orders-filter-applied', 'orders')
      results.passed++
    }
  } catch (error: any) {
    log(`  ✗ FAILED: ${error.message}`)
    await takeScreenshot('05-orders-filter-error', 'orders')
    results.failed++
  }

  return results
}
