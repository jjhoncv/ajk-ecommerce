# Skill: Crear y Ejecutar Tests E2E

## Rol
QA

## Trigger
Module Lead asigna tarea de crear tests (después de Frontend)

## Inputs
- Nombre del módulo
- `.agents/specs/[modulo]-testing-spec.md`
- UI del admin ya funcionando
- Branch de trabajo

---

## Steps

### 1. Verificar Prerequisitos

```bash
# Verificar que páginas admin existen
ls src/app/admin/[modulo]/

# Debe mostrar: page.tsx, new/, [id]/

# Cambiar a branch
git checkout feature/[modulo]
git pull origin feature/[modulo]
```

### 2. Crear Estructura E2E

```bash
mkdir -p src/module/[modulo]/e2e/fixtures
mkdir -p src/module/[modulo]/e2e/screenshots
```

### 3. Crear Fixtures

```typescript
// src/module/[modulo]/e2e/fixtures/[modulo].fixture.ts
export const [modulo]Fixtures = {
  valid: {
    name: "Test [Entidad]",
    slug: "test-[modulo]",
    description: "Descripción de prueba para E2E",
    isActive: true,
    position: 1,
  },
  invalid: {
    name: "",
    slug: "con espacios invalidos",
  },
  update: {
    name: "Test [Entidad] Actualizado",
    description: "Descripción actualizada en E2E",
  },
};
```

### 4. Crear admin.test.ts

```typescript
// src/module/[modulo]/e2e/admin.test.ts
import { Page } from "playwright";
import { [modulo]Fixtures } from "./fixtures/[modulo].fixture";

async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({
    path: `src/module/[modulo]/e2e/screenshots/${name}`,
    fullPage: true,
  });
}

export async function adminTests(page: Page, baseUrl: string) {
  let passed = 0;
  let failed = 0;

  // Test 1: Navegar a lista
  console.log("📋 Test 1: Navegar a lista de [modulo]s");
  try {
    await page.goto(`${baseUrl}/admin/[modulo]`);
    await page.waitForSelector("h1");
    const title = await page.textContent("h1");
    if (!title?.includes("[Entidad]")) throw new Error("Título incorrecto");
    await takeScreenshot(page, "01-list.png");
    console.log("  ✅ Lista cargada correctamente");
    passed++;
  } catch (error) {
    console.log("  ❌ Error:", error);
    await takeScreenshot(page, "01-list-error.png");
    failed++;
  }

  // Test 2: Abrir formulario nuevo
  console.log("📋 Test 2: Abrir formulario nuevo");
  try {
    await page.click('a[href="/admin/[modulo]/new"]');
    await page.waitForSelector("form");
    await takeScreenshot(page, "02-new-form.png");
    console.log("  ✅ Formulario nuevo abierto");
    passed++;
  } catch (error) {
    console.log("  ❌ Error:", error);
    await takeScreenshot(page, "02-new-form-error.png");
    failed++;
  }

  // Test 3: Validaciones de formulario
  console.log("📋 Test 3: Validaciones de formulario");
  try {
    // Intentar enviar sin datos
    await page.click('button[type="submit"]');
    // Esperar validación HTML5 o mensaje de error
    await page.waitForTimeout(500);
    await takeScreenshot(page, "03-validation-errors.png");
    console.log("  ✅ Validaciones funcionando");
    passed++;
  } catch (error) {
    console.log("  ❌ Error:", error);
    await takeScreenshot(page, "03-validation-error.png");
    failed++;
  }

  // Test 4: Crear item
  console.log("📋 Test 4: Crear nuevo [modulo]");
  try {
    const fixture = [modulo]Fixtures.valid;
    await page.fill('input[name="name"]', fixture.name);
    await page.fill('input[name="slug"]', fixture.slug);
    await page.fill('textarea[name="description"]', fixture.description);
    await takeScreenshot(page, "04-form-filled.png");

    await page.click('button[type="submit"]');
    await page.waitForURL("**/admin/[modulo]");
    await page.waitForTimeout(500);
    await takeScreenshot(page, "05-created.png");
    console.log("  ✅ Item creado exitosamente");
    passed++;
  } catch (error) {
    console.log("  ❌ Error:", error);
    await takeScreenshot(page, "04-create-error.png");
    failed++;
  }

  // Test 5: Verificar item en lista
  console.log("📋 Test 5: Verificar item en lista");
  try {
    const itemName = await page.textContent(`text=${[modulo]Fixtures.valid.name}`);
    if (!itemName) throw new Error("Item no encontrado en lista");
    console.log("  ✅ Item visible en lista");
    passed++;
  } catch (error) {
    console.log("  ❌ Error:", error);
    failed++;
  }

  // Test 6: Editar item
  console.log("📋 Test 6: Editar [modulo]");
  try {
    // Click en el primer link de editar
    await page.click('table tbody tr:first-child a[href*="/admin/[modulo]/"]');
    await page.waitForSelector("form");
    await takeScreenshot(page, "06-edit-form.png");

    // Modificar nombre
    await page.fill('input[name="name"]', [modulo]Fixtures.update.name);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/admin/[modulo]");
    await takeScreenshot(page, "07-edited.png");
    console.log("  ✅ Item editado exitosamente");
    passed++;
  } catch (error) {
    console.log("  ❌ Error:", error);
    await takeScreenshot(page, "06-edit-error.png");
    failed++;
  }

  // Test 7: Eliminar item
  console.log("📋 Test 7: Eliminar [modulo]");
  try {
    // Manejar el diálogo de confirmación
    page.on("dialog", (dialog) => dialog.accept());

    await page.click('table tbody tr:first-child button[data-action="delete"]');
    await page.waitForTimeout(1000);
    await takeScreenshot(page, "08-deleted.png");
    console.log("  ✅ Item eliminado exitosamente");
    passed++;
  } catch (error) {
    console.log("  ❌ Error:", error);
    await takeScreenshot(page, "07-delete-error.png");
    failed++;
  }

  return { passed, failed };
}
```

