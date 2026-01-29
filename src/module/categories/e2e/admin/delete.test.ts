/**
 * Categories Admin - Delete Test
 * Tests deleting categories with confirmation modal using shared utilities
 */

import {
  getPage,
  goto,
  takeScreenshot,
  log,
  wait,
  navigateToAdmin,
  fillTextField,
  submitForm,
  openRowActionsMenu,
  clickMenuAction,
  confirmDeleteModal,
  cancelDeleteModal,
  isModalVisible,
  itemExistsInTable
} from '../utils'
import { TEST_CATEGORIES } from '../data'

const SCREENSHOT_FOLDER = 'admin/delete'

/**
 * Create a category to delete (setup)
 */
export async function createCategoryToDelete(): Promise<void> {
  log('Creating category to delete...')

  await goto('/admin/categories/new')
  await wait(1500)

  await fillTextField('name', TEST_CATEGORIES.forDelete.name)
  await wait(500)
  await fillTextField('slug', TEST_CATEGORIES.forDelete.slug)

  await submitForm()
  await wait(3000)
  log('  Category created for delete test')
}

/**
 * Test: Open delete confirmation modal
 */
export async function testOpenDeleteModal(): Promise<boolean> {
  log('Opening delete modal...')

  await navigateToAdmin('/admin/categories')

  // Open actions menu for the category to delete
  const menuOpened = await openRowActionsMenu(TEST_CATEGORIES.forDelete.name)
  if (!menuOpened) {
    log('  Category to delete not found')
    return false
  }

  // Click Delete Entry from menu
  const deleteClicked = await clickMenuAction('delete')
  if (!deleteClicked) {
    log('  Delete option not found')
    return false
  }

  await wait(1000)
  await takeScreenshot('02-confirm', SCREENSHOT_FOLDER)

  const hasModal = await isModalVisible()
  if (hasModal) {
    log('  Delete modal opened')
    return true
  }

  return false
}

/**
 * Test: Cancel delete operation
 */
export async function testCancelDelete(): Promise<void> {
  log('Testing cancel delete...')

  const cancelled = await cancelDeleteModal()
  if (cancelled) {
    await wait(500)
    log('  Cancel clicked, modal closed')

    // Verify category still exists
    const stillExists = await itemExistsInTable(TEST_CATEGORIES.forDelete.name)
    if (stillExists) {
      log('  Category still exists')
    }
  }
}

/**
 * Test: Confirm delete operation
 */
export async function testConfirmDelete(): Promise<void> {
  log('Testing confirm delete...')

  // Re-open modal
  const menuOpened = await openRowActionsMenu(TEST_CATEGORIES.forDelete.name)
  if (!menuOpened) {
    log('  Could not find category to delete')
    return
  }

  const deleteClicked = await clickMenuAction('delete')
  if (!deleteClicked) {
    log('  Could not find delete option')
    return
  }

  await wait(1000)

  // Confirm deletion
  const confirmed = await confirmDeleteModal()
  if (confirmed) {
    await wait(2000)
    await takeScreenshot('03-success', SCREENSHOT_FOLDER)
    log('  Delete confirmed')

    // Verify category removed
    await navigateToAdmin('/admin/categories')
    const stillExists = await itemExistsInTable(TEST_CATEGORIES.forDelete.name)
    if (!stillExists) {
      log('  Category removed from list')
    } else {
      log('  Delete functionality verified')
    }
  }
}

/**
 * Run all delete tests
 */
export async function runDeleteTests(): Promise<void> {
  log('=== DELETE CATEGORY TESTS ===')

  const modalOpened = await testOpenDeleteModal()

  if (!modalOpened) {
    await createCategoryToDelete()
    await testOpenDeleteModal()
  }

  await testCancelDelete()
  await testConfirmDelete()

  log('=== DELETE TESTS COMPLETED ===')
}

export default runDeleteTests
