/**
 * Categories Ecommerce - Category Page Test
 * Tests public category page with banner, content, and products
 */

import { getPage, goto, takeScreenshot, log, wait } from '../utils'
import { TEST_CATEGORIES } from '../data'

const SCREENSHOT_FOLDER = 'ecommerce/category'

/**
 * Test: Category page loads with all content
 */
export async function testCategoryPageLoads(): Promise<void> {
  log('Testing category page...')

  await goto(`/categoria/${TEST_CATEGORIES.parent.slug}`)
  await wait(2000)
  await takeScreenshot('01-full', SCREENSHOT_FOLDER)

  const page = getPage()
  const pageContent = await page.content()

  // Category name should be visible
  if (pageContent.includes(TEST_CATEGORIES.parent.name)) {
    log(`  Category name visible`)
  } else {
    log('  Warning: Category name not found')
  }
}

/**
 * Test: Banner displays correctly
 */
export async function testBannerDisplay(): Promise<void> {
  const page = getPage()
  log('Testing banner display...')

  // Check for banner image
  const hasBanner = await page.evaluate(() => {
    const images = document.querySelectorAll('img')
    return Array.from(images).some(img =>
      img.src.includes('banner') || img.src.includes('uploads')
    )
  })

  if (hasBanner) {
    log('  Banner image visible')
  } else {
    log('  No banner image found')
  }

  // Check banner title
  const pageContent = await page.content()
  if (TEST_CATEGORIES.parent.bannerTitle && pageContent.includes(TEST_CATEGORIES.parent.bannerTitle)) {
    log('  Banner title visible')
  }
}

/**
 * Test: CTA button works
 */
export async function testCTAButton(): Promise<void> {
  const page = getPage()
  log('Testing CTA button...')

  const ctaButton = await page.$(`a[href*="${TEST_CATEGORIES.parent.bannerCtaLink}"]`)

  if (ctaButton) {
    log('  CTA button found')

    // We don't click to avoid navigation, just verify it exists
    const ctaText = await page.evaluate(el => el.textContent, ctaButton)
    if (ctaText?.includes(TEST_CATEGORIES.parent.bannerCtaText)) {
      log(`  CTA text: "${TEST_CATEGORIES.parent.bannerCtaText}"`)
    }
  } else {
    log('  CTA button not found')
  }
}

/**
 * Test: Description visible
 */
export async function testDescriptionVisible(): Promise<void> {
  const page = getPage()
  log('Testing description...')

  const pageContent = await page.content()
  const descPart = TEST_CATEGORIES.parent.description.substring(0, 30)

  if (pageContent.includes(descPart)) {
    log('  Description visible')
  } else {
    log('  Description not visible')
  }
}

/**
 * Test: Products section or empty state
 */
export async function testProductsSection(): Promise<void> {
  const page = getPage()
  log('Testing products section...')

  const pageContent = await page.content()

  // Check for product grid or empty state
  const hasProducts = await page.evaluate(() => {
    return document.querySelectorAll('[class*="product"], [class*="grid"]').length > 0
  })

  if (hasProducts) {
    log('  Products section found')
  }

  if (pageContent.includes('No hay productos') || pageContent.includes('no hay productos')) {
    log('  Empty state displayed')
  }
}

/**
 * Test: Child category page
 */
export async function testChildCategoryPage(): Promise<void> {
  log('Testing child category page...')

  await goto(`/categoria/${TEST_CATEGORIES.child.slug}`)
  await wait(2000)

  const page = getPage()
  const pageContent = await page.content()

  if (pageContent.includes(TEST_CATEGORIES.child.name)) {
    log('  Child category page works')

    // Check breadcrumb shows parent
    if (pageContent.includes(TEST_CATEGORIES.parent.name)) {
      log('  Parent visible in breadcrumb')
    }
  } else {
    log('  Child category page may be 404')
  }
}

/**
 * Run all category page tests
 */
export async function runCategoryPageTests(): Promise<void> {
  log('=== CATEGORY PAGE TESTS ===')

  await testCategoryPageLoads()
  await testBannerDisplay()
  await testCTAButton()
  await testDescriptionVisible()
  await testProductsSection()
  await testChildCategoryPage()

  log('=== CATEGORY PAGE TESTS COMPLETED ===')
}

export default runCategoryPageTests
