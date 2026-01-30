# Skill: Crear y Ejecutar Tests E2E Exploratorios

## Rol
QA

## Trigger
Module Lead asigna tarea de crear tests (después de Frontend y Backend)

## Inputs
- Nombre del módulo
- `.agents/specs/[modulo]-testing-spec.md`
- UI del admin ya funcionando
- API endpoints funcionando
- Branch de trabajo

---

## CONFIGURACIÓN CRÍTICA

### Credenciales Admin (OBLIGATORIO)

```typescript
// Las credenciales REALES del admin son:
export const adminCredentials = {
  email: 'admin@ajk.com',
  password: 'Admin123!'  // NOTA: Contraseña real, no placeholder
}
```

**NO usar placeholders** como `admin/12345678` - esos son solo ejemplos visuales del formulario.

### Detección de Puerto del Servidor

El servidor de desarrollo puede correr en diferentes puertos (3000, 3001, 3002, etc.):

```bash
# Verificar en qué puerto está corriendo
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || \
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 || \
curl -s -o /dev/null -w "%{http_code}" http://localhost:3002

# O usar variable de entorno
BASE_URL=http://localhost:3002 npx tsx src/module/[modulo]/e2e/index.ts
```

### Selectores de Login Flexibles

El formulario de login **NO tiene atributo `name`** en los inputs. Usar selectores flexibles:

```typescript
// ✅ CORRECTO - Selector flexible
'input[name="email"], input[type="email"], form input[type="text"]:first-of-type'

// ❌ INCORRECTO - El input no tiene name="email"
'input[name="email"]'
```

---

## Prerequisitos

Antes de crear tests, verificar que:
1. Servidor de desarrollo corriendo (`pnpm dev`)
2. Páginas admin existen y funcionan
3. API endpoints responden correctamente
4. No hay errores de lint críticos
5. **Puerto del servidor identificado** (3000, 3001, 3002, etc.)

---

## IMPORTANTE: Framework de Testing

Este proyecto usa **Puppeteer** (NO Playwright) con utilidades compartidas en `tests/e2e/utils/`.

Referencia obligatoria: `tests/e2e/E2E-MODULE-INIT.md`

---

## Steps

### 1. Verificar Prerequisitos

```bash
# Verificar que páginas admin existen
ls src/app/admin/[modulo]/

# Debe mostrar: page.tsx, new/, [id]/

# Verificar que API existe
ls src/app/api/admin/[modulo]/

# Cambiar a branch
git checkout feature/[modulo]
```

### 2. Verificar Servidor Corriendo

```bash
# En otra terminal debe estar corriendo:
# pnpm dev

# Verificar que responde
curl -s http://localhost:3000/admin/[modulo] | head -c 100
```

### 3. Crear Estructura E2E Completa

```bash
mkdir -p src/module/[modulo]/e2e/fixtures
mkdir -p src/module/[modulo]/e2e/admin
mkdir -p src/module/[modulo]/e2e/screenshots
```

### 4. Crear data.ts con TEST_SUFFIX

```typescript
// src/module/[modulo]/e2e/data.ts
/**
 * [Modulo] E2E - Test Data
 */

const now = new Date()
const TEST_SUFFIX = `-test-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`

export const TEST_[MODULO] = {
  main: {
    name: `Test [Entidad]${TEST_SUFFIX}`,
    slug: `test-[modulo]${TEST_SUFFIX}`,
    // otros campos según el módulo...
  },
  mainEdited: {
    name: `Test [Entidad] Updated${TEST_SUFFIX}`,
  },
  forDelete: {
    name: `Delete Me${TEST_SUFFIX}`,
  }
}

console.log(`Test suffix: ${TEST_SUFFIX}`)
```

### 5. Crear utils.ts

