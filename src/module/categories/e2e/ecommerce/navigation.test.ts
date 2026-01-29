/**
 * Categories Ecommerce - Navigation Test
 * Tests category navigation in main nav and categories menu
 */

import { getPage, goto, takeScreenshot, log, wait } from '../utils'
import { TEST_CATEGORIES } from '../data'

const SCREENSHOT_FOLDER = 'ecommerce/nav'

/**
 * Test: Main navigation shows categories
 */
export async function testMainNavigation(): Promise<void> {
  log('Testing main navigation...')

  await goto('/')
  await wait(2000)
  await takeScreenshot('01-home', SCREENSHOT_FOLDER)

  const page = getPage()

  // Check for category links in nav
  const navLinks = await page.$$('nav a[href*="/categoria/"]')
  log(`  Found ${navLinks.length} category links in nav`)
}

/**
 * Test: Visible categories appear in nav
 */
export async function testVisibleCategoriesInNav(): Promise<void> {
  const page = getPage()

  log('Checking visible categories in nav...')

  const pageContent = await page.content()

  // Parent category should appear (show_nav = 1)
  if (pageContent.includes(TEST_CATEGORIES.parent.name)) {
    log(`  "${TEST_CATEGORIES.parent.name}" visible in nav`)
  } else {
    log(`  Warning: "${TEST_CATEGORIES.parent.name}" not found in nav`)
  }
}

/**
 * Test: Hidden categories not in nav
 */
export async function testHiddenCategoriesNotInNav(): Promise<void> {
  const page = getPage()

  log('Checking hidden categories not in nav...')

  const pageContent = await page.content()

  // Hidden category should NOT appear
  if (!pageContent.includes(TEST_CATEGORIES.hidden.name)) {
    log('  Hidden category correctly not shown')
  } else {
    log('  ERROR: Hidden category should not be visible!')
  }
}

/**
 * Test: Click category navigates correctly
 */
export async function testCategoryClick(): Promise<void> {
  const page = getPage()

  log('Testing category click navigation...')

  // Find and click on a category link
  const categoryLink = await page.$(`a[href*="/categoria/${TEST_CATEGORIES.parent.slug}"]`)

  if (categoryLink) {
    await categoryLink.click()
    await wait(2000)

    const currentUrl = page.url()
    if (currentUrl.includes(`/categoria/${TEST_CATEGORIES.parent.slug}`)) {
      log('  Navigation to category page works')
    }

    // Go back home for next tests
    await goto('/')
    await wait(1500)
  } else {
    log('  Category link not found in nav')
  }
}

/**
 * Test: Categories menu opens and shows categories
 */
export async function testCategoriesMenu(): Promise<void> {
  const page = getPage()

  log('Testing categories menu...')

  // Find and click categories menu button
  const menuClicked = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button')
    for (const btn of buttons) {
      if (btn.textContent?.includes('Categorías') || btn.textContent?.includes('Categoria')) {
        btn.click()
        return true
      }
    }
    return false
  })

  if (menuClicked) {
    await wait(1000)
    await takeScreenshot('menu-01', SCREENSHOT_FOLDER)
    log('  Menu opened')

    // Check categories are listed
    const pageContent = await page.content()
    if (pageContent.includes(TEST_CATEGORIES.parent.name)) {
      log('  Categories displayed in menu')
    }

    // Try clicking on parent to see subcategories
    const parentClicked = await page.evaluate((name: string) => {
      const buttons = document.querySelectorAll('button')
      for (const btn of buttons) {
        if (btn.textContent?.includes(name)) {
          btn.click()
          return true
        }
      }
      return false
    }, TEST_CATEGORIES.parent.name)

    if (parentClicked) {
      await wait(1000)
      log('  Subcategories view opened')

      // Check for child category
      const content = await page.content()
      if (content.includes(TEST_CATEGORIES.child.name)) {
        log('  Child category visible')
      }
    }
  } else {
    log('  Categories menu button not found')
  }
}

/**
 * Run all navigation tests
 */
export async function runNavigationTests(): Promise<void> {
  log('=== NAVIGATION TESTS ===')

  await testMainNavigation()
  await testVisibleCategoriesInNav()
  await testHiddenCategoriesNotInNav()
  await testCategoryClick()
  await testCategoriesMenu()

  log('=== NAVIGATION TESTS COMPLETED ===')
}

export default runNavigationTests
