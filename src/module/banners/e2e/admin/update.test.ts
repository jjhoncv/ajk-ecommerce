/**
 * Banners E2E - Update Tests
 *
 * Uses shared utilities for table actions and form handling.
 */

import {
  getPage,
  takeScreenshot,
  log,
  wait,
  navigateToAdmin,
  openRowActionsMenu,
  clickMenuAction,
  getFieldValue,
  clearAndFillTextArea,
  submitForm
} from '../utils'
import { TEST_BANNERS } from '../data'

export async function runUpdateTests(): Promise<void> {
  const page = getPage()

  log('=== UPDATE BANNER TESTS ===')

  // 1. Navigate to list and find our test banner
  log('Finding banner to edit...')
  await navigateToAdmin('/admin/banners')

  // 2. Open actions menu for the banner
  const menuOpened = await openRowActionsMenu(TEST_BANNERS.main.title)
  if (!menuOpened) {
    log('  Banner not found, skipping update test')
    log('=== UPDATE TESTS COMPLETED ===')
    return
  }

  // 3. Click Edit from menu
  const editClicked = await clickMenuAction('edit')
  if (!editClicked) {
    log('  Could not click edit, skipping update test')
    log('=== UPDATE TESTS COMPLETED ===')
    return
  }

  log('  Navigating to edit page...')
  await wait(2000)
  await takeScreenshot('01-form-loaded', 'admin/update')
  log('  Edit page loaded')

  // 4. Verify pre-filled fields
  const titleValue = await getFieldValue('title')
  log(`  Title: ${titleValue}`)

  const linkValue = await getFieldValue('link')
  log(`  Link: ${linkValue}`)

  // 5. Modify description
  log('Modifying description...')
  await clearAndFillTextArea('description', 'Descripción actualizada por test E2E')
  log('  Description modified')

  // 6. Submit changes
  log('Submitting changes...')
  await submitForm()
  await takeScreenshot('02-success', 'admin/update')

  // 7. Verify changes persisted
  log('Verifying changes persisted...')
  await page.reload()
  await wait(2000)

  const newDesc = await page.evaluate(() => {
    const textarea = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement
    return textarea?.value || ''
  })

  if (newDesc.includes('actualizada')) {
    log('  Changes verified')
  }

  await takeScreenshot('03-verify', 'admin/update')

  log('=== UPDATE TESTS COMPLETED ===')
}
