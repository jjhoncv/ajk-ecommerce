import { chromium, Browser, Page } from "playwright";
import { adminTests } from "./admin.test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@test.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

async function runTests() {
  console.log("🚀 Iniciando tests E2E para TAGS...\n");
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

    await page.waitForURL("**/admin/**", { timeout: 10000 });
    console.log("✅ Login exitoso\n");

    // Ejecutar tests de admin
    console.log("=".repeat(50));
    console.log("TESTS ADMIN CRUD - TAGS");
    console.log("=".repeat(50) + "\n");

    const adminResults = await adminTests(page, BASE_URL);
    totalPassed += adminResults.passed;
    totalFailed += adminResults.failed;

  } catch (error) {
    console.error("❌ Error durante tests:", error);
    totalFailed++;

    await page.screenshot({
      path: "src/module/tags/e2e/screenshots/error-fatal.png",
      fullPage: true,
    });
  } finally {
    await browser.close();
  }

  // Resumen final
  console.log("\n" + "=".repeat(50));
  console.log("📊 RESUMEN DE TESTS - TAGS");
  console.log("=".repeat(50));
  console.log(`✅ Passed: ${totalPassed}`);
  console.log(`❌ Failed: ${totalFailed}`);
  console.log(`📁 Screenshots: src/module/tags/e2e/screenshots/`);
  console.log("=".repeat(50));

  process.exit(totalFailed > 0 ? 1 : 0);
}

runTests();