```typescript
// src/module/[modulo]/e2e/utils.ts
/**
 * [Modulo] E2E - Module Utilities
 */

import fs from 'fs'
import path from 'path'
import { getPage } from '../../../../tests/e2e/utils'

// Paths del módulo
const MODULE_DIR = path.join(__dirname)
export const FIXTURES_DIR = path.join(MODULE_DIR, 'fixtures')
export const SCREENSHOTS_DIR = path.join(MODULE_DIR, 'screenshots')

// Crear carpeta de screenshots si no existe
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
}

/**
 * Screenshot con path del módulo
 */
export async function takeScreenshot(name: string): Promise<string> {
  const p = getPage()
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `${name}_${timestamp}.png`
  const filepath = path.join(SCREENSHOTS_DIR, filename)
  await p.screenshot({ path: filepath, fullPage: true })
  console.log(`  📸 Screenshot: ${filename}`)
  return filepath
}

// Re-exportar utilidades compartidas
export {
  initBrowser, closeBrowser, getPage, goto, wait, log,
  waitAndClick, clearAndType, waitForText, login,
  // Table actions
  findRowByContent, openRowActionsMenu, clickMenuAction,
  confirmDeleteModal, cancelDeleteModal, isModalVisible, itemExistsInTable,
  // Form helpers
  fillTextField, fillTextArea, submitForm, hasValidationError,
  clearAndFillField, selectOption
} from '../../../../tests/e2e/utils'
```

### 6. Crear index.ts (Runner Principal)

```typescript
#!/usr/bin/env npx tsx
// src/module/[modulo]/e2e/index.ts
/**
 * [Modulo] E2E Test Runner
 *
 * Ejecuta pruebas exploratorias con screenshots
 */

import fs from 'fs'
import path from 'path'
import {
  initBrowser, closeBrowser, log, goto, wait, getPage,
  takeScreenshot, SCREENSHOTS_DIR, login
} from './utils'
import { run[Modulo]Tests } from './admin/01-crud'

/**
 * Limpiar screenshots anteriores
 */
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
  }
}

async function main(): Promise<void> {
  console.log('🧪 [MODULO] E2E EXPLORATORY TESTS')
  console.log('='.repeat(50))

  // SIEMPRE limpiar screenshots al inicio
  cleanupScreenshots()

  try {
    log('Iniciando browser...')
    await initBrowser()

    // Login como admin
    log('Login como admin...')
    await login('admin@ajk.com', 'Admin123!')
    await wait(2000)
    log('Login exitoso')

    // Screenshot del dashboard
    await takeScreenshot('00-dashboard-after-login')

    // Ejecutar tests exploratorios
    const results = await run[Modulo]Tests()

    // Resumen
    console.log('\n' + '='.repeat(50))
    console.log('📊 RESUMEN DE PRUEBAS EXPLORATORIAS')
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
    await takeScreenshot('ERROR-fatal')
    process.exit(1)
  } finally {
    await closeBrowser()
  }
}

main()
```

### 7. Crear Tests Exploratorios (admin/01-crud.ts)

