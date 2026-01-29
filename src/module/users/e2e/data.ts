/**
 * Test data for Users E2E tests
 *
 * Uses unique suffixes to avoid interference with real data
 * Suffix format: -test-YYYYMMDD-HHMMSS
 */

// Generate unique suffix for this test run
const now = new Date()
const TEST_SUFFIX = `-test-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`

// Generate unique email
const generateEmail = (prefix: string): string => {
  const timestamp = Date.now()
  return `${prefix}${timestamp}@test.com`
}

export const TEST_USERS = {
  user: {
    name: `Usuario${TEST_SUFFIX}`,
    lastname: `Prueba${TEST_SUFFIX}`,
    email: generateEmail('user'),
    roleId: 2 // Admin role (not superadmin)
  },
  userEdited: {
    name: `UsuarioEdit${TEST_SUFFIX}`,
    lastname: `PruebaEdit${TEST_SUFFIX}`
  },
  userForDelete: {
    name: `UsuarioElim${TEST_SUFFIX}`,
    lastname: `PruebaElim${TEST_SUFFIX}`,
    email: generateEmail('delete'),
    roleId: 2
  }
}

export const SCREENSHOTS_PATH = 'src/module/users/e2e/screenshots'

// Log the test suffix for debugging
console.log(`Test suffix: ${TEST_SUFFIX}`)
