/**
 * Test data for Brands E2E tests
 *
 * Uses unique suffixes to avoid interference with real data
 * Suffix format: -test-YYYYMMDD-HHMMSS
 */

// Generate unique suffix for this test run
const now = new Date()
const TEST_SUFFIX = `-test-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`

export const TEST_BRANDS = {
  brand: {
    name: `Nike${TEST_SUFFIX}`
  },
  brandEdited: {
    name: `Nike Updated${TEST_SUFFIX}`
  },
  brandForDelete: {
    name: `Adidas${TEST_SUFFIX}`
  }
}

export const SCREENSHOTS_PATH = 'src/module/brands/e2e/screenshots'

// Log the test suffix for debugging
console.log(`Test suffix: ${TEST_SUFFIX}`)
