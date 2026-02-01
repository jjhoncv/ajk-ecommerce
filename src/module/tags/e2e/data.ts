/**
 * TAGS E2E - Test Data
 */

const now = new Date()
const TEST_SUFFIX = `-test-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`

export const TEST_TAGS = {
  main: {
    name: `Test Tag${TEST_SUFFIX}`,
    slug: `test-tag${TEST_SUFFIX}`,
    description: 'Tag de prueba para E2E',
    color: '#22C55E'
  },
  mainEdited: {
    name: `Test Tag Updated${TEST_SUFFIX}`,
    color: '#EF4444'
  },
  forDelete: {
    name: `Delete Me${TEST_SUFFIX}`,
    color: '#6B7280'
  }
}

console.log(`Test suffix: ${TEST_SUFFIX}`)
