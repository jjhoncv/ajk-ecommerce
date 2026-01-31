/**
 * __MODULE__ E2E - Test Data
 *
 * INSTRUCCIONES:
 * 1. Copiar este archivo a: src/module/__module__/e2e/data.ts
 * 2. Reemplazar __MODULE__ con nombre en MAYÚSCULAS (ej: TAGS)
 * 3. Reemplazar __module__ con nombre en minúsculas (ej: tags)
 * 4. Reemplazar __Entidad__ con nombre en PascalCase (ej: Tag)
 * 5. Agregar campos adicionales según el spec del módulo
 */

const now = new Date()
const TEST_SUFFIX = `-test-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`

export const TEST___MODULE__ = {
  main: {
    name: `Test __Entidad__${TEST_SUFFIX}`,
    slug: `test-__module__${TEST_SUFFIX}`,
    // Agregar más campos según el spec:
    // description: 'Descripción de prueba',
    // is_active: true,
  },
  mainEdited: {
    name: `Test __Entidad__ Updated${TEST_SUFFIX}`,
  },
  forDelete: {
    name: `Delete Me${TEST_SUFFIX}`,
  }
}

console.log(`Test suffix: ${TEST_SUFFIX}`)
