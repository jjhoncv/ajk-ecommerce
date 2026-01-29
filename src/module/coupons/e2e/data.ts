/**
 * Test data for Coupons E2E tests
 *
 * Uses unique suffixes to avoid interference with real data
 * Suffix format: -test-YYYYMMDD-HHMMSS
 */

// Generate unique suffix for this test run
const now = new Date()
const TEST_SUFFIX = `-test-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`

// Generate future dates for valid coupons
const startDate = new Date()
startDate.setHours(0, 0, 0, 0)

const endDate = new Date()
endDate.setDate(endDate.getDate() + 30) // 30 days from now
endDate.setHours(23, 59, 59, 0)

// Format date for datetime-local input
const formatDateForInput = (date: Date): string => {
  return date.toISOString().slice(0, 16)
}

export const TEST_COUPONS = {
  coupon: {
    name: `Descuento Prueba${TEST_SUFFIX}`,
    code: `TEST${TEST_SUFFIX}`.toUpperCase().replace(/-/g, ''),
    discountType: 'percentage' as const,
    discountValue: '10',
    startDate: formatDateForInput(startDate),
    endDate: formatDateForInput(endDate),
    minPurchaseAmount: '100',
    usageLimit: '50',
    usageLimitPerCustomer: '1'
  },
  couponEdited: {
    name: `Descuento Actualizado${TEST_SUFFIX}`,
    discountValue: '15'
  },
  couponForDelete: {
    name: `Cupón Eliminar${TEST_SUFFIX}`,
    code: `DEL${TEST_SUFFIX}`.toUpperCase().replace(/-/g, ''),
    discountType: 'fixed_amount' as const,
    discountValue: '20',
    startDate: formatDateForInput(startDate),
    endDate: formatDateForInput(endDate)
  }
}

export const SCREENSHOTS_PATH = 'src/module/coupons/e2e/screenshots'

// Log the test suffix for debugging
console.log(`Test suffix: ${TEST_SUFFIX}`)
