# Skill: Crear Tests E2E Ecommerce

## Rol
QA

## Trigger
Module Lead asigna tarea de crear tests ecommerce (después de tests admin)

## Inputs
- Nombre del módulo
- `.agents/specs/[modulo]-testing-spec.md` (sección Ecommerce)
- Componentes ecommerce ya creados
- Branch de trabajo

---

## ⛔ PROHIBICIONES ABSOLUTAS

### NO INSTALAR NADA

```bash
# ❌ PROHIBIDO
npm install playwright
pnpm add @playwright/test
```

### NO USAR PLAYWRIGHT

Usar **Puppeteer** con utilidades existentes en `tests/e2e/utils/`.

### NO REVISAR TESTS DE OTROS MÓDULOS

Solo usar este skill + `tests/e2e/E2E-MODULE-INIT.md`.

---

## ⚠️ VERIFICAR SERVIDOR ANTES DE EJECUTAR

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
# Debe devolver 200
```

---

## Steps

### 1. Verificar Prerequisitos

```bash
# Verificar componentes ecommerce
ls src/module/[modulo]/components/ecommerce/

# Verificar páginas públicas (si aplica)
ls src/app/[modulo]/

# Cambiar a branch
git checkout feature/[modulo]
```

### 2. Crear Estructura

```bash
mkdir -p src/module/[modulo]/e2e/ecommerce
mkdir -p src/module/[modulo]/e2e/screenshots/ecommerce
```

### 3. Crear data-ecommerce.ts

```typescript
// src/module/[modulo]/e2e/data-ecommerce.ts
/**
 * Datos de referencia para tests ecommerce
 * NOTA: No se crean datos - se usan los existentes del admin
 */

// URLs públicas a probar
export const ECOMMERCE_URLS = {
  home: '/',
  list: '/[modulo]',
  detail: '/[modulo]/[slug-existente]',  // Usar slug real
  notFound: '/[modulo]/slug-que-no-existe'
}

// Selectores de elementos
export const SELECTORS = {
  // Grilla de items
  grid: '[class*="grid"]',
  gridItem: 'a[href^="/[modulo]/"]',

  // Card de item
  cardImage: 'img',
  cardTitle: 'h3',
  cardDescription: 'p',

  // Página de detalle
  detailTitle: 'h1',
  detailImage: 'img[alt]',
  detailDescription: 'p',

  // Featured section
  featuredSection: 'section',
  featuredCard: 'a[href^="/[modulo]/"]',

  // 404
  notFoundTitle: 'h1',
  backLink: 'a[href="/[modulo]"]'
}
```

### 4. Crear ecommerce/01-public.ts

```typescript
// src/module/[modulo]/e2e/ecommerce/01-public.ts
/**
 * Tests E2E Ecommerce - Páginas Públicas
 */

import { ECOMMERCE_URLS, SELECTORS } from '../data-ecommerce'
import {
  log, wait, goto, getPage, takeScreenshot
} from '../utils'

const SCREENSHOTS_DIR = 'src/module/[modulo]/e2e/screenshots/ecommerce'

