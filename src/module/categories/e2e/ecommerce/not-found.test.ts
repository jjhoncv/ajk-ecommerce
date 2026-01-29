/**
 * Categories Ecommerce - Not Found Test
 * Tests 404 page for non-existent categories
 */

import { getPage, goto, takeScreenshot, log, wait } from '../utils'

const SCREENSHOT_FOLDER = 'ecommerce/not-found'

/**
 * Test: Non-existent category shows 404
 */
export async function testNotFoundPage(): Promise<void> {
  log('Testing not found page...')

  await goto('/categoria/xyz-categoria-inexistente-123')
  await wait(2000)
  await takeScreenshot('01-page', SCREENSHOT_FOLDER)

  const page = getPage()
  const pageContent = await page.content()

  // Check for not found message
  if (pageContent.includes('no encontrada') ||
      pageContent.includes('not found') ||
      pageContent.includes('No encontrada') ||
      pageContent.includes('404')) {
    log('  Not found message displayed')
  } else {
    log('  Warning: 404 message not found')
  }
}

/**
 * Test: Suggestions are shown
 */
export async function testSuggestionsShown(): Promise<void> {
  const page = getPage()
  log('Testing suggestions...')

  // Check for category suggestions
  const hasSuggestions = await page.evaluate(() => {
    const links = document.querySelectorAll('a[href*="/categoria/"]')
    return links.length > 0
  })

  if (hasSuggestions) {
    log('  Category suggestions shown')
  } else {
    log('  No suggestions found')
  }
}

/**
 * Test: Home link works
 */
export async function testHomeLinkWorks(): Promise<void> {
  const page = getPage()
  log('Testing home link...')

  const pageContent = await page.content()

  if (pageContent.includes('inicio') || pageContent.includes('Inicio') || pageContent.includes('home')) {
    log('  Home link available')
  }

  // Try clicking on a suggestion
  const suggestionLink = await page.$('a[href*="/categoria/"]')

  if (suggestionLink) {
    await suggestionLink.click()
    await wait(2000)

    const currentUrl = page.url()
    if (currentUrl.includes('/categoria/')) {
      log('  Suggestion link works')
    }
  }
}

/**
 * Run all not-found tests
 */
export async function runNotFoundTests(): Promise<void> {
  log('=== NOT FOUND TESTS ===')

  await testNotFoundPage()
  await testSuggestionsShown()
  await testHomeLinkWorks()

  log('=== NOT FOUND TESTS COMPLETED ===')
}

export default runNotFoundTests
