/**
 * Banners E2E - Create Tests
 *
 * Uses shared utilities for form handling and image upload.
 */

import {
  getPage,
  takeScreenshot,
  log,
  wait,
  fillTextField,
  fillTextArea,
  submitForm,
  isOnPage,
  itemExistsInTable
} from '../utils'
import { uploadBannerImage, TEST_IMAGES } from '../utils'
import { TEST_BANNERS } from '../data'

export async function runCreateTests(): Promise<void> {
  const page = getPage()
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'

  log('=== CREATE BANNER TESTS ===')

  // 1. Navigate to create form
  log('Navigating to new banner form...')
  await page.goto(`${baseUrl}/admin/banners/new`)
  await wait(2000)
  await takeScreenshot('01-form-empty', 'admin/create')
  log('  Form loaded')

  // 2. Fill required fields
  log('Filling form fields...')

  await fillTextField('title', TEST_BANNERS.main.title)
  log(`  Title: ${TEST_BANNERS.main.title}`)

  await fillTextField('link', TEST_BANNERS.main.link)
  log(`  Link: ${TEST_BANNERS.main.link}`)

  await fillTextField('buttonText', TEST_BANNERS.main.buttonText)
  log(`  Button Text: ${TEST_BANNERS.main.buttonText}`)

  await fillTextArea('description', TEST_BANNERS.main.description)
  log('  Description filled')

  await fillTextField('subtitle', TEST_BANNERS.main.subtitle)
  log(`  Subtitle: ${TEST_BANNERS.main.subtitle}`)

  // 3. Upload image
  log('Uploading banner image...')
  const imageUploaded = await uploadBannerImage(TEST_IMAGES.banner)
  if (imageUploaded) {
    log('  Banner image uploaded successfully')
  } else {
    log('  WARNING: Banner image upload failed')
  }

  await takeScreenshot('02-form-filled', 'admin/create')

  // 4. Submit form
  log('Submitting form...')
  await submitForm()

  await takeScreenshot('03-success', 'admin/create')

  // 5. Verify redirect to list
  const onListPage = await isOnPage('/admin/banners')
  if (onListPage && !(await isOnPage('/new'))) {
    log('  Redirected to list')
  }

  // 6. Verify banner in list
  const found = await itemExistsInTable(TEST_BANNERS.main.title)
  if (found) {
    log(`  Banner "${TEST_BANNERS.main.title}" visible in list`)
  }

  log('=== CREATE TESTS COMPLETED ===')
}