### 5. Crear index.ts (Runner)

```typescript
// src/module/[modulo]/e2e/index.ts
import { chromium, Browser, Page } from "playwright";
import { adminTests } from "./admin.test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@test.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

async function runTests() {
  console.log("🚀 Iniciando tests E2E para [modulo]...\n");
  console.log(`📍 Base URL: ${BASE_URL}\n`);

  const browser: Browser = await chromium.launch({
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page: Page = await context.newPage();

  let totalPassed = 0;
  let totalFailed = 0;

  try {
    // Login admin
    console.log("🔐 Iniciando sesión admin...");
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');

    // Esperar redirección
    await page.waitForURL("**/admin/**", { timeout: 10000 });
    console.log("✅ Login exitoso\n");

    // Ejecutar tests de admin
    console.log("=" .repeat(50));
    console.log("TESTS ADMIN CRUD");
    console.log("=".repeat(50) + "\n");

    const adminResults = await adminTests(page, BASE_URL);
    totalPassed += adminResults.passed;
    totalFailed += adminResults.failed;

  } catch (error) {
    console.error("❌ Error durante tests:", error);
    totalFailed++;

    // Screenshot de error
    await page.screenshot({
      path: "src/module/[modulo]/e2e/screenshots/error-fatal.png",
      fullPage: true,
    });
  } finally {
    await browser.close();
  }

  // Resumen final
  console.log("\n" + "=".repeat(50));
  console.log("📊 RESUMEN DE TESTS");
  console.log("=".repeat(50));
  console.log(`✅ Passed: ${totalPassed}`);
  console.log(`❌ Failed: ${totalFailed}`);
  console.log(`📁 Screenshots: src/module/[modulo]/e2e/screenshots/`);
  console.log("=".repeat(50));

  // Exit code basado en resultados
  process.exit(totalFailed > 0 ? 1 : 0);
}

runTests();
```

### 6. Crear testing-spec.md

