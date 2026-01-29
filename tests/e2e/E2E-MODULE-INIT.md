# E2E Module Initialization Guide

## Propósito

Guía para crear infraestructura de E2E tests para cualquier módulo del admin.

**Comando:**
```
Inicializa E2E tests para el módulo: {nombre_modulo}
```

---

## Estructura de Carpetas

```
src/module/{modulo}/e2e/
├── index.ts           # Runner principal (con cleanupScreenshots)
├── data.ts            # Datos de prueba con TEST_SUFFIX
├── utils.ts           # Re-exports + wrappers específicos
├── cleanup.ts         # Script de limpieza de BD
├── admin/
│   └── 01-crud.ts     # Tests CRUD (o archivos separados)
├── ecommerce/         # Tests de frontend público (si aplica)
├── fixtures/          # Imágenes de prueba
└── screenshots/       # Screenshots generados (se limpian al inicio)
```

---

## Archivos Base

### data.ts

```typescript
/**
 * {Modulo} E2E - Test Data
 */

const now = new Date()
const TEST_SUFFIX = `-test-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`

export const TEST_{MODULO} = {
  main: {
    name: `Test Item${TEST_SUFFIX}`,
    // otros campos...
  },
  mainEdited: {
    name: `Test Item Updated${TEST_SUFFIX}`,
  },
  forDelete: {
    name: `Delete Me${TEST_SUFFIX}`,
  }
}

console.log(`Test suffix: ${TEST_SUFFIX}`)
```

### utils.ts

```typescript
/**
 * {Modulo} E2E - Module Utilities
 */

import fs from 'fs'
import path from 'path'
import { getPage } from '../../../../tests/e2e/utils'

// Paths del módulo
const MODULE_DIR = path.join(__dirname)
export const FIXTURES_DIR = path.join(MODULE_DIR, 'fixtures')
export const SCREENSHOTS_DIR = path.join(MODULE_DIR, 'screenshots')

// Imágenes de prueba (ajustar según módulo)
export const TEST_IMAGES = {
  main: path.join(FIXTURES_DIR, 'test-{modulo}-400x400.jpg')
}

// Crear carpeta de screenshots si no existe
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
}

/**
 * Screenshot con path del módulo
 */
export async function takeScreenshot(name: string, _subFolder?: string): Promise<string> {
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
  waitAndClick, clearAndType, waitForText,
  // Table actions
  findRowByContent, openRowActionsMenu, clickMenuAction,
  confirmDeleteModal, cancelDeleteModal, isModalVisible, itemExistsInTable,
  // Form helpers
  fillTextField, fillTextArea, submitForm, hasValidationError,
  clearAndFillField, selectOption,
  // Image upload
  uploadImageToField, fieldHasImage, getTestDate
} from '../../../../tests/e2e/utils'

/**
 * Wrapper para upload de imagen del módulo
 */
export async function upload{Modulo}Image(imagePath: string): Promise<boolean> {
  const { uploadImageToField, getTestDate } = await import('../../../../tests/e2e/utils')
  return uploadImageToField('Imagen', imagePath, {
    filePattern: '{modulo}',
    uploadWaitTime: 3000,
    uploadPath: `e2e/${getTestDate()}/{modulo}`
  })
}
```

### index.ts

```typescript
#!/usr/bin/env npx tsx
/**
 * {Modulo} E2E Test Runner
 */

import fs from 'fs'
import path from 'path'
import { initBrowser, closeBrowser, log, goto, wait, getPage, takeScreenshot, SCREENSHOTS_DIR } from './utils'
import { run{Modulo}Tests } from './admin/01-crud'

/**
 * IMPORTANTE: Limpiar screenshots anteriores antes de ejecutar
 */
function cleanupScreenshots(): void {
  if (fs.existsSync(SCREENSHOTS_DIR)) {
    const items = fs.readdirSync(SCREENSHOTS_DIR)
    let totalCleaned = 0
    for (const item of items) {
      const itemPath = path.join(SCREENSHOTS_DIR, item)
      if (fs.statSync(itemPath).isDirectory()) {
        const files = fs.readdirSync(itemPath)
        for (const file of files) {
          if (file.endsWith('.png')) {
            fs.unlinkSync(path.join(itemPath, file))
            totalCleaned++
          }
        }
      } else if (item.endsWith('.png')) {
        fs.unlinkSync(itemPath)
        totalCleaned++
      }
    }
    if (totalCleaned > 0) {
      console.log(`🧹 Cleaned up ${totalCleaned} previous screenshots`)
    }
  }
}

async function main(): Promise<void> {
  console.log('🧪 {MODULO} E2E TESTS')
  console.log('='.repeat(50))

  // SIEMPRE limpiar screenshots al inicio
  cleanupScreenshots()

  try {
    log('Iniciando browser...')
    await initBrowser()

    // Login
    log('Login como admin...')
    const page = getPage()
    await goto('/admin')
    await wait(2000)
    const inputs = await page.$$('input')
    if (inputs.length >= 2) {
      await inputs[0].type('admin@ajk.com')
      await inputs[1].type('Admin123!')
    }
    await page.click('button[type="submit"]')
    await wait(3000)
    log('Login exitoso')

    // Ejecutar tests
    const results = await run{Modulo}Tests()

    // Resumen
    console.log('📊 RESUMEN')
    console.log(`  ✓ Passed: ${results.passed}`)
    console.log(`  ✗ Failed: ${results.failed}`)

    process.exit(results.failed > 0 ? 1 : 0)
  } catch (error: any) {
    log(`Error: ${error.message}`)
    process.exit(1)
  } finally {
    await closeBrowser()
  }
}

main()
```