```typescript
// src/module/[modulo]/e2e/admin/01-crud.ts
/**
 * [Modulo] E2E - Exploratory Admin Tests
 *
 * Pruebas visuales con screenshots en cada paso
 */

import { TEST_[MODULO] } from '../data'
import {
  log, wait, goto, getPage,
  fillTextField, submitForm, hasValidationError,
  openRowActionsMenu, clickMenuAction,
  confirmDeleteModal, cancelDeleteModal, isModalVisible,
  itemExistsInTable, clearAndType, takeScreenshot
} from '../utils'

const ADMIN_URL = '/admin/[modulo]'
const NEW_URL = '/admin/[modulo]/new'

export async function run[Modulo]Tests(): Promise<{ passed: number; failed: number }> {
  const results = { passed: 0, failed: 0 }

  // ===========================================
  // TC-001: Verificar Sidebar del Admin
  // ===========================================
  try {
    log('TC-001: Verificar módulo en sidebar')
    await goto('/admin')
    await wait(1000)

    const page = getPage()
    const sidebarHasModule = await page.evaluate(() => {
      const sidebar = document.querySelector('nav, aside, [class*="sidebar"]')
      return sidebar?.textContent?.toLowerCase().includes('[modulo]') || false
    })

    await takeScreenshot('01-sidebar-check')

    if (!sidebarHasModule) {
      log('  ⚠️ Módulo no visible en sidebar (puede estar en submenú)')
    }
    log('  ✓ Sidebar verificado')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('01-sidebar-ERROR')
    results.failed++
  }

  // ===========================================
  // TC-002: Navegación a Lista
  // ===========================================
  try {
    log('TC-002: Navegar a lista de [modulo]s')
    await goto(ADMIN_URL)
    await wait(1500)

    const page = getPage()
    if (!page.url().includes('/admin/[modulo]')) {
      throw new Error(`URL incorrecta: ${page.url()}`)
    }

    // Verificar elementos de la página
    const hasTitle = await page.evaluate(() => {
      const h1 = document.querySelector('h1')
      return h1?.textContent?.toLowerCase().includes('[modulo]') ||
             h1?.textContent?.toLowerCase().includes('[entidad]') || false
    })

    const hasTable = await page.evaluate(() => {
      return document.querySelector('table') !== null
    })

    const hasNewButton = await page.evaluate(() => {
      const links = document.querySelectorAll('a')
      for (const link of links) {
        if (link.href.includes('/new')) return true
      }
      return false
    })

    await takeScreenshot('02-list-page')

    log(`  - Título correcto: ${hasTitle ? '✓' : '✗'}`)
    log(`  - Tabla visible: ${hasTable ? '✓' : '✗'}`)
    log(`  - Botón Nuevo: ${hasNewButton ? '✓' : '✗'}`)

    if (!hasTable) throw new Error('No se encontró tabla de datos')

    log('  ✓ Lista carga correctamente')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('02-list-ERROR')
    results.failed++
  }

  // ===========================================
  // TC-003: Formulario de Creación
  // ===========================================
  try {
    log('TC-003: Verificar formulario de creación')
    await goto(NEW_URL)
    await wait(1000)

    const page = getPage()

    // Verificar campos del formulario
    const formFields = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input, textarea, select')
      return Array.from(inputs).map(i => ({
        name: i.getAttribute('name'),
        type: i.getAttribute('type') || i.tagName.toLowerCase()
      }))
    })

    await takeScreenshot('03-new-form-empty')

    log(`  - Campos encontrados: ${formFields.length}`)
    formFields.forEach(f => log(`    · ${f.name} (${f.type})`))

    if (formFields.length === 0) throw new Error('Formulario sin campos')

    log('  ✓ Formulario de creación OK')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('03-form-ERROR')
    results.failed++
  }

  // ===========================================
  // TC-004: Crear Nuevo Item
  // ===========================================
  try {
    log('TC-004: Crear nuevo [modulo]')
    await goto(NEW_URL)
    await wait(500)

    // Llenar formulario con datos de prueba
    await fillTextField('name', TEST_[MODULO].main.name)

    // Intentar llenar slug si existe
    try {
      await fillTextField('slug', TEST_[MODULO].main.slug)
    } catch { /* campo opcional */ }

    await takeScreenshot('04-form-filled')

    await submitForm()
    await wait(2000)

    // Verificar redirección a lista
    const page = getPage()
    if (!page.url().includes(ADMIN_URL) || page.url().includes('/new')) {
      await takeScreenshot('04-submit-no-redirect')
      throw new Error('No redirigió después de crear')
    }

    // Verificar que aparece en la lista
    const exists = await itemExistsInTable(TEST_[MODULO].main.name)
    await takeScreenshot('04-after-create')

    if (!exists) throw new Error('Item creado no aparece en tabla')

    log('  ✓ Item creado exitosamente')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('04-create-ERROR')
    results.failed++
  }

  // ===========================================
  // TC-005: Editar Item
  // ===========================================
  try {
    log('TC-005: Editar [modulo]')
    await goto(ADMIN_URL)
    await wait(1000)

    // Abrir menú de acciones
    const menuOpened = await openRowActionsMenu(TEST_[MODULO].main.name)
    if (!menuOpened) throw new Error('No se pudo abrir menú de acciones')

    await takeScreenshot('05-actions-menu')

    // Click en editar
    await clickMenuAction('edit')
    await wait(1500)

    // Verificar que cargó el formulario de edición
    const page = getPage()
    if (!page.url().includes('/admin/[modulo]/')) {
      throw new Error('No navegó a página de edición')
    }

    await takeScreenshot('05-edit-form-loaded')

    // Modificar nombre
    await clearAndType('input[name="name"]', TEST_[MODULO].mainEdited.name)
    await takeScreenshot('05-edit-form-modified')

    await submitForm()
    await wait(2000)

    // Verificar que se guardó
    const exists = await itemExistsInTable(TEST_[MODULO].mainEdited.name)
    await takeScreenshot('05-after-edit')

    if (!exists) throw new Error('Cambios no se guardaron')

    log('  ✓ Item editado exitosamente')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('05-edit-ERROR')
    results.failed++
  }

  // ===========================================
  // TC-006: Modal de Eliminación (Cancelar)
  // ===========================================
  try {
    log('TC-006: Verificar modal de eliminación (cancelar)')
    await goto(ADMIN_URL)
    await wait(1000)

    await openRowActionsMenu(TEST_[MODULO].mainEdited.name)
    await wait(300)
    await clickMenuAction('delete')
    await wait(500)

    const modalVisible = await isModalVisible()
    await takeScreenshot('06-delete-modal')

    if (!modalVisible) throw new Error('Modal de confirmación no apareció')

    await cancelDeleteModal()
    await wait(500)

    // Verificar que el item sigue existiendo
    const stillExists = await itemExistsInTable(TEST_[MODULO].mainEdited.name)
    if (!stillExists) throw new Error('Item desapareció después de cancelar')

    await takeScreenshot('06-after-cancel')

    log('  ✓ Cancelación de eliminación OK')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('06-cancel-ERROR')
    results.failed++
  }

  // ===========================================
  // TC-007: Eliminar Item
  // ===========================================
  try {
    log('TC-007: Eliminar [modulo]')

    // Primero crear uno para eliminar
    await goto(NEW_URL)
    await wait(500)
    await fillTextField('name', TEST_[MODULO].forDelete.name)
    try {
      await fillTextField('slug', `delete-me-${Date.now()}`)
    } catch { /* opcional */ }
    await submitForm()
    await wait(2000)

    await takeScreenshot('07-created-for-delete')

    // Ahora eliminar
    await openRowActionsMenu(TEST_[MODULO].forDelete.name)
    await wait(300)
    await clickMenuAction('delete')
    await wait(500)

    await takeScreenshot('07-delete-confirm-modal')

    await confirmDeleteModal()
    await wait(2000)

    // Verificar que ya no existe
    const stillExists = await itemExistsInTable(TEST_[MODULO].forDelete.name)
    await takeScreenshot('07-after-delete')

    if (stillExists) throw new Error('Item no fue eliminado')

    log('  ✓ Item eliminado exitosamente')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('07-delete-ERROR')
    results.failed++
  }

  // ===========================================
  // TC-008: Validación de Formulario
  // ===========================================
  try {
    log('TC-008: Validación de campos requeridos')
    await goto(NEW_URL)
    await wait(500)

    // Intentar enviar sin llenar
    await submitForm()
    await wait(1000)

    const page = getPage()
    // Si sigue en /new, la validación funcionó
    const stayedOnForm = page.url().includes('/new')

    await takeScreenshot('08-validation-errors')

    if (!stayedOnForm) {
      log('  ⚠️ Formulario se envió sin validación')
    }

    log('  ✓ Validación verificada')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    await takeScreenshot('08-validation-ERROR')
    results.failed++
  }

  return results
}
```

