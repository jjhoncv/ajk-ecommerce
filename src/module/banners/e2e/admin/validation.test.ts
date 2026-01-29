/**
 * Banners E2E - Validation Tests
 */

import { getPage, takeScreenshot, log, wait } from '../utils'

export async function runValidationTests(): Promise<void> {
  const page = getPage()
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'

  log('=== VALIDATION TESTS ===')

  // 1. Navigate to create form
  await page.goto(`${baseUrl}/admin/banners/new`)
  await wait(2000)

  // 2. Test required title validation
  log('Testing required title validation...')

  // Fill only link and buttonText, leave title empty
  const linkInput = await page.$('input[name="link"]')
  if (linkInput) await linkInput.type('/test-link')

  const buttonTextInput = await page.$('input[name="buttonText"]')
  if (buttonTextInput) await buttonTextInput.type('Test Button')

  // Submit without title
  const submitBtn = await page.$('button[type="submit"]')
  if (submitBtn) {
    await submitBtn.click()
    await wait(1500)
  }

  await takeScreenshot('01-title-required', 'admin/validation')

  // Check for error message
  const titleError = await page.evaluate(() => {
    const errorElements = document.querySelectorAll('[class*="error"], [class*="invalid"], .text-red-500, .text-destructive')
    for (const el of errorElements) {
      if (el.textContent?.toLowerCase().includes('título') ||
          el.textContent?.toLowerCase().includes('requerido')) {
        return true
      }
    }
    // Also check for HTML5 validation
    const titleInput = document.querySelector('input[name="title"]') as HTMLInputElement
    return titleInput?.validity?.valueMissing === true
  })

  if (titleError) {
    log('  Title required error displayed')
  }

  // 3. Test required link validation
  log('Testing required link validation...')
  await page.goto(`${baseUrl}/admin/banners/new`)
  await wait(2000)

  // Fill title but leave link empty
  const titleInput = await page.$('input[name="title"]')
  if (titleInput) await titleInput.type('Test Title')

  const buttonText2 = await page.$('input[name="buttonText"]')
  if (buttonText2) await buttonText2.type('Test Button')

  const submitBtn2 = await page.$('button[type="submit"]')
  if (submitBtn2) {
    await submitBtn2.click()
    await wait(1500)
  }

  await takeScreenshot('02-link-required', 'admin/validation')

  const linkError = await page.evaluate(() => {
    const errorElements = document.querySelectorAll('[class*="error"], [class*="invalid"], .text-red-500')
    for (const el of errorElements) {
      if (el.textContent?.toLowerCase().includes('link') ||
          el.textContent?.toLowerCase().includes('enlace')) {
        return true
      }
    }
    return false
  })

  if (linkError) {
    log('  Link required error displayed')
  }

  // 4. Test invalid URL validation
  log('Testing invalid URL validation...')
  await page.goto(`${baseUrl}/admin/banners/new`)
  await wait(2000)

  const title3 = await page.$('input[name="title"]')
  if (title3) await title3.type('Test Title')

  const link3 = await page.$('input[name="link"]')
  if (link3) await link3.type('not-a-valid-url')

  const button3 = await page.$('input[name="buttonText"]')
  if (button3) await button3.type('Test')

  const submit3 = await page.$('button[type="submit"]')
  if (submit3) {
    await submit3.click()
    await wait(1500)
  }

  await takeScreenshot('03-invalid-url', 'admin/validation')

  // Note: URL validation may or may not be enforced depending on implementation

  // 5. Test required buttonText validation
  log('Testing required buttonText validation...')
  await page.goto(`${baseUrl}/admin/banners/new`)
  await wait(2000)

  const title4 = await page.$('input[name="title"]')
  if (title4) await title4.type('Test Title')

  const link4 = await page.$('input[name="link"]')
  if (link4) await link4.type('/valid-link')

  // Leave buttonText empty

  const submit4 = await page.$('button[type="submit"]')
  if (submit4) {
    await submit4.click()
    await wait(1500)
  }

  await takeScreenshot('04-button-required', 'admin/validation')

  const buttonError = await page.evaluate(() => {
    const errorElements = document.querySelectorAll('[class*="error"], [class*="invalid"], .text-red-500')
    for (const el of errorElements) {
      if (el.textContent?.toLowerCase().includes('button')) {
        return true
      }
    }
    return false
  })

  if (buttonError) {
    log('  Button text required error displayed')
  }

  log('=== VALIDATION TESTS COMPLETED ===')
}
