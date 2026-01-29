/**
 * Test data for Categories E2E tests
 *
 * Uses unique suffixes to avoid interference with real data
 * Suffix format: -test-YYYYMMDD-HHMMSS
 */

// Generate unique suffix for this test run
const now = new Date()
const TEST_SUFFIX = `-test-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`

export const TEST_CATEGORIES = {
  parent: {
    name: `Electrónica${TEST_SUFFIX}`,
    slug: `electronica${TEST_SUFFIX}`,
    description: 'Productos electrónicos y gadgets para testing',
    showNav: '1',
    bannerTitle: 'Electrónica de Alta Calidad',
    bannerCtaText: 'Ver Productos',
    bannerCtaLink: '/search?category=electronica'
  },
  child: {
    name: `Smartphones${TEST_SUFFIX}`,
    slug: `smartphones${TEST_SUFFIX}`,
    description: 'Teléfonos inteligentes para testing',
    showNav: '1'
  },
  hidden: {
    name: `CategoríaOculta${TEST_SUFFIX}`,
    slug: `categoria-oculta${TEST_SUFFIX}`,
    showNav: '0'
  },
  forDelete: {
    name: `ParaEliminar${TEST_SUFFIX}`,
    slug: `para-eliminar${TEST_SUFFIX}`
  }
}

export const TEST_IMAGES = {
  category: 'test-category-400x400.jpg',
  bannerDesktop: 'test-banner-desktop-1400x400.jpg',
  bannerMobile: 'test-banner-mobile-700x350.jpg'
}

export const FIXTURES_PATH = 'src/module/categories/e2e/fixtures'
export const SCREENSHOTS_PATH = 'src/module/categories/e2e/screenshots'

// Log the test suffix for debugging
console.log(`Test suffix: ${TEST_SUFFIX}`)
