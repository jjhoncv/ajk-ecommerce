/**
 * Tags E2E - Test Data
 */

const now = new Date()
const TEST_SUFFIX = `-test-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`

export const TEST_TAGS = {
  main: {
    name: `Nuevo${TEST_SUFFIX}`,
    color: '#22C55E',
    description: 'Tag de prueba para productos nuevos'
  },
  mainEdited: {
    name: `Bestseller${TEST_SUFFIX}`,
    color: '#EF4444',
    description: 'Tag editado para bestsellers'
  },
  forDelete: {
    name: `ToDelete${TEST_SUFFIX}`,
    color: '#6B7280',
    description: 'Tag para probar eliminacion'
  },
  forIntegration: {
    name: `Integration${TEST_SUFFIX}`,
    color: '#3B82F6',
    description: 'Tag para probar integracion con variantes'
  }
}

export { TEST_SUFFIX }

console.log(`Test suffix: ${TEST_SUFFIX}`)
