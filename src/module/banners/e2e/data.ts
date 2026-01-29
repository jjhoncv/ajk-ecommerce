/**
 * Banners E2E - Test Data
 */

// Generar sufijo único con timestamp
const now = new Date()
const TEST_SUFFIX = `-test-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`

export const TEST_BANNERS = {
  main: {
    title: `Oferta Especial${TEST_SUFFIX}`,
    link: 'https://example.com/promociones',
    buttonText: 'Ver Ofertas',
    description: 'Descubre nuestras mejores ofertas de temporada con descuentos increíbles.',
    subtitle: 'Hasta 50% de descuento'
  },
  secondary: {
    title: `Nueva Colección${TEST_SUFFIX}`,
    link: 'https://example.com/nueva-coleccion',
    buttonText: 'Explorar',
    description: 'Conoce nuestra nueva colección de productos.',
    subtitle: 'Novedades 2026'
  },
  forDelete: {
    title: `BannerEliminar${TEST_SUFFIX}`,
    link: 'https://example.com/test',
    buttonText: 'Test',
    description: 'Banner para prueba de eliminación.',
    subtitle: ''
  }
}

export { TEST_SUFFIX }
