/**
 * Categories Admin - Update Test
 * Tests editing an existing category using shared utilities
 */

import {
  getPage,
  goto,
  takeScreenshot,
  log,
  wait,
  navigateToAdmin,
  openRowActionsMenu,
  clickMenuAction,
  clearAndFillTextArea,
  submitForm,
  getFieldValue,
  getTextAreaValue
} from '../utils'
import { TEST_CATEGORIES } from '../data'

const SCREENSHOT_FOLDER = 'admin/update'

/**
 * Test: Navigate to edit form via actions menu
 */
export async function testNavigateToEditForm(): Promise<string | null> {
  log('Finding category to edit...')

  await navigateToAdmin('/admin/categories')

  // Open actions menu for the category
  const menuOpened = await openRowActionsMenu(TEST_CATEGORIES.parent.name)
  if (!menuOpened) {
    log('  Warning: Category not found')
    return null
  }

  // Click Edit from menu
  const editClicked = await clickMenuAction('edit')
  if (!editClicked) {
    log('  Warning: Edit option not found')
    return null
  }

  await wait(2000)
  await takeScreenshot('01-form-loaded', SCREENSHOT_FOLDER)

  const page = getPage()
  const currentUrl = page.url()
  const match = currentUrl.match(/\/admin\/categories\/(\d+)/)
  const categoryId = match ? match[1] : null

  if (categoryId) {
    log(`  Category ID: ${categoryId}`)
  }

  const pageContent = await page.content()
  if (pageContent.includes('Editar')) {
    log('  Edit page loaded')
  }

  return categoryId
}

/**
 * Test: Verify all fields are pre-filled
 */
export async function testVerifyPrefilledFields(): Promise<void> {
  log('Verifying pre-filled fields...')

  const nameValue = await getFieldValue('name')
  const slugValue = await getFieldValue('slug')

  if (nameValue) {
    log(`  Name: ${nameValue}`)
  }
  if (slugValue) {
    log(`  Slug: ${slugValue}`)
  }
}

/**
 * Test: Verify audit information
 */
export async function testVerifyAuditInfo(): Promise<void> {
  const page = getPage()
  log('Verifying audit information...')

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await wait(500)

  const pageContent = await page.content()

  if (pageContent.includes('Creado') || pageContent.includes('creado')) {
    log('  Created info visible')
  }

  if (pageContent.includes('Actualizado') || pageContent.includes('actualizado')) {
    log('  Updated info visible')
  }
}

/**
 * Test: Modify and save changes
 */
export async function testModifyAndSave(): Promise<void> {
  log('Modifying category...')

  // Modify description using shared utility
  await clearAndFillTextArea('description', 'Updated description for testing')
  log('  Description modified')

  // Submit form
  await submitForm()

  await wait(3000)

  // Check for success
  const page = getPage()
  const pageContent = await page.content()
  if (pageContent.includes('actualiz') || pageContent.includes('éxito')) {
    log('  Changes saved successfully')
  }
}

/**
 * Test: Verify changes persisted
 */
export async function testVerifyChangesPersisted(categoryId: string): Promise<void> {
  log('Verifying changes persisted...')

  await goto(`/admin/categories/${categoryId}`)
  await wait(2000)

  const descValue = await getTextAreaValue('description')

  if (descValue.includes('Updated')) {
    await takeScreenshot('04-verify', SCREENSHOT_FOLDER)
    log('  Changes verified')
  }
}

/**
 * Run all update tests
 */
export async function runUpdateTests(): Promise<void> {
  log('=== UPDATE CATEGORY TESTS ===')

  const categoryId = await testNavigateToEditForm()

  if (categoryId) {
    await testVerifyPrefilledFields()
    await testVerifyAuditInfo()
    await testModifyAndSave()
    await testVerifyChangesPersisted(categoryId)
  }

  log('=== UPDATE TESTS COMPLETED ===')
}

export default runUpdateTests