### admin/01-crud.ts (Patrón simplificado)

```typescript
/**
 * {Modulo} E2E - Admin CRUD Tests
 */

import { TEST_{MODULO} } from '../data'
import {
  log, wait, goto, getPage,
  fillTextField, submitForm, hasValidationError,
  openRowActionsMenu, clickMenuAction,
  confirmDeleteModal, cancelDeleteModal, isModalVisible,
  itemExistsInTable, clearAndType, takeScreenshot
} from '../utils'

const ADMIN_URL = '/admin/{modulo}'
const NEW_URL = '/admin/{modulo}/new'

export async function run{Modulo}Tests(): Promise<{ passed: number; failed: number }> {
  const results = { passed: 0, failed: 0 }

  // TC-001: Navegación
  try {
    log('TC-001: Navegación al módulo')
    await goto(ADMIN_URL)
    await wait(1000)
    const page = getPage()
    if (!page.url().includes('/admin/{modulo}')) throw new Error('URL incorrecta')
    log('  ✓ Navegación correcta')
    await takeScreenshot('01-list')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    results.failed++
  }

  // TC-002: Crear
  try {
    log('TC-002: Crear {modulo}')
    await goto(NEW_URL)
    await wait(500)
    await fillTextField('name', TEST_{MODULO}.main.name)
    await takeScreenshot('02-form-filled')
    await submitForm()
    await wait(1500)
    const exists = await itemExistsInTable(TEST_{MODULO}.main.name)
    if (!exists) throw new Error('Item no aparece en tabla')
    log('  ✓ Creado correctamente')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    results.failed++
  }

  // TC-003: Editar
  try {
    log('TC-003: Editar {modulo}')
    await openRowActionsMenu(TEST_{MODULO}.main.name)
    await wait(300)
    await clickMenuAction('edit')
    await wait(1000)
    await clearAndType('input[name="name"]', TEST_{MODULO}.mainEdited.name)
    await submitForm()
    await wait(1500)
    const exists = await itemExistsInTable(TEST_{MODULO}.mainEdited.name)
    if (!exists) throw new Error('Nombre editado no aparece')
    log('  ✓ Editado correctamente')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    results.failed++
  }

  // TC-004: Eliminar
  try {
    log('TC-004: Eliminar {modulo}')
    // Crear uno para eliminar
    await goto(NEW_URL)
    await wait(500)
    await fillTextField('name', TEST_{MODULO}.forDelete.name)
    await submitForm()
    await wait(1500)
    // Eliminar
    await openRowActionsMenu(TEST_{MODULO}.forDelete.name)
    await wait(300)
    await clickMenuAction('delete')
    await wait(500)
    if (!await isModalVisible()) throw new Error('Modal no apareció')
    await confirmDeleteModal()
    await wait(1500)
    const exists = await itemExistsInTable(TEST_{MODULO}.forDelete.name)
    if (exists) throw new Error('Item no fue eliminado')
    log('  ✓ Eliminado correctamente')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    results.failed++
  }

  // TC-005: Cancelar eliminación
  try {
    log('TC-005: Cancelar eliminación')
    await goto(ADMIN_URL)
    await wait(1000)
    await openRowActionsMenu(TEST_{MODULO}.mainEdited.name)
    await wait(300)
    await clickMenuAction('delete')
    await wait(500)
    await cancelDeleteModal()
    await wait(500)
    const exists = await itemExistsInTable(TEST_{MODULO}.mainEdited.name)
    if (!exists) throw new Error('Item desapareció después de cancelar')
    log('  ✓ Cancelación funcionó')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    results.failed++
  }

  // TC-006: Validación campo vacío
  try {
    log('TC-006: Validación campo vacío')
    await goto(NEW_URL)
    await wait(500)
    await submitForm()
    await wait(500)
    const hasError = await hasValidationError('name')
    const page = getPage()
    if (!hasError && !page.url().includes('/new')) {
      throw new Error('Form se envió sin validación')
    }
    log('  ✓ Validación funcionó')
    results.passed++
  } catch (e: any) {
    log(`  ✗ FAILED: ${e.message}`)
    results.failed++
  }

  return results
}
```

