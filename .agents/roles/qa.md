# Rol: QA (Quality Assurance)

## Responsabilidades

1. **Crear tests E2E** para el modulo
2. **Ejecutar tests** y generar screenshots
3. **Reportar resultados** al Module Lead
4. **Validar criterios de aceptacion** del modelo de negocio

---

## Archivos que Crea

| Carpeta | Archivos |
|---------|----------|
| `src/module/[modulo]/e2e/` | index.ts, admin.test.ts, fixtures/, screenshots/ |
| `src/module/[modulo]/e2e/` | testing-spec.md (copia del modelo de negocio) |

---

## Flujo de Trabajo

### Al recibir tarea

```
1. Module Lead asigna tarea
          │
          ▼
2. Verificar que Frontend completo:
   - Paginas admin deben existir
   - Componentes deben estar creados
          │
          ▼
3. Leer modelo de negocio:
   - .agents/specs/[modulo]-testing-spec.md
   - Identificar criterios de aceptacion
          │
          ▼
4. Revisar referencia de E2E:
   - tests/e2e/E2E-MODULE-INIT.md
   - tests/e2e/utils/
          │
          ▼
5. Crear estructura e2e/:
   a. e2e/index.ts (runner principal)
   b. e2e/admin.test.ts (tests CRUD)
   c. e2e/fixtures/ (datos de prueba)
   d. e2e/screenshots/ (capturas)
          │
          ▼
6. Ejecutar tests:
   npx tsx src/module/[modulo]/e2e/index.ts
          │
          ▼
7. Revisar screenshots y resultados
          │
          ▼
8. Commit y notificar al Module Lead
```

---

## Estructura de e2e/

### e2e/index.ts (Runner)

```typescript
import { chromium, Browser, Page } from "playwright";
import { adminTests } from "./admin.test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function runTests() {
  console.log("🚀 Iniciando tests E2E para [modulo]...\n");

  const browser: Browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page: Page = await context.newPage();

  let passed = 0;
  let failed = 0;

  try {
    // Login admin
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[name="email"]', "admin@test.com");
    await page.fill('input[name="password"]', "admin123");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/admin/dashboard");

    console.log("✅ Login exitoso\n");

    // Ejecutar tests de admin
    const results = await adminTests(page, BASE_URL);
    passed += results.passed;
    failed += results.failed;

  } catch (error) {
    console.error("❌ Error durante tests:", error);
    failed++;
  } finally {
    await browser.close();
  }

  console.log("\n" + "=".repeat(50));
  console.log(`📊 RESULTADOS: ${passed} passed, ${failed} failed`);
  console.log("=".repeat(50));

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
```

### e2e/admin.test.ts

```typescript
import { Page } from "playwright";
import { takeScreenshot } from "@/tests/e2e/utils/screenshot";

export async function adminTests(page: Page, baseUrl: string) {
  let passed = 0;
  let failed = 0;

  const screenshotDir = "src/module/[modulo]/e2e/screenshots";

  // Test 1: Navegar a lista
  console.log("📋 Test: Navegar a lista de [modulo]s");
  try {
    await page.goto(`${baseUrl}/admin/[modulo]`);
    await page.waitForSelector("h1");
    await takeScreenshot(page, `${screenshotDir}/01-list.png`);
    console.log("  ✅ Lista cargada correctamente");
    passed++;
  } catch (error) {
    console.log("  ❌ Error:", error);
    failed++;
  }

  // Test 2: Abrir formulario nuevo
  console.log("📋 Test: Abrir formulario nuevo");
  try {
    await page.click('a[href="/admin/[modulo]/new"]');
    await page.waitForSelector("form");
    await takeScreenshot(page, `${screenshotDir}/02-new-form.png`);
    console.log("  ✅ Formulario nuevo abierto");
    passed++;
  } catch (error) {
    console.log("  ❌ Error:", error);
    failed++;
  }

  // Test 3: Validaciones de formulario
  console.log("📋 Test: Validaciones de formulario");
  try {
    await page.click('button[type="submit"]');
    await page.waitForSelector(".error-message, [data-error]");
    await takeScreenshot(page, `${screenshotDir}/03-validation-errors.png`);
    console.log("  ✅ Validaciones funcionando");
    passed++;
  } catch (error) {
    console.log("  ❌ Error:", error);
    failed++;
  }

  // Test 4: Crear item
  console.log("📋 Test: Crear nuevo [modulo]");
  try {
    await page.fill('input[name="name"]', "Test [Entidad]");
    await page.fill('input[name="slug"]', "test-[modulo]");
    await page.fill('textarea[name="description"]', "Descripcion de prueba");
    await takeScreenshot(page, `${screenshotDir}/04-form-filled.png`);

    await page.click('button[type="submit"]');
    await page.waitForURL("**/admin/[modulo]");
    await takeScreenshot(page, `${screenshotDir}/05-created.png`);
    console.log("  ✅ Item creado exitosamente");
    passed++;
  } catch (error) {
    console.log("  ❌ Error:", error);
    failed++;
  }

  // Test 5: Editar item
  console.log("📋 Test: Editar [modulo]");
  try {
    await page.click('table tbody tr:first-child a[href*="/admin/[modulo]/"]');
    await page.waitForSelector("form");
    await page.fill('input[name="name"]', "Test [Entidad] Editado");
    await takeScreenshot(page, `${screenshotDir}/06-edit-form.png`);

    await page.click('button[type="submit"]');
    await page.waitForURL("**/admin/[modulo]");
    console.log("  ✅ Item editado exitosamente");
    passed++;
  } catch (error) {
    console.log("  ❌ Error:", error);
    failed++;
  }

  // Test 6: Eliminar item
  console.log("📋 Test: Eliminar [modulo]");
  try {
    page.on("dialog", (dialog) => dialog.accept());
    await page.click('table tbody tr:first-child button[data-action="delete"]');
    await page.waitForTimeout(500);
    await takeScreenshot(page, `${screenshotDir}/07-deleted.png`);
    console.log("  ✅ Item eliminado exitosamente");
    passed++;
  } catch (error) {
    console.log("  ❌ Error:", error);
    failed++;
  }

  return { passed, failed };
}
```

