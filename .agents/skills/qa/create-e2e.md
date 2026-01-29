# Skill: Crear y Ejecutar Tests E2E

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

## Prerequisitos

Antes de crear tests, verificar que:
1. Servidor de desarrollo corriendo (`pnpm dev`)
2. Páginas admin existen y funcionan
3. API endpoints responden correctamente
4. No hay errores de lint

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
git pull origin feature/[modulo]
```

### 2. Ejecutar Lint Antes de Tests

```bash
pnpm lint
```

Si hay errores de lint, reportar y NO continuar con tests.

### 3. Crear Estructura E2E

```bash
mkdir -p src/module/[modulo]/e2e/fixtures
mkdir -p src/module/[modulo]/e2e/admin
```

### 4. Crear Fixtures

```typescript
// src/module/[modulo]/e2e/fixtures/[modulo].data.ts
export const [modulo]TestData = {
  valid: {
    name: 'Test [Entidad] E2E',
    slug: 'test-[modulo]-e2e',
    description: 'Descripción de prueba para E2E'
  },
  update: {
    name: 'Test [Entidad] Actualizado',
    description: 'Descripción actualizada en E2E'
  },
  invalid: {
    name: '',
    slug: ''
  }
}
```

### 5. Crear Test de Admin CRUD

```typescript
// src/module/[modulo]/e2e/admin/[modulo].spec.ts
import { test, expect } from '@playwright/test'
import { [modulo]TestData } from '../fixtures/[modulo].data'

// URLs
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const ADMIN_URL = `${BASE_URL}/admin/[modulo]`
const LOGIN_URL = `${BASE_URL}/admin/login`

// Credenciales de admin
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@test.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