### cleanup.ts

```typescript
#!/usr/bin/env npx tsx
/**
 * {Modulo} E2E - Cleanup
 *
 * Usage:
 *   npx tsx src/module/{modulo}/e2e/cleanup.ts 2026-01-27
 *   npx tsx src/module/{modulo}/e2e/cleanup.ts all
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots')
const DOCKER_CONTAINER = 'ajk-ecommerce'
const TABLE_NAME = '{tabla}'  // Ajustar: 'brands', 'categories', etc.

const dateArg = process.argv[2]
if (!dateArg) {
  console.log('Uso: npx tsx cleanup.ts <fecha|all>')
  process.exit(1)
}

const pattern = dateArg === 'all' ? '%-test-%' : `%-test-${dateArg.replace(/-/g, '')}-%`

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

console.log(`🧹 Cleanup: ${pattern}`)

// Mostrar y eliminar registros
const items = runSQL(`SELECT id, name FROM ${TABLE_NAME} WHERE name LIKE '${pattern}'`)
if (items.trim()) {
  console.log(items)
  runSQL(`DELETE FROM ${TABLE_NAME} WHERE name LIKE '${pattern}'`)
}

// Eliminar screenshots
if (fs.existsSync(SCREENSHOTS_DIR)) {
  fs.rmSync(SCREENSHOTS_DIR, { recursive: true, force: true })
  console.log('Screenshots eliminados')
}

// Eliminar uploads E2E
const uploadPath = dateArg === 'all'
  ? path.join(process.cwd(), 'public/uploads/e2e')
  : path.join(process.cwd(), 'public/uploads/e2e', dateArg.replace(/-/g, ''))

if (fs.existsSync(uploadPath)) {
  fs.rmSync(uploadPath, { recursive: true, force: true })
  console.log('Uploads E2E eliminados')
}

console.log('✅ Limpieza completada')
```

---

## Utilidades Compartidas

Ubicadas en `tests/e2e/utils/`:

| Categoría | Funciones |
|-----------|-----------|
| **Browser** | `initBrowser`, `closeBrowser`, `getPage`, `goto`, `wait`, `log` |
| **Table** | `openRowActionsMenu`, `clickMenuAction`, `confirmDeleteModal`, `cancelDeleteModal`, `isModalVisible`, `itemExistsInTable` |
| **Form** | `fillTextField`, `fillTextArea`, `submitForm`, `hasValidationError`, `clearAndType`, `selectOption` |
| **Image** | `uploadImageToField`, `fieldHasImage`, `getTestDate` |

### Uso de Table Actions

```typescript
// Abrir menú de acciones de una fila
await openRowActionsMenu('Item Name')
await clickMenuAction('edit')    // o 'delete'

// Confirmar/cancelar eliminación
await confirmDeleteModal()
await cancelDeleteModal()
```

### Upload de Imágenes

```typescript
// Crear wrapper en utils.ts del módulo
export async function uploadBrandLogo(imagePath: string): Promise<boolean> {
  const { uploadImageToField, getTestDate } = await import('../../../../tests/e2e/utils')
  return uploadImageToField('Logo', imagePath, {
    filePattern: 'logo',
    uploadWaitTime: 3000,
    uploadPath: `e2e/${getTestDate()}/brands`
  })
}
```

---

## Reglas Importantes

### ✅ SIEMPRE

1. **Limpiar screenshots al inicio** - Función `cleanupScreenshots()` en `index.ts`
2. **Usar utilidades compartidas** - No duplicar código de `tests/e2e/utils/`
3. **Sufijo único en datos** - `TEST_SUFFIX` con timestamp para evitar conflictos
4. **Screenshots con timestamp** - Facilita debugging

### ❌ NUNCA

1. **No duplicar funciones** de tabla, formulario o upload
2. **No hardcodear paths** - Usar `FIXTURES_DIR`, `SCREENSHOTS_DIR`
3. **No olvidar cleanup** - Siempre crear `cleanup.ts`

---

## Ejecución

```bash
# Ejecutar tests
npx tsx src/module/{modulo}/e2e/index.ts

# Limpiar datos de test
npx tsx src/module/{modulo}/e2e/cleanup.ts 2026-01-27
npx tsx src/module/{modulo}/e2e/cleanup.ts all
```

---

## Checklist

- [ ] Crear carpeta `e2e/` en el módulo
- [ ] `data.ts` con TEST_SUFFIX
- [ ] `utils.ts` re-exportando de shared + SCREENSHOTS_DIR
- [ ] `index.ts` con `cleanupScreenshots()` al inicio
- [ ] `admin/01-crud.ts` con tests básicos
- [ ] `cleanup.ts` con nombre de tabla correcto
- [ ] `fixtures/` con imágenes de prueba (si aplica)
- [ ] Ejecutar y verificar que pasan
- [ ] Verificar mensaje "🧹 Cleaned up X previous screenshots"