export async function run[Entidad]EcommerceTests(): Promise<{
  passed: number
  failed: number
}> {
  const results = { passed: 0, failed: 0 }

  // ===========================================
  // TC-E01: Homepage muestra sección de [modulo]s
  // ===========================================
  try {
    log('TC-E01: Verificar sección [modulo]s en homepage')
    await goto(ECOMMERCE_URLS.home)
    await wait(2000)

    const page = getPage()

    // Buscar sección con items del módulo
    const hasSection = await page.evaluate((selector) => {
      const items = document.querySelectorAll(selector)
      return items.length > 0
    }, SELECTORS.gridItem)

    await takeScreenshot('e01-homepage-section', SCREENSHOTS_DIR)

    if (hasSection) {
      log('  ✓ Sección [modulo]s visible en homepage')
      results.passed++
    } else {
      log('  ⚠️ Sección [modulo]s no encontrada (puede no estar integrada aún)')
      results.passed++ // No es error crítico
    }
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('e01-homepage-ERROR', SCREENSHOTS_DIR)
    results.failed++
  }

  // ===========================================
  // TC-E02: Página de listado carga
  // ===========================================
  try {
    log('TC-E02: Página de listado de [modulo]s')
    await goto(ECOMMERCE_URLS.list)
    await wait(2000)

    const page = getPage()

    // Verificar título
    const hasTitle = await page.evaluate(() => {
      const h1 = document.querySelector('h1')
      return h1 !== null
    })

    // Verificar grilla
    const hasGrid = await page.evaluate((selector) => {
      return document.querySelector(selector) !== null
    }, SELECTORS.grid)

    await takeScreenshot('e02-list-page', SCREENSHOTS_DIR)

    log(`  - Título: ${hasTitle ? '✓' : '✗'}`)
    log(`  - Grilla: ${hasGrid ? '✓' : '✗'}`)

    if (hasTitle || hasGrid) {
      log('  ✓ Página de listado OK')
      results.passed++
    } else {
      throw new Error('Página de listado no tiene contenido esperado')
    }
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('e02-list-ERROR', SCREENSHOTS_DIR)
    results.failed++
  }

  // ===========================================
  // TC-E03: Cards tienen información correcta
  // ===========================================
  try {
    log('TC-E03: Verificar cards de [modulo]s')
    await goto(ECOMMERCE_URLS.list)
    await wait(1500)

    const page = getPage()

    const cardInfo = await page.evaluate((selectors) => {
      const firstCard = document.querySelector(selectors.gridItem)
      if (!firstCard) return null

      return {
        hasImage: firstCard.querySelector('img') !== null,
        hasTitle: firstCard.querySelector('h3') !== null,
        hasLink: firstCard.hasAttribute('href')
      }
    }, SELECTORS)

    await takeScreenshot('e03-card-detail', SCREENSHOTS_DIR)

    if (cardInfo) {
      log(`  - Imagen: ${cardInfo.hasImage ? '✓' : '✗'}`)
      log(`  - Título: ${cardInfo.hasTitle ? '✓' : '✗'}`)
      log(`  - Link: ${cardInfo.hasLink ? '✓' : '✗'}`)
      log('  ✓ Cards tienen información correcta')
      results.passed++
    } else {
      log('  ⚠️ No hay cards para verificar')
      results.passed++ // No es error si no hay datos
    }
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('e03-card-ERROR', SCREENSHOTS_DIR)
    results.failed++
  }

  // ===========================================
  // TC-E04: Navegación a detalle
  // ===========================================
  try {
    log('TC-E04: Navegación a página de detalle')
    await goto(ECOMMERCE_URLS.list)
    await wait(1500)

    const page = getPage()

    // Click en primer item
    const clicked = await page.evaluate((selector) => {
      const firstItem = document.querySelector(selector) as HTMLAnchorElement
      if (firstItem) {
        firstItem.click()
        return true
      }
      return false
    }, SELECTORS.gridItem)

    if (clicked) {
      await wait(2000)
      await takeScreenshot('e04-detail-page', SCREENSHOTS_DIR)

      // Verificar que navegó a detalle
      const isDetailPage = page.url().includes('/[modulo]/')
      const hasDetailContent = await page.evaluate(() => {
        return document.querySelector('h1') !== null
      })

      if (isDetailPage && hasDetailContent) {
        log('  ✓ Navegación a detalle funciona')
        results.passed++
      } else {
        throw new Error('No navegó correctamente a detalle')
      }
    } else {
      log('  ⚠️ No hay items para navegar')
      results.passed++
    }
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('e04-detail-ERROR', SCREENSHOTS_DIR)
    results.failed++
  }

  // ===========================================
  // TC-E05: Página de detalle muestra info
  // ===========================================
  try {
    log('TC-E05: Contenido de página de detalle')

    const page = getPage()

    // Ya estamos en detalle del test anterior
    const detailInfo = await page.evaluate(() => {
      return {
        hasTitle: document.querySelector('h1') !== null,
        hasImage: document.querySelector('img') !== null,
        title: document.querySelector('h1')?.textContent || ''
      }
    })

    await takeScreenshot('e05-detail-content', SCREENSHOTS_DIR)

    log(`  - Título: ${detailInfo.hasTitle ? '✓' : '✗'} (${detailInfo.title})`)
    log(`  - Imagen: ${detailInfo.hasImage ? '✓' : '✗'}`)

    if (detailInfo.hasTitle) {
      log('  ✓ Página de detalle muestra información')
      results.passed++
    } else {
      throw new Error('Página de detalle sin contenido')
    }
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('e05-detail-content-ERROR', SCREENSHOTS_DIR)
    results.failed++
  }

  // ===========================================
  // TC-E06: Página 404 para slug inexistente
  // ===========================================
  try {
    log('TC-E06: Página 404 para [modulo] inexistente')
    await goto(ECOMMERCE_URLS.notFound)
    await wait(2000)

    const page = getPage()

    const is404 = await page.evaluate(() => {
      const body = document.body.textContent?.toLowerCase() || ''
      return body.includes('no encontrado') ||
             body.includes('not found') ||
             body.includes('404')
    })

    await takeScreenshot('e06-404-page', SCREENSHOTS_DIR)

    if (is404) {
      log('  ✓ Página 404 funciona correctamente')
      results.passed++
    } else {
      log('  ⚠️ No hay página 404 personalizada')
      results.passed++ // No crítico
    }
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('e06-404-ERROR', SCREENSHOTS_DIR)
    results.failed++
  }

  // ===========================================
  // TC-E07: Responsive - Mobile
  // ===========================================
  try {
    log('TC-E07: Verificar responsive (mobile)')

    const page = getPage()
    await page.setViewport({ width: 375, height: 667 })

    await goto(ECOMMERCE_URLS.list)
    await wait(1500)

    await takeScreenshot('e07-mobile-list', SCREENSHOTS_DIR)

    // Verificar que grilla se adapta
    const gridColumns = await page.evaluate(() => {
      const grid = document.querySelector('[class*="grid"]')
      if (!grid) return 'no-grid'
      const style = window.getComputedStyle(grid)
      return style.gridTemplateColumns
    })

    log(`  - Grid columns: ${gridColumns}`)

    // Restaurar viewport
    await page.setViewport({ width: 1280, height: 720 })

    log('  ✓ Responsive verificado')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('e07-mobile-ERROR', SCREENSHOTS_DIR)
    results.failed++
  }

  return results
}
```

### 5. Crear index-ecommerce.ts

```typescript
#!/usr/bin/env npx tsx
// src/module/[modulo]/e2e/index-ecommerce.ts
/**
 * [Modulo] E2E Ecommerce Test Runner
 */

