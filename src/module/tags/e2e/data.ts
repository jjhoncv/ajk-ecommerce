/**
 * Tags E2E - Test Data
 */

const now = new Date()
const TEST_SUFFIX = `-test-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`

export const TEST_TAGS = {
  main: {
    name: `Nuevo${TEST_SUFFIX}`,
    color: '#22C55E', // Green
    description: 'Tag de prueba E2E'
  },
  mainEdited: {
    name: `Actualizado${TEST_SUFFIX}`,
    color: '#3B82F6' // Blue
  },
  forDelete: {
    name: `Eliminar${TEST_SUFFIX}`,
    color: '#EF4444' // Red
  }
}

console.log(`Test suffix: ${TEST_SUFFIX}`)