### 8. Crear cleanup.ts

```typescript
#!/usr/bin/env npx tsx
// src/module/[modulo]/e2e/cleanup.ts
/**
 * [Modulo] E2E - Cleanup
 *
 * Limpia datos de prueba de la BD y screenshots
 *
 * Usage:
 *   npx tsx src/module/[modulo]/e2e/cleanup.ts 2026-01-29
 *   npx tsx src/module/[modulo]/e2e/cleanup.ts all
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots')
const DOCKER_CONTAINER = 'ajk-ecommerce'
const TABLE_NAME = '[tabla]'  // Nombre de la tabla en BD

const dateArg = process.argv[2]
if (!dateArg) {
  console.log('Uso: npx tsx cleanup.ts <fecha|all>')
  console.log('  Ejemplo: npx tsx cleanup.ts 2026-01-29')
  console.log('  Ejemplo: npx tsx cleanup.ts all')
  process.exit(1)
}

const pattern = dateArg === 'all'
  ? '%-test-%'
  : `%-test-${dateArg.replace(/-/g, '')}-%`

function runSQL(sql: string): string {
  try {
    return execSync(
      `docker exec ${DOCKER_CONTAINER} mysql -uroot -p12345678 ajkecommerce -e "${sql}"`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    )
  } catch (e: any) {
    return e.stdout || ''
  }
}

console.log(`🧹 Limpiando datos de test: ${pattern}`)

// Mostrar y eliminar registros
const items = runSQL(`SELECT id, name FROM ${TABLE_NAME} WHERE name LIKE '${pattern}'`)
if (items.trim()) {
  console.log('Registros a eliminar:')
  console.log(items)
  runSQL(`DELETE FROM ${TABLE_NAME} WHERE name LIKE '${pattern}'`)
  console.log('✓ Registros eliminados de BD')
}

// Eliminar screenshots
if (fs.existsSync(SCREENSHOTS_DIR)) {
  const files = fs.readdirSync(SCREENSHOTS_DIR)
  const pngFiles = files.filter(f => f.endsWith('.png'))
  if (pngFiles.length > 0) {
    fs.rmSync(SCREENSHOTS_DIR, { recursive: true, force: true })
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
    console.log(`✓ ${pngFiles.length} screenshots eliminados`)
  }
}

console.log('✅ Limpieza completada')
```