```markdown
<!-- src/module/[modulo]/e2e/testing-spec.md -->
# Testing Spec: [Modulo]

## Criterios de Aceptación - Cobertura E2E

### Admin CRUD
| Criterio | Test | Estado |
|----------|------|--------|
| Listar [modulo]s | Test 1: Navegar a lista | ✅ |
| Formulario nuevo | Test 2: Abrir formulario | ✅ |
| Validaciones | Test 3: Validaciones | ✅ |
| Crear [modulo] | Test 4: Crear | ✅ |
| Ver en lista | Test 5: Verificar | ✅ |
| Editar [modulo] | Test 6: Editar | ✅ |
| Eliminar [modulo] | Test 7: Eliminar | ✅ |

## Cobertura
**Total: 7/7 tests (100%)**

## Screenshots Generados
| # | Archivo | Descripción |
|---|---------|-------------|
| 1 | 01-list.png | Página de lista |
| 2 | 02-new-form.png | Formulario nuevo vacío |
| 3 | 03-validation-errors.png | Errores de validación |
| 4 | 04-form-filled.png | Formulario lleno |
| 5 | 05-created.png | Item creado en lista |
| 6 | 06-edit-form.png | Formulario de edición |
| 7 | 07-edited.png | Item editado en lista |
| 8 | 08-deleted.png | Item eliminado |

## Comando de Ejecución
```bash
npx tsx src/module/[modulo]/e2e/index.ts
```

## Variables de Entorno
```bash
BASE_URL=http://localhost:3000
ADMIN_EMAIL=admin@test.com
ADMIN_PASSWORD=admin123
```
```

### 7. Ejecutar Tests

```bash
# Asegurarse que el servidor está corriendo
# En otra terminal: pnpm dev

# Ejecutar tests
npx tsx src/module/[modulo]/e2e/index.ts
```

### 8. Verificar Screenshots

```bash
ls -la src/module/[modulo]/e2e/screenshots/

# Debe mostrar:
# 01-list.png
# 02-new-form.png
# 03-validation-errors.png
# 04-form-filled.png
# 05-created.png
# 06-edit-form.png
# 07-edited.png
# 08-deleted.png
```

### 9. Commit

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
  - src/module/[modulo]/e2e/index.ts
  - src/module/[modulo]/e2e/admin.test.ts
  - src/module/[modulo]/e2e/fixtures/[modulo].fixture.ts
  - src/module/[modulo]/e2e/testing-spec.md
  - src/module/[modulo]/e2e/screenshots/ (8 capturas)

RESULTADOS:
  ✅ Passed: 7
  ❌ Failed: 0

COBERTURA: 100% (7/7 criterios)

TESTS EJECUTADOS:
  1. Navegar a lista - ✅
  2. Abrir formulario nuevo - ✅
  3. Validaciones de formulario - ✅
  4. Crear item - ✅
  5. Verificar en lista - ✅
  6. Editar item - ✅
  7. Eliminar item - ✅

SCREENSHOTS: src/module/[modulo]/e2e/screenshots/

NOTAS: [observaciones si las hay]
```

---

## Si Hay Tests Fallando

Reportar detalladamente:

```
TESTS FALLANDO: [modulo]

RESULTADOS:
  ✅ Passed: X
  ❌ Failed: Y

FALLAS DETALLADAS:

1. Test: [nombre del test]
   Error: [mensaje de error]
   Screenshot: [nombre del archivo]
   Posible causa: [análisis]

2. Test: [nombre del test]
   Error: [mensaje de error]
   Screenshot: [nombre del archivo]
   Posible causa: [análisis]

RECOMENDACIÓN:
  - [Backend/Frontend] debe revisar: [descripción]
```

---

## Outputs
- `src/module/[modulo]/e2e/` completo
- Tests ejecutados
- Screenshots generados
- Resultados reportados

## Next
- Module Lead calcula cumplimiento
- Si todo pasa: proponer release

## NO Hacer
- NO modificar base de datos
- NO modificar código de core/ o service/
- NO modificar componentes
- NO ejecutar sin UI funcionando
