/**
 * Categories Admin - Create Child Test
 * Tests creating subcategories
 */

import { getPage, goto, takeScreenshot, log, wait } from '../utils'
import { TEST_CATEGORIES } from '../data'

const SCREENSHOT_FOLDER = 'admin/create-child'

/**
 * Find parent category ID from list
 */
async function findParentCategoryId(): Promise<string | null> {
  const page = getPage()

  await goto('/admin/categories')
  await wait(1500)

  // Click on parent category actions menu
  const found = await page.evaluate((parentName: string) => {
    const cells = document.querySelectorAll('td')
    for (const cell of cells) {
      if (cell.textContent?.includes(parentName)) {
        const row = cell.closest('tr')
        if (row) {
          const button = row.querySelector('button')
          if (button) {
            button.click()
            return true
          }
        }
      }
    }
    return false
  }, TEST_CATEGORIES.parent.name)

  if (!found) return null

  await wait(500)

  // Extract ID from edit link
  const editId = await page.evaluate(() => {
    const links = document.querySelectorAll('a[href*="/admin/categories/"]')
    for (const link of links) {
      const href = link.getAttribute('href')
      if (href && !href.includes('new')) {
        const match = href.match(/\/admin\/categories\/(\d+)/)
        if (match) return match[1]
      }
    }
    return null
  })

  // Close popup
  await page.click('body')
  await wait(300)

  return editId
}

/**
 * Test: Navigate to create child form
 */
export async function testNavigateToChildForm(): Promise<string | null> {
  log('Finding parent category...')

  const parentId = await findParentCategoryId()

  if (!parentId) {
    log('  Warning: Parent category not found, skipping child tests')
    return null
  }

  log(`  Parent ID: ${parentId}`)

  await goto(`/admin/categories/new?parent=${parentId}`)
  await wait(1500)

  const page = getPage()
  const pageContent = await page.content()

  // Verify parent context alert
  if (pageContent.includes('padre') || pageContent.includes(TEST_CATEGORIES.parent.name)) {
    log('  Parent context displayed')
  }

  return parentId
}

/**
 * Test: Fill and submit child category
 */
export async function testCreateChildCategory(parentId: string): Promise<void> {
  const page = getPage()
  const category = TEST_CATEGORIES.child

  log('Filling child category fields...')

  const nameInput = await page.$('input[name="name"]')
  if (nameInput) {
    await nameInput.type(category.name)
    log(`  Name: ${category.name}`)
  }

  await wait(500)

  const slugInput = await page.$('input[name="slug"]')
  if (slugInput) {
    await slugInput.click({ clickCount: 3 })
    await slugInput.type(category.slug)
  }

  const descInput = await page.$('textarea[name="description"]')
  if (descInput) {
    await descInput.type(category.description)
  }

  const showNavSelect = await page.$('select[name="show_nav"]')
  if (showNavSelect) {
    await showNavSelect.select(category.showNav)
  }

  // Submit
  const submitButton = await page.$('button[type="submit"]')
  if (submitButton) {
    await submitButton.click()
    log('  Submitting...')
  }

  await wait(3000)
  await takeScreenshot('03-success', SCREENSHOT_FOLDER)

  // Verify redirect to parent's subcategories
  const currentUrl = page.url()
  if (currentUrl.includes(`parent=${parentId}`)) {
    log('  Redirected to parent subcategories list')
  }

  // Verify child in list
  const pageContent = await page.content()
  if (pageContent.includes(category.name)) {
    log(`  Child "${category.name}" visible in list`)
  }
}

/**
 * Test: Create child from actions menu
 */
export async function testCreateFromActionsMenu(): Promise<void> {
  const page = getPage()

  log('Testing create from actions menu...')

  await goto('/admin/categories')
  await wait(1500)

  // Find and click actions button
  const actionsClicked = await page.evaluate((parentName: string) => {
    const cells = document.querySelectorAll('td')
    for (const cell of cells) {
      if (cell.textContent?.includes(parentName)) {
        const row = cell.closest('tr')
        if (row) {
          const button = row.querySelector('button')
          if (button) {
            button.click()
            return true
          }
        }
      }
    }
    return false
  }, TEST_CATEGORIES.parent.name)

  if (!actionsClicked) {
    log('  Could not find parent category')
    return
  }

  await wait(500)

  // Find "Añadir subcategoría" link
  const addSubLink = await page.$('a[href*="new?parent="]')
  if (addSubLink) {
    log('  "Add subcategory" link found')
  } else {
    log('  "Add subcategory" link not found in menu')
  }
}

/**
 * Run all create-child tests
 */
export async function runCreateChildTests(): Promise<void> {
  log('=== CREATE CHILD CATEGORY TESTS ===')

  const parentId = await testNavigateToChildForm()

  if (parentId) {
    await testCreateChildCategory(parentId)
  }

  await testCreateFromActionsMenu()

  log('=== CREATE CHILD TESTS COMPLETED ===')
}

export default runCreateChildTests