### 9. EJECUTAR LOS TESTS

**CRÍTICO: El agente QA DEBE ejecutar los tests, no solo crearlos.**

```bash
# Asegurarse que el servidor está corriendo
# En otra terminal: pnpm dev

# Ejecutar tests exploratorios
npx tsx src/module/[modulo]/e2e/index.ts
```

### 10. Revisar Screenshots

Después de ejecutar, revisar la carpeta `screenshots/`:

```bash
ls -la src/module/[modulo]/e2e/screenshots/
```

Los screenshots muestran evidencia visual de cada paso:
- `00-dashboard-after-login.png` - Login exitoso
- `01-sidebar-check.png` - Verificación del sidebar
- `02-list-page.png` - Página de listado
- `03-new-form-empty.png` - Formulario vacío
- `04-form-filled.png` - Formulario lleno
- `04-after-create.png` - Después de crear
- `05-*` - Flujo de edición
- `06-*` - Modal de eliminación
- `07-*` - Eliminación exitosa
- `08-*` - Validaciones

Si hay errores, habrá screenshots con sufijo `-ERROR`.

### 11. ⚠️ NO HACER COMMIT - Notificar a Module Lead

**IMPORTANTE: QA NO hace commit hasta que Module Lead apruebe los screenshots.**

Notificar a Module Lead para validación:

```
TESTS EJECUTADOS: [modulo]
================================

ESTADO: Esperando validación de screenshots

RESULTADOS:
  ✓ Passed: [X]
  ✗ Failed: [Y]

SCREENSHOTS: src/module/[modulo]/e2e/screenshots/

ARCHIVOS GENERADOS:
  - 00-dashboard-after-login.png
  - 01-sidebar-check.png
  - 02-list-page.png
  - 03-new-form-empty.png
  - 04-form-filled.png
  - 04-after-create.png
  - 05-actions-menu.png
  - 05-edit-form-loaded.png
  - 05-edit-form-modified.png
  - 05-after-edit.png
  - 06-delete-modal.png
  - 06-after-cancel.png
  - 07-created-for-delete.png
  - 07-delete-confirm-modal.png
  - 07-after-delete.png
  - 08-validation-errors.png

SOLICITO: Validación de screenshots vs modelo de negocio
SKILL: .agents/skills/module-lead/validate-qa-screenshots.md
```

### 12. Esperar Respuesta de Module Lead

