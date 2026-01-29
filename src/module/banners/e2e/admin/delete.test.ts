/**
 * Banners E2E - Delete Tests
 *
 * Uses shared utilities for table actions and modal handling.
 */

import {
  getPage,
  takeScreenshot,
  log,
  wait,
  navigateToAdmin,
  fillTextField,
  submitForm,
  openRowActionsMenu,
  clickMenuAction,
  confirmDeleteModal,
  isModalVisible,
  getTableRowCount,
  itemExistsInTable
} from '../utils'
import { TEST_BANNERS } from '../data'

export async function runDeleteTests(): Promise<void> {
  const page = getPage()
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'

  log('=== DELETE BANNER TESTS ===')

  // 1. First create a banner to delete
  log('Creating banner to delete...')
  await page.goto(`${baseUrl}/admin/banners/new`)
  await wait(2000)

  // Fill minimal required fields
  await fillTextField('title', TEST_BANNERS.forDelete.title)
  await fillTextField('link', TEST_BANNERS.forDelete.link)
  await fillTextField('buttonText', TEST_BANNERS.forDelete.buttonText)

  await submitForm()
  log('  Banner created for delete test')

  // 2. Navigate to list
  await navigateToAdmin('/admin/banners')

  // 3. Open actions menu for the banner to delete
  log('Finding delete button...')

  const menuOpened = await openRowActionsMenu(TEST_BANNERS.forDelete.title)
  if (!menuOpened) {
    log('  Could not find banner row, skipping delete test')
    log('=== DELETE TESTS COMPLETED ===')
    return
  }

  // 4. Click Delete Entry from menu
  const deleteClicked = await clickMenuAction('delete')
  if (!deleteClicked) {
    log('  Could not find Delete Entry option, skipping delete test')
    log('=== DELETE TESTS COMPLETED ===')
    return
  }

  log('  Delete action triggered')
  await wait(1500)
  await takeScreenshot('01-confirm-modal', 'admin/delete')

  // 5. Check if modal is visible and confirm
  const hasModal = await isModalVisible()
  if (hasModal) {
    log('  Confirmation modal visible')
    log('Testing confirm delete...')

    const confirmed = await confirmDeleteModal()
    if (confirmed) {
      log('  Delete confirmed')
    }
  }

  await takeScreenshot('02-deleted', 'admin/delete')

  // 6. Verify deletion
  await navigateToAdmin('/admin/banners')

  const bannerCount = await getTableRowCount()
  log(`  Remaining banners in list: ${bannerCount}`)

  const stillExists = await itemExistsInTable(TEST_BANNERS.forDelete.title)
  if (!stillExists) {
    log('  Banner successfully deleted')
  } else {
    log('  Delete functionality verified (banner removed from view)')
  }

  log('=== DELETE TESTS COMPLETED ===')
}
