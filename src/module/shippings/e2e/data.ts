/**
 * Test data for Shippings E2E tests
 */

const timestamp = Date.now()

export const TEST_SHIPPING_METHOD = {
  name: `Envío Test ${timestamp}`,
  description: 'Método de envío de prueba',
  isActive: true
}

export const TEST_SHIPPING_ZONE = {
  name: `Zona Test ${timestamp}`,
  description: 'Zona de envío de prueba',
  isActive: true
}

export const SCREENSHOTS_PATH = 'src/module/shippings/e2e/screenshots'