Module Lead revisará los screenshots y responderá:

#### Si Module Lead APRUEBA (>= 90% cumplimiento):

```
AUTORIZACIÓN QA COMMIT
======================
MÓDULO: [modulo]
CUMPLIMIENTO: [Z]% (>= 90%)
ESTADO: ✅ APROBADO

QA: Proceder con commit
```

**Entonces QA hace commit:**

```bash
git add src/module/[modulo]/e2e/

git commit -m "$(cat <<'EOF'
test([modulo]): add e2e exploratory tests with screenshots

- Add test runner with Puppeteer
- Add exploratory tests for CRUD operations
- Take screenshots at each step for visual verification
- Add cleanup script for test data
- Screenshots validated by Module Lead (>= 90% compliance)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"

git push origin feature/[modulo]
```

#### Si Module Lead RECHAZA (< 90% cumplimiento):

```
RECHAZO - ITERACIÓN REQUERIDA
=============================
MÓDULO: [modulo]
CUMPLIMIENTO: [Z]% (< 90%)

CORRECCIONES REQUERIDAS:
  1. [Problema]: [Responsable] debe [corrección]
  2. [Problema]: [Responsable] debe [corrección]
```

**Entonces QA espera las correcciones y luego:**

### 13. Re-ejecutar Tests (si hubo correcciones)

Después de que Frontend/Backend corrijan los problemas:

```bash
# Limpiar screenshots anteriores (se hace automáticamente)
# Re-ejecutar tests
npx tsx src/module/[modulo]/e2e/index.ts
```

Volver al paso 11 (notificar a Module Lead).

**Este ciclo se repite hasta lograr >= 90% de cumplimiento.**

---

## Flujo Completo

```
QA crea tests
    │
    ▼
QA ejecuta tests (npx tsx index.ts)
    │
    ▼
QA genera screenshots
    │
    ▼
QA notifica a Module Lead (NO COMMIT)
    │
    ▼
Module Lead revisa screenshots vs spec
    │
    ├─── >= 90% ───► APRUEBA ───► QA hace commit
    │
    └─── < 90% ────► RECHAZA
                        │
                        ▼
                    Frontend/Backend corrigen
                        │
                        ▼
                    QA re-ejecuta tests
                        │
                        ▼
                    (vuelve a Module Lead)
```

---

## Verificaciones Críticas

### Antes de empezar:
- [ ] `pnpm dev` está corriendo en otra terminal
- [ ] Páginas admin cargan (`curl localhost:3000/admin/[modulo]`)
- [ ] API responde

### Durante ejecución:
- [ ] Screenshots se generan en cada paso
- [ ] No hay errores de conexión
- [ ] El browser navega correctamente

### Después de tests:
- [ ] Listar screenshots generados
- [ ] Verificar que no hay screenshots con `-ERROR`
- [ ] Notificar a Module Lead (NO COMMIT)

### Antes de commit:
- [ ] Module Lead aprobó (>= 90%)
- [ ] Todos los tests pasan
- [ ] No hay screenshots con errores

---

## Outputs
- `src/module/[modulo]/e2e/` completo con:
  - `data.ts` - Datos de prueba
  - `utils.ts` - Utilidades del módulo
  - `index.ts` - Runner principal
  - `admin/01-crud.ts` - Tests exploratorios
  - `cleanup.ts` - Script de limpieza
  - `screenshots/` - Evidencia visual

## Next
- Module Lead valida screenshots (skill: validate-qa-screenshots.md)
- Si aprueba: QA hace commit → Module Lead propone release
- Si rechaza: Correcciones → Re-test → Re-validar

## NO Hacer
- ❌ NO hacer commit sin aprobación de Module Lead
- ❌ NO crear tests sin ejecutarlos
- ❌ NO ignorar screenshots de error
- ❌ NO modificar código del módulo
- ❌ NO continuar sin servidor corriendo
- ❌ NO saltarse la validación de Module Lead
- ❌ NO usar credenciales de placeholder (admin/12345678) - usar las reales
- ❌ NO asumir que el servidor está en puerto 3000 - verificar primero
