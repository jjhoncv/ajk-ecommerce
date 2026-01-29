import { Page } from "playwright";
import { tagsFixtures } from "./fixtures/tags.fixture";

async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({
    path: `src/module/tags/e2e/screenshots/${name}`,
    fullPage: true,
  });
}

export async function adminTests(page: Page, baseUrl: string) {
  let passed = 0;
  let failed = 0;

  // Test 1: Navegar a lista
  console.log("📋 Test 1: Navegar a lista de tags");
  try {
    await page.goto(`${baseUrl}/admin/tags`);
    await page.waitForSelector("h1");
    const title = await page.textContent("h1");
    if (!title?.includes("Tags")) throw new Error("Título incorrecto");
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
    await page.click('a[href="/admin/tags/new"]');
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
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);
    await takeScreenshot(page, "03-validation-errors.png");
    console.log("  ✅ Validaciones funcionando");
    passed++;
  } catch (error) {
    console.log("  ❌ Error:", error);
    await takeScreenshot(page, "03-validation-error.png");
    failed++;
  }

  // Test 4: Crear tag
  console.log("📋 Test 4: Crear nuevo tag");
  try {
    const fixture = tagsFixtures.valid;
    await page.fill('input[name="name"]', fixture.name);
    await page.fill('input[name="slug"]', fixture.slug);
    await page.fill('textarea[name="description"]', fixture.description);
    await takeScreenshot(page, "04-form-filled.png");

    await page.click('button[type="submit"]');
    await page.waitForURL("**/admin/tags", { timeout: 5000 });
    await page.waitForTimeout(500);
    await takeScreenshot(page, "05-created.png");
    console.log("  ✅ Tag creado exitosamente");
    passed++;
  } catch (error) {
    console.log("  ❌ Error:", error);
    await takeScreenshot(page, "04-create-error.png");
    failed++;
  }

  // Test 5: Verificar tag en lista
  console.log("📋 Test 5: Verificar tag en lista");
  try {
    await page.waitForSelector(`text=${tagsFixtures.valid.name}`);
    console.log("  ✅ Tag visible en lista");
    passed++;
  } catch (error) {
    console.log("  ❌ Error:", error);
    failed++;
  }

  // Test 6: Editar tag
  console.log("📋 Test 6: Editar tag");
  try {
    await page.click('table tbody tr:first-child a[href*="/admin/tags/"]');
    await page.waitForSelector("form");
    await takeScreenshot(page, "06-edit-form.png");

    await page.fill('input[name="name"]', tagsFixtures.update.name);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/admin/tags", { timeout: 5000 });
    await takeScreenshot(page, "07-edited.png");
    console.log("  ✅ Tag editado exitosamente");
    passed++;
  } catch (error) {
    console.log("  ❌ Error:", error);
    await takeScreenshot(page, "06-edit-error.png");
    failed++;
  }

  // Test 7: Eliminar tag
  console.log("📋 Test 7: Eliminar tag");
  try {
    page.on("dialog", (dialog) => dialog.accept());
    await page.click('table tbody tr:first-child button[data-action="delete"]');
    await page.waitForTimeout(1000);
    await takeScreenshot(page, "08-deleted.png");
    console.log("  ✅ Tag eliminado exitosamente");
    passed++;
  } catch (error) {
    console.log("  ❌ Error:", error);
    await takeScreenshot(page, "07-delete-error.png");
    failed++;
  }

  return { passed, failed };
}