test.describe('[Entidad]s Admin CRUD', () => {
  test.beforeEach(async ({ page }) => {
    // Login admin
    await page.goto(LOGIN_URL)
    await page.fill('input[name="email"]', ADMIN_EMAIL)
    await page.fill('input[name="password"]', ADMIN_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL('**/admin/**')
  })

  test('should display [modulo]s list page', async ({ page }) => {
    await page.goto(ADMIN_URL)

    // Verificar título
    await expect(page.locator('h1')).toContainText('[Entidad]')

    // Verificar botón de nuevo
    await expect(page.locator('a[href="/admin/[modulo]/new"]')).toBeVisible()
  })

  test('should navigate to new [modulo] form', async ({ page }) => {
    await page.goto(ADMIN_URL)

    // Click en nuevo
    await page.click('a[href="/admin/[modulo]/new"]')
    await page.waitForURL('**/admin/[modulo]/new')

    // Verificar formulario
    await expect(page.locator('form')).toBeVisible()
    await expect(page.locator('input[name="name"]')).toBeVisible()
  })

  test('should show validation errors on empty form', async ({ page }) => {
    await page.goto(`${ADMIN_URL}/new`)

    // Intentar enviar sin datos
    await page.click('button[type="submit"]')

    // Esperar validación
    await page.waitForTimeout(500)

    // El formulario debe seguir visible (no redirige)
    await expect(page.locator('form')).toBeVisible()
  })

  test('should create new [modulo]', async ({ page }) => {
    await page.goto(`${ADMIN_URL}/new`)

    // Llenar formulario
    await page.fill('input[name="name"]', [modulo]TestData.valid.name)
    await page.fill('input[name="slug"]', [modulo]TestData.valid.slug)

    const descriptionField = page.locator('textarea[name="description"]')
    if (await descriptionField.isVisible()) {
      await descriptionField.fill([modulo]TestData.valid.description)
    }

    // Enviar
    await page.click('button[type="submit"]')

    // Esperar redirección a lista
    await page.waitForURL(ADMIN_URL)

    // Verificar que el item aparece en la lista
    await expect(page.locator(`text=${[modulo]TestData.valid.name}`)).toBeVisible()
  })

  test('should edit existing [modulo]', async ({ page }) => {
    await page.goto(ADMIN_URL)

    // Click en editar del primer item
    const editLink = page.locator('table tbody tr:first-child a[href*="/admin/[modulo]/"]').first()
    await editLink.click()

    // Esperar carga del formulario
    await page.waitForSelector('form')

    // Modificar nombre
    await page.fill('input[name="name"]', [modulo]TestData.update.name)

    // Guardar
    await page.click('button[type="submit"]')

    // Esperar redirección
    await page.waitForURL(ADMIN_URL)

    // Verificar cambio
    await expect(page.locator(`text=${[modulo]TestData.update.name}`)).toBeVisible()
  })

  test('should delete [modulo]', async ({ page }) => {
    await page.goto(ADMIN_URL)

    // Contar items antes
    const itemsCountBefore = await page.locator('table tbody tr').count()

    // Aceptar diálogo de confirmación
    page.on('dialog', dialog => dialog.accept())

    // Click en eliminar del primer item
    await page.click('table tbody tr:first-child [data-action="delete"]')

    // Esperar que se actualice
    await page.waitForTimeout(1000)
    await page.reload()

    // Verificar que hay un item menos (o lista vacía)
    const itemsCountAfter = await page.locator('table tbody tr').count()
    expect(itemsCountAfter).toBeLessThan(itemsCountBefore)
  })
})
```

### 6. Ejecutar Tests

```bash
# Asegurarse que el servidor está corriendo en otra terminal
# pnpm dev

# Ejecutar tests del módulo
npx playwright test src/module/[modulo]/e2e/ --headed

# O sin UI
npx playwright test src/module/[modulo]/e2e/
```

### 7. Revisar Resultados

```bash
# Ver reporte HTML
npx playwright show-report
```

### 8. Si Hay Errores

#### Errores de Lint:
```
BLOQUEADO: Errores de lint detectados

DETALLES:
  - [Archivo]: [Mensaje de error]
  - [Archivo]: [Mensaje de error]

ACCIÓN REQUERIDA:
  Backend/Frontend debe corregir los errores de lint antes de tests
```

#### Errores de Tests:
```
TESTS FALLANDO: [modulo]

RESULTADOS:
  ✅ Passed: X
  ❌ Failed: Y

FALLAS DETALLADAS:

1. Test: [nombre del test]
   Error: [mensaje de error]
   Posible causa: [análisis]

2. Test: [nombre del test]
   Error: [mensaje de error]
   Posible causa: [análisis]

RECOMENDACIÓN:
  - [Backend/Frontend] debe revisar: [descripción]
```

### 9. Commit (solo si todos los tests pasan)

```bash
git add src/module/[modulo]/e2e/

git commit -m "test([modulo]): add e2e tests"
git push origin feature/[modulo]
```

### 10. Notificar al Module Lead

```
COMPLETADO: E2E tests para [modulo]
COMMIT: test([modulo]): add e2e tests

ARCHIVOS CREADOS:
  - src/module/[modulo]/e2e/fixtures/[modulo].data.ts
  - src/module/[modulo]/e2e/admin/[modulo].spec.ts

RESULTADOS:
  ✅ Passed: 5
  ❌ Failed: 0

COBERTURA: 100% (5/5 criterios)

TESTS EJECUTADOS:
  1. Lista de [modulo]s - ✅
  2. Navegación a formulario nuevo - ✅
  3. Validaciones de formulario - ✅
  4. Crear [modulo] - ✅
  5. Editar [modulo] - ✅
  6. Eliminar [modulo] - ✅

LINT: ✅ Sin errores

NOTAS: [observaciones si las hay]
```

---

## Verificaciones Críticas

### Antes de empezar:
- [ ] `pnpm lint` pasa sin errores
- [ ] `pnpm dev` está corriendo
- [ ] Páginas admin cargan correctamente
- [ ] API responde correctamente

### Después de tests:
- [ ] Todos los tests pasan
- [ ] No hay errores de consola
- [ ] No hay warnings de TypeScript
- [ ] Screenshots no muestran errores

---

## Outputs
- `src/module/[modulo]/e2e/` completo
- Tests ejecutados y pasando
- Resultados reportados
- Lint verificado

## Next
- Module Lead calcula cumplimiento
- Si todo pasa: proponer release

## NO Hacer
- NO ejecutar tests si hay errores de lint
- NO modificar base de datos
- NO modificar código de core/ o service/
- NO modificar componentes
- NO hacer commit si tests fallan
- NO continuar sin servidor de desarrollo corriendo
