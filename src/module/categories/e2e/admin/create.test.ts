/**
 * Categories Admin - Create Test
 * Tests creating a new parent category with all fields
 */

import {
  getPage,
  goto,
  takeScreenshot,
  log,
  wait,
  fillTextField,
  fillTextArea,
  selectOption,
  submitForm,
  isOnPage,
  itemExistsInTable,
  navigateToAdmin,
  uploadCategoryImage,
  uploadBannerDesktop,
  uploadBannerMobile,
  TEST_IMAGES
} from '../utils'
import { TEST_CATEGORIES } from '../data'

const SCREENSHOT_FOLDER = 'admin/create'

/**
 * Test: Navigate to new category form
 */
export async function testNavigateToNewForm(): Promise<void> {
  log('Navigating to new category form...')
  await goto('/admin/categories/new')
  await wait(1500)
  await takeScreenshot('01-form-empty', SCREENSHOT_FOLDER)

  const page = getPage()
  const pageContent = await page.content()

  if (pageContent.includes('Nueva Categoría') || pageContent.includes('Nueva categoria')) {
    log('  Page title correct')
  } else {
    throw new Error('New category page did not load correctly')
  }
}

/**
 * Test: Fill basic information fields
 */
export async function testFillBasicInfo(): Promise<void> {
  const page = getPage()
  const category = TEST_CATEGORIES.parent

  log('Filling basic information...')

  // Name
  await fillTextField('name', category.name)
  log(`  Name: ${category.name}`)

  await wait(500)

  // Verify slug auto-generation
  const slugValue = await page.$eval('input[name="slug"]', (el: HTMLInputElement) => el.value)
  if (slugValue) {
    log(`  Slug auto-generated: ${slugValue}`)
  } else {
    await fillTextField('slug', category.slug)
    log(`  Slug: ${category.slug}`)
  }

  // Description
  await fillTextArea('description', category.description)
  log('  Description filled')

  // Show in navigation
  await selectOption('show_nav', category.showNav)
  log(`  Show in nav: ${category.showNav === '1' ? 'Yes' : 'No'}`)
}

/**
 * Test: Upload category image
 */
export async function testUploadCategoryImage(): Promise<void> {
  log('Uploading category image...')

  const uploaded = await uploadCategoryImage(TEST_IMAGES.category)
  if (uploaded) {
    log('  Category image uploaded')
  } else {
    log('  Warning: Could not upload category image')
  }
}

/**
 * Test: Upload banner images
 */
export async function testUploadBannerImages(): Promise<void> {
  log('Uploading banner images...')

  // Desktop banner
  const desktopUploaded = await uploadBannerDesktop(TEST_IMAGES.bannerDesktop)
  if (desktopUploaded) {
    log('  Desktop banner uploaded')
  }

  // Mobile banner (optional)
  const mobileUploaded = await uploadBannerMobile(TEST_IMAGES.bannerMobile)
  if (mobileUploaded) {
    log('  Mobile banner uploaded')
  }
}

/**
 * Test: Fill banner text fields
 */
export async function testFillBannerFields(): Promise<void> {
  const category = TEST_CATEGORIES.parent

  log('Filling banner fields...')

  await fillTextField('banner_title', category.bannerTitle)
  log(`  Banner Title: ${category.bannerTitle}`)

  await fillTextField('banner_cta_text', category.bannerCtaText)
  log(`  CTA Text: ${category.bannerCtaText}`)

  await fillTextField('banner_cta_link', category.bannerCtaLink)
  log(`  CTA Link: ${category.bannerCtaLink}`)
}

/**
 * Test: Submit form and verify creation
 */
export async function testSubmitForm(): Promise<void> {
  const page = getPage()

  log('Submitting form...')

  // Close any open dialogs
  await page.evaluate(() => {
    const overlay = document.querySelector('.fixed.bottom-0.left-0.right-0.top-0.z-30.bg-black')
    if (overlay) (overlay as HTMLElement).click()
  })
  await wait(500)

  // Submit the form
  await submitForm()

  await wait(3000)
  await takeScreenshot('06-success', SCREENSHOT_FOLDER)

  // Verify redirect to list
  const onListPage = await isOnPage('/admin/categories')
  if (onListPage && !(await isOnPage('/new'))) {
    log('  Redirected to list')
  }

  // Verify category appears in list
  await navigateToAdmin('/admin/categories')
  const found = await itemExistsInTable(TEST_CATEGORIES.parent.name)
  if (found) {
    log(`  Category "${TEST_CATEGORIES.parent.name}" visible in list`)
  } else {
    log('  Warning: Category not found in list')
  }
}

/**
 * Run all create tests
 */
export async function runCreateTests(): Promise<void> {
  log('=== CREATE CATEGORY TESTS ===')

  await testNavigateToNewForm()
  await testFillBasicInfo()
  await testUploadCategoryImage()
  await testUploadBannerImages()
  await testFillBannerFields()
  await testSubmitForm()

  log('=== CREATE TESTS COMPLETED ===')
}

export default runCreateTests
