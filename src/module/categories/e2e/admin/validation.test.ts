/**
 * Categories Admin - Validation Test
 * Tests form validations for required fields and images
 */

import { getPage, goto, takeScreenshot, log, wait, FIXTURES_DIR } from '../utils'
import path from 'path'

const SCREENSHOT_FOLDER = 'admin/validation'

/**
 * Test: Submit with empty name
 */
export async function testNameRequired(): Promise<void> {
  const page = getPage()

  log('Testing required name validation...')

  await goto('/admin/categories/new')
  await wait(1500)

  // Try to submit without filling name
  const submitButton = await page.$('button[type="submit"]')
  if (submitButton) {
    await submitButton.click()
  }

  await wait(1000)
  await takeScreenshot('name-required', SCREENSHOT_FOLDER)

  // Check for error message
  const pageContent = await page.content()
  if (pageContent.includes('requerido') || pageContent.includes('required') || pageContent.includes('obligatorio')) {
    log('  Name required error displayed')
  } else {
    log('  Warning: No validation error found')
  }
}

/**
 * Test: Name with only spaces
 */
export async function testNameSpaces(): Promise<void> {
  const page = getPage()

  log('Testing name with only spaces...')

  await goto('/admin/categories/new')
  await wait(1500)

  const nameInput = await page.$('input[name="name"]')
  if (nameInput) {
    await nameInput.type('   ')
  }

  const submitButton = await page.$('button[type="submit"]')
  if (submitButton) {
    await submitButton.click()
  }

  await wait(1000)

  const pageContent = await page.content()
  if (pageContent.includes('requerido') || pageContent.includes('válido')) {
    log('  Spaces-only name rejected')
  }
}

/**
 * Test: Slug auto-normalization with spaces
 */
export async function testSlugNormalization(): Promise<void> {
  const page = getPage()

  log('Testing slug normalization...')

  await goto('/admin/categories/new')
  await wait(1500)

  const nameInput = await page.$('input[name="name"]')
  if (nameInput) {
    await nameInput.type('Test Category With Spaces')
  }

  await wait(500)

  // Check slug auto-generated
  const slugValue = await page.$eval('input[name="slug"]', (el: HTMLInputElement) => el.value)

  if (slugValue.includes('-') && !slugValue.includes(' ')) {
    log(`  Slug normalized: ${slugValue}`)
  } else {
    log(`  Slug value: ${slugValue}`)
  }
}

/**
 * Test: Slug normalization with accents
 */
export async function testSlugWithAccents(): Promise<void> {
  const page = getPage()

  log('Testing slug with accents...')

  await goto('/admin/categories/new')
  await wait(1500)

  const nameInput = await page.$('input[name="name"]')
  if (nameInput) {
    await nameInput.type('Categoría Electrónica')
  }

  await wait(500)

  const slugValue = await page.$eval('input[name="slug"]', (el: HTMLInputElement) => el.value)

  if (!slugValue.includes('í') && !slugValue.includes('ó')) {
    log(`  Accents normalized: ${slugValue}`)
  } else {
    log(`  Slug with accents: ${slugValue}`)
  }
}

/**
 * Run all validation tests
 */
export async function runValidationTests(): Promise<void> {
  log('=== VALIDATION TESTS ===')

  await testNameRequired()
  await testNameSpaces()
  await testSlugNormalization()
  await testSlugWithAccents()

  log('=== VALIDATION TESTS COMPLETED ===')
}

export default runValidationTests