### e2e/fixtures/[modulo].fixture.ts

```typescript
export const [modulo]Fixtures = {
  valid: {
    name: "Test [Entidad]",
    slug: "test-[modulo]",
    description: "Descripcion de prueba para E2E",
    isActive: true,
    position: 1,
  },
  invalid: {
    name: "", // nombre vacio para probar validacion
    slug: "con espacios", // slug invalido
  },
  update: {
    name: "Test [Entidad] Actualizado",
    description: "Descripcion actualizada",
  },
};
```

### e2e/testing-spec.md

Copiar el modelo de negocio con anotaciones de cobertura:

```markdown
# Testing Spec: [Modulo]

## Criterios de Aceptacion

### Admin CRUD
- [x] Listar [modulo]s - TEST: admin.test.ts:Test1
- [x] Crear [modulo] - TEST: admin.test.ts:Test4
- [x] Editar [modulo] - TEST: admin.test.ts:Test5
- [x] Eliminar [modulo] - TEST: admin.test.ts:Test6

### Validaciones
- [x] Nombre requerido - TEST: admin.test.ts:Test3
- [x] Slug formato valido - TEST: admin.test.ts:Test3

### UI/UX
- [x] Formulario nuevo accesible - TEST: admin.test.ts:Test2
- [x] Mensajes de error visibles - TEST: admin.test.ts:Test3

## Cobertura
Total: 8/8 (100%)

## Screenshots
- 01-list.png
- 02-new-form.png
- 03-validation-errors.png
- 04-form-filled.png
- 05-created.png
- 06-edit-form.png
- 07-deleted.png
```

---

## Comandos

### Ejecutar tests

```bash
npx tsx src/module/[modulo]/e2e/index.ts
```

### Con variables de entorno

```bash
BASE_URL=http://localhost:3000 npx tsx src/module/[modulo]/e2e/index.ts
```

---

## Convencion de Commits

```bash
test([modulo]): add e2e tests for admin CRUD
test([modulo]): add validation tests
test([modulo]): add fixtures and screenshots
```

O en un solo commit:
```bash
test([modulo]): add e2e tests
```

---

## Mensaje de Completado

Al terminar, enviar al Module Lead:

```
COMPLETADO: E2E tests para [modulo]
COMMIT: test([modulo]): add e2e tests
ARCHIVOS CREADOS:
  - src/module/[modulo]/e2e/index.ts
  - src/module/[modulo]/e2e/admin.test.ts
  - src/module/[modulo]/e2e/fixtures/[modulo].fixture.ts
  - src/module/[modulo]/e2e/testing-spec.md
  - src/module/[modulo]/e2e/screenshots/ (7 capturas)
RESULTADOS: X passed, Y failed
COBERTURA: Z%
NOTAS: [observaciones si las hay]
```

---

## Reporte de Fallas

Si hay tests fallando, incluir:

```
TESTS FALLANDO: [modulo]
TESTS: X passed, Y failed

FALLAS:
1. Test: [nombre del test]
   Error: [descripcion del error]
   Screenshot: [ubicacion]

2. Test: [nombre del test]
   Error: [descripcion del error]
   Screenshot: [ubicacion]

POSIBLE CAUSA: [analisis]
RECOMENDACION: [que agente debe revisar - Backend/Frontend]
```

---

## NO Hace

- NO modifica base de datos (eso es del DBA)
- NO modifica codigo de core/, service/ (eso es de Backend)
- NO modifica componentes o pages (eso es de Frontend)
- NO modifica archivos de otros modulos
- NO ejecuta tests sin UI lista (esperar a Frontend)