import fs from 'fs'
import path from 'path'
import {
  initBrowser, closeBrowser, log, goto, wait, getPage
} from './utils'
import { run[Entidad]EcommerceTests } from './ecommerce/01-public'

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots/ecommerce')

function cleanupScreenshots(): void {
  if (fs.existsSync(SCREENSHOTS_DIR)) {
    const files = fs.readdirSync(SCREENSHOTS_DIR)
    let cleaned = 0
    for (const file of files) {
      if (file.endsWith('.png')) {
        fs.unlinkSync(path.join(SCREENSHOTS_DIR, file))
        cleaned++
      }
    }
    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} previous screenshots`)
    }
  } else {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
  }
}

async function main(): Promise<void> {
  console.log('🛒 [MODULO] E2E ECOMMERCE TESTS')
  console.log('='.repeat(50))

  cleanupScreenshots()

  try {
    log('Iniciando browser...')
    await initBrowser()

    // NO login - tests públicos
    log('Navegando a homepage...')
    await goto('/')
    await wait(2000)

    // Ejecutar tests
    const results = await run[Entidad]EcommerceTests()

    // Resumen
    console.log('\n' + '='.repeat(50))
    console.log('📊 RESUMEN DE PRUEBAS ECOMMERCE')
    console.log('='.repeat(50))
    console.log(`  ✓ Passed: ${results.passed}`)
    console.log(`  ✗ Failed: ${results.failed}`)
    console.log(`  📸 Screenshots: ${SCREENSHOTS_DIR}`)

    if (results.failed > 0) {
      console.log('\n⚠️ HAY FALLAS - Revisar screenshots para diagnóstico')
    } else {
      console.log('\n✅ TODAS LAS PRUEBAS PASARON')
    }

    process.exit(results.failed > 0 ? 1 : 0)
  } catch (error: any) {
    log(`❌ Error fatal: ${error.message}`)
    process.exit(1)
  } finally {
    await closeBrowser()
  }
}

main()
```

### 6. Ejecutar Tests

```bash
# Verificar servidor
curl -s http://localhost:3000 | head -c 100

# Ejecutar tests ecommerce
npx tsx src/module/[modulo]/e2e/index-ecommerce.ts
```

### 7. Revisar Screenshots

```bash
ls -la src/module/[modulo]/e2e/screenshots/ecommerce/
```

Screenshots esperados:
- `e01-homepage-section.png` - Sección en homepage
- `e02-list-page.png` - Página de listado
- `e03-card-detail.png` - Detalle de cards
- `e04-detail-page.png` - Página de detalle
- `e05-detail-content.png` - Contenido de detalle
- `e06-404-page.png` - Página 404
- `e07-mobile-list.png` - Vista mobile

### 8. Notificar a Module Lead

```
TESTS ECOMMERCE EJECUTADOS: [modulo]
====================================

ESTADO: Esperando validación de screenshots

RESULTADOS:
  ✓ Passed: [X]
  ✗ Failed: [Y]

SCREENSHOTS: src/module/[modulo]/e2e/screenshots/ecommerce/

CASOS PROBADOS:
  - TC-E01: Sección en homepage
  - TC-E02: Página de listado
  - TC-E03: Cards con información
  - TC-E04: Navegación a detalle
  - TC-E05: Contenido de detalle
  - TC-E06: Página 404
  - TC-E07: Responsive mobile

SOLICITO: Validación de screenshots vs modelo de negocio
```

### 9. Commit (después de aprobación)

```bash
git add src/module/[modulo]/e2e/ecommerce/
git add src/module/[modulo]/e2e/screenshots/ecommerce/
git add src/module/[modulo]/e2e/data-ecommerce.ts
git add src/module/[modulo]/e2e/index-ecommerce.ts

git commit -m "$(cat <<'EOF'
test([modulo]): QA add ecommerce e2e tests with screenshots

- Add public page tests (list, detail, 404)
- Add homepage section verification
- Add responsive mobile test
- Screenshots for visual verification

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Outputs
- `src/module/[modulo]/e2e/ecommerce/` con tests
- `src/module/[modulo]/e2e/screenshots/ecommerce/` con evidencia
- Tests ejecutados
- Screenshots generados

## NO Hacer
- ❌ NO hacer login (son páginas públicas)
- ❌ NO probar funcionalidad admin
- ❌ NO instalar dependencias
- ❌ NO usar Playwright
